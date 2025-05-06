<?php

namespace App\TemplateCategory;

class TemplateCategoryQuery
{
    public function mainCategory()
    {
        return TemplateCategory::where('special_type', 'MAIN')->firstOrFail();
    }

    public function deletedCategory()
    {
        return TemplateCategory::where('special_type', 'DELETED')->firstOrFail();
    }
}
