<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Ticket;

class VerifyTicketOwner
{
    public function handle(Request $request, Closure $next)
    {
        $ticket = $request->route('ticket');

        // If we get a string (ticket_id), resolve the model
        if (!$ticket instanceof Ticket) {
            $ticket = Ticket::where('ticket_id', $ticket)->firstOrFail();
            // Update the route parameter with the model instance
            $request->route()->setParameter('ticket', $ticket);
        }

        if ($ticket->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return $next($request);
    }
}