<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\Category;
use App\Models\SportsTicket;
use App\Models\ConcertTicket;
use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Inertia\Inertia;
use App\Models\Payment;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Session;

class TicketController extends Controller
{

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

            // Handle the ticket image
            $ticketData = $this->handleTicketImage($request, $ticketData);

            // Create the ticket
            $ticket = Ticket::create($ticketData);

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
     * Create a specialized ticket based on the category
     */
    protected function createSpecializedTicket(Request $request, string $categoryId)
    {
        Log::info('createSpecializedTicket Debug:', [
            'categoryId' => $categoryId,
            'artist_name' => $request->artist_name,
            'tour_name' => $request->tour_name,
        ]);

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
            'generatedTicket' => 'required|string',
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
            if ($ticket->generated_ticket_path) {
                Storage::disk('r2')->delete($ticket->generated_ticket_path);
            }

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

        // Check if the ticket image exists
        if (!$ticket->generated_ticket_path || !Storage::disk('r2')->exists($ticket->generated_ticket_path)) {
            abort(404, 'Ticket image not found.');
        }

        // Get the image content from R2 storage
        $imageContent = Storage::disk('r2')->get($ticket->generated_ticket_path);

        // Determine the correct MIME type
        $mimeType = 'image/webp';
        $extension = pathinfo($ticket->generated_ticket_path, PATHINFO_EXTENSION);
        if ($extension === 'png') {
            $mimeType = 'image/png';
        } elseif (in_array($extension, ['jpg', 'jpeg'])) {
            $mimeType = 'image/jpeg';
        }

        // Return the image with appropriate headers for inline viewing
        return response($imageContent)
            ->header('Content-Type', $mimeType)
            ->header('Content-Disposition', 'inline; filename="ticket_' . $ticket->ticket_id . '.' . $extension . '"');
    }

    public function canvas(Ticket $ticket)
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