<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CommentController extends Controller
{
    /**
     * Display a listing of comments for a post.
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'post_id' => 'required|exists:posts,id'
        ]);

        $comments = Comment::with(['user', 'replies.user'])
            ->byPost($request->post_id)
            ->approved()
            ->topLevel()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $comments
        ]);
    }

    /**
     * Display a listing of all comments for admin panel.
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $query = Comment::with(['user', 'post']);

        // Search filter
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('content', 'like', "%{$search}%")
                  ->orWhere('author_name', 'like', "%{$search}%")
                  ->orWhere('author_email', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Post filter
        if ($request->has('post_id')) {
            $query->where('post_id', $request->post_id);
        }

        $comments = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'data' => $comments
        ]);
    }

    /**
     * Store a newly created comment (Admin only).
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'post_id' => 'required|exists:posts,id',
            'author_name' => 'required|string|max:255',
            'author_email' => 'nullable|email|max:255',
            'author_avatar' => 'nullable|string',
            'content' => 'required|string|max:1000',
            'parent_id' => 'nullable|exists:comments,id',
            'status' => 'in:pending,approved,spam',
        ]);

        // Post'un yorumlara izin verip vermediğini kontrol et
        $post = Post::find($request->post_id);
        if (!$post->allow_comments) {
            return response()->json([
                'success' => false,
                'message' => 'Bu yazıya yorum eklenemez.'
            ], 422);
        }

        $comment = Comment::create([
            'post_id' => $request->post_id,
            'user_id' => null, // Admin eklediği için null
            'author_name' => $request->author_name,
            'author_email' => $request->author_email,
            'author_avatar' => $request->author_avatar,
            'content' => $request->content,
            'parent_id' => $request->parent_id,
            'status' => $request->status ?? 'approved', // Admin eklediği için approved
        ]);

        // Post'un yorum sayısını güncelle
        $post->increment('comments_count');

        $comment->load(['user', 'post']);

        return response()->json([
            'success' => true,
            'message' => 'Yorum başarıyla eklendi.',
            'data' => $comment
        ], 201);
    }

    /**
     * Display the specified comment.
     */
    public function show(Comment $comment): JsonResponse
    {
        $comment->load(['user', 'post', 'replies.user']);

        return response()->json([
            'success' => true,
            'data' => $comment
        ]);
    }

    /**
     * Update the specified comment.
     */
    public function update(Request $request, Comment $comment): JsonResponse
    {
        $request->validate([
            'author_name' => 'required|string|max:255',
            'author_email' => 'nullable|email|max:255',
            'author_avatar' => 'nullable|string',
            'content' => 'required|string|max:1000',
            'status' => 'in:pending,approved,spam',
        ]);

        $comment->update([
            'author_name' => $request->author_name,
            'author_email' => $request->author_email,
            'author_avatar' => $request->author_avatar,
            'content' => $request->content,
            'status' => $request->status ?? 'approved',
        ]);

        $comment->load(['user', 'post']);

        return response()->json([
            'success' => true,
            'message' => 'Yorum başarıyla güncellendi.',
            'data' => $comment
        ]);
    }

    /**
     * Remove the specified comment.
     */
    public function destroy(Comment $comment): JsonResponse
    {
        // Post'un yorum sayısını azalt
        $comment->post->decrement('comments_count');

        $comment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Yorum başarıyla silindi.'
        ]);
    }
}
