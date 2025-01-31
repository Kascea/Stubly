<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use DateTime;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;
use App\Models\Payment;
use Illuminate\Support\Facades\Log;

class TicketController extends Controller
{
    public function store(Request $request)
    {
        try {
            $request->validate([
                'ticketId' => 'nullable|string',
                'eventName' => 'required|string',
                'eventLocation' => 'required|string',
                'date' => 'required|date',
                'time' => 'required',
                'section' => 'nullable|string',
                'row' => 'nullable|string',
                'seat' => 'nullable|string',
                'backgroundImage' => 'nullable|string',
                'generatedTicket' => 'required|string',
                'filename' => 'nullable|string',
                'template' => 'nullable|string'
            ]);

            // If updating, check if ticket is already paid
            if ($request->ticketId) {
                $existingTicket = Ticket::where('ticket_id', $request->ticketId)
                    ->where('user_id', auth()->id())
                    ->firstOrFail();

                $isPaid = Payment::where('ticket_id', $existingTicket->ticket_id)
                    ->where('payment_status', 'paid')
                    ->exists();

                if ($isPaid) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Cannot modify a ticket that has already been purchased.'
                    ], 403);
                }
            }

            $image = str_replace(
                ['data:image/png;base64,', ' '],
                ['', '+'],
                $request->generatedTicket
            );

            if (!$decodedImage = base64_decode($image)) {
                throw new \Exception('Invalid image data provided');
            }

            $imageName = 'tickets/' . uniqid() . '.png';

            if (!Storage::disk('public')->put($imageName, $decodedImage)) {
                throw new \Exception('Failed to save the ticket image');
            }

            $ticketData = [
                'event_name' => $request->eventName,
                'event_location' => $request->eventLocation,
                'event_datetime' => (new DateTime($request->date))->format('Y-m-d') . ' ' .
                    (new DateTime($request->time))->format('H:i:s'),
                'section' => $request->section,
                'row' => $request->row,
                'seat' => $request->seat,
                'template' => $request->template ?? 'modern',
                'background_image' => $request->backgroundImage,
                'background_filename' => $request->filename,
                'generated_ticket_path' => $imageName
            ];

            if ($request->ticketId) {
                $ticket = Ticket::where('ticket_id', $request->ticketId)
                    ->where('user_id', auth()->id())
                    ->firstOrFail();
                $ticket->update($ticketData);
            } else {
                $ticketData['user_id'] = auth()->id();
                $ticketData['ticket_id'] = Str::uuid()->toString();
                $ticket = Ticket::create($ticketData);
            }

            return response()->json([
                'status' => 'success',
                'message' => $request->ticketId ? 'Ticket saved successfully' : 'Ticket created successfully',
                'ticket' => $ticket
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function index()
    {
        $tickets = Ticket::where('user_id', auth()->id())
            ->with([
                'payments' => function ($query) {
                    $query->where('payment_status', 'paid');
                }
            ])
            ->latest('updated_at')
            ->get()
            ->map(function ($ticket) {
                $ticket->isPaid = $ticket->payments->isNotEmpty();
                $ticket->generated_ticket_path = Storage::url($ticket->generated_ticket_path);
                $ticket->lastUpdated = $ticket->updated_at;
                $ticket->created = $ticket->created_at;
                return $ticket;
            });

        return Inertia::render('Tickets/Index', [
            'tickets' => $tickets
        ]);
    }

    public function destroy(Ticket $ticket)
    {
        try {
            if (auth()->id() !== $ticket->user_id) {
                abort(403, 'Unauthorized action.');
            }

            // Check if ticket is paid
            $isPaid = Payment::where('ticket_id', $ticket->id)
                ->where('payment_status', 'paid')
                ->exists();

            if ($isPaid) {
                abort(403, 'Cannot delete a paid ticket.');
            }

            if ($ticket->generated_ticket_path) {
                Storage::disk('public')->delete($ticket->generated_ticket_path);
            }

            $ticket->delete();

            return redirect()->route('tickets.index')
                ->with('success', 'Ticket deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->route('tickets.index')
                ->with('error', 'Failed to delete ticket.');
        }
    }

    public function download(Ticket $ticket)
    {
        // Get the file path from storage
        $path = Storage::disk('public')->path($ticket->generated_ticket_path);

        if (!Storage::disk('public')->exists($ticket->generated_ticket_path)) {
            abort(404, 'Ticket file not found.');
        }

        // Return the file as a download
        return response()->download(
            $path,
            $ticket->event_name . '-' . $ticket->event_location . '.png',
            ['Content-Type' => 'image/png']
        );
    }

    public function duplicate(Ticket $ticket)
    {
        $newTicket = $ticket->replicate();
        $newTicket->ticket_id = Str::uuid()->toString();
        $newTicket->user_id = auth()->id();
        $newTicket->save();

        return redirect()->route('canvas', ['ticket' => $newTicket->ticket_id])
            ->with('success', 'Ticket duplicated successfully');
    }

    public function preview(Ticket $ticket)
    {
        // Add isPaid and isOwner flags
        $isPaid = Payment::where('ticket_id', $ticket->ticket_id)
            ->where('payment_status', 'paid')
            ->exists();

        $isOwner = auth()->check() && auth()->id() === $ticket->user_id;

        return Inertia::render('Tickets/Preview', [
            'ticket' => $ticket,
            'isPaid' => $isPaid,
            'isOwner' => $isOwner,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }
}