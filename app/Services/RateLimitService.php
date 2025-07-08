<?php

namespace App\Services;

use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Cache\RateLimiting\Limit;

/**
 * Rate Limiting Service
 * 
 * Manages all rate limiting configuration for the application.
 * 
 * Usage:
 * - Call RateLimitService::configure() in AppServiceProvider::boot()
 * - Apply middleware in routes: ->middleware('throttle:limiter_name')
 * 
 * Available Rate Limiters:
 * - 'global': 120/min - General browsing protection
 * - 'uploads': 10/min - File upload operations (ticket creation/duplication)
 * - 'emails': 5/min - Email operations (support, notifications)
 * - 'payments': 20/min - Payment and checkout operations
 * - 'cart': 30/min - Shopping cart operations
 * 
 * To add a new rate limiter:
 * 1. Create a new protected static method (e.g., configureNewFeatureLimiting)
 * 2. Add it to the configure() method
 * 3. Apply in routes using ->middleware('throttle:new_feature')
 */
class RateLimitService
{
    /**
     * Configure all rate limiters for the application.
     */
    public static function configure(): void
    {
        static::configureGlobalLimiting();
        static::configureUploadLimiting();
        static::configureEmailLimiting();
        static::configurePaymentLimiting();
        static::configureCartLimiting();
    }

    /**
     * Global rate limiting - reasonable for general browsing
     */
    protected static function configureGlobalLimiting(): void
    {
        RateLimiter::for('global', function (Request $request) {
            return Limit::perMinute(120)->by(static::getRateLimitKey($request))
                ->response(function (Request $request, array $headers) {
                    Log::warning('Global rate limit exceeded', [
                        'ip' => $request->ip(),
                        'user_id' => $request->user()?->id,
                        'path' => $request->path(),
                        'user_agent' => $request->header('User-Agent')
                    ]);
                    return response()->json([
                        'error' => 'Too many requests. Please slow down.'
                    ], 429, $headers);
                });
        });
    }

    /**
     * File upload operations (ticket creation, duplication) - more restrictive
     */
    protected static function configureUploadLimiting(): void
    {
        RateLimiter::for('uploads', function (Request $request) {
            return Limit::perMinute(10)->by(static::getRateLimitKey($request))
                ->response(function (Request $request, array $headers) {
                    Log::warning('Upload rate limit exceeded', [
                        'ip' => $request->ip(),
                        'user_id' => $request->user()?->id,
                        'path' => $request->path(),
                    ]);
                    return response()->json([
                        'error' => 'Too many upload attempts. Please wait before trying again.'
                    ], 429, $headers);
                });
        });
    }

    /**
     * Email operations (support, refunds) - very restrictive to prevent abuse
     */
    protected static function configureEmailLimiting(): void
    {
        RateLimiter::for('emails', function (Request $request) {
            return Limit::perMinute(5)->by(static::getRateLimitKey($request))
                ->response(function (Request $request, array $headers) {
                    Log::warning('Email rate limit exceeded', [
                        'ip' => $request->ip(),
                        'user_id' => $request->user()?->id,
                        'path' => $request->path(),
                    ]);
                    return response()->json([
                        'error' => 'Too many email requests. Please wait before sending another message.'
                    ], 429, $headers);
                });
        });
    }

    /**
     * Payment operations - moderate restriction for checkout flows
     */
    protected static function configurePaymentLimiting(): void
    {
        RateLimiter::for('payments', function (Request $request) {
            return Limit::perMinute(20)->by(static::getRateLimitKey($request))
                ->response(function (Request $request, array $headers) {
                    Log::warning('Payment rate limit exceeded', [
                        'ip' => $request->ip(),
                        'user_id' => $request->user()?->id,
                        'path' => $request->path(),
                    ]);
                    return response()->json([
                        'error' => 'Too many payment attempts. Please wait before trying again.'
                    ], 429, $headers);
                });
        });
    }

    /**
     * Cart operations - moderate limit to prevent cart spam
     */
    protected static function configureCartLimiting(): void
    {
        RateLimiter::for('cart', function (Request $request) {
            return Limit::perMinute(30)->by(static::getRateLimitKey($request))
                ->response(function (Request $request, array $headers) {
                    Log::info('Cart rate limit exceeded', [
                        'ip' => $request->ip(),
                        'user_id' => $request->user()?->id,
                    ]);
                    return response()->json([
                        'error' => 'Too many cart operations. Please wait before trying again.'
                    ], 429, $headers);
                });
        });
    }

    /**
     * Get the rate limiting key for the request.
     * Uses user ID for authenticated users, IP + session for guests.
     */
    protected static function getRateLimitKey(Request $request): string
    {
        return $request->user()
            ? 'user:' . $request->user()->id
            : 'ip:' . $request->ip() . ':session:' . $request->session()->getId();
    }

    /**
     * Get rate limit configuration for specific operations.
     * Useful for testing or dynamic adjustment.
     */
    public static function getLimits(): array
    {
        return [
            'global' => 120,
            'uploads' => 10,
            'emails' => 5,
            'payments' => 20,
            'cart' => 30,
        ];
    }
}