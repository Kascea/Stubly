<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use ZipArchive;
use Illuminate\Support\Facades\Storage;

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
                            'ticket_id' => $ticket->ticket_id,
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
     * Download all tickets for an order as a ZIP file.
     */
    public function downloadTickets(Order $order)
    {
        // Check if the order belongs to the authenticated user
        if ($order->user_id !== Auth::id()) {
            return redirect()->route('orders.index')
                ->with('error', 'You do not have permission to download these tickets.');
        }

        // Load tickets
        $order->load(['tickets']);

        // Check if there are any tickets to download
        if ($order->tickets->isEmpty()) {
            return redirect()->route('orders.show', $order->order_id)
                ->with('error', 'No tickets available for download.');
        }

        // Create a temporary zip file
        $zipFileName = 'order_' . $order->order_id . '_tickets.zip';
        $zipFilePath = storage_path('app/temp/' . $zipFileName);

        // Ensure the temp directory exists
        if (!file_exists(storage_path('app/temp'))) {
            mkdir(storage_path('app/temp'), 0755, true);
        }

        $zip = new ZipArchive();

        if ($zip->open($zipFilePath, ZipArchive::CREATE | ZipArchive::OVERWRITE) === true) {
            // Add each ticket to the zip file
            foreach ($order->tickets as $ticket) {
                $ticketUrl = $ticket->generated_ticket_url;

                if ($ticketUrl) {
                    // Remove the domain part if it's a full URL
                    $ticketPath = parse_url($ticketUrl, PHP_URL_PATH);
                    if (empty($ticketPath)) {
                        $ticketPath = $ticketUrl;
                    }

                    // Remove leading slash
                    $ticketPath = ltrim($ticketPath, '/');

                    // Construct the local file path
                    $localPath = public_path($ticketPath);

                    if (file_exists($localPath)) {
                        // Add file to zip
                        $fileName = 'ticket_' . $ticket->event_name . '_' . $ticket->id . '.png';
                        $fileName = preg_replace('/[^a-zA-Z0-9_\-\.]/', '_', $fileName);
                        $zip->addFile($localPath, $fileName);
                    }
                }
            }

            // Close the zip file
            $zip->close();

            // Download the zip file
            return response()->download($zipFilePath, $zipFileName)->deleteFileAfterSend(true);
        } else {
            return redirect()->route('orders.show', $order->order_id)
                ->with('error', 'Failed to create zip archive for tickets.');
        }
    }
}