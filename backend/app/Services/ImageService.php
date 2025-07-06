<?php

namespace App\Services;

use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class ImageService
{
    private ImageManager $imageManager;

    public function __construct()
    {
        $this->imageManager = new ImageManager(new Driver());
    }

    /**
     * Görseli optimize et ve boyutlandır
     */
    public function processImage(UploadedFile $file, string $path, array $sizes = []): array
    {
        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $filename = \Illuminate\Support\Str::random(40);

        // Orijinal dosyayı kaydet
        $originalPath = $file->storeAs($path, $filename . '.' . $extension, 'public');

        // Görseli yükle
        $image = $this->imageManager->read($file->getPathname());

        // Orijinal boyutları al
        $originalWidth = $image->width();
        $originalHeight = $image->height();

        $processedImages = [
            'original' => [
                'path' => $originalPath,
                'url' => asset('storage/' . $originalPath),
                'width' => $originalWidth,
                'height' => $originalHeight,
                'size' => $file->getSize()
            ]
        ];

        // Farklı boyutlarda görseller oluştur
        foreach ($sizes as $sizeName => $sizeConfig) {
            $resizedImage = $this->resizeImage($image, $sizeConfig);

            $resizedFilename = $filename . '_' . $sizeName . '.' . $extension;
            $resizedPath = $path . '/' . $resizedFilename;

            // Resized görseli kaydet
            $format = strtolower($extension);
            if ($format === 'jpg') $format = 'jpeg';

            $encodedImage = match($format) {
                'jpeg', 'jpg' => $resizedImage->toJpeg(85),
                'png' => $resizedImage->toPng(),
                'webp' => $resizedImage->toWebp(85),
                'gif' => $resizedImage->toGif(),
                default => $resizedImage->toJpeg(85)
            };

            Storage::disk('public')->put($resizedPath, $encodedImage);

            $processedImages[$sizeName] = [
                'path' => $resizedPath,
                'url' => asset('storage/' . $resizedPath),
                'width' => $resizedImage->width(),
                'height' => $resizedImage->height(),
                'size' => Storage::disk('public')->size($resizedPath)
            ];
        }

        return $processedImages;
    }

    /**
     * Görseli belirtilen boyutlara göre yeniden boyutlandır
     */
    private function resizeImage($image, array $config): \Intervention\Image\Interfaces\ImageInterface
    {
        $width = $config['width'] ?? null;
        $height = $config['height'] ?? null;
        $fit = $config['fit'] ?? 'contain'; // contain, cover, fill, stretch

        $resized = clone $image;

        // Orijinal boyut ise hiç işlem yapma
        if ($width === null && $height === null) {
            return $resized;
        }

        if ($width && $height) {
            switch ($fit) {
                case 'cover':
                    $resized = $resized->cover($width, $height);
                    break;
                case 'fill':
                    $resized = $resized->resize($width, $height);
                    break;
                case 'stretch':
                    $resized = $resized->resize($width, $height);
                    break;
                default: // contain
                    $resized = $resized->contain($width, $height);
                    break;
            }
        } elseif ($width) {
            $resized = $resized->scaleDown($width);
        } elseif ($height) {
            $resized = $resized->scaleDown(null, $height);
        }

        return $resized;
    }

    /**
     * Varsayılan boyutlandırma ayarları
     */
    public function getDefaultSizes(): array
    {
        return [
            'original' => ['width' => null, 'height' => null, 'fit' => 'contain'], // Orijinal boyut
            'thumbnail' => ['width' => 150, 'height' => 150, 'fit' => 'contain'],
            'small' => ['width' => 300, 'height' => 200, 'fit' => 'contain'],
            'medium' => ['width' => 600, 'height' => 400, 'fit' => 'contain'],
            'large' => ['width' => 1200, 'height' => 800, 'fit' => 'contain'],
            'featured' => ['width' => 800, 'height' => 400, 'fit' => 'cover'], // Öne çıkan için cover
        ];
    }

    /**
     * Görseli sil
     */
    public function deleteImage(string $path, array $sizes = []): void
    {
        // Orijinal dosyayı sil
        if (Storage::disk('public')->exists($path)) {
            Storage::disk('public')->delete($path);
        }

        // Boyutlandırılmış dosyaları sil
        foreach ($sizes as $sizeName => $sizeData) {
            if (isset($sizeData['path']) && Storage::disk('public')->exists($sizeData['path'])) {
                Storage::disk('public')->delete($sizeData['path']);
            }
        }
    }
}
