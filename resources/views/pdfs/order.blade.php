<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <body style='background-color:rgb(243,244,246);font-family:ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";padding:20px'>
    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background-color:rgb(255,255,255);border-radius:8px;padding:20px;margin:0 auto;max-width:37.5em">
      <tbody>
        <tr>
          <td>
            <h1 style="font-size:20px;font-weight:700;margin:0 0 5px 0">Your Custom Ticket is Ready</h1>
            <p style="font-size:14px;color:rgb(75,85,99);margin:0 0 15px 0">Order #{{ $order->order_id }}</p>
            
            <div style="font-size:12px;color:rgb(55,65,81);margin-bottom:15px">
              <strong>Printing Instructions:</strong> Use standard letter paper (8.5" x 11"), print in high quality at "Actual size", and cut along dashed lines. Final ticket size: 3" x 7".
            </div>

            @foreach($tickets as $index => $ticket)
            <div style="margin:0 auto;width:7in;margin-bottom:30px;">
              <div style="border:2px dashed rgb(156,163,175);background-color:rgb(249,250,251);height:3in;width:100%;position:relative;overflow:hidden">
                @if(isset($ticketImages[$index]))
                <img 
                  src="{{ $ticketImages[$index] }}" 
                  alt="Custom Ticket" 
                  style="
                    width: 3in;
                    height: 7in;
                    object-fit: contain;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(90deg);
                    transform-origin: center;
                  "
                >
                @else
                <p style="color:rgb(107,114,128)">Ticket image not available</p>
                @endif
              </div>
              
              @if(count($tickets) > 1)
              <div style="text-align:center;margin-top:5px;font-size:12px;color:#666;">
                Ticket {{ $index + 1 }} of {{ count($tickets) }}
              </div>
              @endif
            </div>
            @endforeach

            <p style="font-size:12px;color:rgb(55,65,81);margin-top:15px;text-align:center">
              Questions? Contact <a href="mailto:cole@stubly.shop" style="color:rgb(37,99,235)">cole@stubly.shop</a>
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
