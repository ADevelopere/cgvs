<?php

namespace App\Template;

use Illuminate\Http\UploadedFile;

readonly class CreateTemplateInput
{
    public function __construct(
        public string $name,
        public ?string $description,
        public string $categoryId,
        public ?int $order = null,
        public ?UploadedFile $backgroundImage = null,
    ) {
    }
}
