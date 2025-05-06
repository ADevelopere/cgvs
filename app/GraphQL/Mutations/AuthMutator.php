<?php

namespace App\GraphQL\Mutations;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\AuthenticationException;

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
        $user = $context->user();
        if (!$user) {
            throw new AuthenticationException('Unauthenticated.');
        }

        // Get the current access token
        $token = $user->currentAccessToken();
        if (!$token) {
            throw new AuthenticationException('No active session found.');
        }

        $token->delete();

        return [
            'message' => 'Logged out successfully'
        ];
    }
}
