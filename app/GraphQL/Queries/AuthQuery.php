<?php

namespace App\GraphQL\Queries;

class AuthQuery
{
    public function me($root, array $args, $context)
    {
        return $context->user();
    }
}
