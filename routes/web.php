<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Ticket;
use Illuminate\Http\Request;


// Routes that require authentication
Route::middleware(['auth', 'verified'])->group(function () {
  // Main canvas page
  Route::get('/', function (Request $request) {
    $ticket = null;
    if ($request->has('ticket')) {
      $ticket = Ticket::where('ticket_id', $request->ticket)
        ->where('user_id', auth()->id())
        ->first();
    }
    return Inertia::render('Canvas', [
      'ticket' => $ticket
    ]);
  })->name('canvas');

  // Ticket routes with additional middleware for ownership verification
  Route::prefix('tickets')->name('tickets.')->group(function () {
    // Creating a new ticket only needs auth
    Route::post('/', [TicketController::class, 'store'])->name('store');

    // These routes need both auth and ticket ownership verification
    Route::middleware('verify.ticket.owner')->group(function () {
      Route::get('/{ticket}/download', [TicketController::class, 'download'])->name('download');
      Route::get('/{ticket}/success', [TicketController::class, 'success'])->name('success');
      Route::get('/{ticket}/cancel', [TicketController::class, 'cancel'])->name('cancel');
    });
  });

  // Profile routes
  Route::prefix('profile')->name('profile.')->group(function () {
    Route::get('/', [ProfileController::class, 'edit'])->name('edit');
    Route::patch('/', [ProfileController::class, 'update'])->name('update');
    Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
  });
});

Route::middleware(['auth'])->group(function () {
  Route::post('/tickets', [TicketController::class, 'store'])->name('tickets.store');
  Route::get('/tickets', [TicketController::class, 'index'])->name('tickets.index');
});

require __DIR__ . '/auth.php';