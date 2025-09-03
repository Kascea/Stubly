<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Display the email verification prompt.
     */
    public function __invoke(Request $request): RedirectResponse|Response
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('canvas', absolute: false));
        }

        // Automatically send verification email if not already sent recently
        $lastSent = session('verification_last_sent');
        $now = time();

        // Only send if no email was sent in the last 60 seconds
        if (!$lastSent || ($now - $lastSent) > 60) {
            $request->user()->sendEmailVerificationNotification();
            session(['verification_last_sent' => $now]);
            session()->flash('status', 'verification-link-sent');
        }

        return Inertia::render('Auth/VerifyEmail', ['status' => session('status')]);
    }
}
