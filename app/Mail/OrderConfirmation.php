<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class OrderConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $order;
    public $tickets;

    /**
     * Create a new message instance.
     */
    public function __construct(Order $order, $tickets)
    {
        $this->order = $order;
        $this->tickets = $tickets;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $data = [
            'order' => $this->order,
            'tickets' => $this->tickets,
            'hasAccount' => !is_null($this->order->user_id),
        ];

        return $this->subject('Your Stubly Order Confirmation #' . $this->order->order_id)
            ->markdown('emails.order-confirmation', $data);
    }
}