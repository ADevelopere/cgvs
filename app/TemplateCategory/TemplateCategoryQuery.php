<?php

namespace App\TemplateCategory;

use App\GraphQL\Contracts\LighthouseQuery;
use App\Models\TemplateCategory;

class TemplateCategoryQuery implements LighthouseQuery
{
    public function mainCategory(): TemplateCategory | null
    {
        return TemplateCategory::where('special_type', 'MAIN')->firstOrFail();
    }

    public function deletedCategory() : TemplateCategory | null
    {
        return TemplateCategory::where('special_type', 'DELETED')->firstOrFail();
    }

    public function flatCategories(): array
    {
        return TemplateCategoryService::getFlatCategories();
    }
}
