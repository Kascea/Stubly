<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use DateTime;

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
        'generatedTicket' => 'required|string'
      ]);

      // Convert base64 to file and store
      $image = $request->generatedTicket;
      $image = str_replace('data:image/png;base64,', '', $image);
      $image = str_replace(' ', '+', $image);

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
        'event_datetime' => (new DateTime($request->date))->format('Y-m-d') . ' ' . (new DateTime($request->time))->format('H:i:s'),
        'section' => $request->section,
        'row' => $request->row,
        'seat' => $request->seat,
        'background_image' => $request->backgroundImage,
        'generated_ticket_path' => $imageName
      ];

      // Find existing ticket or create new one
      if ($request->ticketId) {
        $ticket = Ticket::where('ticket_id', $request->ticketId)
          ->where('user_id', auth()->id())
          ->firstOrFail();

        // Delete old image if it exists
        if ($ticket->generated_ticket_path) {
          Storage::disk('public')->delete($ticket->generated_ticket_path);
        }

        $ticket->update($ticketData);
        $message = 'Ticket updated successfully';
      } else {
        $ticketData['user_id'] = auth()->id();
        $ticketData['ticket_id'] = Str::uuid()->toString();
        $ticket = Ticket::create($ticketData);
        $message = 'Ticket created successfully';
      }

      return response()->json([
        'message' => $message,
        'ticket' => $ticket
      ]);

    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
      return response()->json([
        'message' => 'Ticket not found',
        'error' => 'The specified ticket could not be found'
      ], 404);
    } catch (\Illuminate\Validation\ValidationException $e) {
      return response()->json([
        'message' => 'Validation failed',
        'errors' => $e->errors()
      ], 422);
    } catch (\Exception $e) {
      return response()->json([
        'message' => 'Failed to save ticket',
        'error' => $e->getMessage()
      ], 500);
    }
  }

  public function index()
  {
    $tickets = auth()->user()->tickets()->latest()->get();

    return inertia('Tickets/Index', [
      'tickets' => $tickets
    ]);
  }
}