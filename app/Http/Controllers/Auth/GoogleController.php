<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Exception;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class GoogleController extends Controller
{
  public function redirect()
  {
    $redirectUrl = Socialite::driver('google')
      ->stateless()  // Add this line
      ->redirect()
      ->getTargetUrl();  // Add this line

    return Inertia::location($redirectUrl);
  }

  public function callback()
  {
    try {
      $googleUser = Socialite::driver('google')->stateless()->user();

      $user = User::where('email', $googleUser->email)->first();

      if (!$user) {
        $user = User::create([
          'name' => $googleUser->name,
          'email' => $googleUser->email,
          'google_id' => $googleUser->id,
          'password' => null,
          'email_verified_at' => now(),
        ]);

        event(new Registered($user));
      } else if (!$user->google_id) {
        $user->google_id = $googleUser->id;
        $user->save();
      }

      Auth::login($user);

      return Inertia::location(url: '/');

    } catch (Exception $e) {
      // More detailed error logging
      Log::error('Google callback error details:', [
        'message' => $e->getMessage(),
        'code' => $e->getCode(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => $e->getTraceAsString()
      ]);

      // You might also want to dump these details in development
      if (app()->environment('local')) {
        dd([
          'error_message' => $e->getMessage(),
          'code' => $e->getCode(),
          'file' => $e->getFile(),
          'line' => $e->getLine()
        ]);
      }

      return redirect()->route('login')
        ->with('error', 'Something went wrong with Google login');
    }
  }
}