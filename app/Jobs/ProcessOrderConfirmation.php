<?php

namespace App\Jobs;

use App\Mail\OrderConfirmation;
use App\Models\Order;
use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class ProcessOrderConfirmation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        protected Order $order,
        protected string $customerEmail,
        protected $tickets
    ) {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Mail::to($this->customerEmail)
            ->send(new OrderConfirmation($this->order, $this->tickets));
    }
}
