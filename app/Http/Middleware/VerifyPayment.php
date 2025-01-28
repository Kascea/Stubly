<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Ticket;
use App\Models\Payment;

class VerifyPayment
{
    public function handle(Request $request, Closure $next): Response
    {
        $ticket = $request->route('ticket');

        // If we get a string (ticket_id), use the model from VerifyTicketOwner
        if (!$ticket instanceof Ticket) {
            $ticket = Ticket::where('ticket_id', $ticket)->firstOrFail();
            $request->route()->setParameter('ticket', $ticket);
        }

        $isPaid = Payment::where('ticket_id', $ticket->ticket_id)
            ->where('payment_status', 'paid')
            ->exists();

        if (!$isPaid) {
            return redirect()->route('payment.checkout', ['ticket' => $ticket->ticket_id])
                ->with('error', 'Please purchase this ticket before downloading.');
        }

        // Add the payment status to the ticket for the frontend
        $ticket->isPaid = true;

        return $next($request);
    }
}