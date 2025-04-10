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
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class GoogleController extends Controller
{
  public function redirect()
  {
    $redirectUrl = Socialite::driver('google')
      ->stateless()
      ->redirect()
      ->getTargetUrl();

    return Inertia::location($redirectUrl);
  }

  public function callback()
  {
    try {
      $googleUser = Socialite::driver('google')->stateless()->user();
      $user = User::where('email', $googleUser->email)->first();

      if (!$user) {
        // Create a new user with verified email
        $user = User::create([
          'name' => $googleUser->name,
          'email' => $googleUser->email,
          'password' => Hash::make(Str::random(32)),
          'email_verified_at' => now(), // Mark as verified immediately
        ]);

        event(new Registered($user));
      } else if (is_null($user->email_verified_at)) {
        // If user exists but email not verified, mark it as verified now
        $user->email_verified_at = now();
        $user->save();
      }

      // Create or update social auth record
      $user->socialAuth()->updateOrCreate(
        [
          'provider' => 'google',
          'provider_id' => $googleUser->id,
        ]
      );

      Auth::login($user, true);
      return redirect(route('canvas', absolute: false));

    } catch (Exception $e) {
      Log::error('Google callback error details:', [
        'message' => $e->getMessage(),
        'code' => $e->getCode(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => $e->getTraceAsString()
      ]);

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