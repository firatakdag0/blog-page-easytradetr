<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Ön Muhasebe',
                'slug' => 'on-muhasebe',
                'description' => 'Ön muhasebe yazılımları, fatura yönetimi ve finansal süreçler hakkında detaylı bilgiler.',
                'color' => '#3B82F6',
                'sort_order' => 1,
            ],
            [
                'name' => 'Barkod Sistemi',
                'slug' => 'barkod-sistemi',
                'description' => 'Barkod okuyucular, etiketleme sistemleri ve otomatik stok takibi konuları.',
                'color' => '#10B981',
                'sort_order' => 2,
            ],
            [
                'name' => 'Satış Noktası (POS)',
                'slug' => 'satis-noktasi-pos',
                'description' => 'POS sistemleri, ödeme yöntemleri ve satış süreçlerinin optimizasyonu.',
                'color' => '#F59E0B',
                'sort_order' => 3,
            ],
            [
                'name' => 'Bulut Teknolojisi',
                'slug' => 'bulut-teknolojisi',
                'description' => 'Cloud tabanlı çözümler, veri güvenliği ve uzaktan erişim sistemleri.',
                'color' => '#8B5CF6',
                'sort_order' => 4,
            ],
            [
                'name' => 'Perakende Yönetimi',
                'slug' => 'perakende-yonetimi',
                'description' => 'Perakende sektörü için özel çözümler, müşteri yönetimi ve pazarlama stratejileri.',
                'color' => '#EF4444',
                'sort_order' => 5,
            ],
            [
                'name' => 'Stok Yönetimi',
                'slug' => 'stok-yonetimi',
                'description' => 'Stok takibi, envanter yönetimi ve tedarik zinciri optimizasyonu.',
                'color' => '#06B6D4',
                'sort_order' => 6,
            ],
            [
                'name' => 'Müşteri İlişkileri',
                'slug' => 'musteri-iliskileri',
                'description' => 'CRM sistemleri, müşteri deneyimi ve sadakat programları.',
                'color' => '#84CC16',
                'sort_order' => 7,
            ],
            [
                'name' => 'Dijital Dönüşüm',
                'slug' => 'dijital-donusum',
                'description' => 'İşletmelerin dijital dönüşüm süreçleri ve teknoloji entegrasyonu.',
                'color' => '#EC4899',
                'sort_order' => 8,
            ],
        ];

        foreach ($categories as $categoryData) {
            Category::create($categoryData);
        }
    }
}
