<?php

namespace App\Template;

use App\GraphQL\Contracts\LighthouseQuery;
use Illuminate\Support\Facades\Log;

class TemplateQuery implements LighthouseQuery
{
    /**
     * Get template configuration
     *
     * @return TemplateConfig
     */
    public function config(): array
    {
        $allowedTypes = config('filesystems.upload_limits.template_allowed_types');
        Log::info('Template allowed types:', ['types' => $allowedTypes]);

        $config = TemplateConfig::fromConfig();
        Log::info('Template config:', $config->toArray());

        return $config->toArray();
    }
}
