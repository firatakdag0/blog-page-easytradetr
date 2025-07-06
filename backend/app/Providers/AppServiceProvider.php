<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Cache;
use App\Models\Post;
use App\Models\Category;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Post modeli güncellendiğinde cache temizle
        Post::updated(function ($post) {
            Post::clearCache();
        });

        Post::created(function ($post) {
            Post::clearCache();
        });

        Post::deleted(function ($post) {
            Post::clearCache();
        });

        // Category modeli güncellendiğinde cache temizle
        Category::updated(function ($category) {
            Cache::forget('categories.with_posts_count');
            Cache::forget("category.{$category->id}.with_posts");
        });

        Category::created(function ($category) {
            Cache::forget('categories.with_posts_count');
        });

        Category::deleted(function ($category) {
            Cache::forget('categories.with_posts_count');
            Cache::forget("category.{$category->id}.with_posts");
        });
    }
}
