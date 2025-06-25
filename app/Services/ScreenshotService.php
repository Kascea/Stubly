<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ScreenshotService
{
    private string $accountId;
    private string $apiToken;
    private string $apiBaseUrl;

    public function __construct()
    {
        $this->accountId = config('services.cloudflare.account_id');
        $this->apiToken = config('services.cloudflare.api_token');
        $this->apiBaseUrl = "https://api.cloudflare.com/client/v4/accounts/{$this->accountId}/browser-rendering";
    }

    /**
     * Request a screenshot from the Cloudflare Browser Rendering API and store it
     */
    public function captureAndStoreTicketScreenshot(string $ticketId, string $ticketUrl): bool
    {
        try {
            // Validate configuration first
            if (empty($this->accountId) || empty($this->apiToken)) {
                Log::error('Screenshot service not configured properly', [
                    'ticket_id' => $ticketId,
                    'account_id_set' => !empty($this->accountId),
                    'api_token_set' => !empty($this->apiToken),
                ]);
                return false;
            }

            // Prepare the API request payload
            $payload = [
                'url' => $ticketUrl,
                'screenshotOptions' => [
                    'type' => 'webp', // Use WebP format
                    'quality' => 85, // High quality for WebP
                ],
                'gotoOptions' => [
                    'waitUntil' => 'domcontentloaded', // Wait until DOM is loaded (faster than networkidle0)
                    'timeout' => 10000, // 10 second timeout for navigation
                ],
                'actionTimeout' => 10000, // 10 second timeout for actions
                'waitForTimeout' => 2000, // Wait 2 seconds after page load to ensure rendering
            ];

            // Make request to Cloudflare Browser Rendering API
            $response = Http::timeout(10) // 10 second timeout for screenshot generation
                ->withToken($this->apiToken)
                ->post($this->apiBaseUrl . '/screenshot', $payload);

            if (!$response->successful()) {
                Log::error('Screenshot service request failed', [
                    'ticket_id' => $ticketId,
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'headers' => $response->headers(),
                ]);
                return false;
            }

            // Parse the JSON response
            $responseData = $response->json();
            if (!isset($responseData['success']) || !$responseData['success']) {
                Log::error('Screenshot service returned unsuccessful response', [
                    'ticket_id' => $ticketId,
                    'response' => $responseData,
                ]);
                return false;
            }

            if (!isset($responseData['result']['screenshot'])) {
                Log::error('Screenshot service response missing screenshot data', [
                    'ticket_id' => $ticketId,
                    'response_keys' => array_keys($responseData['result'] ?? []),
                ]);
                return false;
            }

            // Decode the base64 screenshot data
            $base64Screenshot = $responseData['result']['screenshot'];
            $imageData = base64_decode($base64Screenshot);

            if ($imageData === false || empty($imageData)) {
                Log::error('Failed to decode base64 screenshot data', [
                    'ticket_id' => $ticketId,
                    'base64_length' => strlen($base64Screenshot),
                ]);
                return false;
            }

            // Store the screenshot in R2 permanent storage as WebP
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

            return true;

        } catch (\Exception $e) {
            Log::error('Exception during screenshot capture', [
                'ticket_id' => $ticketId,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'account_id' => $this->accountId ?? 'not set',
            ]);
            return false;
        }
    }

    /**
     * Get the ticket URL for duplication with override parameters
     */
    public function getDuplicationTicketUrl(
        string $originalTicketId,
        ?string $section = null,
        ?string $row = null,
        ?string $seat = null
    ): string {
        $queryParams = array_filter([
            'section' => $section,
            'row' => $row,
            'seat' => $seat,
        ]);

        $baseUrl = "https://stubly-main-blnwuu.laravel.cloud/tickets/{$originalTicketId}/render";

        return empty($queryParams) ? $baseUrl : $baseUrl . '?' . http_build_query($queryParams);
    }
}