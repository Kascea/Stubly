@extends('emails.layout')

@section('preview')
Verify your email address to get started with Stubly
@endsection

@section('header')
<h1 style="font-size:28px;line-height:36px;font-weight:700;color:rgb(15,23,42);margin:0px;margin-bottom:16px">
    Verify Your Email Address
</h1>
<p style="font-size:16px;line-height:24px;color:rgb(51,65,85);margin:0px">
    Welcome to Stubly! We're excited to have you on board.
</p>
@endsection

@section('content')
<div style="text-align:left">
    <p style="font-size:16px;line-height:24px;color:rgb(51,65,85);margin:0px;margin-bottom:24px">
        Hi {{ $user->name }},
    </p>
    
    <p style="font-size:16px;line-height:24px;color:rgb(51,65,85);margin:0px;margin-bottom:24px">
        Thanks for signing up for Stubly! Before you can start creating and sharing your custom tickets, we need to verify your email address.
    </p>
    
    <p style="font-size:16px;line-height:24px;color:rgb(51,65,85);margin:0px;margin-bottom:32px">
        Please click the button below to verify your email address:
    </p>
    
    <!-- Verification Button -->
    <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:32px">
        <tbody>
            <tr>
                <td align="center">
                    <a href="{{ $verificationUrl }}" 
                       style="background-color:rgb(14,116,144);border-radius:6px;color:rgb(255,255,255);display:inline-block;font-size:16px;font-weight:600;line-height:24px;padding:12px 24px;text-decoration:none;text-align:center"
                       target="_blank">
                        Verify Email Address
                    </a>
                </td>
            </tr>
        </tbody>
    </table>
    
    <p style="font-size:14px;line-height:20px;color:rgb(107,114,128);margin:0px;margin-bottom:16px">
        If you're having trouble clicking the button, copy and paste the URL below into your web browser:
    </p>
    
    <p style="font-size:14px;line-height:20px;color:rgb(107,114,128);margin:0px;margin-bottom:24px;word-break:break-all">
        {{ $verificationUrl }}
    </p>
    
    <hr style="border:none;border-top:1px solid rgb(229,231,235);margin:24px 0">
    
    <p style="font-size:14px;line-height:20px;color:rgb(107,114,128);margin:0px;margin-bottom:8px">
        This verification link will expire in {{ config('auth.verification.expire', 60) }} minutes.
    </p>
    
    <p style="font-size:14px;line-height:20px;color:rgb(107,114,128);margin:0px">
        If you didn't create an account with Stubly, you can safely ignore this email.
    </p>
</div>
@endsection

@section('footer-message')
<p style="font-size:14px;color:rgb(75,85,99);margin:0px;line-height:24px;margin-bottom:16px;margin-top:16px">
    Need help? Contact us at <a href="mailto:support@stubly.com" style="color:rgb(14,116,144);text-decoration:underline">support@stubly.com</a>
</p>
@endsection
