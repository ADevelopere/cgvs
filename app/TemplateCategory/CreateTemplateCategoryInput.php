<?php

namespace App\TemplateCategory;

readonly class CreateTemplateCategoryInput
{
    public function __construct(
        public string  $name,
        public ?string $description = null,
        public ?string $parentCategoryId = null,
        public ?int    $order = null,
    ) {}
}
