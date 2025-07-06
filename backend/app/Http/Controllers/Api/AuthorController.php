<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Author;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AuthorController extends Controller
{
    public function index(Request $request)
    {
        $query = Author::query();
        if ($search = $request->input('search')) {
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%$search%")
                  ->orWhere('last_name', 'like', "%$search%")
                  ->orWhere('username', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%")
                  ->orWhere('bio', 'like', "%$search%")
                  ->orWhere('title', 'like', "%$search%")
                  ->orWhere('expertise', 'like', "%$search%")
                  ->orWhere('location', 'like', "%$search%")
                  ;
            });
        }
        $authors = $query->orderByDesc('created_at')->paginate(20);
        return response()->json($authors);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:authors,email',
            'username' => 'required|string|max:255|unique:authors,username',
            'bio' => 'nullable|string',
            'profile_image' => 'nullable|string',
            'website' => 'nullable|string',
            'twitter' => 'nullable|string',
            'linkedin' => 'nullable|string',
            'instagram' => 'nullable|string',
            'facebook' => 'nullable|string',
            'youtube' => 'nullable|string',
            'title' => 'nullable|string',
            'expertise' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'location' => 'nullable|string',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $author = Author::create($validator->validated());
        return response()->json($author, 201);
    }

    public function show($id)
    {
        $author = Author::findOrFail($id);
        return response()->json($author);
    }

    public function update(Request $request, $id)
    {
        $author = Author::findOrFail($id);
        $validator = Validator::make($request->all(), [
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:authors,email,' . $author->id,
            'username' => 'sometimes|required|string|max:255|unique:authors,username,' . $author->id,
            'bio' => 'nullable|string',
            'profile_image' => 'nullable|string',
            'website' => 'nullable|string',
            'twitter' => 'nullable|string',
            'linkedin' => 'nullable|string',
            'instagram' => 'nullable|string',
            'facebook' => 'nullable|string',
            'youtube' => 'nullable|string',
            'title' => 'nullable|string',
            'expertise' => 'nullable|string',
            'birth_date' => 'nullable|date',
            'location' => 'nullable|string',
            'is_active' => 'boolean',
            'is_featured' => 'boolean',
        ]);
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $author->update($validator->validated());
        return response()->json($author);
    }

    public function destroy($id)
    {
        $author = Author::findOrFail($id);
        $author->delete();
        return response()->json(['message' => 'Yazar silindi.']);
    }
}
