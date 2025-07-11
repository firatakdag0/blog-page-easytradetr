# Easytrade Blog

## Proje Amacı

Easytrade Blog, modern ve kullanıcı dostu bir blog platformudur. Hem içerik üreticileri (yazarlar, adminler) hem de ziyaretçiler için kolay kullanım ve zengin özellikler sunar. Blog yazıları, kategoriler, etiketler, yazar profilleri, öne çıkan yazılar, kaydedilenler ve gelişmiş filtreleme gibi fonksiyonlar içerir.

## Kullanılan Teknolojiler

- **Frontend:**
  - Next.js (React tabanlı)
  - TypeScript
  - TailwindCSS
  - Framer Motion (animasyonlar için)
  - Lucide React (ikonlar)
  - Swiper.js (slider/carousel)
  - React Markdown (zengin içerik)

- **Backend:**
  - Laravel (PHP framework)
  - Eloquent ORM
  - RESTful API
  - Seeder ve Migration desteği

- **Veritabanı:**
  - MySQL veya MariaDB (Laravel ile uyumlu herhangi biri)

- **Diğer:**
  - localStorage (kaydedilenler için)
  - JSON yedekleme ve geri yükleme desteği

## Kurulum

### 1. Backend (Laravel)

```bash
cd backend
composer install
cp .env.example .env
# .env dosyasını veritabanı bilgilerinize göre düzenleyin
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### 2. Frontend (Next.js)

```bash
cd frontend
npm install # veya pnpm install
cp .env.example .env.local
# .env.local dosyasını API adresinize göre düzenleyin
npm run dev
```

## Özellikler

- Blog yazıları oluşturma, düzenleme, silme (admin paneli)
- Kategori, etiket ve yazar yönetimi
- Öne çıkan yazılar ve trend yazılar
- Kaydedilenler (localStorage ile kalıcı)
- Gelişmiş filtreleme ve arama
- Responsive ve modern arayüz
- Animasyonlu geçişler ve kullanıcı dostu deneyim
- JSON ile veri yedekleme ve geri yükleme desteği (Laravel artisan komutu ile)

## Yedekleme & Geri Yükleme

- Tüm içerikleri JSON olarak dışa aktırabilir, gerektiğinde tekrar yükleyebilirsiniz.
- Yedek almak için özel artisan komutu kullanılabilir (detaylar için dökümana bakın).

## Katkı ve Lisans

- Açık kaynaklıdır, katkılara açıktır.
- Lisans: MIT

---

## 📦 Hazır Veri Yedeği (`blog_backup.json`)

Bu projede, örnek ve gerçek blog içeriklerini hızlıca yükleyebilmek için kök dizinde **`blog_backup.json`** adında bir yedek dosyası bulunmaktadır.  
Bu dosya; yazılar, kategoriler, etiketler ve yazarlar gibi tüm temel verileri içerir.

### Yedek Veriyi Laravel'e Yükleme

1. **Seeder Oluştur:**  
   `backend/database/seeders/BlogJsonImportSeeder.php` dosyasını oluştur ve aşağıdaki gibi yapılandır:

   ```php
   <?php

   namespace Database\Seeders;

   use Illuminate\Database\Seeder;
   use Illuminate\Support\Facades\DB;
   use Illuminate\Support\Facades\File;

   class BlogJsonImportSeeder extends Seeder
   {
       public function run()
       {
           $json = File::get(base_path('blog_backup.json'));
           $data = json_decode($json, true);

           // Kategoriler
           foreach ($data['categories'] as $category) {
               DB::table('categories')->updateOrInsert(['id' => $category['id']], $category);
           }

           // Etiketler
           foreach ($data['tags'] as $tag) {
               DB::table('tags')->updateOrInsert(['id' => $tag['id']], $tag);
           }

           // Yazarlar
           foreach ($data['authors'] as $author) {
               DB::table('authors')->updateOrInsert(['id' => $author['id']], $author);
           }

           // Yazılar
           foreach ($data['posts'] as $post) {
               $tags = $post['tags'] ?? [];
               $author = $post['author'] ?? null;
               unset($post['tags'], $post['author'], $post['category']);
               DB::table('posts')->updateOrInsert(['id' => $post['id']], $post);

               // Post-tag pivot
               foreach ($tags as $tag) {
                   DB::table('post_tag')->updateOrInsert([
                       'post_id' => $post['id'],
                       'tag_id' => $tag['id'],
                   ]);
               }
           }
       }
   }
   ```

2. **Seeder'ı `DatabaseSeeder.php`'ye ekle:**

   ```php
   $this->call(BlogJsonImportSeeder::class);
   ```

3. **Seed Komutunu Çalıştır:**

   ```bash
   php artisan db:seed --class=BlogJsonImportSeeder
   ```

   > **Not:** Eğer tablo yapılarında değişiklik yaptıysan önce `php artisan migrate:fresh` ile veritabanını sıfırlayabilirsin.

---

## ⏰ Laravel Schedule (Zamanlanmış Görevler)

Projede, bazı işlemlerin otomatik olarak belirli aralıklarla çalışması için Laravel’in **Schedule** (Zamanlayıcı) sistemi kullanılmaktadır.

### Örnek: Otomatik Yayınlama ve Optimize Etme

- **Yayınlanacak yazıların otomatik olarak yayına alınması**
- **Veritabanı optimizasyonu**

#### 1. Komutlar Nerede?

`backend/app/Console/Commands/` klasöründe:
- `PublishScheduledPosts.php` (Zamanı gelen yazıları yayına alır)
- `OptimizeDatabase.php` (Veritabanı bakımı yapar)

#### 2. Schedule Tanımı

`backend/app/Console/Kernel.php` dosyasında:

```php
protected function schedule(Schedule $schedule)
{
    $schedule->command('posts:publish-scheduled')->everyMinute();
    $schedule->command('db:optimize')->daily();
}
```

#### 3. Schedule'ın Çalıştırılması

Sunucuda schedule görevlerinin çalışması için aşağıdaki komutun **sürekli** çalışması gerekir:

```bash
php artisan schedule:work
```
veya
```bash
* * * * * cd /proje_yolu/backend && php artisan schedule:run >> /dev/null 2>&1
```
(Bu satırı sunucunun crontab’ına ekleyebilirsin.)

---

## Özetle

- **blog_backup.json** ile tüm verileri kolayca yükleyebilirsin.
- **Seeder** ile yükleme işlemi otomatikleşir.
- **Laravel Schedule** ile zamanlanmış görevler (ör. otomatik yayınlama) arka planda çalışır.

Her türlü soru ve katkı için iletişime geçebilirsiniz! 