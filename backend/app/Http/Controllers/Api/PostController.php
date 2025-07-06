<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\Category;
use App\Models\Tag;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class PostController extends Controller
{
    /**
     * Display a listing of posts for admin panel.
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $query = Post::selectForList()
            ->with(['category:id,name,slug,color', 'author:id,name,email,avatar,bio', 'tags:id,name,slug,color']);

        // Kategori filtresi
        if ($request->has('category') && $request->category !== 'Tümü') {
            $query->byCategory($request->category);
        }

        // Durum filtresi
        if ($request->has('status') && $request->status !== 'Tümü') {
            $query->where('status', $request->status);
        }

        // Arama filtresi
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        // Sıralama
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        // Sıralama alanlarını kontrol et
        $allowedSortFields = [
            'created_at', 'updated_at', 'published_at', 'title',
            'views_count', 'likes_count', 'comments_count'
        ];

        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        // Sayfalama
        $perPage = $request->get('per_page', 10);
        $page = $request->get('page', 1);

        $posts = $query->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'data' => $posts->items(),
            'pagination' => [
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'per_page' => $posts->perPage(),
                'total' => $posts->total(),
                'from' => $posts->firstItem(),
                'to' => $posts->lastItem(),
            ]
        ]);
    }

    /**
     * Display a listing of posts.
     */
    public function index(Request $request): JsonResponse
    {
        // Cache'i geçici olarak devre dışı bırak
        // $cacheKey = 'posts.index.' . md5(serialize($request->all()));
        // return Cache::remember($cacheKey, 1800, function () use ($request) {

        $query = Post::selectForList()
            ->with(['category:id,name,slug,color', 'author:id,name,email,avatar,bio', 'tags:id,name,slug,color'])
            ->published()
            ->orderBy('published_at', 'desc');

        // Kategori filtresi
        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        // Arama filtresi
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }

        // Öne çıkan yazılar
        if ($request->has('featured') && $request->featured) {
            $query->featured();
        }

        // Trend yazılar
        if ($request->has('trending') && $request->trending) {
            $query->trending();
        }

        $posts = $query->paginate($request->get('per_page', 12));

        return response()->json([
            'success' => true,
            'data' => $posts
        ]);
        // });
    }

    /**
     * Store a newly created post.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'required|string|max:500',
            'content' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'featured_image' => 'nullable|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'status' => 'required|in:draft,published,scheduled',
            'published_at' => 'nullable|date',
            'read_time' => 'integer|min:1',
            'is_featured' => 'boolean',
            'is_trending' => 'boolean',
            'allow_comments' => 'boolean',
            'tags' => 'array',
            'tags.*' => 'string',
        ]);

        DB::beginTransaction();

        try {
            $post = Post::create([
                'title' => $request->title,
                'slug' => Str::slug($request->title),
                'excerpt' => $request->excerpt,
                'content' => $request->content,
                'category_id' => $request->category_id,
                'author_id' => 1, // Admin user ID - şimdilik sabit
                'featured_image' => $request->featured_image,
                'meta_title' => $request->meta_title,
                'meta_description' => $request->meta_description,
                'status' => $request->status,
                'published_at' => $request->published_at,
                'read_time' => $request->read_time ?? 5,
                'is_featured' => $request->is_featured ?? false,
                'is_trending' => $request->is_trending ?? false,
                'allow_comments' => $request->allow_comments ?? true,
            ]);

            // Etiketleri ekle
            if ($request->has('tags') && is_array($request->tags)) {
                $tagIds = [];
                foreach ($request->tags as $tagName) {
                    $tag = Tag::firstOrCreate(
                        ['name' => $tagName],
                        [
                            'slug' => Str::slug($tagName),
                            'color' => '#64748b',
                            'is_active' => true,
                        ]
                    );
                    $tagIds[] = $tag->id;
                }
                $post->tags()->attach($tagIds);
            }

            DB::commit();

            // Cache temizle
            Post::clearCache();

            $post->load(['category:id,name,slug,color', 'author:id,name,avatar', 'tags:id,name,slug,color']);

            return response()->json([
                'success' => true,
                'message' => 'Yazı başarıyla oluşturuldu.',
                'data' => $post
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Yazı oluşturulurken bir hata oluştu.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified post.
     */
    public function show(Post $post): JsonResponse
    {
        // Görüntülenme sayısını artır
        $post->incrementViews();

        $post->load([
            'category',
            'author',
            'tags',
            'comments' => function ($query) {
                $query->approved()->topLevel()->with(['replies', 'user']);
            }
        ]);

        return response()->json([
            'success' => true,
            'data' => $post
        ]);
    }

    /**
     * Display the specified post by slug.
     */
    public function showBySlug(string $slug): JsonResponse
    {
        $post = Post::with(['category', 'author', 'tags'])
            ->where('status', 'published')
            ->where('slug', $slug)
            ->first();

        if (!$post) {
            return response()->json([
                'success' => false,
                'message' => 'Blog yazısı bulunamadı.'
            ], 404);
        }

        // Görüntülenme sayısını artır
        $post->incrementViews();

        return response()->json([
            'success' => true,
            'data' => $post
        ]);
    }

    /**
     * Update the specified post.
     */
    public function update(Request $request, Post $post): JsonResponse
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'excerpt' => 'sometimes|required|string|max:500',
            'content' => 'sometimes|required|string',
            'category_id' => 'sometimes|required|exists:categories,id',
            'featured_image' => 'nullable|string',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'status' => 'sometimes|required|in:draft,published,scheduled',
            'published_at' => 'nullable|date',
            'read_time' => 'integer|min:1',
            'is_featured' => 'boolean',
            'is_trending' => 'boolean',
            'allow_comments' => 'boolean',
            'tags' => 'array',
            'tags.*' => 'string',
        ]);

        DB::beginTransaction();

        try {
            $updateData = [];

            if ($request->has('title')) {
                $updateData['title'] = $request->title;
                $updateData['slug'] = Str::slug($request->title);
            }
            if ($request->has('excerpt')) $updateData['excerpt'] = $request->excerpt;
            if ($request->has('content')) $updateData['content'] = $request->content;
            if ($request->has('category_id')) $updateData['category_id'] = $request->category_id;
            if ($request->has('featured_image')) $updateData['featured_image'] = $request->featured_image;
            if ($request->has('meta_title')) $updateData['meta_title'] = $request->meta_title;
            if ($request->has('meta_description')) $updateData['meta_description'] = $request->meta_description;
            if ($request->has('status')) $updateData['status'] = $request->status;
            if ($request->has('published_at')) $updateData['published_at'] = $request->published_at;
            if ($request->has('read_time')) $updateData['read_time'] = $request->read_time;
            if ($request->has('is_featured')) $updateData['is_featured'] = $request->is_featured;
            if ($request->has('is_trending')) $updateData['is_trending'] = $request->is_trending;
            if ($request->has('allow_comments')) $updateData['allow_comments'] = $request->allow_comments;

            $post->update($updateData);

            // Etiketleri güncelle
            if ($request->has('tags') && is_array($request->tags)) {
                $tagIds = [];
                foreach ($request->tags as $tagName) {
                    $tag = Tag::firstOrCreate(
                        ['name' => $tagName],
                        [
                            'slug' => Str::slug($tagName),
                            'color' => '#64748b',
                            'is_active' => true,
                        ]
                    );
                    $tagIds[] = $tag->id;
                }
                $post->tags()->sync($tagIds);
            }

            DB::commit();

            $post->load(['category', 'author', 'tags']);

            return response()->json([
                'success' => true,
                'message' => 'Yazı başarıyla güncellendi.',
                'data' => $post
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Yazı güncellenirken bir hata oluştu.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified post.
     */
    public function destroy(Post $post): JsonResponse
    {
        $post->delete();

        return response()->json([
            'success' => true,
            'message' => 'Yazı başarıyla silindi.'
        ]);
    }
}
