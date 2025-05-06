<?php

namespace App\TemplateCategory;

class UpdateTemplateCategoryInput
{
    public function __construct(
        public readonly ?string $name = null,
        public readonly ?string $description = null,
        public readonly ?string $parentCategoryId = null,
        public readonly ?int $order = null,
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
