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

    public static function rules(): array
    {
        return [
            'name' => ['nullable', 'string', 'min:3', 'max:255'],
            'description' => ['nullable', 'string'],
            'parentCategoryId' => [
                'nullable',
                'exists:template_categories,id',
                'not_deletion_category',
                'prevent_self_parent',
                'prevent_circular_reference'
            ],
            'order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
