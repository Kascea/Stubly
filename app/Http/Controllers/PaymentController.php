<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Laravel\Cashier\Cashier;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    /**
     * Handle Stripe webhook events
     */
    public function handleWebhook(Request $request)
    {
        $payload = $request->all();
        $method = 'handle' . str_replace('.', '', ucwords($payload['type'], '.'));

        if (method_exists($this, $method)) {
            try {
                return $this->$method($payload);
            } catch (\Exception $e) {
                return $this->handleSecureError($e, 'Webhook handling', [
                    'event' => $payload['type'],
                ]);
            }
        }

        return response()->json(['message' => 'Webhook received but not handled'], 200);
    }

    /**
     * Handle checkout.session.completed event
     */
    protected function handleCheckoutSessionCompleted(array $payload)
    {
        $session = $payload['data']['object'];

        // Find the order by payment intent
        $order = Order::where('payment_intent', $session['payment_intent'])->first();

        if ($order) {
            $order->update([
                'status' => 'completed',
                'payment_method' => $session['payment_method'] ?? null,
            ]);
        }

        return response()->json(['message' => 'Webhook handled successfully']);
    }

    /**
     * Handle payment_intent.payment_failed event
     */
    protected function handlePaymentIntentPaymentFailed(array $payload)
    {
        $paymentIntent = $payload['data']['object'];

        // Find the order by payment intent
        $order = Order::where('payment_intent', $paymentIntent['id'])->first();

        if ($order) {
            $order->update([
                'status' => 'failed',
            ]);
        }

        return response()->json(['message' => 'Webhook handled successfully']);
    }

    /**
     * Handle payment_intent.succeeded event
     */
    protected function handlePaymentIntentSucceeded(array $payload)
    {
        $paymentIntent = $payload['data']['object'];

        // Find the order by payment intent
        $order = Order::where('payment_intent', $paymentIntent['id'])->first();

        if ($order) {
            $order->update([
                'status' => 'completed',
                'payment_method' => $paymentIntent['payment_method'] ?? null,
            ]);
        }

        return response()->json(['message' => 'Webhook handled successfully']);
    }
}