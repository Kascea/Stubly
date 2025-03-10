<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SportsTicket extends Model
{
    use HasFactory;

    protected $fillable = [
        'team_home',
        'team_away',
    ];

    /**
     * Get the ticket record associated with the sports ticket.
     */
    public function ticket()
    {
        return $this->morphOne(Ticket::class, 'ticketable');
    }
}