<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\PaymentController;
use App\Http\Middleware\VerifyTicketOwner;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Middleware\VerifyTicketAccess;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\SupportController;
use Illuminate\Support\Facades\Mail;
use App\Mail\RefundRequest;

// Apply global rate limiting to all routes
Route::middleware(['throttle:global'])->group(function () {

  // Public routes
  Route::get('/', [TicketController::class, 'canvas'])->name('canvas');
  Route::get('/canvas/{ticket:ticket_id}', [TicketController::class, 'canvas'])->name('canvas.duplicate');

  // Public ticket routes with specific rate limiting for intensive operations
  Route::prefix('tickets')->name('tickets.')->group(function () {
    // File upload routes - more restrictive rate limiting
    Route::post('/', [TicketController::class, 'store'])
      ->middleware('throttle:uploads')
      ->name('store');
    Route::post('/duplicate', [TicketController::class, 'createDuplicate'])
      ->middleware('throttle:uploads')
      ->name('duplicate.create');

    // Viewing and deletion routes - use global rate limiting
    Route::get('/{ticket:ticket_id}', [TicketController::class, 'viewTicket'])->name('view');
  });

  // Cart routes (accessible to guests) with cart-specific rate limiting
  Route::prefix('cart')->name('cart.')->middleware('throttle:cart')->group(function () {
    Route::get('/', [CartController::class, 'index'])->name('index');
    Route::post('/add', [CartController::class, 'addItem'])->name('add');
    Route::delete('/', [CartController::class, 'clear'])->name('clear');
    Route::get('/checkout', [CartController::class, 'checkout'])
      ->middleware('throttle:payments')
      ->name('checkout');
  });

  // Checkout routes (accessible to guests) with payment-specific rate limiting
  Route::get('/checkout', [CartController::class, 'checkout'])
    ->middleware('throttle:payments')
    ->name('checkout');
  Route::get('/checkout/success', [CartController::class, 'checkoutSuccess'])
    ->middleware('throttle:payments')
    ->name('cart.checkout.success');

  // Support routes (accessible to guests) with email-specific rate limiting
  Route::prefix('support')->name('support.')->group(function () {
    Route::get('/', [SupportController::class, 'index'])->name('index');
    Route::get('/refund', [SupportController::class, 'refundForm'])->name('refund.form');
    Route::post('/refund', [SupportController::class, 'submitRefund'])
      ->middleware('throttle:emails')
      ->name('refund.submit');
  });

  // Routes that work for both guests and authenticated users
  Route::post('/orders/{order}/resend-confirmation', [OrderController::class, 'resendConfirmation'])
    ->middleware('throttle:emails')
    ->name('orders.resend-confirmation');

  // Auth protected routes
  Route::middleware(['auth'])->group(function () {
    // Profile routes
    Route::prefix('profile')->name('profile.')->group(function () {
      Route::get('/', [ProfileController::class, 'edit'])->name('edit');
      Route::patch('/', [ProfileController::class, 'update'])->name('update');
      Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
    });

    // Password routes
    Route::post('/password/set', [PasswordController::class, 'set'])->name('password.set');

    // Order routes
    Route::prefix('orders')->name('orders.')->group(function () {
      Route::get('/', [OrderController::class, 'index'])->name('index');
      Route::get('/{order}', [OrderController::class, 'show'])->name('show');
      Route::get('/{order}/printout', [OrderController::class, 'viewPdf'])->name('printout');
    });
  });

});

require __DIR__ . '/auth.php';