<?php

namespace App\GraphQL\Errors;

use GraphQL\Error\Error;
use Nuwave\Lighthouse\Execution\ErrorHandler;
use Illuminate\Validation\ValidationException;

class AuthenticationErrorHandler implements ErrorHandler
{
    public function __invoke(?Error $error, \Closure $next): ?array
    {
        if ($error->getPrevious() instanceof ValidationException) {
            return null;
        }

        return $next($error);
    }
}
