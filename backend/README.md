<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

# Blog API Backend

Laravel tabanlı blog API backend'i.

## Performans Optimizasyonları

Bu proje aşağıdaki performans optimizasyonlarını içerir:

### 1. Database Indexleri
- Posts tablosunda arama, sıralama ve filtreleme için optimize edilmiş indexler
- Composite indexler ile çoklu alan sorguları için hızlandırma
- Foreign key indexleri ile ilişkisel sorgular için optimizasyon

### 2. Query Optimizasyonu
- `selectForList()` scope'u ile sadece gerekli alanları seçme
- Eager loading ile N+1 query problemini çözme
- Sadece gerekli ilişkili verileri yükleme (`category:id,name,slug,color`)

### 3. Cache Sistemi
- Redis/Database cache ile sık erişilen verileri önbellekleme
- Otomatik cache temizleme (model güncellemelerinde)
- Frontend'de client-side cache ile API çağrılarını azaltma

### 4. Database Optimizasyon Komutları

```bash
# Tablo istatistiklerini analiz et ve cache'i temizle
php artisan db:optimize --analyze --cache

# Sadece tablo analizi
php artisan db:optimize --analyze

# Sadece cache temizleme ve yeniden oluşturma
php artisan db:optimize --cache
```

### 5. Performans İyileştirmeleri

#### Backend Optimizasyonları:
- **Select Optimizasyonu**: Sadece gerekli alanları seçme
- **Eager Loading**: İlişkili verileri tek sorguda yükleme
- **Cache**: Sık erişilen verileri önbellekleme
- **Indexler**: Hızlı arama ve sıralama için database indexleri

#### Frontend Optimizasyonları:
- **Client-side Cache**: API çağrılarını önbellekleme
- **Lazy Loading**: Gerektiğinde veri yükleme
- **Debouncing**: Arama işlemlerinde gereksiz API çağrılarını önleme

### 6. Cache Stratejisi

| Veri Tipi | Cache Süresi | Açıklama |
|-----------|-------------|----------|
| Kategoriler | 10 dakika | Nadiren değişen veriler |
| Post listesi | 5 dakika | Orta sıklıkta değişen veriler |
| Tekil post | 30 dakika | Detay sayfaları için |
| Arama sonuçları | 2 dakika | Dinamik içerik |

### 7. Monitoring ve Debug

```bash
# Query loglarını aktif et
php artisan db:monitor

# Yavaş sorguları tespit et
php artisan db:slow-queries
```

## Kurulum

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
```

## API Endpoints

- `GET /api/v1/posts` - Blog yazılarını listele
- `GET /api/v1/categories` - Kategorileri listele
- `GET /api/v1/posts/{id}` - Tekil yazı detayı

## Performans Testleri

```bash
# API response time testleri
php artisan test --filter=PerformanceTest

# Database query testleri
php artisan test --filter=DatabaseTest
```
