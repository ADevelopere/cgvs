<?php

namespace App\Auth;

use GraphQL\Error\Error;
use Illuminate\Auth\AuthenticationException;
use Nuwave\Lighthouse\Execution\ErrorHandler;
use Illuminate\Support\Facades\Log;

class AuthenticationErrorHandler implements ErrorHandler
{
    public function __invoke(Error|null $error, \Closure $next): ?array
    {
        if ($error === null) {
            return $next($error);
        }

        $previous = $error->getPrevious();

        if ($previous instanceof AuthenticationException) {
            // Log the authentication error if in debug mode
            if (config('app.debug')) {
                $request = request();
                $token = $request->bearerToken();

                Log::warning('GraphQL Authentication Error', [
                    'message' => $previous->getMessage(),
                    // keep it commented now
                    // 'trace' => $previous->getTraceAsString(),
                    'token' => $token ? 'present' : 'missing',
                    'token_length' => $token ? strlen($token) : 0,
                    'auth_header' => $request->header('Authorization'),
                ]);
            }

            return [
                'message' => 'Unauthenticated.',
                'extensions' => [
                    'category' => 'authentication',
                ]
            ];
        }

        return $next($error);
    }
}
