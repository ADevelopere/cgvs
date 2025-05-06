<?php

namespace App\GraphQL\Types;

use App\Models\User;

class UserType
{
    /**
     * Resolve the isAdmin field for the User type
     */
    public function isAdmin(User $user): bool
    {
        return $user->getIsAdmin();
    }
}
