<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Refund Request</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            line-height: 1.5;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #f0f7ff;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
            border-left: 4px solid #0369a1;
        }
        .field {
            margin-bottom: 15px;
        }
        .label {
            font-weight: bold;
            margin-bottom: 5px;
            color: #0369a1;
        }
        .value {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 3px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>New Refund Request</h1>
        <p>A customer has submitted a refund request through the Stubly support page.</p>
    </div>

    <div class="field">
        <div class="label">Email Address:</div>
        <div class="value">{{ $data['email'] }}</div>
    </div>

    @if(isset($data['order_id']) && !empty($data['order_id']))
    <div class="field">
        <div class="label">Order ID:</div>
        <div class="value">{{ $data['order_id'] }}</div>
    </div>
    @endif

    @if(isset($data['reason']) && !empty($data['reason']))
    <div class="field">
        <div class="label">Reason for Refund:</div>
        <div class="value">{{ $data['reason'] }}</div>
    </div>
    @endif

    @if(isset($data['details']) && !empty($data['details']))
    <div class="field">
        <div class="label">Additional Details:</div>
        <div class="value">{{ $data['details'] }}</div>
    </div>
    @endif

    @if(isset($data['order_id']) && !empty($data['order_id']))
    <p>
        <a href="{{ config('app.url') }}/orders/{{ $data['order_id'] }}" style="display: inline-block; background-color: #0369a1; color: white; padding: 10px 15px; text-decoration: none; border-radius: 3px;">
            View Order
        </a>
    </p>
    @endif

    <p>You can reply directly to this email to contact the customer.</p>
</body>
</html> 