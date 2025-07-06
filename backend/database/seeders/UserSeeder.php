<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin kullanıcısı
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@easytrade.com',
            'password' => Hash::make('password'),
            'avatar' => '/placeholder-user.jpg',
            'bio' => 'EasyTrade sistem yöneticisi ve teknoloji uzmanı.',
        ]);

        // Test kullanıcısı
        User::create([
            'name' => 'Test User',
            'email' => 'test@easytrade.com',
            'password' => Hash::make('password'),
            'avatar' => '/placeholder-user.jpg',
            'bio' => 'Test kullanıcısı',
        ]);
    }
}
