<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * Handle errors securely by logging detailed information but returning user-friendly messages
     */
    protected function handleSecureError(\Exception $e, string $context = 'Operation', array $extraData = [])
    {
        // Log detailed error information for debugging
        Log::error("{$context} failed", array_merge([
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ], $extraData));

        // Return generic user-friendly message
        return response()->json([
            'status' => 'error',
            'message' => 'We encountered an issue while processing your request. Please try again, and if the problem persists, contact support.'
        ], 500);
    }

    /**
     * Handle errors securely for redirect responses
     */
    protected function handleSecureErrorRedirect(\Exception $e, string $context = 'Operation', string $redirectRoute = 'home', array $extraData = [])
    {
        // Log detailed error information for debugging
        Log::error("{$context} failed", array_merge([
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ], $extraData));

        // Return redirect with generic user-friendly message
        return redirect()->route($redirectRoute)->with('error', 'We encountered an issue while processing your request. Please try again, and if the problem persists, contact support.');
    }

    /**
     * Handle validation exceptions by re-throwing them to preserve field-specific messages
     */
    protected function handleValidationError(ValidationException $e)
    {
        // Re-throw validation exceptions so they're handled by Laravel's default handler
        // This preserves the field-specific error messages for forms
        throw $e;
    }

    /**
     * Determine if an exception should be handled securely or re-thrown
     */
    protected function shouldHandleSecurely(\Exception $e): bool
    {
        // Don't handle validation exceptions securely - let Laravel handle them
        if ($e instanceof ValidationException) {
            return false;
        }

        // Handle all other exceptions securely
        return true;
    }
}
