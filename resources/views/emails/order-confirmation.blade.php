<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <body
    style='background-color:rgb(243,244,246);font-family:ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";padding-top:40px;padding-bottom:40px'>
    <div
      style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">
      Order Confirmation - Thank you for your purchase! Order #{{ $order->order_id }}
      <div>
         ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏
      </div>
    </div>
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="max-width:600px;margin-left:auto;margin-right:auto">
      <tbody>
        <tr style="width:100%">
          <td>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="background-color:rgb(255,255,255);border-radius:8px;box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 1px 2px 0 rgb(0,0,0,0.05);overflow:hidden">
              <tbody>
                <tr>
                  <td>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="padding:32px;text-align:center;border-bottom-width:1px;border-color:rgb(229,231,235)">
                      <tbody>
                        <tr>
                          <td>
                            <img
                              alt="Stubly"
                              height="40"
                              src="{{ config('app.url') }}/images/stubly-logo.png"
                              style="width:120px;height:auto;margin-left:auto;margin-right:auto;margin-bottom:16px;object-fit:cover;display:block;outline:none;border:none;text-decoration:none"
                              width="120" />
                            <h1
                              style="font-size:24px;font-weight:700;color:rgb(7,89,133);margin:0px">
                              Order Confirmation
                            </h1>
                            <p
                              style="font-size:16px;color:rgb(75,85,99);margin-top:8px;line-height:24px;margin-bottom:16px">
                              Thank you for your purchase!
                            </p>
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
                      style="padding:32px">
                      <tbody>
                        <tr>
                          <td>
                            <p
                              style="font-size:16px;color:rgb(75,85,99);margin-bottom:24px;line-height:24px;margin-top:16px">
                              Hello
                              {{ $order->customer_name ?? 'Customer' }},
                            </p>
                            <p
                              style="font-size:16px;color:rgb(75,85,99);margin-bottom:24px;line-height:24px;margin-top:16px">
                              Your order has been successfully processed.
                              Here&#x27;s a summary of your purchase:
                            </p>
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
                                    <p
                                      style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                                      Order Number:
                                      <strong>#{{ $order->order_id }}</strong>
                                    </p>
                                    <p
                                      style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                                      Order Date:
                                      {{ $order->created_at->format('F j, Y, g:i a') }}
                                    </p>
                                    <p
                                      style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                                      Number of Tickets:
                                      {{ $tickets->count() }}
                                    </p>
                                    <hr
                                      style="border-color:rgb(229,231,235);margin-top:12px;margin-bottom:12px;width:100%;border:none;border-top:1px solid #eaeaea" />
                                    <p
                                      style="font-size:14px;color:rgb(75,85,99);font-weight:700;margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                                      Total: ${{ number_format($order->total_amount, 2) }}
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <h1
                              style="font-size:16px;font-weight:700;color:rgb(7,89,133);margin-bottom:16px">
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
                                    <h1
                                      style="font-size:16px;font-weight:700;color:rgb(7,89,133);margin:0px">
                                      {{ $ticket->event_name }}
                                    </h1>
                                    
                                    @if($ticket->event_datetime)
                                    <p
                                      style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                                      Date &amp; Time:
                                      {{ date('F j, Y, g:i a', strtotime($ticket->event_datetime)) }}
                                    </p>
                                    @endif
                                    
                                    @if($ticket->event_location)
                                    <p
                                      style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                                      Location:
                                      {{ $ticket->event_location }}
                                    </p>
                                    @endif
                                    
                                    @if($ticket->section)
                                    <p
                                      style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                                      Section:
                                      {{ $ticket->section }}
                                    </p>
                                    @endif
                                    
                                    @if($ticket->row)
                                    <p
                                      style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                                      Row:
                                      {{ $ticket->row }}
                                    </p>
                                    @endif
                                    
                                    @if($ticket->seat)
                                    <p
                                      style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                                      Seat:
                                      {{ $ticket->seat }}
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
                                      target="_blank"
                                      ><span
                                        ><!--[if mso]><i style="mso-font-width:400%;mso-text-raise:18" hidden>&#8202;&#8202;&#8202;</i><![endif]--></span
                                      ><span
                                        style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px"
                                        >View Your Order</span
                                      ><span
                                        ><!--[if mso]><i style="mso-font-width:400%" hidden>&#8202;&#8202;&#8202;&#8203;</i><![endif]--></span
                                      ></a
                                    >
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
                                    <p
                                      style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                                      <strong>Important:</strong> Your tickets
                                      are available in your account. If you have
                                      any questions or need assistance, please
                                      contact our support team at
                                      <a
                                        href="mailto:cole@stubly.shop"
                                        style="color:rgb(245,158,11)"
                                        >cole@stubly.shop</a
                                      >.
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
                                    <p
                                      style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                                      <strong>Important:</strong> If you have
                                      any questions or need assistance, please
                                      contact our support team at
                                      <a
                                        href="mailto:cole@stubly.shop"
                                        style="color:rgb(245,158,11)"
                                        >cole@stubly.shop</a
                                      >.
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
                                    <p
                                      style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                                      <strong>Your Tickets PDF:</strong>
                                      We&#x27;ve attached a PDF document to this
                                      email containing all your tickets. You can
                                      print them at home or present them on your
                                      mobile device for entry.
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
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
                      style="background-color:rgb(249,250,251);padding:24px;text-align:center;border-top-width:1px;border-color:rgb(229,231,235)">
                      <tbody>
                        <tr>
                          <td>
                            <p
                              style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                              ©
                              {{ date('Y') }}
                              Stubly. All rights reserved.
                            </p>
                            <p
                              style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                              This is an automated message, please do not reply
                              directly to this email.
                            </p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html> 