<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;
use App\Models\Payment;
use Illuminate\Support\Facades\Log;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class TicketController extends Controller
{

    public function store(Request $request)
    {
        try {
            $this->validateTicket($request);

            $ticketData = [
                'ticket_id' => Str::uuid()->toString(),
                'user_id' => auth()->id(),
                'template' => $request->template,
                'event_name' => $request->eventName,
                'event_location' => $request->eventLocation,
                'event_datetime' => (new \DateTime($request->date))->format('Y-m-d') . ' ' .
                    (new \DateTime($request->time))->format('H:i:s'),
                'section' => $request->section,
                'row' => $request->row,
                'seat' => $request->seat,
            ];

            // Only upload the generated ticket image
            $ticketData = $this->handleTicketImage($request, $ticketData);

            $ticket = Ticket::create($ticketData);

            return response()->json([
                'status' => 'success',
                'message' => 'Ticket created successfully!',
                'ticket' => $ticket
            ]);
        } catch (\Exception $e) {
            Log::error('Ticket creation failed', [
                'message' => $e->getMessage(),
            ]);
            return $this->handleError($e);
        }
    }

    protected function handleTicketImage(Request $request, array $ticketData): array
    {
        $image = $request->generatedTicket;

        // Clean the base64 data
        $cleanedBase64 = $this->cleanBase64Data($image);

        if ($decodedImage = base64_decode($cleanedBase64)) {
            $imageName = uniqid() . '.webp';
            // Use Intervention Image to convert to WebP
            $manager = new ImageManager(new Driver());
            $img = $manager->read($decodedImage);
            $encodedImage = $img->toWebp(85);

            // Save to storage
            if (!Storage::disk('r2')->put($imageName, $encodedImage->toString())) {
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
            'CustomTicket-' . $ticket->ticket_id . '.webp',
            ['Content-Type' => 'image/webp']
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

    public function canvas()
    {
        // Load categories with their templates
        $categories = Category::with('templates')->get();

        return Inertia::render('Canvas', [
            'categories' => $categories,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }
}