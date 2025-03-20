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

  protected $primaryKey = 'ticket_id';
  public $incrementing = false;
  protected $keyType = 'string';

  protected $fillable = [
    'ticket_id',
    'user_id',
    'order_id',
    'event_name',
    'event_location',
    'event_datetime',
    'section',
    'row',
    'seat',
    'price',
    'is_purchased',
    'generated_ticket_url',
    'template_id',
    'ticketable_id',
    'ticketable_type',
    'generated_ticket_path',
    'background_image_path',
  ];

  protected $casts = [
    'event_datetime' => 'datetime',
    'price' => 'decimal:2',
  ];

  protected $appends = [
    'generated_ticket_url',
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

  /**
   * Get the parent ticketable model (SportsTicket, ConcertTicket, etc.).
   */
  public function ticketable()
  {
    return $this->morphTo();
  }

  /**
   * Get the user that owns the ticket.
   */
  public function user()
  {
    return $this->belongsTo(User::class);
  }

  public function getRouteKeyName()
  {
    return 'ticket_id';
  }

  /**
   * Get the order associated with the ticket.
   */
  public function order()
  {
    return $this->belongsTo(Order::class, 'order_id', 'order_id');
  }

  public function payments()
  {
    return $this->hasMany(Payment::class, 'ticket_id', 'ticket_id');
  }

  public function isPaid()
  {
    return $this->payments()->where('payment_status', 'paid')->exists();
  }

  public function getGeneratedTicketUrlAttribute()
  {
    if (!$this->generated_ticket_path)
      return null;
    return config('filesystems.disks.r2.url') . '/' . $this->generated_ticket_path;
  }

  public function getBackgroundUrlAttribute()
  {
    if (!$this->background_image_path)
      return null;
    return config('filesystems.disks.r2.url') . '/' . $this->background_image_path;
  }

  /**
   * Get the template that owns the ticket.
   */
  public function template()
  {
    return $this->belongsTo(Template::class);
  }

  /**
   * Get the cart items for the ticket.
   */
  public function cartItems()
  {
    return $this->hasMany(CartItem::class, 'ticket_id', 'ticket_id');
  }
}