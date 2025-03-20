<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class VerifyTicketAccess
{
    public function handle(Request $request, Closure $next)
    {
        $ticket = $request->route('ticket');

        // Check if user is authenticated and owns the ticket
        if (Auth::check() && $ticket->user_id === Auth::id()) {
            return $next($request);
        }

        // Check if guest session matches the ticket's session
        if (!Auth::check() && $ticket->session_id === Session::getId()) {
            return $next($request);
        }

        return abort(403, 'Unauthorized action.');
    }
}