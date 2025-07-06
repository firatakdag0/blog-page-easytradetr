<?php

namespace Database\Seeders;

use App\Models\Post;
use App\Models\Category;
use App\Models\Tag;
use App\Models\Author;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all();
        $tags = Tag::all();
        $authors = Author::all();

        $posts = [
            [
                'title' => '2024\'te Küçük İşletmeler İçin Dijital Dönüşüm Stratejileri',
                'slug' => '2024-kucuk-isletmeler-dijital-donusum-stratejileri',
                'excerpt' => 'Küçük işletmelerin dijital dönüşüm sürecinde izlemesi gereken adımlar ve EasyTrade ile sağlanan avantajlar.',
                'content' => $this->getPostContent('dijital-donusum'),
                'featured_image' => '/placeholder.jpg',
                'category_id' => $categories->where('slug', 'dijital-donusum')->first()->id,
                'author_id' => 1,
                'status' => 'published',
                'published_at' => now()->subDays(2),
                'read_time' => 8,
                'views_count' => 2450,
                'likes_count' => 156,
                'comments_count' => 23,
                'is_featured' => true,
                'is_trending' => true,
                'meta_title' => '2024 Dijital Dönüşüm Stratejileri - EasyTrade',
                'meta_description' => 'Küçük işletmeler için dijital dönüşüm rehberi ve EasyTrade çözümleri',
                'tags' => ['dijital-donusum', 'teknoloji', 'verimlilik'],
            ],
            [
                'title' => 'Barkod Sistemi ile Stok Yönetiminde %90 Zaman Tasarrufu',
                'slug' => 'barkod-sistemi-stok-yonetimi-zaman-tasarrufu',
                'excerpt' => 'Barkod sistemlerinin stok yönetiminde sağladığı avantajlar ve EasyTrade barkod çözümleri.',
                'content' => $this->getPostContent('barkod-sistemi'),
                'featured_image' => '/placeholder.jpg',
                'category_id' => $categories->where('slug', 'barkod-sistemi')->first()->id,
                'author_id' => 1,
                'status' => 'published',
                'published_at' => now()->subDays(5),
                'read_time' => 6,
                'views_count' => 1890,
                'likes_count' => 134,
                'comments_count' => 18,
                'is_featured' => false,
                'is_trending' => true,
                'meta_title' => 'Barkod Sistemi Stok Yönetimi - EasyTrade',
                'meta_description' => 'Barkod sistemi ile stok yönetimi avantajları ve zaman tasarrufu',
                'tags' => ['barkod-okuyucu', 'stok-yonetimi', 'otomasyon'],
            ],
            [
                'title' => 'Modern POS Sistemleri ile Satış Süreçlerinizi Optimize Edin',
                'slug' => 'modern-pos-sistemleri-satis-surecleri-optimizasyonu',
                'excerpt' => 'Günümüzde POS sistemlerinin önemi ve EasyTrade POS çözümleri ile satış süreçlerinizi nasıl optimize edebilirsiniz.',
                'content' => $this->getPostContent('pos-sistemi'),
                'featured_image' => '/placeholder.jpg',
                'category_id' => $categories->where('slug', 'satis-noktasi-pos')->first()->id,
                'author_id' => 1,
                'status' => 'published',
                'published_at' => now()->subDays(8),
                'read_time' => 7,
                'views_count' => 1567,
                'likes_count' => 98,
                'comments_count' => 12,
                'is_featured' => true,
                'is_trending' => false,
                'meta_title' => 'Modern POS Sistemleri - EasyTrade',
                'meta_description' => 'POS sistemleri ile satış süreçlerinizi optimize edin',
                'tags' => ['pos-sistemi', 'satis', 'verimlilik'],
            ],
            [
                'title' => 'Bulut Teknolojisi ile İşletmenizi Her Yerden Yönetin',
                'slug' => 'bulut-teknolojisi-isletme-yonetimi',
                'excerpt' => 'Cloud tabanlı çözümlerin avantajları ve EasyTrade bulut teknolojisi ile işletmenizi nasıl yönetebilirsiniz.',
                'content' => $this->getPostContent('bulut-teknolojisi'),
                'featured_image' => '/placeholder.jpg',
                'category_id' => $categories->where('slug', 'bulut-teknolojisi')->first()->id,
                'author_id' => 1,
                'status' => 'published',
                'published_at' => now()->subDays(12),
                'read_time' => 9,
                'views_count' => 1234,
                'likes_count' => 87,
                'comments_count' => 15,
                'is_featured' => false,
                'is_trending' => true,
                'meta_title' => 'Bulut Teknolojisi İşletme Yönetimi - EasyTrade',
                'meta_description' => 'Cloud tabanlı çözümler ile işletmenizi her yerden yönetin',
                'tags' => ['cloud-cozumler', 'teknoloji', 'dijital-donusum'],
            ],
            [
                'title' => 'Perakende Sektöründe Müşteri Deneyimi Optimizasyonu',
                'slug' => 'perakende-sektorunde-musteri-deneyimi-optimizasyonu',
                'excerpt' => 'Perakende sektöründe müşteri deneyimini artırmanın yolları ve EasyTrade çözümleri.',
                'content' => $this->getPostContent('musteri-deneyimi'),
                'featured_image' => '/placeholder.jpg',
                'category_id' => $categories->where('slug', 'perakende-yonetimi')->first()->id,
                'author_id' => 2,
                'status' => 'published',
                'published_at' => now()->subDays(15),
                'read_time' => 6,
                'views_count' => 987,
                'likes_count' => 67,
                'comments_count' => 9,
                'is_featured' => false,
                'is_trending' => false,
                'meta_title' => 'Perakende Müşteri Deneyimi - EasyTrade',
                'meta_description' => 'Perakende sektöründe müşteri deneyimi optimizasyonu',
                'tags' => ['musteri-deneyimi', 'perakende', 'crm'],
            ],
            [
                'title' => 'Ön Muhasebe Yazılımı Seçerken Dikkat Edilmesi Gerekenler',
                'slug' => 'on-muhasebe-yazilimi-secimi-kriterleri',
                'excerpt' => 'Doğru ön muhasebe yazılımı seçimi için kriterler ve EasyTrade ön muhasebe çözümlerinin avantajları.',
                'content' => $this->getPostContent('on-muhasebe'),
                'featured_image' => '/placeholder.jpg',
                'category_id' => $categories->where('slug', 'on-muhasebe')->first()->id,
                'author_id' => 1,
                'status' => 'published',
                'published_at' => now()->subDays(18),
                'read_time' => 10,
                'views_count' => 1456,
                'likes_count' => 112,
                'comments_count' => 16,
                'is_featured' => true,
                'is_trending' => false,
                'meta_title' => 'Ön Muhasebe Yazılımı Seçimi - EasyTrade',
                'meta_description' => 'Ön muhasebe yazılımı seçerken dikkat edilmesi gerekenler',
                'tags' => ['fatura-yonetimi', 'on-muhasebe', 'verimlilik'],
            ],
            [
                'title' => 'Stok Yönetiminde Yapılan En Yaygın Hatalar ve Çözümleri',
                'slug' => 'stok-yonetimi-yaygin-hatalar-cozumleri',
                'excerpt' => 'Stok yönetiminde karşılaşılan yaygın hatalar ve EasyTrade ile bu hataları nasıl önleyebilirsiniz.',
                'content' => $this->getPostContent('stok-yonetimi'),
                'featured_image' => '/placeholder.jpg',
                'category_id' => $categories->where('slug', 'stok-yonetimi')->first()->id,
                'author_id' => 2,
                'status' => 'published',
                'published_at' => now()->subDays(22),
                'read_time' => 8,
                'views_count' => 1123,
                'likes_count' => 78,
                'comments_count' => 11,
                'is_featured' => false,
                'is_trending' => true,
                'meta_title' => 'Stok Yönetimi Hataları ve Çözümleri - EasyTrade',
                'meta_description' => 'Stok yönetiminde yapılan yaygın hatalar ve çözümleri',
                'tags' => ['stok-yonetimi', 'otomasyon', 'verimlilik'],
            ],
            [
                'title' => 'CRM Sistemleri ile Müşteri İlişkilerinizi Güçlendirin',
                'slug' => 'crm-sistemleri-musteri-iliskileri-guclendirme',
                'excerpt' => 'CRM sistemlerinin önemi ve EasyTrade CRM çözümleri ile müşteri ilişkilerinizi nasıl güçlendirebilirsiniz.',
                'content' => $this->getPostContent('crm-sistemi'),
                'featured_image' => '/placeholder.jpg',
                'category_id' => $categories->where('slug', 'musteri-iliskileri')->first()->id,
                'author_id' => 1,
                'status' => 'published',
                'published_at' => now()->subDays(25),
                'read_time' => 7,
                'views_count' => 876,
                'likes_count' => 54,
                'comments_count' => 8,
                'is_featured' => false,
                'is_trending' => false,
                'meta_title' => 'CRM Sistemleri Müşteri İlişkileri - EasyTrade',
                'meta_description' => 'CRM sistemleri ile müşteri ilişkilerinizi güçlendirin',
                'tags' => ['crm', 'musteri-deneyimi', 'perakende'],
            ],
        ];

        foreach ($posts as $postData) {
            $tagNames = $postData['tags'];
            unset($postData['tags']);

            $post = Post::create($postData);

            // Etiketleri ekle
            $tagIds = $tags->whereIn('slug', $tagNames)->pluck('id');
            $post->tags()->attach($tagIds);
        }
    }

    private function getPostContent($type): string
    {
        $contents = [
            'dijital-donusum' => $this->getDigitalTransformationContent(),
            'barkod-sistemi' => $this->getBarcodeSystemContent(),
            'pos-sistemi' => $this->getPOSSystemContent(),
            'bulut-teknolojisi' => $this->getCloudTechnologyContent(),
            'musteri-deneyimi' => $this->getCustomerExperienceContent(),
            'on-muhasebe' => $this->getAccountingContent(),
            'stok-yonetimi' => $this->getInventoryManagementContent(),
            'crm-sistemi' => $this->getCRMContent(),
        ];

        return $contents[$type] ?? $this->getDefaultContent();
    }

    private function getDigitalTransformationContent(): string
    {
        return '<h2>Dijital Dönüşümün Önemi</h2>
        <p>Günümüzde dijital dönüşüm, tüm işletmeler için kaçınılmaz bir süreçtir. Küçük işletmeler için bu süreç daha da kritik öneme sahiptir çünkü rekabet avantajı sağlar ve operasyonel verimliliği artırır.</p>

        <h3>Dijital Dönüşümün Faydaları</h3>
        <ul>
            <li>Operasyonel verimlilik artışı</li>
            <li>Müşteri deneyiminin iyileştirilmesi</li>
            <li>Maliyetlerin azaltılması</li>
            <li>Rekabet avantajı elde edilmesi</li>
        </ul>

        <h3>EasyTrade ile Dijital Dönüşüm</h3>
        <p>EasyTrade, işletmenizin dijital dönüşüm sürecinde size rehberlik eder. Ön muhasebe, stok yönetimi, POS sistemleri ve CRM çözümlerimiz ile işletmenizi tamamen dijitalleştirebilirsiniz.</p>

        <h3>Adım Adım Dijital Dönüşüm</h3>
        <ol>
            <li>Mevcut süreçlerin analizi</li>
            <li>Dijital çözümlerin belirlenmesi</li>
            <li>Uygulama ve entegrasyon</li>
            <li>Personel eğitimi</li>
            <li>Sürekli iyileştirme</li>
        </ol>';
    }

    private function getBarcodeSystemContent(): string
    {
        return '<h2>Barkod Sistemlerinin Avantajları</h2>
        <p>Barkod sistemleri, modern işletmelerin stok yönetiminde vazgeçilmez araçlardır. Bu sistemler sayesinde stok takibi, satış süreçleri ve envanter yönetimi çok daha verimli hale gelir.</p>

        <h3>Barkod Sisteminin Faydaları</h3>
        <ul>
            <li>%90\'a varan zaman tasarrufu</li>
            <li>İnsan hatası riskinin minimize edilmesi</li>
            <li>Gerçek zamanlı stok takibi</li>
            <li>Otomatik raporlama</li>
        </ul>

        <h3>EasyTrade Barkod Çözümleri</h3>
        <p>EasyTrade barkod sistemi ile ürünlerinizi kolayca etiketleyebilir, stok hareketlerini takip edebilir ve satış süreçlerinizi hızlandırabilirsiniz.</p>

        <h3>Barkod Sistemi Kurulumu</h3>
        <ol>
            <li>Barkod okuyucu seçimi</li>
            <li>Yazılım entegrasyonu</li>
            <li>Ürün etiketleme</li>
            <li>Personel eğitimi</li>
            <li>Test ve optimizasyon</li>
        </ol>';
    }

    private function getPOSSystemContent(): string
    {
        return '<h2>Modern POS Sistemleri</h2>
        <p>Günümüzde POS sistemleri sadece satış işlemi yapmak için değil, işletmenizin tüm operasyonlarını yönetmek için kullanılmaktadır.</p>

        <h3>POS Sisteminin Özellikleri</h3>
        <ul>
            <li>Hızlı satış işlemleri</li>
            <li>Çoklu ödeme yöntemi desteği</li>
            <li>Stok entegrasyonu</li>
            <li>Müşteri yönetimi</li>
            <li>Detaylı raporlama</li>
        </ul>

        <h3>EasyTrade POS Çözümleri</h3>
        <p>EasyTrade POS sistemi ile satış süreçlerinizi optimize edebilir, müşteri deneyimini artırabilir ve işletmenizin karlılığını artırabilirsiniz.</p>';
    }

    private function getCloudTechnologyContent(): string
    {
        return '<h2>Bulut Teknolojisinin Avantajları</h2>
        <p>Cloud tabanlı çözümler, işletmelerin her yerden erişim sağlamasını ve veri güvenliğini garanti altına almasını sağlar.</p>

        <h3>Bulut Teknolojisinin Faydaları</h3>
        <ul>
            <li>Her yerden erişim</li>
            <li>Yüksek güvenlik</li>
            <li>Otomatik yedekleme</li>
            <li>Ölçeklenebilirlik</li>
        </ul>';
    }

    private function getCustomerExperienceContent(): string
    {
        return '<h2>Müşteri Deneyimi Optimizasyonu</h2>
        <p>Müşteri deneyimi, perakende sektöründe başarının anahtarıdır. Modern tüketiciler hızlı, kolay ve kişiselleştirilmiş deneyimler bekler.</p>

        <h3>Müşteri Deneyimini Artırmanın Yolları</h3>
        <ul>
            <li>Hızlı satış süreçleri</li>
            <li>Kişiselleştirilmiş hizmet</li>
            <li>Sadakat programları</li>
            <li>Kolay iletişim kanalları</li>
        </ul>';
    }

    private function getAccountingContent(): string
    {
        return '<h2>Ön Muhasebe Yazılımı Seçimi</h2>
        <p>Doğru ön muhasebe yazılımı seçimi, işletmenizin finansal süreçlerinin verimliliği için kritik öneme sahiptir.</p>

        <h3>Seçim Kriterleri</h3>
        <ul>
            <li>Kullanım kolaylığı</li>
            <li>Entegrasyon imkanları</li>
            <li>Raporlama özellikleri</li>
            <li>Teknik destek</li>
        </ul>';
    }

    private function getInventoryManagementContent(): string
    {
        return '<h2>Stok Yönetimi Hataları</h2>
        <p>Stok yönetiminde yapılan hatalar, işletmelerin maliyetlerini artırır ve müşteri memnuniyetini düşürür.</p>

        <h3>Yaygın Hatalar</h3>
        <ul>
            <li>Manuel stok takibi</li>
            <li>Düzensiz sayım</li>
            <li>Geç bildirimler</li>
            <li>Yanlış kodlama</li>
        </ul>';
    }

    private function getCRMContent(): string
    {
        return '<h2>CRM Sistemleri</h2>
        <p>CRM sistemleri, müşteri ilişkilerinizi yönetmek ve müşteri sadakatini artırmak için vazgeçilmez araçlardır.</p>

        <h3>CRM\'nin Faydaları</h3>
        <ul>
            <li>Müşteri verilerinin merkezi yönetimi</li>
            <li>Satış süreçlerinin takibi</li>
            <li>Müşteri analizi</li>
            <li>Pazarlama kampanyaları</li>
        </ul>';
    }

    private function getDefaultContent(): string
    {
        return '<p>Bu yazı EasyTrade blog\'unda yayınlanmıştır. Daha fazla bilgi için bizimle iletişime geçebilirsiniz.</p>';
    }
}
