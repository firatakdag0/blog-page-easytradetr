# Admin Panel Güvenlik Özellikleri

Bu dokümantasyon, admin yönetim paneline güvenli erişim için eklenen güvenlik katmanlarını açıklar.

## 🔐 Güvenlik Katmanları

### 1. Authentication (Kimlik Doğrulama)
- **Laravel Sanctum** ile token-based authentication
- Sadece admin rolündeki kullanıcılar giriş yapabilir
- Session-based token yönetimi
- Token expiration ve refresh mekanizması

### 2. Authorization (Yetkilendirme)
- **AdminMiddleware** ile rol kontrolü
- Sadece `role = 'admin'` olan kullanıcılar admin paneline erişebilir
- API endpoint'leri admin middleware ile korunur

### 3. Rate Limiting
- Login denemelerinde rate limiting
- 5 başarısız deneme sonrası 15 dakika bloklama
- IP bazlı rate limiting

### 4. CORS Güvenliği
- Credentials desteği aktif
- Güvenli cross-origin istekleri

## 🚀 Kurulum ve Kullanım

### Backend Kurulumu

1. **Paketleri yükle:**
```bash
cd backend
composer install
composer require laravel/sanctum
```

2. **Migration'ları çalıştır:**
```bash
php artisan migrate
```

3. **Admin kullanıcısı oluştur:**
```bash
php artisan db:seed --class=AdminUserSeeder
```

4. **Backend'i başlat:**
```bash
php artisan serve
```

### Frontend Kurulumu

1. **Paketleri yükle:**
```bash
cd frontend
npm install
```

2. **Frontend'i başlat:**
```bash
npm run dev
```

## 👤 Test Kullanıcıları

### Admin Kullanıcıları
- **Email:** `admin@easytrade.com`
- **Şifre:** `Admin123!@#`

- **Email:** `test@easytrade.com`
- **Şifre:** `Test123!@#`

### Normal Kullanıcı (Admin Değil)
- **Email:** `user@easytrade.com`
- **Şifre:** `User123!@#`

## 🔒 API Endpoints

### Public Endpoints
```
GET /api/v1/posts
GET /api/v1/categories
GET /api/v1/tags
GET /api/v1/comments
GET /api/v1/media
```

### Admin Authentication Endpoints
```
POST /api/v1/admin/auth/login
POST /api/v1/admin/auth/logout
GET /api/v1/admin/auth/me
POST /api/v1/admin/auth/refresh
POST /api/v1/admin/auth/change-password
```

### Protected Admin Endpoints
```
POST /api/v1/admin/categories
PUT /api/v1/admin/categories/{id}
DELETE /api/v1/admin/categories/{id}

GET /api/v1/admin/posts
POST /api/v1/admin/posts
PUT /api/v1/admin/posts/{id}
DELETE /api/v1/admin/posts/{id}

POST /api/v1/admin/tags
PUT /api/v1/admin/tags/{id}
DELETE /api/v1/admin/tags/{id}

GET /api/v1/admin/comments
POST /api/v1/admin/comments
PUT /api/v1/admin/comments/{id}
DELETE /api/v1/admin/comments/{id}

POST /api/v1/admin/media/upload
PUT /api/v1/admin/media/{id}
DELETE /api/v1/admin/media/{id}
```

## 🛡️ Güvenlik Özellikleri

### 1. Token Yönetimi
- JWT benzeri token sistemi
- Token expiration (varsayılan: 60 dakika)
- Automatic token refresh
- Secure token storage (localStorage)

### 2. Middleware Koruması
- `auth:sanctum` - Token kontrolü
- `admin` - Admin rol kontrolü
- Her admin endpoint'i bu middleware'lerle korunur

### 3. Error Handling
- 401 Unauthorized - Token yok veya geçersiz
- 403 Forbidden - Admin yetkisi yok
- 422 Validation Error - Form validasyon hatası

### 4. Frontend Güvenlik
- Authentication state management
- Automatic redirect to login
- Token expiration handling
- Secure logout

## 🔧 Konfigürasyon

### Sanctum Konfigürasyonu
```php
// config/sanctum.php
'expiration' => 60, // Token expiration in minutes
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
    '%s%s',
    'localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1',
    env('APP_URL') ? ','.parse_url(env('APP_URL'), PHP_URL_HOST) : ''
))),
```

### CORS Konfigürasyonu
```php
// config/cors.php
'supports_credentials' => true,
'allowed_origins' => ['*'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

## 🚨 Güvenlik Notları

1. **Production'da:**
   - HTTPS kullanın
   - CORS origins'i kısıtlayın
   - Rate limiting'i aktif edin
   - Log monitoring ekleyin

2. **Token Güvenliği:**
   - Token'ları secure HTTP-only cookie'de saklayın
   - Token rotation uygulayın
   - Session timeout ekleyin

3. **Monitoring:**
   - Failed login attempts loglanmalı
   - Suspicious activity detection
   - IP blocking for repeated failures

## 🔍 Test Senaryoları

### Başarılı Giriş
1. `/admin/login` sayfasına git
2. Admin credentials ile giriş yap
3. `/admin` paneline yönlendirildiğini kontrol et

### Başarısız Giriş
1. Yanlış credentials ile giriş dene
2. Rate limiting'in çalıştığını kontrol et
3. 5 deneme sonrası bloklandığını kontrol et

### Yetkisiz Erişim
1. Normal kullanıcı ile giriş yap
2. Admin paneline erişmeye çalış
3. 403 Forbidden hatası al

### Token Expiration
1. Admin olarak giriş yap
2. Token'ı manuel olarak sil
3. API çağrısı yap
4. 401 Unauthorized hatası al ve login'e yönlendir

## 📝 Geliştirme Notları

### Yeni Admin Endpoint Ekleme
```php
// routes/api.php
Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/new-endpoint', [NewController::class, 'method']);
});
```

### Yeni Middleware Ekleme
```php
// app/Http/Middleware/NewMiddleware.php
class NewMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Güvenlik kontrolü
        return $next($request);
    }
}
```

### Frontend'de Authentication Kontrolü
```typescript
// lib/api.ts
if (!apiClient.isAuthenticated()) {
    router.push('/admin/login')
    return
}
```

Bu güvenlik sistemi, admin paneline sadece yetkili kullanıcıların erişmesini sağlar ve modern web güvenlik standartlarını karşılar. 