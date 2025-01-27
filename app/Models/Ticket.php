<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Laravel\Cashier\Billable;

class Ticket extends Model
{
  use HasFactory;
  use Billable;

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
    'background_filename',
    'template',
    'generated_ticket_path'
  ];

  protected $casts = [
    'event_datetime' => 'datetime'
  ];

  protected static function boot()
  {
    parent::boot();

    static::creating(function ($ticket) {
      if (!$ticket->ticket_id) {
        do {
          $ticketId = sprintf(
            'TIX-%s-%s',
            now()->format('Y'),
            Str::upper(Str::random(6))
          );
        } while (static::where('ticket_id', $ticketId)->exists());

        $ticket->ticket_id = $ticketId;
      }
    });

    static::saving(function ($ticket) {
      // Ensure ticket_id is never null
      if (!$ticket->ticket_id) {
        throw new \Exception('Ticket ID cannot be null');
      }
    });
  }

  public function user()
  {
    return $this->belongsTo(User::class);
  }

  public function getRouteKeyName()
  {
    return 'ticket_id';
  }
}