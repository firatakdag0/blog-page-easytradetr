<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\Category;
use App\Models\Tag;
use App\Models\Author;
use Illuminate\Support\Str;
use App\Models\User;

class BlogJsonImportSeeder extends Seeder
{
    public function run()
    {
        $json = file_get_contents(database_path('seeders/blog_icerikleri_50.json'));
        $posts = json_decode($json, true);

        foreach ($posts as $item) {
            try {
                // Kategori
                $category = Category::firstOrCreate(
                    ['name' => $item['category']],
                    ['slug' => Str::slug($item['category'])]
                );

                // User (author)
                $user = User::firstOrCreate(
                    ['name' => $item['author']],
                    [
                        'email' => Str::slug($item['author']) . '@example.com',
                        'password' => bcrypt('password'),
                        'role' => 'user', // 'author' yerine 'user'
                    ]
                );

                // Post
                $post = Post::create([
                    'title' => $item['title'],
                    'slug' => Str::slug($item['title']),
                    'excerpt' => $item['excerpt'],
                    'content' => $item['content'],
                    'category_id' => $category->id,
                    'author_id' => $user->id,
                    'published_at' => $item['published_at'],
                    'read_time' => $item['read_time'],
                    'featured_image' => null,
                    'status' => 'published',
                ]);

                // Etiketler
                $tagIds = [];
                foreach ($item['tags'] as $tagName) {
                    $tag = Tag::firstOrCreate(
                        ['name' => $tagName],
                        ['slug' => Str::slug($tagName)]
                    );
                    $tagIds[] = $tag->id;
                }
                $post->tags()->sync($tagIds);

                echo "[OK] {$item['title']}\n";
            } catch (\Exception $e) {
                echo "[ERR] {$item['title']} - " . $e->getMessage() . "\n";
            }
        }
    }
}
