<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Ticket;
use Illuminate\Http\Request;

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

  // Ticket routes
  Route::prefix('tickets')->name('tickets.')->group(function () {
    Route::get('/', [TicketController::class, 'index'])->name('index');
    Route::post('/', [TicketController::class, 'store'])->name('store');
    Route::delete('/{ticket:ticket_id}', [TicketController::class, 'destroy'])->name('destroy');

    // Routes that need ticket ownership verification
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

require __DIR__ . '/auth.php';