<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Cart extends Model
{
    use HasFactory;

    protected $primaryKey = 'cart_id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'user_id',
        'cart_id',
        'session_id',
        'status',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($cart) {
            if (!$cart->cart_id) {
                do {
                    $cartId = sprintf(
                        'CART-%s-%s',
                        now()->format('Y'),
                        Str::upper(Str::random(6))
                    );
                } while (static::where('cart_id', $cartId)->exists());

                $cart->cart_id = $cartId;
                $cart->expires_at = now()->addDays(7);
            }
        });
    }

    /**
     * Get the user that owns the cart.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the items in the cart.
     */
    public function items()
    {
        return $this->hasMany(CartItem::class, 'cart_id', 'cart_id');
    }

    /**
     * Check if the cart is expired.
     */
    public function isExpired()
    {
        return $this->expires_at->isPast();
    }

    /**
     * Get the total number of items in the cart.
     */
    public function itemCount()
    {
        return $this->items()->count();
    }

    /**
     * Get route key name.
     */
    public function getRouteKeyName()
    {
        return 'cart_id';
    }
}