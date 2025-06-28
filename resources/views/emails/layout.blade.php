<!DOCTYPE html>
<html dir="ltr" lang="en">
<head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
</head>
<body style='background-color:rgb(243,244,246);font-family:ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";padding-top:40px;padding-bottom:40px'>
    <!-- Preview text -->
    <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">
        @yield('preview')
        <div>
           ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏ ‌​‍‎‏ ‌​‍‎‏ ‌​‍‎‏ ‌​‍‎‏ ‌​‍‎‏ ‌​‍‎‏ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏﻿ ‌​‍‎‏ ‌​‍‎‏ ‌​‍‎‏﻿
        </div>
    </div>

    <!-- Main email container -->
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
                    <!-- Email content card -->
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
                                    <!-- Header -->
                                    @hasSection('header')
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
                                                        src="{{ config('app.url') }}/images/android-chrome-192x192.png"
                                                        style="width:120px;height:auto;margin-left:auto;margin-right:auto;margin-bottom:16px;object-fit:cover;display:block;outline:none;border:none;text-decoration:none"
                                                        width="120" />
                                                    @yield('header')
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
                                        style="padding:20px;border-radius:5px;margin-bottom:20px;">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    @yield('simple-header')
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    @endif

                                    <!-- Main content -->
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
                                                    @yield('content')
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <!-- Footer -->
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
                                                    <p style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                                                        © {{ date('Y') }} Stubly. All rights reserved.
                                                    </p>
                                                    @hasSection('footer-message')
                                                        @yield('footer-message')
                                                    @else
                                                        <p style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                                                            123 Ticket Street, Minneapolis, MN 55401
                                                        </p>
                                                        <p style="margin:0px;margin-top:8px;font-size:14px;line-height:24px;margin-bottom:16px">
                                                            <a href="#" style="color:rgb(107,114,128);text-decoration-line:underline" target="_blank">Unsubscribe</a>
                                                        </p>
                                                    @endif
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