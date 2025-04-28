<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => env('ADMIN_NAME', 'Super Admin'),
            'email' => env('ADMIN_EMAIL', 'super.admin@cgvs.com'),
            'password' => Hash::make(env('ADMIN_PASSWORD', 'cgvs@123')),
        ]);
    }
}
