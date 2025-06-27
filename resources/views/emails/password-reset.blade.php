@extends('emails.layout')

@section('preview')
Reset Your Password - Stubly Account
@endsection

@section('header')
<h1 style="font-size:24px;font-weight:700;color:rgb(7,89,133);margin:0px">
    Reset Your Password
</h1>
<p style="font-size:16px;color:rgb(75,85,99);margin-top:8px;line-height:24px;margin-bottom:16px">
    We received a request to reset your password
</p>
@endsection

@section('content')
<p style="font-size:16px;color:rgb(75,85,99);margin-bottom:24px;line-height:24px;margin-top:16px">
    Hello,
</p>
<p style="font-size:16px;color:rgb(75,85,99);margin-bottom:24px;line-height:24px;margin-top:16px">
    You are receiving this email because we received a password reset request for your account.
</p>

<!-- Reset Button -->
<table
    align="center"
    width="100%"
    border="0"
    cellpadding="0"
    cellspacing="0"
    role="presentation"
    style="text-align:center;margin-top:32px;margin-bottom:32px">
    <tbody>
        <tr>
            <td>
                <a
                    href="{{ $actionUrl }}"
                    style="background-color:rgb(7,89,133);color:rgb(255,255,255);font-weight:700;padding-top:12px;padding-bottom:12px;padding-left:24px;padding-right:24px;border-radius:4px;text-decoration-line:none;text-align:center;box-sizing:border-box;line-height:100%;text-decoration:none;display:inline-block;max-width:100%;mso-padding-alt:0px;padding:12px 24px 12px 24px"
                    target="_blank">
                    <span><!--[if mso]><i style="mso-font-width:400%;mso-text-raise:18" hidden>&#8202;&#8202;&#8202;</i><![endif]--></span>
                    <span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px">Reset Password</span>
                    <span><!--[if mso]><i style="mso-font-width:400%" hidden>&#8202;&#8202;&#8202;&#8203;</i><![endif]--></span>
                </a>
            </td>
        </tr>
    </tbody>
</table>

<p style="font-size:16px;color:rgb(75,85,99);margin-bottom:24px;line-height:24px;margin-top:16px">
    This password reset link will expire in {{ $count }} {{ Str::plural('minute', $count) }}.
</p>

<p style="font-size:16px;color:rgb(75,85,99);margin-bottom:24px;line-height:24px;margin-top:16px">
    If you did not request a password reset, no further action is required.
</p>

<!-- Troubleshooting Section -->
<table
    align="center"
    width="100%"
    border="0"
    cellpadding="0"
    cellspacing="0"
    role="presentation"
    style="background-color:rgb(240,249,255);border-left-width:4px;border-color:rgb(7,89,133);padding:16px;margin-top:32px">
    <tbody>
        <tr>
            <td>
                <p style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
                    <strong>Having trouble clicking the button?</strong> Copy and paste the URL below into your web browser:
                </p>
                <p style="font-size:12px;color:rgb(75,85,99);margin:0px;line-height:20px;word-break:break-all;margin-top:8px">
                    {{ $actionUrl }}
                </p>
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