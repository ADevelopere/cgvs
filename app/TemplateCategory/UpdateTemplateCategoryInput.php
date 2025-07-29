<?php

namespace App\TemplateCategory;

readonly class UpdateTemplateCategoryInput
{
    public function __construct(
        public ?string $name = null,
        public ?string $description = null,
        public ?string $parentCategoryId = null,
        public ?int    $order = null,
    ) {}
}
