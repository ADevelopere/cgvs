<?php

namespace App\Http\Middleware;

use App\Models\Template;
use App\Exceptions\TabAccessDeniedException;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class TemplateTabPermissionMiddleware
{
    /**
     * Handle an incoming request to template management tabs.
     * Controls access to different tabs within template management interface.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     * @throws TabAccessDeniedException
     */
    public function handle(Request $request, Closure $next)
    {
        $tab = $request->query('tab', 'basic');
        $user = Auth::user();
        
        if (!$user) {
            abort(401, 'Unauthorized');
        }

        $route = $request->route();
        $template = $route ? $route->parameter('template') : null;
        
        if (!$template instanceof Template) {
            abort(404, 'Template not found');
        }

        $canAccess = $this->checkTabAccess($tab, $template);
        
        if (!$canAccess) {
            throw new TabAccessDeniedException($tab);
        }

        return $next($request);
    }

    /**
     * Check if the user can access the specified tab
     */
    private function checkTabAccess(string $tab, Template $template): bool
    {
        return match($tab) {
            'basic' => Gate::allows('view', $template),
            'variables', 'editor' => $this->canEditTemplate($template),
            'recipients' => $this->canManageRecipients($template),
            'preview' => $this->canPreview($template),
            default => false,
        };
    }

    /**
     * Check if user can edit template content (variables and editor tabs)
     */
    private function canEditTemplate(Template $template): bool
    {
        $user = Auth::user();
        return $user && ($template->user_id === $user->id || Gate::allows('admin'));
    }

    /**
     * Check if user can manage template recipients
     */
    private function canManageRecipients(Template $template): bool
    {
        $user = Auth::user();
        // Users with admin access or template owners can manage recipients if they have the permission
        return $user &&
            ($template->user_id === $user->id || Gate::allows('admin')) &&
            Gate::allows('manage-recipients');
    }

    /**
     * Check if user can preview template
     */
    private function canPreview(Template $template): bool
    {
        $user = Auth::user();
        return $user && (
            $template->user_id === $user->id ||
            Gate::allows('admin') ||
            Gate::allows('view', $template)
        );
    }
}
