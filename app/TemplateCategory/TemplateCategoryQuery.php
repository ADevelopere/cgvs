<?php

namespace App\TemplateCategory;

use App\GraphQL\Contracts\LighthouseQuery;

class TemplateCategoryQuery implements LighthouseQuery
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
