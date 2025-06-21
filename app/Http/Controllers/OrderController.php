<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use ZipArchive;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use App\Mail\OrderConfirmation;
use Illuminate\Support\Facades\RateLimiter;
use App\Jobs\ProcessOrderConfirmation;

class OrderController extends Controller
{
    /**
     * Display a listing of the orders for the authenticated user.
     */
    public function index()
    {
        $orders = Auth::user()->orders()
            ->with(['tickets'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'order_id' => $order->order_id,
                    'created_at' => $order->created_at,
                    'total_amount' => $order->total_amount,
                    'status' => $order->status,
                    'payment_id' => $order->payment_id,
                    'tickets' => $order->tickets->map(function ($ticket) {
                        return [
                            'id' => $ticket->id,
                            'ticket_id' => $ticket->ticket_id,
                            'event_name' => $ticket->event_name,
                            'event_location' => $ticket->event_location,
                            'event_datetime' => $ticket->event_datetime,
                            'section' => $ticket->section,
                            'row' => $ticket->row,
                            'seat' => $ticket->seat,
                            'price' => $ticket->price,
                            'generated_ticket_url' => $ticket->generated_ticket_url,
                        ];
                    }),
                ];
            });

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order)
    {
        // Check if the order belongs to the authenticated user
        if ($order->user_id !== Auth::id()) {
            return redirect()->route('orders.index')
                ->with('error', 'You do not have permission to view this order.');
        }

        // Load tickets
        $order->load(['tickets']);

        // Format order data for frontend
        $orderData = [
            'order_id' => $order->order_id,
            'created_at' => $order->created_at,
            'total_amount' => $order->total_amount,
            'status' => $order->status,
            'payment_id' => $order->payment_id,
            'tickets' => $order->tickets->map(function ($ticket) {
                return [
                    'id' => $ticket->id,
                    'ticket_id' => $ticket->ticket_id,
                    'event_name' => $ticket->event_name,
                    'event_location' => $ticket->event_location,
                    'event_datetime' => $ticket->event_datetime,
                    'section' => $ticket->section,
                    'row' => $ticket->row,
                    'seat' => $ticket->seat,
                    'price' => $ticket->price,
                    'generated_ticket_url' => $ticket->generated_ticket_url,
                ];
            }),
        ];

        return Inertia::render('Orders/Show', [
            'order' => $orderData,
        ]);
    }

    /**
     * View PDF in browser for an order.
     */
    public function viewPdf(Order $order)
    {
        // Check if the order belongs to the authenticated user
        if ($order->user_id !== Auth::id()) {
            return redirect()->route('orders.index')
                ->with('error', 'You do not have permission to view this PDF.');
        }

        // Check if there's a PDF path stored for this order
        if (empty($order->pdf_path)) {
            return redirect()->route('orders.show', $order->order_id)
                ->with('error', 'No PDF available for viewing.');
        }

        // Check if the PDF file exists in storage
        if (!Storage::disk('r2-perm')->exists($order->pdf_path)) {
            return redirect()->route('orders.show', $order->order_id)
                ->with('error', 'PDF file not found.');
        }

        // Get the PDF content from R2 storage
        $pdfContent = Storage::disk('r2-perm')->get($order->pdf_path);

        // Return the PDF with appropriate headers for inline viewing
        return response($pdfContent)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="order_' . $order->order_id . '_tickets.pdf"');
    }

    /**
     * Resend the order confirmation email.
     */
    public function resendConfirmation(Request $request, Order $order)
    {
        // For authenticated users, check if the order belongs to them
        if (Auth::check() && $order->user_id !== Auth::id()) {
            return $request->wantsJson()
                ? response()->json(['error' => 'You do not have permission to resend this order confirmation.'], 403)
                : redirect()->back()->with('error', 'You do not have permission to resend this order confirmation.');
        }

        // For guest users, we need to ensure they have the correct email
        if ($request->has('email')) {
            $request->validate([
                'email' => 'required|email'
            ]);

            if ($request->email !== $order->customer_email) {
                return $request->wantsJson()
                    ? response()->json(['error' => 'The provided email does not match the order email.'], 400)
                    : redirect()->back()->with('error', 'The provided email does not match the order email.');
            }
        }

        // Load tickets
        $order->load(['tickets']);

        // Check if there are any tickets
        if ($order->tickets->isEmpty()) {
            return $request->wantsJson()
                ? response()->json(['error' => 'No tickets found for this order.'], 404)
                : redirect()->back()->with('error', 'No tickets found for this order.');
        }

        try {
            // Dispatch the job to regenerate PDF and send the email
            ProcessOrderConfirmation::dispatch($order, $order->customer_email, $order->tickets);

            $successMessage = 'Order confirmation email has been queued for resending. Please allow a few minutes for delivery and check your spam folder.';

            return $request->wantsJson()
                ? response()->json(['message' => $successMessage])
                : redirect()->back()->with('success', $successMessage);
        } catch (\Exception $e) {
            $errorMessage = 'Failed to resend confirmation email. Please try again later.';

            return $request->wantsJson()
                ? response()->json(['error' => $errorMessage], 500)
                : redirect()->back()->with('error', $errorMessage);
        }
    }
}