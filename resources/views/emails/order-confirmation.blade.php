@extends('emails.layout')

@section('preview')
Order Confirmation - Thank you for your purchase! Order #{{ $order->order_id }}
@endsection

@section('header')
<h1 style="font-size:24px;font-weight:700;color:rgb(7,89,133);margin:0px">
    Order Confirmation
</h1>
<p style="font-size:16px;color:rgb(75,85,99);margin-top:8px;line-height:24px;margin-bottom:16px">
    Thank you for your purchase!
</p>
@endsection

@section('content')
<p style="font-size:16px;color:rgb(75,85,99);margin-bottom:24px;line-height:24px;margin-top:16px">
    Hello {{ $order->customer_name ?? 'Customer' }},
</p>
<p style="font-size:16px;color:rgb(75,85,99);margin-bottom:24px;line-height:24px;margin-top:16px">
    Your order has been successfully processed. Here's a summary of your purchase:
</p>

<!-- Order Summary -->
<table
    align="center"
    width="100%"
    border="0"
    cellpadding="0"
    cellspacing="0"
    role="presentation"
    style="background-color:rgb(249,250,251);border-width:1px;border-color:rgb(229,231,235);border-radius:8px;padding:20px;margin-bottom:32px">
    <tbody>
        <tr>
            <td>
                <p style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                    Order Number: <strong>#{{ $order->order_id }}</strong>
                </p>
                <p style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                    Order Date: {{ $order->created_at->format('F j, Y, g:i a') }}
                </p>
                <p style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                    Number of Tickets: {{ $tickets->count() }}
                </p>
                <hr style="border-color:rgb(229,231,235);margin-top:12px;margin-bottom:12px;width:100%;border:none;border-top:1px solid #eaeaea" />
                <p style="font-size:14px;color:rgb(75,85,99);font-weight:700;margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                    Total: ${{ number_format($order->total_amount, 2) }}
                </p>
            </td>
        </tr>
    </tbody>
</table>

<h1 style="font-size:16px;font-weight:700;color:rgb(7,89,133);margin-bottom:16px">
    Ticket Details
</h1>

@foreach($tickets as $ticket)
<table
    align="center"
    width="100%"
    border="0"
    cellpadding="0"
    cellspacing="0"
    role="presentation"
    style="background-color:rgb(249,250,251);border-width:1px;border-color:rgb(229,231,235);border-radius:8px;padding:20px;margin-bottom:20px">
    <tbody>
        <tr>
            <td>
                <h1 style="font-size:16px;font-weight:700;color:rgb(7,89,133);margin:0px">
                    {{ $ticket->event_name }}
                </h1>
                
                @if($ticket->event_datetime)
                <p style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                    Date & Time: {{ date('F j, Y, g:i a', strtotime($ticket->event_datetime)) }}
                </p>
                @endif
                
                @if($ticket->event_location)
                <p style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                    Location: {{ $ticket->event_location }}
                </p>
                @endif
                
                @if($ticket->section)
                <p style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                    Section: {{ $ticket->section }}
                </p>
                @endif
                
                @if($ticket->row)
                <p style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                    Row: {{ $ticket->row }}
                </p>
                @endif
                
                @if($ticket->seat)
                <p style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                    Seat: {{ $ticket->seat }}
                </p>
                @endif
            </td>
        </tr>
    </tbody>
</table>
@endforeach

@if(isset($hasAccount) && $hasAccount && $order->user_id)
<table
    align="center"
    width="100%"
    border="0"
    cellpadding="0"
    cellspacing="0"
    role="presentation"
    style="text-align:center;margin-top:32px">
    <tbody>
        <tr>
            <td>
                <a
                    href="{{ route('orders.show', $order->order_id) }}"
                    style="background-color:rgb(7,89,133);color:rgb(255,255,255);font-weight:700;padding-top:12px;padding-bottom:12px;padding-left:24px;padding-right:24px;border-radius:4px;text-decoration-line:none;text-align:center;box-sizing:border-box;line-height:100%;text-decoration:none;display:inline-block;max-width:100%;mso-padding-alt:0px;padding:12px 24px 12px 24px"
                    target="_blank">
                    <span><!--[if mso]><i style="mso-font-width:400%;mso-text-raise:18" hidden>&#8202;&#8202;&#8202;</i><![endif]--></span>
                    <span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px">View Your Order</span>
                    <span><!--[if mso]><i style="mso-font-width:400%" hidden>&#8202;&#8202;&#8202;&#8203;</i><![endif]--></span>
                </a>
            </td>
        </tr>
    </tbody>
</table>

<table
    align="center"
    width="100%"
    border="0"
    cellpadding="0"
    cellspacing="0"
    role="presentation"
    style="background-color:rgb(255,251,235);border-left-width:4px;border-color:rgb(245,158,11);padding:16px;margin-top:32px">
    <tbody>
        <tr>
            <td>
                <p style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                    <strong>Important:</strong> Your tickets are available in your account. If you have any questions or need assistance, please contact our support team at
                    <a href="mailto:cole@stubly.shop" style="color:rgb(245,158,11)">cole@stubly.shop</a>.
                </p>
            </td>
        </tr>
    </tbody>
</table>
@else
<table
    align="center"
    width="100%"
    border="0"
    cellpadding="0"
    cellspacing="0"
    role="presentation"
    style="background-color:rgb(255,251,235);border-left-width:4px;border-color:rgb(245,158,11);padding:16px;margin-top:32px">
    <tbody>
        <tr>
            <td>
                <p style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                    <strong>Important:</strong> If you have any questions or need assistance, please contact our support team at
                    <a href="mailto:cole@stubly.shop" style="color:rgb(245,158,11)">cole@stubly.shop</a>.
                </p>
            </td>
        </tr>
    </tbody>
</table>
@endif

<table
    align="center"
    width="100%"
    border="0"
    cellpadding="0"
    cellspacing="0"
    role="presentation"
    style="background-color:rgb(240,249,255);border-left-width:4px;border-color:rgb(7,89,133);padding:16px;margin-top:16px">
    <tbody>
        <tr>
            <td>
                <p style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                    <strong>Your Tickets PDF:</strong> We've attached a PDF document to this email containing all your tickets. You can use this to print them at home.
            </td>
        </tr>
    </tbody>
</table>
@endsection

@section('footer-message')
<p style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
    This is an automated message, please do not reply directly to this email.
</p>
@endsection 