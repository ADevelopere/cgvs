<?php

namespace App\Auth;

use App\GraphQL\Contracts\LighthouseQuery;

class AuthQuery implements LighthouseQuery
{
    public function me($root, array $args, $context)
    {
        return $context->user();
    }
}
