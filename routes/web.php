<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TicketController;
use App\Http\Controllers\PaymentController;
use App\Http\Middleware\VerifyTicketOwner;
use App\Http\Middleware\VerifyPayment;
use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Middleware\VerifyTicketAccess;
use Inertia\Inertia;

// Public routes
Route::get('/', [TicketController::class, 'canvas'])->name('canvas');

// Public ticket routes
Route::post('/tickets', [TicketController::class, 'store'])->name('tickets.store');
Route::delete('/tickets/{ticket:ticket_id}', [TicketController::class, 'destroy'])
  ->middleware(VerifyTicketAccess::class)
  ->name('tickets.destroy');

// Cart and checkout routes (accessible to guests)
Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
Route::post('/cart/add', [CartController::class, 'addItem'])->name('cart.add');
Route::patch('/cart/{item}', [CartController::class, 'updateItem'])->name('cart.update');
Route::delete('/cart/{item}', [CartController::class, 'removeItem'])->name('cart.remove');
Route::delete('/cart', [CartController::class, 'clear'])->name('cart.clear');

// Checkout routes (accessible to guests)
Route::post('/checkout', [CartController::class, 'checkout'])->name('checkout');
Route::get('/checkout/success', [CartController::class, 'checkoutSuccess'])->name('cart.checkout.success');

// Add this with your other public cart routes
Route::get('/cart/count', [CartController::class, 'count'])->name('cart.count');

Route::middleware(['auth', 'verified'])->group(function () {
  // Authenticated ticket routes
  Route::prefix('tickets')->name('tickets.')->group(function () {
    Route::get('/', [TicketController::class, 'index'])->name('index');
    Route::get('/duplicate/{ticket:ticket_id}', [TicketController::class, 'duplicate'])->name('duplicate');
    Route::get('/preview/{ticket:ticket_id}', [TicketController::class, 'preview'])->name('preview');

    //Protected routes
    // Route::get('/{ticket:ticket_id}/download', [TicketController::class, 'download'])
    //   ->middleware([VerifyTicketOwner::class, VerifyPayment::class])
    //   ->name('download');
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

  // Password routes
  Route::post('/password/set', [PasswordController::class, 'set'])->name('password.set');

  // Order routes (remain authenticated)
  Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
  Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
  Route::get('/orders/{order}/download', [OrderController::class, 'downloadTickets'])->name('orders.download');
});

Route::get('/support', function () {
  return Inertia::render('Support/Index');
})->name('support');

require __DIR__ . '/auth.php';