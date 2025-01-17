<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes (if any)
Route::get('/about', function () {
  return Inertia::render('About');
})->name('about');

// Routes that require authentication
Route::middleware(['auth', 'verified'])->group(function () {
  // Main canvas page
  Route::get('/', function () {
    return Inertia::render('Canvas');
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

require __DIR__ . '/auth.php';