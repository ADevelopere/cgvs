<?php

namespace App\Auth;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\AuthenticationException;
use Laravel\Sanctum\PersonalAccessToken;
use App\GraphQL\Contracts\LighthouseMutation;

class AuthMutator  implements LighthouseMutation
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
        $user = Auth::guard('sanctum')->user();
        if (!$user) {
            throw new AuthenticationException('User not authenticated.');
        }

        try {
            // Get the bearer token from the request
            $bearerToken = request()->bearerToken();
            if ($bearerToken) {
                // Find and delete the current token
                [$id, $token] = explode('|', $bearerToken, 2);
                if ($id && $token) {
                    PersonalAccessToken::where('id', $id)
                        ->where('tokenable_id', $user->id)
                        ->delete();
                }
            }

            return [
                'message' => 'Logged out successfully'
            ];
        } catch (\Exception $e) {
            Log::error('Logout failed: ' . $e->getMessage());
            throw new \Exception('Failed to process logout. Please try again.');
        }
    }
}
