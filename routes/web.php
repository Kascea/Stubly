<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\PaymentController;
use App\Http\Middleware\VerifyTicketOwner;
use App\Http\Middleware\VerifyPayment;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Laravel\Cashier\Cashier;
use App\Models\Payment;
use Illuminate\Support\Str;

Route::middleware(['auth', 'verified'])->group(function () {
  // Main canvas page
  Route::get('/', [TicketController::class, 'canvas'])->name('canvas');

  // Ticket routes
  Route::prefix('tickets')->name('tickets.')->group(function () {
    Route::get('/', [TicketController::class, 'index'])->name('index');
    Route::post('/', [TicketController::class, 'store'])->name('store');
    Route::get('/duplicate/{ticket:ticket_id}', [TicketController::class, 'duplicate'])->name('duplicate');
    Route::get('/preview/{ticket:ticket_id}', [TicketController::class, 'preview'])->name('preview');

    //Protected routes
    Route::delete('/{ticket:ticket_id}', [TicketController::class, 'destroy'])
      ->middleware(VerifyTicketOwner::class)
      ->name('destroy');

    Route::get('/{ticket:ticket_id}/download', [TicketController::class, 'download'])
      ->middleware([VerifyTicketOwner::class, VerifyPayment::class])
      ->name('download');
  });

  // Payment routes
  Route::prefix('payment')->name('payment.')->group(function () {
    // Checkout Routes
    Route::get('/checkout/{ticket:ticket_id}', [PaymentController::class, 'checkout'])
      ->middleware(VerifyTicketOwner::class)
      ->name('checkout');

    // Success/Return URL after payment
    Route::get('/success/{ticket:ticket_id}', [PaymentController::class, 'success'])
      ->middleware(VerifyTicketOwner::class)
      ->name('success');

    // Status check endpoint for the frontend
    Route::post('/status', [PaymentController::class, 'status'])
      ->middleware(['auth'])
      ->name('status');
  });

  // Profile routes
  Route::prefix('profile')->name('profile.')->group(function () {
    Route::get('/', [ProfileController::class, 'edit'])->name('edit');
    Route::patch('/', [ProfileController::class, 'update'])->name('update');
    Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
  });
});

require __DIR__ . '/auth.php';