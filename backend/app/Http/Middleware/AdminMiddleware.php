<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Kullanıcının giriş yapmış olup olmadığını kontrol et
        if (!Auth::check()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Please login first.',
                'code' => 'UNAUTHORIZED'
            ], 401);
        }

        // Kullanıcının admin rolüne sahip olup olmadığını kontrol et
        if (!Auth::user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied. Admin privileges required.',
                'code' => 'FORBIDDEN'
            ], 403);
        }

        return $next($request);
    }
}
