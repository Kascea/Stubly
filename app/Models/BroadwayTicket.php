<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BroadwayTicket extends Model
{
    use HasFactory;

    protected $fillable = [
        'play_name',
        'theater_name',
    ];

    /**
     * Get the ticket record associated with the broadway ticket.
     */
    public function ticket()
    {
        return $this->morphOne(Ticket::class, 'ticketable');
    }
}