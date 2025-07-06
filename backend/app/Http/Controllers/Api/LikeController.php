<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Like;
use App\Models\Post;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LikeController extends Controller
{
    /**
     * Toggle like for a post or comment.
     */
    public function toggle(Request $request): JsonResponse
    {
        $request->validate([
            'likeable_type' => 'required|in:App\Models\Post,App\Models\Comment',
            'likeable_id' => 'required|integer',
        ]);

        $userId = 1; // Şimdilik sabit user ID

        $existingLike = Like::byUser($userId)
            ->byLikeable($request->likeable_type, $request->likeable_id)
            ->first();

        if ($existingLike) {
            // Like'ı kaldır
            $existingLike->delete();

            // Counter'ı azalt
            if ($request->likeable_type === 'App\Models\Post') {
                Post::find($request->likeable_id)->decrement('likes_count');
            } elseif ($request->likeable_type === 'App\Models\Comment') {
                Comment::find($request->likeable_id)->decrement('likes_count');
            }

            return response()->json([
                'success' => true,
                'message' => 'Beğeni kaldırıldı.',
                'liked' => false
            ]);
        } else {
            // Like ekle
            Like::create([
                'user_id' => $userId,
                'likeable_type' => $request->likeable_type,
                'likeable_id' => $request->likeable_id,
            ]);

            // Counter'ı artır
            if ($request->likeable_type === 'App\Models\Post') {
                Post::find($request->likeable_id)->increment('likes_count');
            } elseif ($request->likeable_type === 'App\Models\Comment') {
                Comment::find($request->likeable_id)->increment('likes_count');
            }

            return response()->json([
                'success' => true,
                'message' => 'Beğenildi.',
                'liked' => true
            ]);
        }
    }

    /**
     * Check if user liked a post or comment.
     */
    public function check(Request $request): JsonResponse
    {
        $request->validate([
            'likeable_type' => 'required|in:App\Models\Post,App\Models\Comment',
            'likeable_id' => 'required|integer',
        ]);

        $userId = 1; // Şimdilik sabit user ID

        $liked = Like::byUser($userId)
            ->byLikeable($request->likeable_type, $request->likeable_id)
            ->exists();

        return response()->json([
            'success' => true,
            'liked' => $liked
        ]);
    }

    /**
     * Get likes count for a post or comment.
     */
    public function count(Request $request): JsonResponse
    {
        $request->validate([
            'likeable_type' => 'required|in:App\Models\Post,App\Models\Comment',
            'likeable_id' => 'required|integer',
        ]);

        $count = Like::byLikeable($request->likeable_type, $request->likeable_id)->count();

        return response()->json([
            'success' => true,
            'count' => $count
        ]);
    }
}
