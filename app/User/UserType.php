<?php

namespace App\User;

use App\GraphQL\Contracts\LighthouseType;
use App\Models\User;

class UserType implements LighthouseType
{
    /**
     * Resolve the isAdmin field for the User type
     */
    public function isAdmin(User $user): bool
    {
        return $user->getIsAdmin();
    }
}
