<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\SportsTicket;
use App\Models\ConcertTicket;
use App\Models\BroadwayTicket;
use App\Models\Template;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\ValidationException;

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
                'accent_color' => $request->accentColor,
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

            return $this->handleSecureError($e, 'Ticket creation', [
                'template_id' => $request->template_id ?? null,
                'event_name' => $request->eventName ?? null,
            ]);
        }
    }

    /**
     * Process and upload all ticket assets including the main ticket image
     */
    protected function processTicketImages(Request $request, Ticket $ticket, string $categoryId): void
    {
        // 1. Store the main ticket image directly (already WebP from frontend)
        if ($request->hasFile('generatedTicket')) {
            $success = Storage::disk('r2-perm')->putFileAs(
                '',
                $request->file('generatedTicket'),
                $ticket->ticket_id . '.webp'
            );

            if (!$success) {
                throw new \Exception('Failed to store main ticket image');
            }
        }

        // 2. Store background image directly to temp storage
        if ($request->hasFile('backgroundImage')) {
            $success = Storage::disk('r2-temp')->putFileAs(
                $ticket->ticket_id,
                $request->file('backgroundImage'),
                'background-image.webp'
            );
        }

        // 3. Store team logos directly to temp storage for sports tickets
        if ($categoryId === 'sports') {
            if ($request->hasFile('homeTeamLogo')) {
                Storage::disk('r2-temp')->putFileAs(
                    $ticket->ticket_id,
                    $request->file('homeTeamLogo'),
                    'home-team-logo.webp'
                );
            }

            if ($request->hasFile('awayTeamLogo')) {
                Storage::disk('r2-temp')->putFileAs(
                    $ticket->ticket_id,
                    $request->file('awayTeamLogo'),
                    'away-team-logo.webp'
                );
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
                'team_away' => $request->team_away ?? null,
                'sport_type' => $request->sport_type ?? null,
            ]),
            'concerts' => ConcertTicket::create([
                'artist_name' => $request->artist_name ?? null,
                'tour_name' => $request->tour_name ?? null,
            ]),
            'broadway' => BroadwayTicket::create([
                'play_name' => $request->play_name ?? null,
                'theater_name' => $request->theater_name ?? null,
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
            'backgroundImage' => 'nullable|file|image|max:20480', // 20MB max for background (temp asset)
            'homeTeamLogo' => 'nullable|file|image|max:15360', // 15MB max for logos (temp asset)
            'awayTeamLogo' => 'nullable|file|image|max:15360', // 15MB max for logos (temp asset)
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

            case 'broadway':
                $rules = array_merge($rules, [
                    'play_name' => 'required|string',
                    'theater_name' => 'required|string',
                ]);
                break;

            // Add more cases for other categories as needed
        }

        $request->validate($rules);
    }

    public function destroy(Ticket $ticket)
    {
        try {
            // Delete the image file using the constructed path
            $path = $ticket->ticket_id . '.webp';
            Storage::disk('r2-perm')->delete($path);

            $ticket->delete();

            return response()->json([
                'message' => 'Ticket deleted successfully'
            ]);
        } catch (\Exception $e) {
            return $this->handleSecureError($e, 'Ticket deletion', [
                'ticket_id' => $ticket->ticket_id ?? 'unknown',
            ]);
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

        // Since we're using .webp from Cloudflare Browser Rendering API
        $mimeType = 'image/webp';
        $extension = 'webp';

        // Return the image with appropriate headers for inline viewing
        return response($imageContent)
            ->header('Content-Type', $mimeType)
            ->header('Content-Disposition', 'inline; filename="ticket_' . $ticket->ticket_id . '.' . $extension . '"');
    }

    public function canvas()
    {
        return Inertia::render('Canvas', [
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    public function createDuplicate(Request $request)
    {
        try {
            $request->validate([
                'original_ticket_id' => 'required|string|exists:tickets,ticket_id',
                'section' => 'nullable|string|max:10',
                'row' => 'nullable|string|max:10',
                'seat' => 'nullable|string|max:10',
                'generatedTicket' => 'required|file|image|max:10240', // 10MB max for ticket image
            ]);

            // Find the original ticket
            $originalTicket = Ticket::where('ticket_id', $request->original_ticket_id)->firstOrFail();

            // Start database transaction
            DB::beginTransaction();

            // Load the original ticket's specialized data
            $originalTicket->load('ticketable', 'template');

            // Create a duplicate of the specialized ticket
            $duplicateSpecialized = null;
            if ($originalTicket->ticketable) {
                $specializedData = $originalTicket->ticketable->toArray();
                unset($specializedData['id'], $specializedData['created_at'], $specializedData['updated_at']);

                $duplicateSpecialized = $originalTicket->ticketable->replicate();
                $duplicateSpecialized->save();
            }

            // Create the new ticket data
            $newTicketData = [
                'ticket_id' => Str::uuid()->toString(),
                'user_id' => auth()->check() ? auth()->id() : null,
                'session_id' => !auth()->check() ? Session::getId() : null,
                'template_id' => $originalTicket->template_id,
                'event_name' => $originalTicket->event_name,
                'event_location' => $originalTicket->event_location,
                'event_datetime' => $originalTicket->event_datetime,
                'section' => $request->section,
                'row' => $request->row,
                'seat' => $request->seat,
                'accent_color' => $originalTicket->accent_color,
                'ticketable_id' => $duplicateSpecialized?->id,
                'ticketable_type' => $originalTicket->ticketable_type,
            ];

            // Create the new ticket
            $newTicket = Ticket::create($newTicketData);

            // Store the main ticket image directly
            if ($request->hasFile('generatedTicket')) {
                $success = Storage::disk('r2-perm')->putFileAs(
                    '',
                    $request->file('generatedTicket'),
                    $newTicket->ticket_id . '.webp'
                );

                if (!$success) {
                    throw new \Exception('Failed to store main ticket image');
                }
            }

            // Copy R2 assets (background images, logos) so they're available for screenshot rendering
            $assetsSuccess = $this->copyNonTicketAssets($originalTicket, $newTicket);
            if (!$assetsSuccess) {
                throw new \Exception('Failed to copy ticket assets (background images, logos). The ticket could not be created.');
            }

            // Commit the transaction only if everything succeeded
            DB::commit();

            // Load the new ticket with its relationships for the response
            $newTicket->load('ticketable', 'template');

            return response()->json([
                'status' => 'success',
                'message' => 'Ticket duplicated successfully!',
                'ticket' => $newTicket
            ]);

        } catch (ValidationException $e) {
            // Re-throw validation exceptions so they're handled by Laravel's default handler
            // This preserves the field-specific error messages for forms
            throw $e;
        } catch (\Exception $e) {
            // Rollback the transaction in case of error
            DB::rollBack();

            return $this->handleSecureError($e, 'Ticket duplication', [
                'original_ticket_id' => $request->original_ticket_id ?? null,
            ]);
        }
    }

    /**
     * Copy non-ticket R2 assets (background images, logos) from original to new ticket
     * Returns true on success, false on failure
     */
    protected function copyNonTicketAssets(Ticket $originalTicket, Ticket $newTicket): bool
    {
        try {
            // Copy background image if it exists
            $originalBgPath = $originalTicket->ticket_id . '/background-image.webp';
            $newBgPath = $newTicket->ticket_id . '/background-image.webp';

            if (Storage::disk('r2-temp')->exists($originalBgPath)) {
                $bgContent = Storage::disk('r2-temp')->get($originalBgPath);
                if (!$bgContent || !Storage::disk('r2-temp')->put($newBgPath, $bgContent)) {
                    return false;
                }
            }

            // Copy team logos for sports tickets
            if ($originalTicket->template && $originalTicket->template->category_id === 'sports') {
                foreach (['home', 'away'] as $logoType) {
                    $originalLogoPath = $originalTicket->ticket_id . '/' . $logoType . '-team-logo.webp';
                    $newLogoPath = $newTicket->ticket_id . '/' . $logoType . '-team-logo.webp';

                    if (Storage::disk('r2-temp')->exists($originalLogoPath)) {
                        $logoContent = Storage::disk('r2-temp')->get($originalLogoPath);
                        if (!$logoContent || !Storage::disk('r2-temp')->put($newLogoPath, $logoContent)) {
                            return false;
                        }
                    }
                }
            }

            return true;
        } catch (\Exception $e) {
            return false;
        }
    }

}