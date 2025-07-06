<?php

namespace Database\Seeders;

use App\Models\Media;
use Illuminate\Database\Seeder;

class MediaSeeder extends Seeder
{
    public function run(): void
    {
        $mediaFiles = [
            [
                'name' => 'EasyTrade POS Sistemi',
                'filename' => 'easytrade-pos-sistemi.jpg',
                'path' => '/media/easytrade-pos-sistemi.jpg',
                'url' => '/media/easytrade-pos-sistemi.jpg',
                'size' => 245760,
                'mime_type' => 'image/jpeg',
                'width' => 1920,
                'height' => 1080,
                'alt_text' => 'EasyTrade POS sistemi kullanım örneği',
                'caption' => 'Modern POS sistemi ile hızlı satış işlemleri',
                'is_active' => true,
                'sizes_data' => [
                    'original' => [
                        'path' => '/media/easytrade-pos-sistemi.jpg',
                        'url' => '/media/easytrade-pos-sistemi.jpg',
                        'width' => 1920,
                        'height' => 1080,
                        'size' => 245760
                    ],
                    'thumbnail' => [
                        'path' => '/media/easytrade-pos-sistemi-thumb.jpg',
                        'url' => '/media/easytrade-pos-sistemi-thumb.jpg',
                        'width' => 300,
                        'height' => 200,
                        'size' => 45000
                    ],
                    'medium' => [
                        'path' => '/media/easytrade-pos-sistemi-medium.jpg',
                        'url' => '/media/easytrade-pos-sistemi-medium.jpg',
                        'width' => 800,
                        'height' => 600,
                        'size' => 120000
                    ]
                ]
            ],
            [
                'name' => 'Barkod Okuyucu Sistem',
                'filename' => 'barkod-okuyucu-sistem.jpg',
                'path' => '/media/barkod-okuyucu-sistem.jpg',
                'url' => '/media/barkod-okuyucu-sistem.jpg',
                'size' => 198400,
                'mime_type' => 'image/jpeg',
                'width' => 1600,
                'height' => 900,
                'alt_text' => 'Barkod okuyucu sistem kullanımı',
                'caption' => 'Hızlı ve doğru barkod okuma sistemi',
                'is_active' => true,
                'sizes_data' => [
                    'original' => [
                        'path' => '/media/barkod-okuyucu-sistem.jpg',
                        'url' => '/media/barkod-okuyucu-sistem.jpg',
                        'width' => 1600,
                        'height' => 900,
                        'size' => 198400
                    ],
                    'thumbnail' => [
                        'path' => '/media/barkod-okuyucu-sistem-thumb.jpg',
                        'url' => '/media/barkod-okuyucu-sistem-thumb.jpg',
                        'width' => 300,
                        'height' => 200,
                        'size' => 35000
                    ]
                ]
            ],
            [
                'name' => 'Ön Muhasebe Yazılımı',
                'filename' => 'on-muhasebe-yazilimi.jpg',
                'path' => '/media/on-muhasebe-yazilimi.jpg',
                'url' => '/media/on-muhasebe-yazilimi.jpg',
                'size' => 312000,
                'mime_type' => 'image/jpeg',
                'width' => 1920,
                'height' => 1080,
                'alt_text' => 'EasyTrade ön muhasebe yazılımı arayüzü',
                'caption' => 'Kullanıcı dostu ön muhasebe çözümü',
                'is_active' => true,
                'sizes_data' => [
                    'original' => [
                        'path' => '/media/on-muhasebe-yazilimi.jpg',
                        'url' => '/media/on-muhasebe-yazilimi.jpg',
                        'width' => 1920,
                        'height' => 1080,
                        'size' => 312000
                    ],
                    'thumbnail' => [
                        'path' => '/media/on-muhasebe-yazilimi-thumb.jpg',
                        'url' => '/media/on-muhasebe-yazilimi-thumb.jpg',
                        'width' => 300,
                        'height' => 200,
                        'size' => 55000
                    ]
                ]
            ],
            [
                'name' => 'Stok Yönetimi Sistemi',
                'filename' => 'stok-yonetimi-sistemi.jpg',
                'path' => '/media/stok-yonetimi-sistemi.jpg',
                'url' => '/media/stok-yonetimi-sistemi.jpg',
                'size' => 267000,
                'mime_type' => 'image/jpeg',
                'width' => 1600,
                'height' => 900,
                'alt_text' => 'Stok yönetimi sistemi dashboard',
                'caption' => 'Gerçek zamanlı stok takibi',
                'is_active' => true,
                'sizes_data' => [
                    'original' => [
                        'path' => '/media/stok-yonetimi-sistemi.jpg',
                        'url' => '/media/stok-yonetimi-sistemi.jpg',
                        'width' => 1600,
                        'height' => 900,
                        'size' => 267000
                    ],
                    'thumbnail' => [
                        'path' => '/media/stok-yonetimi-sistemi-thumb.jpg',
                        'url' => '/media/stok-yonetimi-sistemi-thumb.jpg',
                        'width' => 300,
                        'height' => 200,
                        'size' => 48000
                    ]
                ]
            ],
            [
                'name' => 'CRM Müşteri Yönetimi',
                'filename' => 'crm-musteri-yonetimi.jpg',
                'path' => '/media/crm-musteri-yonetimi.jpg',
                'url' => '/media/crm-musteri-yonetimi.jpg',
                'size' => 289000,
                'mime_type' => 'image/jpeg',
                'width' => 1920,
                'height' => 1080,
                'alt_text' => 'CRM müşteri yönetimi sistemi',
                'caption' => 'Müşteri ilişkileri yönetimi platformu',
                'is_active' => true,
                'sizes_data' => [
                    'original' => [
                        'path' => '/media/crm-musteri-yonetimi.jpg',
                        'url' => '/media/crm-musteri-yonetimi.jpg',
                        'width' => 1920,
                        'height' => 1080,
                        'size' => 289000
                    ],
                    'thumbnail' => [
                        'path' => '/media/crm-musteri-yonetimi-thumb.jpg',
                        'url' => '/media/crm-musteri-yonetimi-thumb.jpg',
                        'width' => 300,
                        'height' => 200,
                        'size' => 52000
                    ]
                ]
            ],
            [
                'name' => 'Bulut Teknolojisi',
                'filename' => 'bulut-teknolojisi.jpg',
                'path' => '/media/bulut-teknolojisi.jpg',
                'url' => '/media/bulut-teknolojisi.jpg',
                'size' => 234000,
                'mime_type' => 'image/jpeg',
                'width' => 1600,
                'height' => 900,
                'alt_text' => 'Cloud tabanlı çözümler',
                'caption' => 'Güvenli bulut teknolojisi altyapısı',
                'is_active' => true,
                'sizes_data' => [
                    'original' => [
                        'path' => '/media/bulut-teknolojisi.jpg',
                        'url' => '/media/bulut-teknolojisi.jpg',
                        'width' => 1600,
                        'height' => 900,
                        'size' => 234000
                    ],
                    'thumbnail' => [
                        'path' => '/media/bulut-teknolojisi-thumb.jpg',
                        'url' => '/media/bulut-teknolojisi-thumb.jpg',
                        'width' => 300,
                        'height' => 200,
                        'size' => 42000
                    ]
                ]
            ],
            [
                'name' => 'Perakende Çözümleri',
                'filename' => 'perakende-cozumleri.jpg',
                'path' => '/media/perakende-cozumleri.jpg',
                'url' => '/media/perakende-cozumleri.jpg',
                'size' => 298000,
                'mime_type' => 'image/jpeg',
                'width' => 1920,
                'height' => 1080,
                'alt_text' => 'Perakende sektörü için özel çözümler',
                'caption' => 'Perakende işletmeleri için kapsamlı çözümler',
                'is_active' => true,
                'sizes_data' => [
                    'original' => [
                        'path' => '/media/perakende-cozumleri.jpg',
                        'url' => '/media/perakende-cozumleri.jpg',
                        'width' => 1920,
                        'height' => 1080,
                        'size' => 298000
                    ],
                    'thumbnail' => [
                        'path' => '/media/perakende-cozumleri-thumb.jpg',
                        'url' => '/media/perakende-cozumleri-thumb.jpg',
                        'width' => 300,
                        'height' => 200,
                        'size' => 54000
                    ]
                ]
            ],
            [
                'name' => 'Dijital Dönüşüm',
                'filename' => 'dijital-donusum.jpg',
                'path' => '/media/dijital-donusum.jpg',
                'url' => '/media/dijital-donusum.jpg',
                'size' => 276000,
                'mime_type' => 'image/jpeg',
                'width' => 1600,
                'height' => 900,
                'alt_text' => 'Dijital dönüşüm süreçleri',
                'caption' => 'İşletmelerin dijital dönüşüm yolculuğu',
                'is_active' => true,
                'sizes_data' => [
                    'original' => [
                        'path' => '/media/dijital-donusum.jpg',
                        'url' => '/media/dijital-donusum.jpg',
                        'width' => 1600,
                        'height' => 900,
                        'size' => 276000
                    ],
                    'thumbnail' => [
                        'path' => '/media/dijital-donusum-thumb.jpg',
                        'url' => '/media/dijital-donusum-thumb.jpg',
                        'width' => 300,
                        'height' => 200,
                        'size' => 49000
                    ]
                ]
            ],
        ];

        foreach ($mediaFiles as $mediaData) {
            Media::create($mediaData);
        }
    }
}
