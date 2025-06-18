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
use Laravel\Cashier\Cashier;
use App\Mail\OrderConfirmation;
use Illuminate\Support\Facades\Mail;
use App\Jobs\ProcessOrderConfirmation;

class CartController extends Controller
{
    /**
     * Get Stripe price ID based on ticket type
     */
    private function getStripePriceIdForTicketType(string $type): string
    {
        return match ($type) {
            'physical' => env('STRIPE_PHYSICAL_PRICE_ID'),
            'digital' => env('STRIPE_DIGITAL_PRICE_ID'),
            default => throw new \Exception("Invalid ticket type: $type"),
        };
    }

    /**
     * Determine ticket type (physical or digital)
     * For now, all tickets are digital. In the future, this can be expanded
     * to check ticket properties or user preferences.
     */
    private function getTicketType(): string
    {
        // For now, default to digital
        // In the future, you could:
        // - Check ticket template properties
        // - Check user preferences during ticket creation
        // - Add a field to the tickets table
        return 'digital';
    }

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
     * Show the checkout page with Stripe Embedded Checkout
     */
    public function checkout(Request $request)
    {
        Stripe::setApiKey(config('cashier.secret'));
        $cart = $this->getCart();

        if (!$cart || $cart->tickets->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty');
        }

        try {
            $ticketCount = $cart->tickets->count();

            // Get ticket type and corresponding price ID
            $ticketType = $this->getTicketType();
            $priceId = $this->getStripePriceIdForTicketType($ticketType);

            // Retrieve price from Stripe to ensure we have the correct amount
            $price = \Stripe\Price::retrieve($priceId);
            $unitPrice = $price->unit_amount / 100; // Convert from cents to dollars

            // Create checkout session first
            $checkoutSession = StripeSession::create([
                'ui_mode' => 'embedded',
                'payment_method_types' => ['card'],
                'mode' => 'payment',
                'return_url' => route('cart.checkout.success'),
                'customer_email' => Auth::check() ? Auth::user()->email : null,
                'client_reference_id' => Auth::id() ?? Session::getId(),
                'line_items' => [
                    [
                        'price' => $priceId,
                        'quantity' => $ticketCount,
                    ]
                ],
                'metadata' => [
                    'cart_id' => $cart->cart_id,
                    'ticket_type' => $ticketType,
                ],
            ]);

            // Store the session ID in Laravel session
            $request->session()->put('stripe_session_id', $checkoutSession->id);

            return Inertia::render('Cart/Checkout', [
                'checkoutData' => [
                    'items' => $cart->tickets->map(function ($ticket) use ($unitPrice) {
                        return [
                            'id' => $ticket->ticket_id,
                            'price' => $unitPrice,
                            'ticket' => [
                                'event_name' => $ticket->event_name,
                                'event_location' => $ticket->event_location ?? 'N/A',
                                'event_datetime' => $ticket->event_datetime,
                                'section' => $ticket->section,
                                'row' => $ticket->row,
                                'seat' => $ticket->seat,
                            ],
                        ];
                    }),
                    'subtotal' => $unitPrice * $ticketCount,
                    'total' => $unitPrice * $ticketCount,
                ],
                'clientSecret' => $checkoutSession->client_secret,
                'publishableKey' => config('cashier.key'),
                'isGuest' => !Auth::check(),
            ]);
        } catch (\Exception $e) {
            Log::error('Checkout error: ' . $e->getMessage(), [
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
        // Get session ID from Laravel session instead of URL
        $sessionId = $request->session()->get('stripe_session_id');

        if (!$sessionId) {
            return redirect()->route('cart.index');
        }

        try {
            // Retrieve the session using Cashier
            $stripeSession = Cashier::stripe()->checkout->sessions->retrieve($sessionId);

            if ($stripeSession->payment_status !== 'paid') {
                return redirect()->route('cart.index')->with('error', 'Payment unsuccessful. Please try again.');
            }

            // Get cart and lock it for update
            $cart = Cart::where('cart_id', $stripeSession->metadata->cart_id)
                ->where('status', 'active')
                ->with(['tickets'])
                ->lockForUpdate()
                ->first();

            if (!$cart) {
                Log::error('Cart not found or already processed', [
                    'session_id' => $sessionId,
                    'cart_id' => $stripeSession->metadata->cart_id
                ]);
                return redirect()->route('cart.index')->with('error', 'Cart not found or already processed');
            }

            // Wrap everything in a transaction
            return DB::transaction(function () use ($cart, $stripeSession, $request) {
                try {
                    $ticketCount = $cart->tickets->count();

                    if ($ticketCount === 0) {
                        throw new \Exception('Cart is empty');
                    }

                    // Create the order after successful payment
                    $order = Order::create([
                        'user_id' => auth()->id(),
                        'customer_email' => $stripeSession->customer_details->email,
                        'total_amount' => $stripeSession->amount_total / 100,
                        'payment_intent_id' => $stripeSession->payment_intent,
                        'payment_method' => $stripeSession->payment_method ?? null,
                        'status' => 'completed',
                    ]);

                    // Get the tickets for the email
                    $tickets = $cart->tickets;

                    // Bulk update tickets
                    Ticket::whereIn('ticket_id', $tickets->pluck('ticket_id'))
                        ->update([
                            'order_id' => $order->order_id,
                            'user_id' => auth()->id() ?? null,
                            'cart_id' => null
                        ]);

                    // Replace the Mail::to line with:
                    ProcessOrderConfirmation::dispatch($order, $stripeSession->customer_details->email, $tickets);

                    // Delete the cart
                    $cart->delete();

                    // At the end of successful checkout, clear the session ID
                    $request->session()->forget('stripe_session_id');

                    // Return to confirmation page with order details
                    return Inertia::render('Cart/CheckoutSuccess', [
                        'orderDetails' => [
                            'id' => $order->order_id,
                            'created_at' => $order->created_at,
                            'total_amount' => $order->total_amount,
                            'items_count' => $ticketCount,
                            'customer_email' => $stripeSession->customer_details->email,
                            'is_guest' => !auth()->check(),
                        ],
                        'cart' => [
                            'count' => 0,
                        ]
                    ]);

                } catch (\Exception $e) {
                    Log::error('Transaction error in checkout success: ' . $e->getMessage(), [
                        'session_id' => $stripeSession->id,
                        'cart_id' => $cart->cart_id,
                        'trace' => $e->getTraceAsString()
                    ]);
                    throw $e;
                }
            });

        } catch (\Exception $e) {
            Log::error('Checkout success error: ' . $e->getMessage(), [
                'session_id' => $sessionId,
                'trace' => $e->getTraceAsString()
            ]);

            // Clear the session ID in case of error too
            $request->session()->forget('stripe_session_id');

            $errorMessage = match (true) {
                $e instanceof \Laravel\Cashier\Exceptions\IncompletePayment => 'Your payment was not completed. Please try again.',
                $e instanceof \Illuminate\Database\Eloquent\ModelNotFoundException => 'Order not found. Please contact support.',
                $e->getMessage() === 'Cart is empty' => 'Your cart appears to be empty. Please try again.',
                default => 'An error occurred while processing your order. Please contact support.'
            };

            return redirect()->route('cart.index')->with('error', $errorMessage);
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