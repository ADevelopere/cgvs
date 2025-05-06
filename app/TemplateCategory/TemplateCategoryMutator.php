<?php

namespace App\TemplateCategory;

use App\GraphQL\Contracts\LighthouseMutation;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class TemplateCategoryMutator implements LighthouseMutation
{
    public function create($root, array $args)
    {
        Log::info('TemplateCategoryMutator: Creating template category', $args);
        $validator = Validator::make($args['input'], [
            'name' => 'required|string|min:3|max:255',
            'description' => 'nullable|string',
            'parentCategoryId' => 'nullable|exists:template_categories,id',
            'order' => 'nullable|integer|min:0'
        ]);

        if ($validator->fails()) {
            throw new \Exception($validator->errors()->first());
        }
        return TemplateCategoryService::createTemplateCategory($args);
    }

    public function update($root, array $args)
    {
        $category = TemplateCategory::findOrFail($args['id']);
        return TemplateCategoryService::updateTemplateCategory($category, $args['input']);
    }

    public function delete($root, array $args)
    {
        $category = TemplateCategory::findOrFail($args['id']);
        return TemplateCategoryService::deleteTemplateCategory($category);
    }

    public function reorder($root, array $args)
    {
        return TemplateCategoryService::reorderCategories($args['input']);
    }
}
