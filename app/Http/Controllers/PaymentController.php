<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Stripe\StripeClient;

class PaymentController extends Controller
{
    protected $stripe;

    public function __construct()
    {
        $this->stripe = new StripeClient(config('services.stripe.secret'));
    }

    public function checkout(Request $request)
    {
        $ticket = $request->attributes->get('verifiedTicket');

        return Inertia::render('Tickets/Checkout', [
            'ticket' => $ticket
        ]);
    }

    public function process(Request $request)
    {
        $ticket = $request->attributes->get('verifiedTicket');

        try {
            if ($ticket->isPaid()) {
                return back()->with([
                    'status' => 'error',
                    'message' => 'Ticket is already paid for.'
                ]);
            }

            // Create a payment intent
            $paymentIntent = $this->stripe->paymentIntents->create([
                'amount' => $ticket->price * 100, // Convert to cents
                'currency' => 'usd',
                'payment_method_types' => ['card'],
                'metadata' => [
                    'ticket_id' => $ticket->ticket_id,
                    'user_id' => auth()->id()
                ]
            ]);

            // Update ticket with payment intent
            $ticket->update([
                'payment_intent_id' => $paymentIntent->id
            ]);

            return response()->json([
                'clientSecret' => $paymentIntent->client_secret
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function confirm(Request $request)
    {
        $ticket = $request->attributes->get('verifiedTicket');

        try {
            $paymentIntent = $this->stripe->paymentIntents->retrieve($ticket->payment_intent_id);

            if ($paymentIntent->status === 'succeeded') {
                $ticket->update([
                    'payment_status' => 'paid',
                    'paid_at' => now(),
                ]);

                return redirect()->route('canvas', [
                    'ticket' => $ticket->ticket_id,
                    'status' => 'success',
                    'message' => 'Payment processed successfully!'
                ]);
            }

            return back()->with([
                'status' => 'error',
                'message' => 'Payment verification failed.'
            ]);

        } catch (\Exception $e) {
            return back()->with([
                'status' => 'error',
                'message' => 'Payment confirmation failed: ' . $e->getMessage()
            ]);
        }
    }
}