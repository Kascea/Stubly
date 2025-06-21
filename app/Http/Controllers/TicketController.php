<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Category;
use App\Models\SportsTicket;
use App\Models\ConcertTicket;
use App\Models\Template;
use App\Services\ImageProcessingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;
use App\Models\Payment;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class TicketController extends Controller
{
    protected ImageProcessingService $imageService;

    public function __construct(ImageProcessingService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function store(Request $request)
    {
        try {
            $this->validateTicket($request);

            // Start a database transaction
            DB::beginTransaction();

            // Get the template
            $template = Template::findOrFail($request->template_id);
            $categoryId = $template->category_id;

            // Create the specialized ticket based on the template's category
            $specializedTicket = $this->createSpecializedTicket($request, $categoryId);

            if (!$specializedTicket) {
                throw new \Exception("Invalid ticket category: {$categoryId}");
            }

            // Create the base ticket data
            $ticketData = [
                'ticket_id' => Str::uuid()->toString(),
                'user_id' => auth()->check() ? auth()->id() : null,
                'session_id' => !auth()->check() ? Session::getId() : null,
                'template_id' => $request->template_id,
                'template' => $request->template, // Keep for backward compatibility
                'event_name' => $request->eventName,
                'event_location' => $request->eventLocation,
                'event_datetime' => (new \DateTime($request->date))->format('Y-m-d') . ' ' .
                    (new \DateTime($request->time))->format('H:i:s'),
                'section' => $request->section,
                'row' => $request->row,
                'seat' => $request->seat,
                'ticketable_id' => $specializedTicket->id,
                'ticketable_type' => get_class($specializedTicket),
            ];

            // Create the ticket first
            $ticket = Ticket::create($ticketData);

            // Process images sequentially using the service
            $this->processTicketImages($request, $ticket, $categoryId);

            // Commit the transaction
            DB::commit();

            return response()->json([
                'status' => 'success',
                'message' => 'Ticket created successfully!',
                'ticket' => $ticket
            ]);
        } catch (\Exception $e) {
            // Rollback the transaction in case of error
            DB::rollBack();

            Log::error('Ticket creation failed', [
                'message' => $e->getMessage(),
            ]);
            return $this->handleError($e);
        }
    }

    /**
     * Process all ticket images sequentially
     */
    protected function processTicketImages(Request $request, Ticket $ticket, string $categoryId): void
    {
        // 1. Process main ticket image
        if ($request->hasFile('generatedTicket')) {
            $this->imageService->storeTicketImage($request->file('generatedTicket'), $ticket->ticket_id);
        }

        // 2. Process background image
        if ($request->hasFile('backgroundImage')) {
            $this->imageService->storeBackgroundImage($request->file('backgroundImage'), $ticket->ticket_id);
        }

        // 3. Process team logos for sports tickets
        if ($categoryId === 'sports') {
            if ($request->hasFile('homeTeamLogo')) {
                $this->imageService->storeTeamLogo($request->file('homeTeamLogo'), $ticket->ticket_id, 'home');
            }

            if ($request->hasFile('awayTeamLogo')) {
                $this->imageService->storeTeamLogo($request->file('awayTeamLogo'), $ticket->ticket_id, 'away');
            }
        }
    }

    /**
     * Create a specialized ticket based on the category
     */
    protected function createSpecializedTicket(Request $request, string $categoryId)
    {
        return match ($categoryId) {
            'sports' => SportsTicket::create([
                'sport_type' => $request->sport_type ?? null,
                'team_home' => $request->team_home ?? null,
                'team_away' => $request->team_away ?? null,
            ]),
            'concerts' => ConcertTicket::create([
                'artist_name' => $request->artist_name ?? null,
                'tour_name' => $request->tour_name ?? null,
            ]),
            default => null,
        };
    }

    protected function validateTicket(Request $request): void
    {
        // Get the template to determine category-specific validation
        $template = Template::findOrFail($request->template_id);
        $categoryId = $template->category_id;

        // Base validation rules for all tickets
        $rules = [
            'eventName' => 'required|string',
            'eventLocation' => 'required|string',
            'date' => 'required|date',
            'time' => 'required',
            'section' => 'nullable|string',
            'row' => 'nullable|string',
            'seat' => 'nullable|string',
            'generatedTicket' => 'required|file|image|max:10240', // 10MB max for ticket image
            'backgroundImage' => 'nullable|file|image|max:5120', // 5MB max for background
            'homeTeamLogo' => 'nullable|file|image|max:5120', // 5MB max for logos
            'awayTeamLogo' => 'nullable|file|image|max:5120', // 5MB max for logos
            'template' => 'nullable|string',
            'template_id' => 'required|string|exists:templates,id',
        ];

        // Add category-specific validation rules
        switch ($categoryId) {
            case 'sports':
                $rules = array_merge($rules, [
                    'team_home' => 'required|string',
                    'team_away' => 'required|string',
                ]);
                break;

            case 'concerts':
                $rules = array_merge($rules, [
                    'artist_name' => 'required|string',
                    'tour_name' => 'required|string',
                ]);
                break;

            // Add more cases for other categories as needed
        }

        $request->validate($rules);
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

    public function destroy(Ticket $ticket)
    {
        try {
            // Delete the image file using the constructed path
            Storage::disk('r2-perm')->delete($ticket->generated_ticket_path);

            $ticket->delete();

            return response()->json([
                'message' => 'Ticket deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Error deleting ticket: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to delete ticket'
            ], 500);
        }
    }

    public function viewTicket(Ticket $ticket)
    {
        // Check if user has access to this ticket
        if (auth()->check()) {
            // For authenticated users, check if they own the ticket or it's in their orders
            $userOwnsTicket = $ticket->user_id === auth()->id() ||
                $ticket->order?->user_id === auth()->id();

            if (!$userOwnsTicket) {
                abort(403, 'You do not have permission to view this ticket.');
            }
        }

        // Check if the ticket image exists using the constructed path
        if (!Storage::disk('r2-perm')->exists($ticket->generated_ticket_path)) {
            abort(404, 'Ticket image not found.');
        }

        // Get the image content from R2 storage
        $imageContent = Storage::disk('r2-perm')->get($ticket->generated_ticket_path);

        // Since we're always using .webp now, we can simplify this
        $mimeType = 'image/webp';
        $extension = 'webp';

        // Return the image with appropriate headers for inline viewing
        return response($imageContent)
            ->header('Content-Type', $mimeType)
            ->header('Content-Disposition', 'inline; filename="ticket_' . $ticket->ticket_id . '.' . $extension . '"');
    }

    public function canvas(Ticket $ticket = null)
    {
        // Load categories with their templates
        $categories = Category::with('templates')->get();

        return Inertia::render('Canvas', [
            'categories' => $categories,
            'ticket' => $ticket,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    public function duplicate(Ticket $ticket)
    {
        // Check if user has access to this ticket
        if (auth()->check()) {
            // For authenticated users, check if they own the ticket or it's in their orders
            $userOwnsTicket = $ticket->user_id === auth()->id() ||
                $ticket->order?->user_id === auth()->id();

            if (!$userOwnsTicket) {
                abort(403, 'You do not have permission to duplicate this ticket.');
            }
        } else {
            // For guests, check if the session matches
            if ($ticket->session_id !== session()->getId()) {
                abort(403, 'You do not have permission to duplicate this ticket.');
            }
        }

        // Redirect to canvas with the ticket data for duplication
        return redirect()->route('canvas.duplicate', ['ticket' => $ticket->ticket_id]);
    }
}