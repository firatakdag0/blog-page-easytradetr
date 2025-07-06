<?php

namespace Database\Seeders;

use App\Models\Author;
use Illuminate\Database\Seeder;

class AuthorSeeder extends Seeder
{
    public function run(): void
    {
        $authors = [
            [
                'first_name' => 'Ahmet',
                'last_name' => 'Yılmaz',
                'email' => 'ahmet.yilmaz@easytrade.com',
                'username' => 'ahmet_yilmaz',
                'bio' => 'EasyTrade\'de 8 yıldır teknoloji uzmanı olarak çalışıyorum. Ön muhasebe ve POS sistemleri konusunda uzmanım.',
                'profile_image' => '/placeholder-user.jpg',
                'website' => 'https://ahmetyilmaz.com',
                'twitter' => '@ahmetyilmaz',
                'linkedin' => 'ahmet-yilmaz-easytrade',
                'title' => 'Teknoloji Uzmanı',
                'expertise' => 'Ön Muhasebe, POS Sistemleri',
                'location' => 'İstanbul, Türkiye',
                'is_active' => true,
                'is_featured' => true,
            ],
            [
                'first_name' => 'Fatma',
                'last_name' => 'Kaya',
                'email' => 'fatma.kaya@easytrade.com',
                'username' => 'fatma_kaya',
                'bio' => 'Perakende sektöründe 12 yıllık deneyimim var. Müşteri deneyimi ve stok yönetimi konularında uzmanım.',
                'profile_image' => '/placeholder-user.jpg',
                'website' => 'https://fatmakaya.com',
                'instagram' => '@fatmakaya',
                'linkedin' => 'fatma-kaya-easytrade',
                'title' => 'Perakende Uzmanı',
                'expertise' => 'Perakende Yönetimi, CRM',
                'location' => 'Ankara, Türkiye',
                'is_active' => true,
                'is_featured' => true,
            ],
            [
                'first_name' => 'Mehmet',
                'last_name' => 'Özkan',
                'email' => 'mehmet.ozkan@easytrade.com',
                'username' => 'mehmet_ozkan',
                'bio' => 'Barkod sistemleri ve otomasyon konusunda 10 yıllık deneyimim var. Endüstri 4.0 çözümleri geliştiriyorum.',
                'profile_image' => '/placeholder-user.jpg',
                'website' => 'https://mehmetozkan.com',
                'twitter' => '@mehmetozkan',
                'linkedin' => 'mehmet-ozkan-easytrade',
                'title' => 'Otomasyon Uzmanı',
                'expertise' => 'Barkod Sistemleri, Otomasyon',
                'location' => 'İzmir, Türkiye',
                'is_active' => true,
                'is_featured' => false,
            ],
            [
                'first_name' => 'Zeynep',
                'last_name' => 'Arslan',
                'email' => 'zeynep.arslan@easytrade.com',
                'username' => 'zeynep_arslan',
                'bio' => 'Bulut teknolojileri ve dijital dönüşüm konusunda uzmanım. Küçük işletmelerin dijitalleşme süreçlerine rehberlik ediyorum.',
                'profile_image' => '/placeholder-user.jpg',
                'website' => 'https://zeyneparslan.com',
                'twitter' => '@zeyneparslan',
                'linkedin' => 'zeynep-arslan-easytrade',
                'title' => 'Dijital Dönüşüm Uzmanı',
                'expertise' => 'Cloud Teknolojileri, Dijital Dönüşüm',
                'location' => 'Bursa, Türkiye',
                'is_active' => true,
                'is_featured' => true,
            ],
            [
                'first_name' => 'Ali',
                'last_name' => 'Demir',
                'email' => 'ali.demir@easytrade.com',
                'username' => 'ali_demir',
                'bio' => 'Finans ve muhasebe alanında 15 yıllık deneyimim var. Ön muhasebe yazılımları ve finansal süreçler konusunda uzmanım.',
                'profile_image' => '/placeholder-user.jpg',
                'website' => 'https://alidemir.com',
                'linkedin' => 'ali-demir-easytrade',
                'title' => 'Finans Uzmanı',
                'expertise' => 'Ön Muhasebe, Finansal Süreçler',
                'location' => 'Antalya, Türkiye',
                'is_active' => true,
                'is_featured' => false,
            ],
        ];

        foreach ($authors as $authorData) {
            Author::create($authorData);
        }
    }
}
