<?php

namespace App\Providers;

use App\Models\Template;
use App\Policies\TemplatePolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Template::class => TemplatePolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Define admin gate
        Gate::define('admin', function ($user) {
            return $user->isAdmin();
        });

        // Define manage-recipients gate
        Gate::define('manage-recipients', function ($user) {
            // For now, anyone who can access the application can manage recipients
            // You can add more specific logic here later
            return true;
        });

        // Template-related gates
        Gate::define('viewTemplates', function ($user) {
            return true;
        });

        Gate::define('viewTemplate', function ($user, Template $template) {
            return true;
        });

        Gate::define('createTemplate', function ($user) {
            return $user->isAdmin();
        });

        Gate::define('updateTemplate', function ($user, Template $template) {
            return $user->isAdmin();
        });

        Gate::define('deleteTemplate', function ($user, Template $template) {
            return $user->isAdmin();
        });
    }
}
