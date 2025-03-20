<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\SocialAuth;
use App\Models\Ticket;
use Illuminate\Support\Str;
use App\Models\Order;

class User extends Authenticatable
{
  /** @use HasFactory<\Database\Factories\UserFactory> */
  use HasFactory, Notifiable;

  public $incrementing = false;
  protected $keyType = 'string';

  protected static function boot()
  {
    parent::boot();

    static::creating(function ($model) {
      if (!$model->id) {
        $model->id = Str::uuid()->toString();
      }
    });
  }

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

  /**
   * Get the orders for the user.
   */
  public function orders()
  {
    return $this->hasMany(Order::class);
  }
}
