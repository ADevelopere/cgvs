<?php

namespace App\Policies;

use App\Models\Template;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class TemplatePolicy
{
    use HandlesAuthorization;

    /**
     * Perform pre-authorization checks.
     */
    public function before(User $user, string $ability): ?bool
    {
        // Admins have all permissions
        if ($user->isAdmin()) {
            return true;
        }
        
        return null;
    }

    /**
     * Determine whether the user can view the template.
     */
    public function view(User $user, Template $template): bool
    {
        return $user->id === $template->user_id;
    }

    /**
     * Determine whether the user can update the template.
     */
    public function update(User $user, Template $template): bool
    {
        return $user->id === $template->user_id;
    }
}
