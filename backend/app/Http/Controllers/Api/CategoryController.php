<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories.
     */
    public function index(): JsonResponse
    {
        return Cache::remember('categories.with_posts_count', 3600, function () {
            $categories = Category::active()
                ->ordered()
                ->withCount('posts')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $categories
            ]);
        });
    }

    /**
     * Store a newly created category.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:7',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $category = Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'color' => $request->color ?? '#64748b',
            'is_active' => $request->is_active ?? true,
            'sort_order' => $request->sort_order ?? 0,
        ]);

        // Cache temizle
        Cache::forget('categories.with_posts_count');

        return response()->json([
            'success' => true,
            'message' => 'Kategori başarıyla oluşturuldu.',
            'data' => $category
        ], 201);
    }

    /**
     * Display the specified category.
     */
    public function show(Category $category): JsonResponse
    {
        $cacheKey = "category.{$category->id}.with_posts";

        return Cache::remember($cacheKey, 1800, function () use ($category) {
            $category->load(['posts' => function ($query) {
                $query->published()
                    ->selectForList()
                    ->with(['author:id,name,avatar', 'tags:id,name,slug,color']);
            }]);

            return response()->json([
                'success' => true,
                'data' => $category
            ]);
        });
    }

    /**
     * Update the specified category.
     */
    public function update(Request $request, Category $category): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'color' => 'nullable|string|max:7',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ]);

        $category->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'color' => $request->color ?? '#64748b',
            'is_active' => $request->is_active ?? true,
            'sort_order' => $request->sort_order ?? 0,
        ]);

        // Cache temizle
        Cache::forget('categories.with_posts_count');
        Cache::forget("category.{$category->id}.with_posts");

        return response()->json([
            'success' => true,
            'message' => 'Kategori başarıyla güncellendi.',
            'data' => $category
        ]);
    }

    /**
     * Remove the specified category.
     */
    public function destroy(Category $category): JsonResponse
    {
        try {
            // Kategoriye ait yazı varsa silmeyi engelle
            $postsCount = $category->posts()->count();
            if ($postsCount > 0) {
                return response()->json([
                    'success' => false,
                    'message' => "Bu kategoriye ait {$postsCount} yazı bulunduğu için silinemez. Önce bu yazıları başka bir kategoriye taşıyın veya silin."
                ], 422);
            }

            $category->delete();

            // Cache temizle
            Cache::forget('categories.with_posts_count');
            Cache::forget("category.{$category->id}.with_posts");

            return response()->json([
                'success' => true,
                'message' => 'Kategori başarıyla silindi.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Kategori silinirken bir hata oluştu: ' . $e->getMessage()
            ], 500);
        }
    }
}
