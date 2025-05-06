<?php

namespace App\TemplateCategory;

use App\GraphQL\Contracts\LighthouseMutation;
use App\Models\TemplateCategory;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class TemplateCategoryMutator implements LighthouseMutation
{
    /**
     * @throws ValidationException
     */
    public function create($root, array $args) : ?TemplateCategory
    {
        Log::info('TemplateCategoryMutator: Creating template category', $args);
        $input = new CreateTemplateCategoryInput(
            name: $args['name'],
            description: $args['description'] ?? null,
            parentCategoryId: $args['parentCategoryId'] ?? null,
            order: $args['order'] ?? null
        );

        return TemplateCategoryService::createTemplateCategory($input);
    }

    /**
     * @throws ValidationException
     */
    public function update($root, array $args): ?TemplateCategory
    {
        $category = TemplateCategory::query()->findOrFail($args['id']);
        $input = new UpdateTemplateCategoryInput(
            name: $args['name'],
            description: $args['description'] ?? null,
            parentCategoryId: $args['parentCategoryId'] ?? null,
            order: $args['order'] ?? null
        );

        return TemplateCategoryService::updateTemplateCategory($category, $input);
    }

    /**
     * @throws ValidationException
     */
    public function delete($root, array $args): bool
    {
        $category = TemplateCategory::query()->findOrFail($args['id']);
        return TemplateCategoryService::deleteTemplateCategory($category);
    }

    /**
     * @throws ValidationException
     */
    public function reorder($root, array $args): bool
    {
        return TemplateCategoryService::reorderCategories($args['input']);
    }
}
