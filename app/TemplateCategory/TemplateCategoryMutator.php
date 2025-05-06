<?php

namespace App\TemplateCategory;

class TemplateCategoryMutator
{
    public function create($root, array $args)
    {
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
