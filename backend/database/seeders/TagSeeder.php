<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TagSeeder extends Seeder
{
    public function run(): void
    {
        $tags = [
            [
                'name' => 'Dijital Dönüşüm',
                'slug' => 'dijital-donusum',
                'description' => 'İşletmelerin dijital dönüşüm süreçleri',
                'color' => '#3B82F6',
            ],
            [
                'name' => 'Stok Yönetimi',
                'slug' => 'stok-yonetimi',
                'description' => 'Stok ve envanter yönetimi konuları',
                'color' => '#10B981',
            ],
            [
                'name' => 'Müşteri Deneyimi',
                'slug' => 'musteri-deneyimi',
                'description' => 'Müşteri deneyimi ve memnuniyeti',
                'color' => '#F59E0B',
            ],
            [
                'name' => 'Verimlilik',
                'slug' => 'verimlilik',
                'description' => 'İş süreçlerinde verimlilik artırma',
                'color' => '#8B5CF6',
            ],
            [
                'name' => 'Teknoloji',
                'slug' => 'teknoloji',
                'description' => 'Teknoloji ve yazılım çözümleri',
                'color' => '#EF4444',
            ],
            [
                'name' => 'Fatura Yönetimi',
                'slug' => 'fatura-yonetimi',
                'description' => 'Fatura ve ödeme süreçleri',
                'color' => '#06B6D4',
            ],
            [
                'name' => 'Barkod Okuyucu',
                'slug' => 'barkod-okuyucu',
                'description' => 'Barkod okuyucu sistemleri',
                'color' => '#84CC16',
            ],
            [
                'name' => 'POS Sistemi',
                'slug' => 'pos-sistemi',
                'description' => 'Satış noktası sistemleri',
                'color' => '#EC4899',
            ],
            [
                'name' => 'Cloud Çözümler',
                'slug' => 'cloud-cozumler',
                'description' => 'Bulut tabanlı yazılım çözümleri',
                'color' => '#6366F1',
            ],
            [
                'name' => 'Perakende',
                'slug' => 'perakende',
                'description' => 'Perakende sektörü çözümleri',
                'color' => '#F97316',
            ],
            [
                'name' => 'CRM',
                'slug' => 'crm',
                'description' => 'Müşteri ilişkileri yönetimi',
                'color' => '#14B8A6',
            ],
            [
                'name' => 'Otomasyon',
                'slug' => 'otomasyon',
                'description' => 'İş süreçlerinde otomasyon',
                'color' => '#A855F7',
            ],
        ];

        foreach ($tags as $tagData) {
            Tag::create($tagData);
        }
    }
}
