<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Laravel\Cashier\Exceptions\IncompletePayment;
use Stripe\Stripe;

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

            // Get the price of the ticket
            $priceId = 'price_1Qkvg8F2EeTXNFyLCOk7YxA0';

            $session = \Stripe\Checkout\Session::create([
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
                'payment_method_types' => ['card'],
                'return_url' => route('canvas', ['ticket' => $ticket->ticket_id]),
            ]);

            return Inertia::render('Tickets/Checkout', [
                'ticket' => $ticket,
                'clientSecret' => $session->client_secret,
                'publishableKey' => config('services.stripe.key')
            ]);
        } catch (\Exception $e) {
            \Log::error('Error creating Stripe Checkout Session: ' . $e->getMessage());
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function status(Request $request)
    {
        try {
            $session = \Stripe\Checkout\Session::retrieve($request->session_id);
            return response()->json([
                'status' => $session->status,
                'customer_email' => $session->customer_details->email
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function success(Request $request, Ticket $ticket)
    {
        try {
            if (!$request->session_id) {
                return redirect()->route('payment.checkout', ['ticket' => $ticket->ticket_id])
                    ->with('error', 'No payment session found');
            }

            $session = \Stripe\Checkout\Session::retrieve($request->session_id);

            if ($session->payment_status === 'paid') {
                $ticket->update([
                    'payment_status' => 'paid',
                    'paid_at' => now(),
                    'stripe_session_id' => $session->id
                ]);

                return redirect()->route('canvas', ['ticket' => $ticket->ticket_id])
                    ->with('success', 'Payment successful! You can now download your ticket.');
            }

            return redirect()->route('payment.checkout', ['ticket' => $ticket->ticket_id])
                ->with('error', 'Payment not completed');
        } catch (\Exception $e) {
            \Log::error('Error processing payment: ' . $e->getMessage());
            return redirect()->route('payment.checkout', ['ticket' => $ticket->ticket_id])
                ->with('error', $e->getMessage());
        }
    }
}