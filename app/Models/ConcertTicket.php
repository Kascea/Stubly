<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConcertTicket extends Model
{
    use HasFactory;

    protected $fillable = [
        'artist',
        'tour_name',
    ];

    /**
     * Get the ticket record associated with the concert ticket.
     */
    public function ticket()
    {
        return $this->morphOne(Ticket::class, 'ticketable');
    }
}