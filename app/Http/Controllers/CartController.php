<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

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
        $cart->load(['items.ticket']);

        return Inertia::render('Cart/Index', [
            'cart' => $cart,
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
     * Get the number of items in the cart
     */
    public function getCartCount()
    {
        $cart = $this->getCart();

        $itemCount = 0;
        if ($cart) {
            // Sum up the quantities of all items
            $itemCount = $cart->items()->sum('quantity');
        }

        return response()->json(['count' => $itemCount]);
    }
}