# Authentication System Migration

## GraphQL Schema Changes

Create `graphql/types/User.graphql`:
```graphql
type User {
  id: ID!
  email: String!
  name: String
  isAdmin: Boolean!
  created_at: DateTime!
  updated_at: DateTime!
}

type AuthPayload {
  token: String!
  user: User!
}

type LogoutResponse {
  message: String!
}
```

Create `graphql/mutations/auth.graphql`:
```graphql
extend type Mutation {
  login(
    email: String! @rules(apply: ["required", "email", "exists:users,email"])
    password: String! @rules(apply: ["required", "min:6"])
  ): AuthPayload! @field(resolver: "AuthMutator@login")

  logout: LogoutResponse! 
    @guard 
    @field(resolver: "AuthMutator@logout")
}
```

Create `graphql/queries/auth.graphql`:
```graphql
extend type Query {
  me: User! 
    @guard 
    @auth
    @field(resolver: "AuthQuery@me")
}
```

## Resolver Implementation

Create `app/GraphQL/Mutations/AuthMutator.php`:
```php
<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthMutator
{
    public function login($root, array $args)
    {
        $user = User::where('email', $args['email'])->first();

        if (!$user || !Hash::check($args['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return [
            'token' => $token,
            'user' => $user,
        ];
    }

    public function logout($root, array $args, $context)
    {
        $context->user()->currentAccessToken()->delete();

        return [
            'message' => 'Logged out successfully'
        ];
    }
}
```

Create `app/GraphQL/Queries/AuthQuery.php`:
```php
<?php

namespace App\GraphQL\Queries;

class AuthQuery
{
    public function me($root, array $args, $context)
    {
        return $context->user();
    }
}
```

## Error Handling

Create `app/GraphQL/Errors/AuthenticationErrorHandler.php`:
```php
<?php

namespace App\GraphQL\Errors;

use GraphQL\Error\Error;
use Nuwave\Lighthouse\Execution\ErrorHandler;

class AuthenticationErrorHandler implements ErrorHandler
{
    public function handle(Error $error, \Closure $next)
    {
        if ($error->getPrevious() instanceof ValidationException) {
            return null;
        }

        return $next($error);
    }
}
```

## Testing (dont implement this)

Create feature tests in `tests/Feature/GraphQL/AuthTest.php`.
