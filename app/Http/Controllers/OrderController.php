<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Cart;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of orders for the current user.
     */
    public function index()
    {
        $orders = Order::where('user_id', Auth::id())
            ->with(['tickets'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order)
    {
        // Ensure the user can only view their own orders
        if ($order->user_id !== Auth::id()) {
            abort(403);
        }

        $order->load(['tickets']);

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }

    /**
     * Checkout the current cart and create an order.
     */
    public function checkout(Request $request)
    {
        // Ensure the user is authenticated
        if (!Auth::check()) {
            return redirect()->route('login')
                ->with('error', 'Please sign in to complete your purchase');
        }

        // Get the active cart
        $cart = Cart::where('user_id', Auth::id())
            ->where('status', 'active')
            ->with(['items.ticket'])
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index')
                ->with('error', 'Your cart is empty');
        }

        // Calculate the total amount
        $totalAmount = $cart->items->sum(function ($item) {
            return $item->price * $item->quantity;
        });

        DB::beginTransaction();

        try {
            // Create the order
            $order = Order::create([
                'user_id' => Auth::id(),
                'status' => 'pending',
                'total_amount' => $totalAmount,
                'billing_email' => Auth::user()->email,
                'billing_name' => Auth::user()->name,
            ]);

            // Associate tickets with the order
            foreach ($cart->items as $item) {
                // Update the ticket with order information
                $item->ticket->update([
                    'order_id' => $order->order_id,
                    'price' => $item->price,
                ]);
            }

            // Mark the cart as converted
            $cart->update([
                'status' => 'converted',
            ]);

            DB::commit();

            // Redirect to payment page (to be implemented)
            return redirect()->route('payment.process', ['order' => $order->order_id])
                ->with('success', 'Order created successfully');

        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Failed to create order: ' . $e->getMessage());
        }
    }
}