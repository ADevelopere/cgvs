<?php

declare(strict_types=1);

namespace App\Template;

/**
 * Value object representing template configuration
 */
 class TemplateConfig
{
    /**
     * @param int $maxBackgroundSize Maximum size of background image in KB
     * @param array<string> $allowedFileTypes Array of 
     * allowed file extensions
     */
    private function __construct(
        private readonly int $maxBackgroundSize,
        private readonly array $allowedFileTypes,
    ) {
    }

    /**
     * Create a new TemplateConfig instance
     *
     * @param int $maxBackgroundSize Maximum size of background image in KB
     * @param array<string> $allowedFileTypes Array of allowed file extensions
     * @return self
     */
    public static function create(int $maxBackgroundSize, array $allowedFileTypes): self 
    {
        return new self($maxBackgroundSize, $allowedFileTypes);
    }

    /**
     * Create a TemplateConfig instance from configuration
     *
     * @return self
     */
    public static function fromConfig(): self
    {
        return new self(
            (int) config('filesystems.upload_limits.template_background', 2048),
            config('filesystems.upload_limits.template_allowed_types', ['jpeg', 'png', 'jpg', 'gif'])
        );
    }

    /**
     * Get the maximum background size in KB
     *
     * @return int
     */
    public function getMaxBackgroundSize(): int
    {
        return $this->maxBackgroundSize;
    }

    /**
     * Get the allowed file types
     *
     * @return array<string>
     */
    public function getAllowedFileTypes(): array
    {
        return $this->allowedFileTypes;
    }

    /**
     * Convert to array
     *
     * @return array{maxBackgroundSize: int, allowedFileTypes: array<string>}
     */
    public function toArray(): array
    {
        return [
            'maxBackgroundSize' => $this->maxBackgroundSize,
            'allowedFileTypes' => $this->allowedFileTypes,
        ];
    }
}