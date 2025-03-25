<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Mail\RefundRequest as RefundMail;
use Illuminate\Support\Facades\Mail;

class SupportController extends Controller
{
    /**
     * Show the support page
     */
    public function index()
    {
        return Inertia::render('Support/Index');
    }

    /**
     * Show the refund request form
     */
    public function refundForm()
    {
        return Inertia::render('Support/RefundRequest');
    }

    /**
     * Process a refund request
     */
    public function submitRefund(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        // Send the email directly to the business owner
        Mail::to('cole@stubly.shop')->send(new RefundMail($request->all()));

        // Using Inertia's redirect method with flash message
        return redirect()->route('support.index')
            ->with('success', 'Your refund request has been sent. We\'ll get back to you shortly.');
    }
}
