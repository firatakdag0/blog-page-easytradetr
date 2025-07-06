<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Media;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class MediaController extends Controller
{
    private ImageService $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    /**
     * Medya dosyalarını listele
     */
    public function index(Request $request): JsonResponse
    {
        $query = Media::active()->orderBy('created_at', 'desc');

        // Arama filtresi
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('alt_text', 'like', "%{$search}%")
                  ->orWhere('caption', 'like', "%{$search}%");
            });
        }

        // MIME type filtresi
        if ($request->has('type')) {
            $type = $request->type;
            if ($type === 'image') {
                $query->images();
            } elseif ($type === 'video') {
                $query->where('mime_type', 'like', 'video/%');
            } elseif ($type === 'audio') {
                $query->where('mime_type', 'like', 'audio/%');
            }
        }

        $media = $query->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $media
        ]);
    }

    /**
     * Medya dosyası yükle
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
        ]);

        try {
            $file = $request->file('file');
            $originalName = $file->getClientOriginalName();
            $mimeType = $file->getMimeType();

            // Eğer resim dosyasıysa, boyutlandırma yap
            if (str_starts_with($mimeType, 'image/')) {
                $sizes = $this->imageService->getDefaultSizes();
                $processedImages = $this->imageService->processImage($file, 'media', $sizes);

                // Ana görsel bilgilerini al
                $originalImage = $processedImages['original'];
                $filename = basename($originalImage['path']);

                // Veritabanına kaydet
                $media = Media::create([
                    'name' => $originalName,
                    'filename' => $filename,
                    'path' => $originalImage['path'],
                    'url' => $originalImage['url'],
                    'size' => $originalImage['size'],
                    'mime_type' => $mimeType,
                    'width' => $originalImage['width'],
                    'height' => $originalImage['height'],
                    'alt_text' => $request->alt_text,
                    'caption' => $request->caption,
                    'sizes_data' => $processedImages,
                ]);
            } else {
                // Resim değilse normal yükleme
                $extension = $file->getClientOriginalExtension();
                $size = $file->getSize();
                $filename = Str::random(40) . '.' . $extension;
                $path = $file->storeAs('media', $filename, 'public');
                $url = asset('storage/' . $path);

                $media = Media::create([
                    'name' => $originalName,
                    'filename' => $filename,
                    'path' => $path,
                    'url' => $url,
                    'size' => $size,
                    'mime_type' => $mimeType,
                    'width' => null,
                    'height' => null,
                    'alt_text' => $request->alt_text,
                    'caption' => $request->caption,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Dosya başarıyla yüklendi.',
                'data' => $media
            ], 201);

        } catch (\Exception $e) {
            Log::error('Media upload error: ' . $e->getMessage(), [
                'file' => $request->file('file')->getClientOriginalName(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Dosya yüklenirken hata oluştu: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Belirli bir medya dosyasını göster
     */
    public function show(Media $media): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $media
        ]);
    }

    /**
     * Medya dosyasını güncelle
     */
    public function update(Request $request, Media $media): JsonResponse
    {
        $request->validate([
            'name' => 'nullable|string|max:255',
            'alt_text' => 'nullable|string',
            'caption' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $media->update($request->only(['name', 'alt_text', 'caption', 'is_active']));

        return response()->json([
            'success' => true,
            'message' => 'Medya dosyası başarıyla güncellendi.',
            'data' => $media
        ]);
    }

    /**
     * Medya dosyasını sil
     */
    public function destroy(Media $media): JsonResponse
    {
        // Dosyayı storage'dan sil
        if (Storage::disk('public')->exists($media->path)) {
            Storage::disk('public')->delete($media->path);
        }

        // Veritabanından sil
        $media->delete();

        return response()->json([
            'success' => true,
            'message' => 'Medya dosyası başarıyla silindi.'
        ]);
    }

    /**
     * Toplu silme
     */
    public function bulkDestroy(Request $request): JsonResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:media,id'
        ]);

        $mediaFiles = Media::whereIn('id', $request->ids)->get();

        foreach ($mediaFiles as $media) {
            // Dosyayı storage'dan sil
            if (Storage::disk('public')->exists($media->path)) {
                Storage::disk('public')->delete($media->path);
            }
        }

        // Veritabanından sil
        Media::whereIn('id', $request->ids)->delete();

        return response()->json([
            'success' => true,
            'message' => count($request->ids) . ' dosya başarıyla silindi.'
        ]);
    }
}
