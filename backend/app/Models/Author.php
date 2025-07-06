<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Author extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'username',
        'bio',
        'profile_image',
        'website',
        'twitter',
        'linkedin',
        'instagram',
        'facebook',
        'youtube',
        'title',
        'expertise',
        'birth_date',
        'location',
        'is_active',
        'is_featured',
        'posts_count',
        'views_count',
        'likes_count',
    ];

    // İlişki: Bir yazarın birden fazla postu olabilir
    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }
}
