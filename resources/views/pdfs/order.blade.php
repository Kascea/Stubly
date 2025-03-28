<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Order #{{ $order->order_id }} - Tickets</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 20px;
        }
        .header h1 {
            color: #0369a1;
            margin-bottom: 10px;
        }
        .order-info {
            margin-bottom: 30px;
        }
        .instructions {
            background-color: #f8f9fa;
            border-left: 4px solid #0369a1;
            padding: 15px;
            margin-bottom: 30px;
        }
        .tickets-container {
            margin-bottom: 30px;
        }
        .ticket {
            margin-bottom: 40px;
            page-break-inside: avoid;
        }
        .ticket-header {
            background-color: #0369a1;
            color: white;
            padding: 10px;
            margin-bottom: 15px;
        }
        .ticket-details {
            display: table;
            width: 100%;
            margin-bottom: 15px;
        }
        .detail-row {
            display: table-row;
        }
        .detail-label {
            display: table-cell;
            font-weight: bold;
            padding: 5px 10px 5px 0;
            width: 30%;
        }
        .detail-value {
            display: table-cell;
            padding: 5px 0;
            width: 70%;
        }
        .ticket-image {
            text-align: center;
            margin: 20px 0;
        }
        .ticket-image img {
            max-width: 100%;
            max-height: 300px;
            border: 1px solid #ddd;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #666;
            margin-top: 30px;
            border-top: 1px solid #ddd;
            padding-top: 20px;
        }
        .page-break {
            page-break-after: always;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Stubly - Order Confirmation</h1>
        <p>Order #{{ $order->order_id }} - {{ $order->created_at->format('F j, Y') }}</p>
    </div>

    <div class="order-info">
        <p><strong>Order Date:</strong> {{ $order->created_at->format('F j, Y, g:i a') }}</p>
        <p><strong>Customer:</strong> {{ $order->customer_email }}</p>
        <p><strong>Total Amount:</strong> ${{ number_format($order->total_amount, 2) }}</p>
        <p><strong>Number of Tickets:</strong> {{ count($tickets) }}</p>
    </div>

    <div class="instructions">
        <h3>Printing Instructions</h3>
        <ol>
            <li>For best results, print this document using a color printer on standard letter paper (8.5" x 11").</li>
            <li>Make sure to print at 100% scale (no shrinking or "fit to page").</li>
            <li>After printing, carefully cut each ticket along the outer border.</li>
            <li>For mobile entry, you can also just show the ticket on your mobile device.</li>
            <li>Each ticket in this order has a unique identifier and can only be used once.</li>
        </ol>
    </div>

    <div class="tickets-container">
        <h2>Your Tickets</h2>
        
        @foreach($tickets as $index => $ticket)
        <div class="ticket">
            <div class="ticket-header">
                <h3>{{ $ticket->event_name }}</h3>
            </div>
            
            <div class="ticket-details">
                @if($ticket->event_datetime)
                <div class="detail-row">
                    <div class="detail-label">Date & Time:</div>
                    <div class="detail-value">{{ date('F j, Y, g:i a', strtotime($ticket->event_datetime)) }}</div>
                </div>
                @endif
                
                @if($ticket->event_location)
                <div class="detail-row">
                    <div class="detail-label">Location:</div>
                    <div class="detail-value">{{ $ticket->event_location }}</div>
                </div>
                @endif
                
                @if($ticket->section)
                <div class="detail-row">
                    <div class="detail-label">Section:</div>
                    <div class="detail-value">{{ $ticket->section }}</div>
                </div>
                @endif
                
                @if($ticket->row)
                <div class="detail-row">
                    <div class="detail-label">Row:</div>
                    <div class="detail-value">{{ $ticket->row }}</div>
                </div>
                @endif
                
                @if($ticket->seat)
                <div class="detail-row">
                    <div class="detail-label">Seat:</div>
                    <div class="detail-value">{{ $ticket->seat }}</div>
                </div>
                @endif
                
                <div class="detail-row">
                    <div class="detail-label">Ticket ID:</div>
                    <div class="detail-value">{{ $ticket->ticket_id }}</div>
                </div>
            </div>
            
            <div class="ticket-image">
                <img src="{{ $ticketImages[$index] }}" alt="Ticket for {{ $ticket->event_name }}">
            </div>
        </div>
        
        @if(!$loop->last)
        <div class="page-break"></div>
        @endif
        @endforeach
    </div>

    <div class="footer">
        <p>Thank you for using Stubly! If you have any questions, please contact support at cole@stubly.shop</p>
        <p>&copy; {{ date('Y') }} Stubly. All rights reserved.</p>
    </div>
</body>
</html> 