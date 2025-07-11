<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\TagController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\LikeController;
use App\Http\Controllers\Api\SaveController;
use App\Http\Controllers\Api\MediaController;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public API Routes
Route::prefix('v1')->group(function () {

    // Categories
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/categories/{category}', [CategoryController::class, 'show']);

    // Posts
    Route::get('/posts', [PostController::class, 'index']);
    Route::get('/posts/{post}', [PostController::class, 'show']);
    Route::get('/posts/slug/{slug}', [PostController::class, 'showBySlug']);
    Route::get('/posts/prev-next/{slug}', [PostController::class, 'getPrevNextPosts']);
    Route::get('/posts/check-slug-unique', [PostController::class, 'checkSlugUnique']);

    // Tags
    Route::get('/tags', [TagController::class, 'index']);
    Route::get('/tags/{tag}', [TagController::class, 'show']);

    // Comments
    Route::get('/comments', [CommentController::class, 'index']);
    Route::get('/comments/{comment}', [CommentController::class, 'show']);

    // Likes
    Route::post('/likes/toggle', [LikeController::class, 'toggle']);
    Route::get('/likes/check', [LikeController::class, 'check']);
    Route::get('/likes/count', [LikeController::class, 'count']);

    // Saves
    Route::get('/saves', [SaveController::class, 'index']);
    Route::post('/saves/toggle', [SaveController::class, 'toggle']);
    Route::get('/saves/check', [SaveController::class, 'check']);

    // Media (public read access)
    Route::get('/media', [MediaController::class, 'index']);
    Route::get('/media/{media}', [MediaController::class, 'show']);

    // Authors
    Route::apiResource('authors', App\Http\Controllers\Api\AuthorController::class);

    // Admin Authentication Routes
    Route::prefix('admin/auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/refresh', [AuthController::class, 'refresh']);
            Route::post('/change-password', [AuthController::class, 'changePassword']);
        });
    });

    // Admin Routes (Protected with admin middleware)
    Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {

        // Categories
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

        // Posts
        Route::get('/posts', [PostController::class, 'adminIndex']);
        Route::post('/posts', [PostController::class, 'store']);
        Route::put('/posts/{post}', [PostController::class, 'update']);
        Route::delete('/posts/{post}', [PostController::class, 'destroy']);

        // Tags
        Route::get('/tags', [TagController::class, 'index']);
        Route::post('/tags', [TagController::class, 'store']);
        Route::put('/tags/{tag}', [TagController::class, 'update']);
        Route::delete('/tags/{tag}', [TagController::class, 'destroy']);

        // Comments
        Route::get('/comments', [CommentController::class, 'adminIndex']);
        Route::post('/comments', [CommentController::class, 'store']);
        Route::put('/comments/{comment}', [CommentController::class, 'update']);
        Route::delete('/comments/{comment}', [CommentController::class, 'destroy']);

        // Media (admin write access)
        Route::post('/media/upload', [MediaController::class, 'upload']);
        Route::put('/media/{media}', [MediaController::class, 'update']);
        Route::delete('/media/{media}', [MediaController::class, 'destroy']);
        Route::post('/media/bulk-destroy', [MediaController::class, 'bulkDestroy']);

        // Saves
        Route::delete('/saves/{save}', [SaveController::class, 'destroy']);
    });
});
