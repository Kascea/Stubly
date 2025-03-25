<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Order Confirmation</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.5;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            overflow: hidden;
        }
        .header {
            background-color: #0369a1;
            color: white;
            padding: 25px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .header p {
            margin: 10px 0 0;
            opacity: 0.9;
        }
        .content {
            padding: 25px;
        }
        .order-summary {
            background-color: #f0f7ff;
            border-radius: 6px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        .summary-row.total {
            border-top: 1px solid #cce3f8;
            padding-top: 10px;
            margin-top: 10px;
            font-weight: bold;
            font-size: 18px;
        }
        .ticket-item {
            border-left: 3px solid #0369a1;
            padding: 15px;
            margin-bottom: 15px;
            background-color: #f5f5f5;
            border-radius: 6px;
        }
        .ticket-details {
            display: flex;
            flex-wrap: wrap;
            margin-top: 10px;
        }
        .ticket-detail {
            margin-right: 20px;
            margin-bottom: 5px;
        }
        .ticket-label {
            font-size: 12px;
            color: #666;
            display: block;
        }
        .ticket-value {
            font-weight: 600;
        }
        .footer {
            background-color: #f0f7ff;
            padding: 20px 25px;
            font-size: 14px;
            color: #555;
            border-top: 1px solid #e1e4e8;
            text-align: center;
        }
        .button {
            display: inline-block;
            background-color: #0284c7;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin-top: 20px;
        }
        .note {
            margin-top: 20px;
            padding: 15px;
            background-color: #fffbeb;
            border-radius: 6px;
            border-left: 4px solid #f59e0b;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Order Confirmation</h1>
            <p>Thank you for your purchase!</p>
        </div>

        <div class="content">
            <p>Hello{{ isset($order->customer_name) ? ' ' . $order->customer_name : '' }},</p>
            
            <p>Your order has been successfully processed. Here's a summary of your purchase:</p>
            
            <div class="order-summary">
                <div class="summary-row">
                    <span>Order Number:</span>
                    <span>#{{ $order->order_id }}</span>
                </div>
                <div class="summary-row">
                    <span>Order Date:</span>
                    <span>{{ $order->created_at->format('F j, Y, g:i a') }}</span>
                </div>
                <div class="summary-row">
                    <span>Number of Tickets:</span>
                    <span>{{ $tickets->count() }}</span>
                </div>
                <div class="summary-row total">
                    <span>Total:</span>
                    <span>${{ number_format($order->total_amount, 2) }}</span>
                </div>
            </div>
            
            <h2 style="color: #0369a1; font-size: 18px; margin-top: 30px;">Ticket Details</h2>
            
            @foreach($tickets as $ticket)
            <div class="ticket-item">
                <h3 style="margin-top: 0; margin-bottom: 10px; color: #0369a1;">{{ $ticket->event_name }}</h3>
                
                <div class="ticket-details">
                    @if($ticket->event_datetime)
                    <div class="ticket-detail">
                        <span class="ticket-label">Date & Time</span>
                        <span class="ticket-value">{{ $ticket->event_datetime ? date('F j, Y, g:i a', strtotime($ticket->event_datetime)) : 'N/A' }}</span>
                    </div>
                    @endif
                    
                    @if($ticket->event_location)
                    <div class="ticket-detail">
                        <span class="ticket-label">Location</span>
                        <span class="ticket-value">{{ $ticket->event_location ?? 'N/A' }}</span>
                    </div>
                    @endif
                    
                    @if($ticket->section)
                    <div class="ticket-detail">
                        <span class="ticket-label">Section</span>
                        <span class="ticket-value">{{ $ticket->section ?? 'N/A' }}</span>
                    </div>
                    @endif
                    
                    @if($ticket->row)
                    <div class="ticket-detail">
                        <span class="ticket-label">Row</span>
                        <span class="ticket-value">{{ $ticket->row ?? 'N/A' }}</span>
                    </div>
                    @endif
                    
                    @if($ticket->seat)
                    <div class="ticket-detail">
                        <span class="ticket-label">Seat</span>
                        <span class="ticket-value">{{ $ticket->seat ?? 'N/A' }}</span>
                    </div>
                    @endif
                </div>
            </div>
            @endforeach
            
            <div style="text-align: center; margin-top: 30px;">
                @if ($order->user_id)
                <a href="{{ route('orders.show', $order->order_id) }}" class="button">View Your Order</a>
                @endif
            </div>
            
            <div class="note">
                <strong>Important:</strong> Your tickets are available in your account. If you have any questions or need assistance, please contact our support team at <a href="mailto:cole@stubly.shop">cole@stubly.shop</a>.
            </div>
        </div>
        
        <div class="footer">
            <p>&copy; {{ date('Y') }} Stubly. All rights reserved.</p>
            <p>This is an automated message, please do not reply directly to this email.</p>
        </div>
    </div>
</body>
</html> 