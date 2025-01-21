<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
  use HasFactory;

  protected $fillable = [
    'ticket_id',
    'user_id',
    'event_name',
    'event_location',
    'event_datetime',
    'section',
    'row',
    'seat',
    'background_image',
    'generated_ticket_path'
  ];

  protected $casts = [
    'event_datetime' => 'datetime'
  ];

  public function user()
  {
    return $this->belongsTo(User::class);
  }
}