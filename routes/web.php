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

// Public routes
Route::get('/', [TicketController::class, 'canvas'])->name('canvas');
Route::get('/canvas/{ticket:ticket_id}', [TicketController::class, 'canvas'])->name('canvas.duplicate');

// Public ticket routes
Route::prefix('tickets')->name('tickets.')->group(function () {
  Route::post('/', [TicketController::class, 'store'])->name('store');
  Route::get('/{ticket:ticket_id}', [TicketController::class, 'viewTicket'])->name('view');
  Route::get('/{ticket:ticket_id}/render', [TicketController::class, 'renderForScreenshot'])->name('render');
  Route::delete('/{ticket:ticket_id}', [TicketController::class, 'destroy'])
    ->middleware(VerifyTicketAccess::class)
    ->name('destroy');
  Route::post('/duplicate', [TicketController::class, 'createDuplicate'])
    ->name('duplicate.create');
});

// Cart routes (accessible to guests)
Route::prefix('cart')->name('cart.')->group(function () {
  Route::get('/', [CartController::class, 'index'])->name('index');
  Route::post('/add', [CartController::class, 'addItem'])->name('add');
  Route::delete('/', [CartController::class, 'clear'])->name('clear');
  Route::get('/checkout', [CartController::class, 'checkout'])->name('checkout');
});

// Checkout routes (accessible to guests)
Route::post('/checkout', [CartController::class, 'checkout'])->name('checkout');
Route::get('/checkout/success', [CartController::class, 'checkoutSuccess'])->name('cart.checkout.success');

// Support routes (accessible to guests)
Route::prefix('support')->name('support.')->group(function () {
  Route::get('/', [SupportController::class, 'index'])->name('index');
  Route::get('/refund', [SupportController::class, 'refundForm'])->name('refund.form');
  Route::post('/refund', [SupportController::class, 'submitRefund'])->name('refund.submit');
});

// Routes that work for both guests and authenticated users
Route::post('/orders/{order}/resend-confirmation', [OrderController::class, 'resendConfirmation'])
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

require __DIR__ . '/auth.php';