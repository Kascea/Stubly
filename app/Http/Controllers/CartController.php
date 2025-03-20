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

        // Load cart items with their tickets
        $cartData = [
            'items' => $cart ? $cart->items->load('ticket') : [],
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
            'quantity' => 'integer|min:1|max:10',
        ]);

        $cart = $this->getCart();
        $ticket = Ticket::where('ticket_id', $request->ticket_id)->firstOrFail();

        // Set a default price - you'll want to customize this
        $price = 9.99;

        // Check if the item is already in cart
        $existingItem = CartItem::where('cart_id', $cart->cart_id)
            ->where('ticket_id', $ticket->ticket_id)
            ->first();

        if ($existingItem) {
            // Update quantity if the item already exists
            $existingItem->update([
                'quantity' => $existingItem->quantity + ($request->quantity ?? 1),
            ]);
        } else {
            // Create a new cart item
            CartItem::create([
                'cart_id' => $cart->cart_id,
                'ticket_id' => $ticket->ticket_id,
                'price' => $price,
                'quantity' => $request->quantity ?? 1,
            ]);
        }

        return redirect()->back()->with('success', 'Ticket added to cart');
    }

    /**
     * Remove an item from the cart
     */
    public function removeItem(Request $request, CartItem $item)
    {
        $cart = $this->getCart();

        // Make sure the item belongs to the current cart
        if ($item->cart_id !== $cart->cart_id) {
            return redirect()->back()->with('error', 'Item not found in your cart');
        }

        $item->delete();

        return redirect()->back()->with('success', 'Item removed from cart');
    }

    /**
     * Update cart item quantity
     */
    public function updateItem(Request $request, CartItem $item)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1|max:10',
        ]);

        $cart = $this->getCart();

        // Make sure the item belongs to the current cart
        if ($item->cart_id !== $cart->cart_id) {
            return redirect()->back()->with('error', 'Item not found in your cart');
        }

        $item->update([
            'quantity' => $request->quantity,
        ]);

        // Return the updated cart data for Inertia
        return redirect()->back()->with('success', 'Cart updated');
    }

    /**
     * Clear the entire cart
     */
    public function clear()
    {
        $cart = $this->getCart();

        // Delete all cart items
        CartItem::where('cart_id', $cart->cart_id)->delete();

        return redirect()->back()->with('success', 'Cart cleared');
    }

    /**
     * Process checkout for cart items
     */
    public function checkout(Request $request)
    {
        // Get active cart with its items and related ticket data
        $cart = $this->getCart();

        // Debug the cart to see what's happening
        \Log::info('Checkout initiated', [
            'user_id' => Auth::id() ?? 'guest',
            'cart_exists' => $cart ? true : false,
            'items_count' => $cart ? $cart->items->count() : 0
        ]);

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty');
        }

        try {
            // Initialize Stripe
            Stripe::setApiKey(config('services.stripe.secret'));

            // Calculate total
            $totalAmount = $cart->items->reduce(function ($total, $item) {
                return $total + ($item->price * $item->quantity);
            }, 0);

            $checkoutSession = StripeSession::create([
                'payment_method_types' => ['card'],
                'mode' => 'payment',
                'success_url' => route('cart.checkout.success') . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('cart.index'),
                'customer_email' => Auth::check() ? Auth::user()->email : null,
                'client_reference_id' => Auth::id() ?? Session::getId(),
                'line_items' => $cart->items->map(function ($item) {
                    return [
                        'price_data' => [
                            'currency' => 'usd',
                            'product_data' => [
                                'name' => $item->ticket->event_name,
                                'description' => "Ticket for " . $item->ticket->event_name,
                                'images' => $item->ticket->generated_ticket_url ? [$item->ticket->generated_ticket_url] : [],
                            ],
                            'unit_amount' => (int) round($item->price * 100),
                        ],
                        'quantity' => $item->quantity,
                    ];
                })->toArray(),
                'metadata' => [
                    'cart_id' => $cart->cart_id,
                ],
            ]);

            return Inertia::render('Cart/Checkout', [
                'cart' => [
                    'items' => $cart->items->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'quantity' => $item->quantity,
                            'price' => $item->price,
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
            foreach ($cart->items as $cartItem) {
                // For each quantity, we associate the ticket with the order
                for ($i = 0; $i < $cartItem->quantity; $i++) {
                    // If quantity > 1, we might need to duplicate the ticket
                    if ($i === 0) {
                        // First ticket can just be updated
                        $cartItem->ticket->update([
                            'user_id' => $user->id,
                            'order_id' => $order->order_id,
                            'is_purchased' => true,
                            'price' => $cartItem->price
                        ]);
                    } else {
                        // For additional quantities, clone the ticket
                        $newTicket = $cartItem->ticket->replicate();
                        $newTicket->user_id = $user->id;
                        $newTicket->order_id = $order->order_id;
                        $newTicket->is_purchased = true;
                        $newTicket->price = $cartItem->price;
                        $newTicket->save();
                    }
                }
            }

            // Clear the cart
            $cart->items()->delete();

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

            return $cart ? CartItem::where('cart_id', $cart->cart_id)->sum('quantity') : 0;
        } catch (\Exception $e) {
            Log::error('Error getting cart count: ' . $e->getMessage());
            return 0;
        }
    }
}