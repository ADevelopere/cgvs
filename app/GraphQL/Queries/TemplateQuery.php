<?php

namespace App\GraphQL\Queries;

class TemplateQuery
{
    public function config()
    {
        return [
            'maxBackgroundSize' => config('templates.max_background_size', 5 * 1024 * 1024), // 5MB
            'allowedFileTypes' => ['image/jpeg', 'image/png', 'image/gif'],
        ];
    }
}
