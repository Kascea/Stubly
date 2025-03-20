<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Laravel\Cashier\Billable;

class Order extends Model
{
    use HasFactory;
    use Billable;

    protected $primaryKey = 'order_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'order_id',
        'status',
        'total_amount',
        'payment_intent_id',
        'payment_method_id',
        'billing_email',
        'billing_name',
        'payment_id',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            if (!$order->order_id) {
                do {
                    $orderId = sprintf(
                        'ORD-%s-%s',
                        now()->format('Y'),
                        Str::upper(Str::random(6))
                    );
                } while (static::where('order_id', $orderId)->exists());

                $order->order_id = $orderId;
            }
        });
    }

    /**
     * Get the user that owns the order.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the tickets associated with this order.
     */
    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'order_id', 'order_id');
    }

    /**
     * Get route key name.
     */
    public function getRouteKeyName()
    {
        return 'order_id';
    }
}