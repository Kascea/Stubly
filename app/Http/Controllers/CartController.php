<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Ticket;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Stripe\Stripe;
use Stripe\Checkout\Session as StripeSession;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
class CartController extends Controller
{
    /**
     * Get the current cart for the user or session
     */
    protected function getCart()
    {
        // Get the cart for authenticated user
        if (Auth::check()) {
            $cart = Cart::where('user_id', Auth::id())
                ->where('status', 'active')
                ->first();

            // If the user has no cart, create one
            if (!$cart) {
                $cart = Cart::create([
                    'user_id' => Auth::id(),
                    'status' => 'active',
                    'expires_at' => now()->addDays(7),
                ]);
            }

            return $cart;
        }

        // Get the cart for guest session
        $sessionId = Session::getId();
        $cart = Cart::where('session_id', $sessionId)
            ->where('status', 'active')
            ->first();

        // If the guest has no cart, create one
        if (!$cart) {
            $cart = Cart::create([
                'session_id' => $sessionId,
                'status' => 'active',
                'expires_at' => now()->addDays(7),
            ]);
        }

        return $cart;
    }

    /**
     * Display the shopping cart
     */
    public function index()
    {
        $cart = $this->getCart();

        // Map the tickets to include all needed fields directly
        $cartData = [
            'items' => $cart ? $cart->tickets()->with(['template', 'user'])->get()->map(function ($ticket) {
                return [
                    'id' => $ticket->ticket_id,
                    'event_name' => $ticket->event_name,
                    'event_location' => $ticket->event_location,
                    'event_datetime' => $ticket->event_datetime,
                    'section' => $ticket->section,
                    'row' => $ticket->row,
                    'seat' => $ticket->seat,
                    'generated_ticket_url' => $ticket->generated_ticket_url,
                    'price' => $ticket->price,
                    'template_id' => $ticket->template_id,
                ];
            }) : [],
            'count' => $this->getCartCount()
        ];

        return Inertia::render('Cart/Index', [
            'cart' => $cartData,
        ]);
    }

    /**
     * Add a ticket to the cart
     */
    public function addItem(Request $request)
    {
        $request->validate([
            'ticket_id' => 'required|exists:tickets,ticket_id',
        ]);

        $cart = $this->getCart();
        $ticket = Ticket::where('ticket_id', $request->ticket_id)->firstOrFail();

        // Check if ticket is already in a cart
        if ($ticket->cart_id) {
            return redirect()->back()->with('error', 'Ticket is already in a cart');
        }

        // Add ticket to cart
        $ticket->update([
            'cart_id' => $cart->cart_id
        ]);

        return redirect()->back()->with('success', 'Ticket added to cart');
    }

    /**
     * Clear the entire cart
     */
    public function clear()
    {
        $cart = $this->getCart();

        foreach ($cart->tickets as $ticket) {
            //Delete the generated ticket from R2
            Storage::disk('r2')->delete($ticket->generated_ticket_path);

            //Delete the ticket from the database
            $ticket->delete();
        }

        return response()->json([
            'message' => 'Cart cleared',
            'cart' => [
                'count' => 0,
                'items' => []
            ]
        ]);
    }

    /**
     * Process checkout for cart items
     */
    public function checkout(Request $request)
    {
        $cart = $this->getCart();

        if (!$cart || $cart->tickets->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty');
        }

        try {
            Stripe::setApiKey(config('services.stripe.secret'));

            // Calculate total - simplified since no quantity
            $totalAmount = $cart->tickets->sum('price');

            $checkoutSession = StripeSession::create([
                'payment_method_types' => ['card'],
                'mode' => 'payment',
                'success_url' => route('cart.checkout.success') . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('cart.index'),
                'customer_email' => Auth::check() ? Auth::user()->email : null,
                'client_reference_id' => Auth::id() ?? Session::getId(),
                'line_items' => $cart->tickets->map(function ($ticket) {
                    return [
                        'price_data' => [
                            'currency' => 'usd',
                            'product_data' => [
                                'name' => $ticket->event_name,
                                'description' => "Ticket for " . $ticket->event_name,
                                'images' => $ticket->generated_ticket_url ? [$ticket->generated_ticket_url] : [],
                            ],
                            'unit_amount' => (int) round($ticket->price * 100),
                        ],
                        'quantity' => 1,
                    ];
                })->toArray(),
                'metadata' => [
                    'cart_id' => $cart->cart_id,
                ],
            ]);

            return Inertia::render('Cart/Checkout', [
                'cart' => [
                    'items' => $cart->tickets->map(function ($item) {
                        return [
                            'id' => $item->pivot->id,
                            'quantity' => $item->pivot->quantity,
                            'price' => $item->pivot->price,
                            'ticket' => [
                                'event_name' => $item->ticket->event_name,
                                'event_location' => $item->ticket->event_location ?? 'N/A',
                                'event_datetime' => $item->ticket->event_datetime ?? now(),
                                'section' => $item->ticket->section ?? null,
                                'row' => $item->ticket->row ?? null,
                                'seat' => $item->ticket->seat ?? null,
                                'generated_ticket_url' => $item->ticket->generated_ticket_url ?? null,
                            ],
                        ];
                    }),
                ],
                'clientSecret' => $checkoutSession->client_secret,
                'publishableKey' => config('services.stripe.key'),
                'isGuest' => !Auth::check(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Checkout error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->route('cart.index')->with('error', 'An error occurred during checkout: ' . $e->getMessage());
        }
    }

    /**
     * Handle successful checkout
     */
    public function checkoutSuccess(Request $request)
    {
        $user = auth()->user();
        $cart = $user->cart;

        if (!$request->session_id) {
            return redirect()->route('cart.index');
        }

        try {
            // Initialize Stripe
            Stripe::setApiKey(config('services.stripe.secret'));

            // Retrieve the session to verify payment
            $session = StripeSession::retrieve($request->session_id);

            if ($session->payment_status !== 'paid') {
                return redirect()->route('cart.index')->with('error', 'Payment unsuccessful. Please try again.');
            }

            // Create an order record
            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => $session->amount_total / 100, // Convert from cents
                'payment_id' => $session->payment_intent,
                'status' => 'completed',
            ]);

            // Assign tickets to the user and link them to the order
            foreach ($cart->tickets as $cartItem) {
                // For each quantity, we associate the ticket with the order
                for ($i = 0; $i < $cartItem->pivot->quantity; $i++) {
                    // If quantity > 1, we might need to duplicate the ticket
                    if ($i === 0) {
                        // First ticket can just be updated
                        $cartItem->pivot->update([
                            'user_id' => $user->id,
                            'order_id' => $order->order_id,
                            'is_purchased' => true,
                            'price' => $cartItem->pivot->price
                        ]);
                    } else {
                        // For additional quantities, clone the ticket
                        $newTicket = $cartItem->replicate();
                        $newTicket->user_id = $user->id;
                        $newTicket->order_id = $order->order_id;
                        $newTicket->is_purchased = true;
                        $newTicket->price = $cartItem->pivot->price;
                        $newTicket->save();
                    }
                }
            }

            // Clear the cart
            $cart->tickets()->detach();

            return Inertia::render('Cart/CheckoutSuccess', [
                'orderDetails' => [
                    'id' => $order->order_id,
                    'created_at' => $order->created_at,
                    'total_amount' => $order->total_amount,
                    'items_count' => $order->tickets->count(),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Checkout success error: ' . $e->getMessage());
            return redirect()->route('cart.index')->with('error', 'An error occurred while processing your order. Please contact support.');
        }
    }

    // Add the same method as in HandleInertiaRequests middleware
    private function getCartCount()
    {
        try {
            if (Auth::check()) {
                $cart = Cart::where('user_id', Auth::id())
                    ->where('status', 'active')
                    ->first();
            } else {
                $cart = Cart::where('session_id', Session::getId())
                    ->where('status', 'active')
                    ->first();
            }

            return $cart ? $cart->tickets()->count() : 0;
        } catch (\Exception $e) {
            Log::error('Error getting cart count: ' . $e->getMessage());
            return 0;
        }
    }
}