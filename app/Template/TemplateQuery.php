<?php

namespace App\Template;

use App\GraphQL\Contracts\LighthouseQuery;

class TemplateQuery implements LighthouseQuery
{
    /**
     * Get template configuration
     *
     * @return TemplateConfig
     */
    public function config(): TemplateConfig
    {
        return TemplateConfig::fromConfig();
    }
}
