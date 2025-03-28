<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Storage;

class OrderConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $order;
    public $tickets;
    protected $pdfPath;

    /**
     * Create a new message instance.
     */
    public function __construct(Order $order, $tickets, $pdfPath = null)
    {
        $this->order = $order;
        $this->tickets = $tickets;
        $this->pdfPath = $pdfPath;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        $mail = $this->subject('Your Stubly Order Confirmation #' . $this->order->order_id)
            ->markdown('emails.order-confirmation', [
                'order' => $this->order,
                'tickets' => $this->tickets,
                'hasAccount' => !is_null($this->order->user_id),
            ]);

        // Attach the PDF if available
        if ($this->pdfPath && Storage::disk('r2')->exists($this->pdfPath)) {
            $mail->attachData(
                Storage::disk('r2')->get($this->pdfPath),
                'Stubly-Order-' . $this->order->order_id . '.pdf',
                [
                    'mime' => 'application/pdf',
                ]
            );
        }

        return $mail;
    }
}