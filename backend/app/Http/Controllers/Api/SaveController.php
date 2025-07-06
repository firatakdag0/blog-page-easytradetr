<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Save;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SaveController extends Controller
{
    /**
     * Display a listing of saved posts for user.
     */
    public function index(): JsonResponse
    {
        $userId = 1; // Şimdilik sabit user ID

        $savedPosts = Save::with(['post.category', 'post.author', 'post.tags'])
            ->byUser($userId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->pluck('post');

        return response()->json([
            'success' => true,
            'data' => $savedPosts
        ]);
    }

    /**
     * Toggle save for a post.
     */
    public function toggle(Request $request): JsonResponse
    {
        $request->validate([
            'post_id' => 'required|exists:posts,id',
        ]);

        $userId = 1; // Şimdilik sabit user ID

        $existingSave = Save::byUser($userId)
            ->byPost($request->post_id)
            ->first();

        if ($existingSave) {
            // Save'ı kaldır
            $existingSave->delete();

            return response()->json([
                'success' => true,
                'message' => 'Kayıt kaldırıldı.',
                'saved' => false
            ]);
        } else {
            // Save ekle
            Save::create([
                'user_id' => $userId,
                'post_id' => $request->post_id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Kaydedildi.',
                'saved' => true
            ]);
        }
    }

    /**
     * Check if user saved a post.
     */
    public function check(Request $request): JsonResponse
    {
        $request->validate([
            'post_id' => 'required|exists:posts,id',
        ]);

        $userId = 1; // Şimdilik sabit user ID

        $saved = Save::byUser($userId)
            ->byPost($request->post_id)
            ->exists();

        return response()->json([
            'success' => true,
            'saved' => $saved
        ]);
    }

    /**
     * Remove the specified save.
     */
    public function destroy(Save $save): JsonResponse
    {
        $save->delete();

        return response()->json([
            'success' => true,
            'message' => 'Kayıt kaldırıldı.'
        ]);
    }
}
