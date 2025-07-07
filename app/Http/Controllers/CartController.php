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
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use App\Jobs\ProcessOrderConfirmation;
use Laravel\Cashier\Cashier;
use Laravel\Cashier\Checkout;


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
            'items' => $cart ? $cart->tickets()->with(['template', 'user', 'ticketable'])->get()->map(function ($ticket) {
                $ticketData = [
                    'ticket_id' => $ticket->ticket_id,
                    'event_name' => $ticket->event_name,
                    'event_location' => $ticket->event_location,
                    'event_datetime' => $ticket->event_datetime,
                    'section' => $ticket->section,
                    'row' => $ticket->row,
                    'seat' => $ticket->seat,
                    'accent_color' => $ticket->accent_color,
                    'generated_ticket_url' => $ticket->generated_ticket_url,
                    'price' => $ticket->price,
                    'template_id' => $ticket->template_id,
                    'ticketable' => $ticket->ticketable,
                ];

                // Add background image URL if it exists
                $backgroundImagePath = $ticket->ticket_id . '/background-image.webp';
                if (Storage::disk('r2-temp')->exists($backgroundImagePath)) {
                    $ticketData['background_image_url'] = Storage::disk('r2-temp')->url($backgroundImagePath);
                }

                // Add team logo URLs for sports tickets
                if (
                    $ticket->ticketable &&
                    isset($ticket->ticketable->team_home) &&
                    isset($ticket->ticketable->team_away)
                ) {
                    $homeLogoPath = $ticket->ticket_id . '/home-team-logo.webp';
                    $awayLogoPath = $ticket->ticket_id . '/away-team-logo.webp';

                    if (Storage::disk('r2-temp')->exists($homeLogoPath)) {
                        $ticketData['home_team_logo_url'] = Storage::disk('r2-temp')->url($homeLogoPath);
                    }

                    if (Storage::disk('r2-temp')->exists($awayLogoPath)) {
                        $ticketData['away_team_logo_url'] = Storage::disk('r2-temp')->url($awayLogoPath);
                    }
                }

                return $ticketData;
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
            Storage::disk('r2-perm')->delete($ticket->generated_ticket_path);

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
     * Show the checkout page with Stripe Checkout via Laravel Cashier
     */
    public function checkout(Request $request)
    {
        $cart = $this->getCart();

        if (!$cart || $cart->tickets->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Your cart is empty');
        }

        try {
            $ticketCount = $cart->tickets->count();

            // Get ticket type and corresponding price ID
            $ticketType = $this->getTicketType();
            $priceId = $this->getStripePriceIdForTicketType($ticketType);

            // Retrieve price from Stripe using Cashier to ensure we have the correct amount
            $price = Cashier::stripe()->prices->retrieve($priceId);
            $unitPrice = $price->unit_amount / 100; // Convert from cents to dollars

            // Create a pending order first so we can include the order ID in Stripe metadata
            $order = Order::create([
                'user_id' => auth()->id(), // null for guests
                'customer_email' => Auth::check() ? Auth::user()->email : null,
                'total_amount' => $unitPrice * $ticketCount,
                'payment_intent_id' => null, // Will be updated after payment
                'payment_method' => null, // Will be updated after payment
                'status' => 'pending',
            ]);

            $checkoutOptions = [
                'success_url' => route('cart.checkout.success') . '?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => route('cart.index'),
                'mode' => 'payment',
                'metadata' => [
                    'order_id' => $order->order_id,
                    'cart_id' => $cart->cart_id,
                    'ticket_type' => $ticketType,
                    'user_id' => Auth::id() ?? 'guest',
                ],
                'payment_intent_data' => [
                    'metadata' => [
                        'order_id' => $order->order_id,
                        'cart_id' => $cart->cart_id,
                        'ticket_type' => $ticketType,
                        'user_id' => Auth::id() ?? 'guest',
                    ],
                ],
            ];

            // Use different checkout methods for authenticated vs guest users
            if (Auth::check()) {
                return $request->user()->checkout([$priceId => $ticketCount], $checkoutOptions);
            } else {
                return Checkout::guest()->create([$priceId => $ticketCount], $checkoutOptions);
            }

        } catch (\Exception $e) {
            // Clean up pending order if it was created but checkout failed
            if (isset($order) && $order->status === 'pending') {
                $order->delete();
            }

            Log::error('Checkout error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->route('cart.index')->with('error', 'An error occurred during checkout. Please try again or contact support if the issue persists.');
        }
    }

    /**
     * Handle successful checkout
     */
    public function checkoutSuccess(Request $request)
    {
        // Get session ID from URL parameter (Stripe redirects with this)
        $sessionId = $request->get('session_id');

        if (!$sessionId) {
            return redirect()->route('cart.index')->with('error', 'Invalid checkout session');
        }

        try {
            // Retrieve the session using Cashier's Stripe client
            $checkoutSession = Cashier::stripe()->checkout->sessions->retrieve($sessionId);

            if ($checkoutSession->payment_status !== 'paid') {
                return redirect()->route('cart.index')->with('error', 'Payment unsuccessful. Please try again.');
            }

            // Get cart and lock it for update
            $cart = Cart::where('cart_id', $checkoutSession->metadata->cart_id)
                ->where('status', 'active')
                ->with(['tickets'])
                ->lockForUpdate()
                ->first();

            if (!$cart) {
                Log::error('Cart not found or already processed', [
                    'session_id' => $checkoutSession->id,
                    'cart_id' => $checkoutSession->metadata->cart_id
                ]);
                return redirect()->route('cart.index')->with('error', 'Cart not found or already processed');
            }

            // Wrap everything in a transaction
            return DB::transaction(function () use ($cart, $checkoutSession, $request) {
                try {
                    $ticketCount = $cart->tickets->count();

                    if ($ticketCount === 0) {
                        throw new \Exception('Cart is empty');
                    }

                    // Validate metadata exists
                    if (!isset($checkoutSession->metadata->order_id)) {
                        throw new \Exception('Order ID missing from payment session');
                    }

                    // Get the existing pending order with additional validation
                    $order = Order::where('order_id', $checkoutSession->metadata->order_id)
                        ->where('status', 'pending') // Only allow pending orders
                        ->lockForUpdate() // Prevent race conditions
                        ->first();

                    if (!$order) {
                        throw new \Exception('Pending order not found or already processed');
                    }

                    // Security check: verify order ownership for authenticated users or session for guests
                    $isGuest = $checkoutSession->metadata->user_id === 'guest';
                    if (!$isGuest && $order->user_id !== auth()->id()) {
                        throw new \Exception('Order ownership validation failed');
                    } elseif ($isGuest && $cart->session_id !== Session::getId()) {
                        throw new \Exception('Guest session validation failed');
                    }

                    // Update order with payment details
                    $order->update([
                        'customer_email' => $checkoutSession->customer_details->email,
                        'payment_intent_id' => $checkoutSession->payment_intent,
                        'payment_method' => $checkoutSession->payment_method ?? null,
                        'status' => 'completed',
                    ]);

                    // Get the tickets for the email
                    $tickets = $cart->tickets;

                    // Bulk update tickets
                    Ticket::whereIn('ticket_id', $tickets->pluck('ticket_id'))
                        ->update([
                            'order_id' => $order->order_id,
                            'user_id' => $isGuest ? null : auth()->id(),
                            'cart_id' => null
                        ]);

                    ProcessOrderConfirmation::dispatch($order, $checkoutSession->customer_details->email, $tickets);

                    // Delete the cart
                    $cart->delete();

                    // Return to confirmation page with order details
                    return Inertia::render('Cart/CheckoutSuccess', [
                        'orderDetails' => [
                            'id' => $order->order_id,
                            'created_at' => $order->created_at,
                            'total_amount' => $order->total_amount,
                            'items_count' => $ticketCount,
                            'customer_email' => $checkoutSession->customer_details->email,
                            'is_guest' => $isGuest
                        ],
                        'cart' => [
                            'count' => 0,
                        ]
                    ]);

                } catch (\Exception $e) {
                    Log::error('Transaction error in checkout success: ' . $e->getMessage(), [
                        'session_id' => $checkoutSession->id,
                        'cart_id' => $cart->cart_id,
                        'order_id' => $checkoutSession->metadata->order_id ?? 'missing',
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