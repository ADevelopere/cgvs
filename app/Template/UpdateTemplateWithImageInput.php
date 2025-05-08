<?php

namespace App\Template;

use Illuminate\Http\UploadedFile;

readonly class UpdateTemplateWithImageInput
{
    public function __construct(
        public ?string $name = null,
        public ?string $description = null,
        public ?string $categoryId = null,
        public ?int $order = null,
        public ?UploadedFile $image = null,
    ) {}
}