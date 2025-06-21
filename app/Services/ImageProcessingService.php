<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Http\UploadedFile;

class ImageProcessingService
{
    /**
     * Process and store the main ticket image from uploaded file
     */
    public function storeTicketImage(UploadedFile $file, string $ticketId, string $disk = 'r2-perm'): bool
    {
        return $this->processImageFromFile(
            file: $file,
            path: $ticketId . '.webp',
            disk: $disk,
            quality: 85,
            logContext: ['ticket_id' => $ticketId, 'type' => 'main_ticket']
        );
    }

    /**
     * Process and store background image from uploaded file
     */
    public function storeBackgroundImage(UploadedFile $file, string $ticketId, string $disk = 'r2-temp'): bool
    {
        return $this->processImageFromFile(
            file: $file,
            path: $ticketId . '/background-image.webp',
            disk: $disk,
            quality: 50,
            maxDimensions: ['width' => 600, 'height' => 600],
            logContext: ['ticket_id' => $ticketId, 'type' => 'background']
        );
    }

    /**
     * Process and store team logo from uploaded file
     */
    public function storeTeamLogo(UploadedFile $file, string $ticketId, string $logoType, string $disk = 'r2-temp'): bool
    {
        return $this->processImageFromFile(
            file: $file,
            path: $ticketId . '/' . $logoType . '-team-logo.webp',
            disk: $disk,
            quality: 40,
            maxDimensions: ['width' => 50, 'height' => 50],
            logContext: ['ticket_id' => $ticketId, 'type' => $logoType . '_logo']
        );
    }

    /**
     * Process image from uploaded file
     */
    protected function processImageFromFile(
        UploadedFile $file,
        string $path,
        string $disk,
        int $quality = 85,
        ?array $maxDimensions = null,
        array $logContext = []
    ): bool {
        try {
            // Create image manager and read file
            $manager = new ImageManager(new Driver());
            $img = $manager->read($file->getRealPath());

            // Resize if needed
            if ($maxDimensions) {
                $this->resizeIfNeeded($img, $maxDimensions['width'], $maxDimensions['height']);
            }

            // Convert to WebP and store
            $webpData = $img->toWebp($quality)->toString();
            $success = Storage::disk($disk)->put($path, $webpData);

            // Basic cleanup of large objects
            unset($img, $webpData);

            return $success;

        } catch (\Exception $e) {
            Log::error('Image processing failed', array_merge($logContext, [
                'message' => $e->getMessage(),
                'path' => $path,
                'disk' => $disk,
            ]));
            return false;
        }
    }

    /**
     * Resize image if it exceeds maximum dimensions
     */
    protected function resizeIfNeeded($img, int $maxWidth, int $maxHeight): void
    {
        if ($img->width() > $maxWidth || $img->height() > $maxHeight) {
            $img->scaleDown(width: $maxWidth, height: $maxHeight);
        }
    }
}