# Password Reset System Migration

## GraphQL Schema Changes

Create `graphql/types/PasswordReset.graphql`:
```graphql
type PasswordResetResponse {
  message: String!
  success: Boolean!
}

type PasswordResetResult {
  message: String!
  success: Boolean!
}
```

Create `graphql/mutations/password-reset.graphql`:
```graphql
extend type Mutation {
  requestPasswordReset(
    email: String! @rules(apply: ["required", "email"])
  ): PasswordResetResponse! @field(resolver: "PasswordResetMutator@request")

  resetPassword(
    email: String! @rules(apply: ["required", "email"])
    token: String! @rules(apply: ["required"])
    password: String! @rules(apply: ["required", "min:8", "confirmed"])
  ): PasswordResetResult! @field(resolver: "PasswordResetMutator@reset")
}
```

## Resolver Implementation

Create `app/GraphQL/Mutations/PasswordResetMutator.php`:
```php
<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class PasswordResetMutator
{
    public function request($root, array $args)
    {
        $status = Password::sendResetLink(['email' => $args['email']]);

        return [
            'message' => __($status),
            'success' => $status === Password::RESET_LINK_SENT,
        ];
    }

    public function reset($root, array $args)
    {
        $status = Password::reset(
            [
                'email' => $args['email'],
                'token' => $args['token'],
                'password' => $args['password'],
                'password_confirmation' => $args['password_confirmation'],
            ],
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => bcrypt($password)
                ])->setRememberToken(Str::random(60));

                $user->save();
            }
        );

        return [
            'message' => __($status),
            'success' => $status === Password::PASSWORD_RESET,
        ];
    }
}
```

## Testing

Create feature tests in `tests/Feature/GraphQL/PasswordResetTest.php`.
