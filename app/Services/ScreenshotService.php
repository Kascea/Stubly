<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ScreenshotService
{
    private string $workerUrl;
    private string $sharedSecret;
    private int $defaultExpirationMinutes;
    private bool $testMode;

    public function __construct()
    {
        $this->workerUrl = config('services.cloudflare.screenshot_worker_url');
        $this->sharedSecret = config('services.cloudflare.screenshot_shared_secret');
        $this->defaultExpirationMinutes = config('services.cloudflare.screenshot_expiration_minutes', 30);
    }

    /**
     * Generate a signed URL for the Cloudflare Worker screenshot service
     */
    public function generateSignedScreenshotUrl(string $ticketUrl, ?int $expirationMinutes = null): string
    {
        $expirationMinutes = $expirationMinutes ?? $this->defaultExpirationMinutes;
        $expirationTimestamp = now()->addMinutes($expirationMinutes)->timestamp;

        // Create the payload that will be signed
        $payload = [
            'url' => $ticketUrl,
            'expires' => $expirationTimestamp,
        ];

        // Generate HMAC signature
        $signature = hash_hmac('sha256', json_encode($payload), $this->sharedSecret);

        // Build the query parameters
        $queryParams = http_build_query([
            'url' => $ticketUrl,
            'expires' => $expirationTimestamp,
            'signature' => $signature,
        ]);

        return $this->workerUrl . '?' . $queryParams;
    }

    /**
     * Request a screenshot from the Cloudflare Worker and store it
     */
    public function captureAndStoreTicketScreenshot(string $ticketId, string $ticketUrl): bool
    {
        try {
            // Validate configuration first
            if (empty($this->workerUrl) || empty($this->sharedSecret)) {
                Log::error('Screenshot service not configured properly', [
                    'ticket_id' => $ticketId,
                    'worker_url_set' => !empty($this->workerUrl),
                    'shared_secret_set' => !empty($this->sharedSecret),
                ]);
                return false;
            }

            // Generate signed URL
            $signedUrl = $this->generateSignedScreenshotUrl($ticketUrl);

            Log::info('Requesting screenshot from Cloudflare Worker', [
                'ticket_id' => $ticketId,
                'ticket_url' => $ticketUrl,
                'worker_url' => $this->workerUrl,
            ]);

            // Make request to Cloudflare Worker
            $response = Http::timeout(60) // 60 second timeout for screenshot generation
                ->get($signedUrl);

            if (!$response->successful()) {
                Log::error('Screenshot service request failed', [
                    'ticket_id' => $ticketId,
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'headers' => $response->headers(),
                ]);
                return false;
            }

            // Validate that we received image data
            $imageData = $response->body();
            if (empty($imageData)) {
                Log::error('Screenshot service returned empty response', [
                    'ticket_id' => $ticketId,
                    'response_size' => strlen($imageData),
                ]);
                return false;
            }

            // Store the screenshot in R2 permanent storage
            $filePath = $ticketId . '.webp';
            $stored = Storage::disk('r2-perm')->put($filePath, $imageData);

            if (!$stored) {
                Log::error('Failed to store screenshot in R2', [
                    'ticket_id' => $ticketId,
                    'file_path' => $filePath,
                    'image_size' => strlen($imageData),
                ]);
                return false;
            }

            Log::info('Screenshot successfully captured and stored', [
                'ticket_id' => $ticketId,
                'file_path' => $filePath,
                'file_size' => strlen($imageData),
            ]);

            return true;

        } catch (\Exception $e) {
            Log::error('Exception during screenshot capture', [
                'ticket_id' => $ticketId,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'worker_url' => $this->workerUrl ?? 'not set',
            ]);
            return false;
        }
    }

    /**
     * Verify a signature for incoming webhook requests (if needed)
     */
    public function verifySignature(string $payload, string $signature): bool
    {
        $expectedSignature = hash_hmac('sha256', $payload, $this->sharedSecret);
        return hash_equals($expectedSignature, $signature);
    }

    /**
     * Get the public ticket URL for a given ticket ID
     */
    public function getTicketUrl(string $ticketId): string
    {
        return route('tickets.render', ['ticket' => $ticketId]);
    }

    /**
     * Get the ticket URL for duplication with override parameters
     */
    public function getDuplicationTicketUrl(
        string $originalTicketId,
        string $newTicketId,
        ?string $section = null,
        ?string $row = null,
        ?string $seat = null
    ): string {
        $queryParams = array_filter([
            'asset_ticket_id' => $newTicketId,
            'section' => $section,
            'row' => $row,
            'seat' => $seat,
        ]);

        $baseUrl = route('tickets.render', ['ticket' => $originalTicketId]);

        return empty($queryParams) ? $baseUrl : $baseUrl . '?' . http_build_query($queryParams);
    }
}