<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\Ticket;

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

        if (!$ticket || $ticket->payment_status !== 'paid') {
            return redirect()->route('payment.checkout', ['ticket' => $ticket->ticket_id]);
        }

        return $next($request);
    }
}