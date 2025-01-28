<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'user_id',
        'ticket_id',
        'stripe_session_id',
        'amount',
        'payment_status',
        'paid_at'
    ];

    protected $casts = [
        'paid_at' => 'datetime'
    ];

    public function ticket()
    {
        return $this->belongsTo(Ticket::class, 'ticket_id', 'ticket_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}