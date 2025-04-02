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
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;

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
        // Generate PDF for the order
        $pdfPath = $this->generateOrderPdf();

        // Send the order confirmation email with the PDF attached
        Mail::to($this->customerEmail)
            ->send(new OrderConfirmation($this->order, $this->tickets, $pdfPath));
    }

    /**
     * Generate a PDF for the order
     * 
     * @return string Path to the saved PDF in R2 storage
     */
    protected function generateOrderPdf(): string
    {
        $ticketImages = [];

        // Load the template relationship for all tickets
        $this->tickets->load('template');

        // Retrieve ticket images from R2 and convert to base64 for PDF embedding
        foreach ($this->tickets as $ticket) {
            if ($ticket->generated_ticket_path && Storage::disk('r2')->exists($ticket->generated_ticket_path)) {
                $imageContents = Storage::disk('r2')->get($ticket->generated_ticket_path);
                $base64Image = 'data:image/webp;base64,' . base64_encode($imageContents);
                $ticketImages[] = $base64Image;
            } else {
                // Use a placeholder if the ticket image doesn't exist
                $ticketImages[] = 'data:image/png;base64,' . base64_encode('Ticket image not available');
            }
        }

        // Generate PDF content
        $pdf = PDF::loadView('pdfs.order', [
            'order' => $this->order,
            'tickets' => $this->tickets,
            'ticketImages' => $ticketImages
        ]);

        // Create a unique filename for the PDF
        $pdfFilename = 'order-' . $this->order->order_id . '-' . Str::random(8) . '.pdf';

        // Save PDF to R2 storage
        Storage::disk('r2')->put($pdfFilename, $pdf->output());

        // Update the order with the PDF path
        $this->order->update([
            'pdf_path' => $pdfFilename
        ]);

        return $pdfFilename;
    }
}
