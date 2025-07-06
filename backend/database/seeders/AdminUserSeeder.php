<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin kullanıcısı oluştur
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@easytrade.com',
            'password' => Hash::make('Admin123!@#'),
            'role' => 'admin',
            'avatar' => '/placeholder-user.jpg',
            'bio' => 'Sistem yöneticisi',
            'email_verified_at' => now(),
        ]);

        // Test admin kullanıcısı
        User::create([
            'name' => 'Test Admin',
            'email' => 'test@easytrade.com',
            'password' => Hash::make('Test123!@#'),
            'role' => 'admin',
            'avatar' => '/placeholder-user.jpg',
            'bio' => 'Test yöneticisi',
            'email_verified_at' => now(),
        ]);

        // Normal kullanıcı (admin olmayan)
        User::create([
            'name' => 'Normal User',
            'email' => 'user@easytrade.com',
            'password' => Hash::make('User123!@#'),
            'role' => 'user',
            'avatar' => '/placeholder-user.jpg',
            'bio' => 'Normal kullanıcı',
            'email_verified_at' => now(),
        ]);
    }
}
