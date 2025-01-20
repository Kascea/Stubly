<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class SocialAuth extends Model
{
  use HasFactory;
  protected $table = 'social_auth';

  protected $fillable = [
    'provider',
    'provider_id',
    'user_id'
  ];

  public function user()
  {
    return $this->belongsTo(User::class);
  }
}