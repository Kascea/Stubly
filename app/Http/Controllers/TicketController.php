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
            $this->validateTicket($request);

            $ticketData = $this->prepareTicketData($request);
            $ticketData['user_id'] = auth()->id();
            $ticketData['ticket_id'] = Str::uuid()->toString();

            // Only upload the generated ticket image
            $ticketData = $this->handleTicketImage($request, $ticketData);

            $ticket = Ticket::create($ticketData);

            return response()->json([
                'status' => 'success',
                'message' => 'Ticket created successfully!',
                'ticket' => $ticket
            ]);
        } catch (\Exception $e) {
            return $this->handleError($e);
        }
    }

    protected function handleTicketImage(Request $request, array $ticketData): array
    {
        // Handle generated ticket
        $image = $request->generatedTicket;
        preg_match('/data:image\/(.*?);base64,/', $image, $matches);
        $imageFormat = $matches[1] ?? 'png';

        $image = $this->cleanBase64Data($image);
        if ($decodedImage = base64_decode($image)) {
            $imageName = 'tickets/' . uniqid() . '.' . $imageFormat;
            if (!Storage::disk('r2')->put($imageName, $decodedImage)) {
                throw new \Exception('Failed to save the ticket image');
            }
            $ticketData['generated_ticket_path'] = $imageName;
        }

        return $ticketData;
    }

    protected function cleanBase64Data(string $data): string
    {
        // Remove data URI prefixes and convert spaces to + for proper base64 decoding
        return str_replace(
            [
                'data:image/png;base64,',
                'data:image/jpeg;base64,',
                'data:image/jpg;base64,',
                'data:image/webp;base64,',  // Add WebP support
                ' '
            ],
            ['', '', '', '', '+'],
            $data
        );
    }

    protected function validateTicket(Request $request): void
    {
        $request->validate([
            'eventName' => 'required|string',
            'eventLocation' => 'required|string',
            'date' => 'required|date',
            'time' => 'required',
            'section' => 'nullable|string',
            'row' => 'nullable|string',
            'seat' => 'nullable|string',
            'generatedTicket' => 'required|string',
            'template' => 'nullable|string'
        ]);
    }

    protected function prepareTicketData(Request $request): array
    {
        return [
            'event_name' => $request->eventName,
            'event_location' => $request->eventLocation,
            'event_datetime' => (new DateTime($request->date))->format('Y-m-d') . ' ' .
                (new DateTime($request->time))->format('H:i:s'),
            'section' => $request->section,
            'row' => $request->row,
            'seat' => $request->seat,
            'template' => $request->template ?? 'modern',
        ];
    }

    protected function handleError(\Exception $e)
    {
        Log::error('Ticket operation failed', [
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage()
        ], 500);
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
                Storage::disk('r2')->delete($ticket->generated_ticket_path);
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
        if (!Storage::disk('r2')->exists($ticket->generated_ticket_path)) {
            abort(404, 'Ticket file not found.');
        }

        return Storage::disk('r2')->download(
            $ticket->generated_ticket_path,
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
        // Add background_url to the ticket data
        $ticket->load('payments');

        return Inertia::render('Tickets/Preview', [
            'ticket' => $ticket,
            'isPaid' => $ticket->isPaid(),
            'isOwner' => auth()->check() && auth()->id() === $ticket->user_id,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    public function canvas(Request $request)
    {
        $ticket = null;
        if ($request->has('ticket')) {
            $ticket = Ticket::where('ticket_id', $request->ticket)
                ->where('user_id', auth()->id())
                ->first();

            if ($ticket) {
                $isPaid = Payment::where('ticket_id', $ticket->id)
                    ->where('payment_status', 'paid')
                    ->exists();

                if ($isPaid) {
                    return redirect()->route('tickets.preview', ['ticket' => $ticket->ticket_id]);
                }
            }
        }
        return Inertia::render('Canvas', [
            'ticket' => $ticket
        ]);
    }
}