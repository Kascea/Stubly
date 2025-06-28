@extends('emails.layout')

@section('preview')
New Refund Request - Customer: {{ $data['email'] ?? 'customer@example.com' }}
@endsection

@section('simple-header')
<div style="background-color:rgb(239,246,255);padding:20px;border-radius:5px;margin-bottom:20px;border-left-width:4px;border-color:rgb(3,105,161)">
    <h1 style="font-size:24px;font-weight:700;color:rgb(31,41,55);margin-top:12px;margin-bottom:12px">
        New Refund Request
    </h1>
    <p style="color:rgb(55,65,81);margin:0px;font-size:14px;line-height:24px;margin-bottom:16px;margin-top:16px">
        A customer has submitted a refund request through the Stubly support page.
    </p>
</div>
@endsection

@section('content')
<table
    align="center"
    width="100%"
    border="0"
    cellpadding="0"
    cellspacing="0"
    role="presentation"
    style="margin-bottom:15px">
    <tbody>
        <tr>
            <td>
                <p style="font-weight:700;margin-bottom:5px;color:rgb(3,105,161);margin:0px;font-size:14px;line-height:24px;margin-top:16px">
                    Email Address:
                </p>
                <p style="background-color:rgb(243,244,246);padding:10px;border-radius:3px;margin:0px;font-size:14px;line-height:24px;margin-bottom:16px;margin-top:16px">
                    {{ $data['email'] ?? 'customer@example.com' }}
                </p>
            </td>
        </tr>
    </tbody>
</table>

@if(isset($data['order_id']) && !empty($data['order_id']))
<table
    align="center"
    width="100%"
    border="0"
    cellpadding="0"
    cellspacing="0"
    role="presentation"
    style="margin-bottom:15px">
    <tbody>
        <tr>
            <td>
                <p style="font-weight:700;margin-bottom:5px;color:rgb(3,105,161);margin:0px;font-size:14px;line-height:24px;margin-top:16px">
                    Order ID:
                </p>
                <p style="background-color:rgb(243,244,246);padding:10px;border-radius:3px;margin:0px;font-size:14px;line-height:24px;margin-bottom:16px;margin-top:16px">
                    {{ $data['order_id'] }}
                </p>
            </td>
        </tr>
    </tbody>
</table>
@endif

@if(isset($data['reason']) && !empty($data['reason']))
<table
    align="center"
    width="100%"
    border="0"
    cellpadding="0"
    cellspacing="0"
    role="presentation"
    style="margin-bottom:15px">
    <tbody>
        <tr>
            <td>
                <p style="font-weight:700;margin-bottom:5px;color:rgb(3,105,161);margin:0px;font-size:14px;line-height:24px;margin-top:16px">
                    Reason for Refund:
                </p>
                <p style="background-color:rgb(243,244,246);padding:10px;border-radius:3px;margin:0px;font-size:14px;line-height:24px;margin-bottom:16px;margin-top:16px">
                    {{ $data['reason'] }}
                </p>
            </td>
        </tr>
    </tbody>
</table>
@endif

@if(isset($data['details']) && !empty($data['details']))
<table
    align="center"
    width="100%"
    border="0"
    cellpadding="0"
    cellspacing="0"
    role="presentation"
    style="margin-bottom:15px">
    <tbody>
        <tr>
            <td>
                <p style="font-weight:700;margin-bottom:5px;color:rgb(3,105,161);margin:0px;font-size:14px;line-height:24px;margin-top:16px">
                    Additional Details:
                </p>
                <p style="background-color:rgb(243,244,246);padding:10px;border-radius:3px;margin:0px;font-size:14px;line-height:24px;margin-bottom:16px;margin-top:16px">
                    {{ $data['details'] }}
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
    style="margin-top:30px">
    <tbody>
        <tr>
            <td>
                <p style="color:rgb(55,65,81);font-size:14px;line-height:24px;margin-bottom:16px;margin-top:16px">
                    You can reply directly to this email to contact the customer.
                </p>
            </td>
        </tr>
    </tbody>
</table>
@endsection 