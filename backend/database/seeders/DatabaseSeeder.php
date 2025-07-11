<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Database\Seeders\BlogJsonImportSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AdminUserSeeder::class,
            UserSeeder::class,
            CategorySeeder::class,
            TagSeeder::class,
            AuthorSeeder::class,
            PostSeeder::class,
            CommentSeeder::class,
            MediaSeeder::class,
            BlogJsonImportSeeder::class,
        ]);
    }
}
