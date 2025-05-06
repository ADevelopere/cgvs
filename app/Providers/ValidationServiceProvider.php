<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\TemplateCategory\TemplateCategoryValidator;

class ValidationServiceProvider extends ServiceProvider
{
    public function boot()
    {
        TemplateCategoryValidator::register();
    }

    public function register()
    {
        //
    }
}
