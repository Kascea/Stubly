<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Http\UploadedFile;

class ImageProcessingService
{
    // Maximum file size in bytes (10MB)
    protected const MAX_FILE_SIZE = 10 * 1024 * 1024;

    // Maximum dimensions for initial resize to prevent memory issues
    protected const MAX_INITIAL_WIDTH = 2048;
    protected const MAX_INITIAL_HEIGHT = 2048;

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
            // Early validation
            if (!$this->validateFile($file, $logContext)) {
                return false;
            }

            // Increase memory limit temporarily if needed
            $originalMemoryLimit = ini_get('memory_limit');
            $this->increaseMemoryLimitIfNeeded();

            // Force garbage collection before processing
            gc_collect_cycles();

            // Create image manager and read file
            $manager = new ImageManager(new Driver());
            $img = $manager->read($file->getRealPath());

            // Apply initial resize if image is too large
            $this->applyInitialResize($img);

            // Resize to target dimensions if specified
            if ($maxDimensions) {
                $this->resizeIfNeeded($img, $maxDimensions['width'], $maxDimensions['height']);
            }

            // Convert to WebP and get data
            $webpData = $img->toWebp($quality)->toString();

            // Immediately clear the image from memory
            unset($img);
            gc_collect_cycles();

            // Store the file
            $success = Storage::disk($disk)->put($path, $webpData);

            // Clear WebP data
            unset($webpData);
            gc_collect_cycles();

            // Restore original memory limit
            ini_set('memory_limit', $originalMemoryLimit);

            return $success;

        } catch (\Exception $e) {
            // Ensure memory limit is restored on error
            if (isset($originalMemoryLimit)) {
                ini_set('memory_limit', $originalMemoryLimit);
            }

            return false;
        }
    }

    /**
     * Validate file before processing
     */
    protected function validateFile(UploadedFile $file, array $logContext = []): bool
    {
        // Check file size
        if ($file->getSize() > self::MAX_FILE_SIZE) {
            Log::warning('File too large for processing', array_merge($logContext, [
                'file_size' => $file->getSize(),
                'max_size' => self::MAX_FILE_SIZE
            ]));
            return false;
        }

        // Check if it's an image
        if (!str_starts_with($file->getMimeType(), 'image/')) {
            Log::warning('Invalid file type', array_merge($logContext, [
                'mime_type' => $file->getMimeType()
            ]));
            return false;
        }

        return true;
    }

    /**
     * Increase memory limit if current limit is too low
     */
    protected function increaseMemoryLimitIfNeeded(): void
    {
        $currentLimit = $this->parseMemoryLimit(ini_get('memory_limit'));
        $recommendedLimit = 256 * 1024 * 1024; // 256MB

        if ($currentLimit < $recommendedLimit) {
            ini_set('memory_limit', '256M');
        }
    }

    /**
     * Parse memory limit string to bytes
     */
    protected function parseMemoryLimit(string $limit): int
    {
        $limit = trim($limit);
        $last = strtolower($limit[strlen($limit) - 1]);
        $value = (int) $limit;

        switch ($last) {
            case 'g':
                $value *= 1024;
            case 'm':
                $value *= 1024;
            case 'k':
                $value *= 1024;
        }

        return $value;
    }

    /**
     * Apply initial resize if image is too large to prevent memory issues
     */
    protected function applyInitialResize($img): void
    {
        if ($img->width() > self::MAX_INITIAL_WIDTH || $img->height() > self::MAX_INITIAL_HEIGHT) {
            $img->scaleDown(width: self::MAX_INITIAL_WIDTH, height: self::MAX_INITIAL_HEIGHT);
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