<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Media extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'filename',
        'path',
        'url',
        'size',
        'mime_type',
        'width',
        'height',
        'alt_text',
        'caption',
        'is_active',
        'sizes_data',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'size' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
        'sizes_data' => 'array',
    ];

    /**
     * Aktif medya dosyalarını getir
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Resim dosyalarını getir
     */
    public function scopeImages($query)
    {
        return $query->where('mime_type', 'like', 'image/%');
    }

    /**
     * Dosya boyutunu formatla
     */
    public function getFormattedSizeAttribute()
    {
        $bytes = $this->size;
        if ($bytes === 0) return "0 Bytes";

        $k = 1024;
        $sizes = ["Bytes", "KB", "MB", "GB"];
        $i = floor(log($bytes) / log($k));

        return round($bytes / pow($k, $i), 2) . " " . $sizes[$i];
    }

    /**
     * Dosya türü ikonunu getir
     */
    public function getFileTypeIconAttribute()
    {
        if (str_starts_with($this->mime_type, 'image/')) return '🖼️';
        if (str_starts_with($this->mime_type, 'video/')) return '🎥';
        if (str_starts_with($this->mime_type, 'audio/')) return '🎵';
        return '📄';
    }
}
