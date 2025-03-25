<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
  /**
   * Display the user's profile form.
   */
  // In ProfileController.php
  public function edit(Request $request): Response
  {
    $user = $request->user();
    return Inertia::render('Profile/Edit', [
      'mustVerifyEmail' => $user instanceof MustVerifyEmail,
      'status' => session('status'),
      'auth' => [
        'user' => array_merge($user->toArray(), [
          'has_password' => $user->hasRealPassword(),
        ]),
      ],
    ]);
  }

  /**
   * Update the user's profile information.
   */
  public function update(ProfileUpdateRequest $request): RedirectResponse
  {
    // Determine if this is a social auth user
    $isSocialUser = $request->user()->social_id !== null; // Adjust based on your implementation

    // For social auth users, only update name
    if ($isSocialUser) {
      $request->user()->fill([
        'name' => $request->name,
      ]);
    } else {
      // For regular users, update both name and email
      $request->user()->fill($request->validated());

      if ($request->user()->isDirty('email')) {
        $request->user()->email_verified_at = null;
      }
    }

    $request->user()->save();

    return Redirect::route('profile.edit')->with('status', 'profile-updated');
  }

  /**
   * Delete the user's account.
   */
  public function destroy(Request $request): RedirectResponse
  {
    $user = $request->user();
    $isSocialUser = !$user->hasRealPassword();

    if ($isSocialUser) {
      // For social auth users, validate the confirmation checkbox
      $request->validate([
        'confirm_deletion' => ['required', 'accepted'],
      ]);
    } else {
      // For regular users, validate password
      $request->validate([
        'password' => ['required', 'current_password'],
      ]);
    }

    Auth::logout();

    $user->delete();

    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return Redirect::to('/');
  }
}
