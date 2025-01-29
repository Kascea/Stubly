<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Payment;
use Log;
use Stripe\Stripe;
use Stripe\Checkout\Session as StripeSession;
use Stripe\Price;

class PaymentController extends Controller
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    public function checkout(Ticket $ticket)
    {
        try {
            $user = Auth::user();
            $priceId = 'price_1Qkvg8F2EeTXNFyLCOk7YxA0';

            $session = StripeSession::create([
                'line_items' => [
                    [
                        'price' => $priceId,
                        'quantity' => 1,
                    ]
                ],
                'mode' => 'payment',
                'ui_mode' => 'embedded',
                'client_reference_id' => $ticket->ticket_id,
                'customer_email' => $user->email,
                'payment_method_types' => ['card',],
                'return_url' => route('payment.success', [
                    'ticket' => $ticket->ticket_id,
                ]),
            ]);

            $price = Price::retrieve($priceId);
            $amount = $price->unit_amount / 100; // Convert from cents to dollars

            // Create payment record
            $payment = Payment::create([
                'user_id' => $user->id,
                'ticket_id' => $ticket->ticket_id,
                'stripe_session_id' => $session->id,
                'amount' => $amount,
                'payment_status' => 'pending'
            ]);

            return Inertia::render('Tickets/Checkout', [
                'ticket' => $ticket,
                'clientSecret' => $session->client_secret,
                'publishableKey' => config('services.stripe.key'),
            ]);
        } catch (\Exception $e) {
            Log::error('Error creating Stripe Checkout Session: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function success(Request $request, Ticket $ticket)
    {
        try {
            $payment = Payment::where('ticket_id', $ticket->ticket_id)
                ->where('payment_status', 'pending')
                ->latest()
                ->firstOrFail();

            $sessionId = $payment->stripe_session_id;

            if (!$sessionId) {
                return redirect()->route('payment.checkout', ['ticket' => $ticket->ticket_id])
                    ->with('error', 'Payment session not found');
            }

            $session = StripeSession::retrieve($sessionId);

            if ($session->payment_status === 'paid') {
                $payment->update([
                    'payment_status' => 'paid',
                    'paid_at' => now()
                ]);

                $ticket->update([
                    'status' => 'paid'
                ]);

                return redirect()->route('tickets.preview', ['ticket' => $ticket->ticket_id])
                    ->with('success', 'Payment successful! You can now download your ticket.');
            }

            return redirect()->route('payment.checkout', ['ticket' => $ticket->ticket_id])
                ->with('error', 'Payment not completed');
        } catch (\Exception $e) {
            Log::error('Error processing payment: ' . $e->getMessage());
            return redirect()->route('payment.checkout', ['ticket' => $ticket->ticket_id])
                ->with('error', $e->getMessage());
        }
    }
}