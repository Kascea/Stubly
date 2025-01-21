<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\SocialAuth;
use App\Models\Ticket;

class User extends Authenticatable
{
  /** @use HasFactory<\Database\Factories\UserFactory> */
  use HasFactory, Notifiable;

  /**
   * The attributes that are mass assignable.
   *
   * @var list<string>
   */
  protected $fillable = [
    'name',
    'email',
    'password',
  ];

  /**
   * The attributes that should be hidden for serialization.
   *
   * @var list<string>
   */
  protected $hidden = [
    'password',
    'remember_token',
  ];

  /**
   * Get the attributes that should be cast.
   *
   * @return array<string, string>
   */
  protected function casts(): array
  {
    return [
      'email_verified_at' => 'datetime',
      'password' => 'hashed',
    ];
  }

  // Relationship to social authentications
  public function socialAuth()
  {
    return $this->hasMany(SocialAuth::class);

  }

  // Helper method to check if user has a real password set
  public function hasRealPassword(): bool
  {
    // You could store a flag in the database, or use a specific pattern
    // in the hashed password to identify auto-generated ones
    return !$this->socialAuth()->exists();
  }

  // Add this method to the User model
  public function tickets()
  {
    return $this->hasMany(Ticket::class);
  }
}
