<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Facades\Cache;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'featured_image',
        'category_id',
        'author_id',
        'meta_title',
        'meta_description',
        'status',
        'published_at',
        'read_time',
        'views_count',
        'likes_count',
        'comments_count',
        'is_featured',
        'is_trending',
        'allow_comments',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_featured' => 'boolean',
        'is_trending' => 'boolean',
        'allow_comments' => 'boolean',
        'read_time' => 'integer',
        'views_count' => 'integer',
        'likes_count' => 'integer',
        'comments_count' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    public function likes(): MorphMany
    {
        return $this->morphMany(Like::class, 'likeable');
    }

    public function saves(): HasMany
    {
        return $this->hasMany(Save::class);
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published')
                    ->where('published_at', '<=', now());
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeTrending($query)
    {
        return $query->where('is_trending', true);
    }

    public function scopeByCategory($query, $categorySlug)
    {
        return $query->whereHas('category', function ($q) use ($categorySlug) {
            $q->where('slug', $categorySlug);
        });
    }

    // Performans için sadece gerekli alanları seç
    public function scopeSelectForList($query)
    {
        return $query->select([
            'id', 'title', 'slug', 'excerpt', 'featured_image',
            'category_id', 'author_id', 'published_at', 'read_time',
            'views_count', 'likes_count', 'comments_count',
            'is_featured', 'is_trending', 'created_at'
        ]);
    }

    // Cache ile birlikte kullan
    public function scopeCached($query, $key, $ttl = 3600)
    {
        return Cache::remember($key, $ttl, function () use ($query) {
            return $query->get();
        });
    }

    public function incrementViews()
    {
        $this->increment('views_count');
    }

    // Cache temizleme
    public static function clearCache()
    {
        Cache::forget('posts.featured');
        Cache::forget('posts.trending');
        Cache::forget('posts.latest');
        Cache::forget('categories.with_posts_count');
    }
}
