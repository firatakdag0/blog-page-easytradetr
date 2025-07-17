# EasyTradeTR Blog Platformu

## Proje Hakkında

EasyTradeTR Blog Platformu, modern bir blog ve içerik yönetim sistemidir. Next.js (React), Supabase ve TailwindCSS ile geliştirilmiştir. Hem ziyaretçiler hem de adminler için kullanıcı dostu, hızlı ve güvenli bir deneyim sunar. Proje, medya yönetimi, kategori/tag sistemi, kullanıcı yönetimi, gelişmiş admin paneli ve SEO uyumlu blog sayfaları içerir.

---

## Özellikler

- **Modern Blog Sayfası:** SEO uyumlu, hızlı, mobil uyumlu blog listesi ve detay sayfaları
- **Admin Paneli:** İçerik, kategori, yazar, medya, kullanıcı, yorum ve ayar yönetimi
- **Medya Yönetimi:** Supabase Storage ile görsel/video yükleme, silme, arama, filtreleme
- **Kategori & Etiket Sistemi:** Çoklu kategori ve tag desteği
- **Yazar Yönetimi:** Yazar profilleri, avatar, biyografi
- **Kullanıcı Yönetimi:** Supabase Auth ile güvenli oturum açma/kapama
- **Yorumlar:** Yorum ekleme, silme, onaylama (isteğe bağlı)
- **Analytics:** Görüntülenme, okuma süresi, trend/öne çıkan yazılar
- **Tema Desteği:** Açık/koyu mod
- **Responsive Tasarım:** Tüm cihazlarda kusursuz görünüm

---

## Teknoloji Yığını

- **Frontend:** Next.js (App Router), React, TypeScript
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **UI:** TailwindCSS, Shadcn UI, Framer Motion
- **State Management:** React Hooks
- **Bildirimler:** Sonner
- **Diğer:** Lucide React Icons, Swiper.js, Markdown desteği

---

## Kurulum

### 1. Depoyu Klonla
```bash
git clone https://github.com/easytradetr/blog-page-easytradetr.git
cd blog-page-easytradetr
```

### 2. Bağımlılıkları Yükle
```bash
npm install
# veya
yarn install
# veya
pnpm install
```

### 3. Ortam Değişkenlerini Ayarla
Ana dizinde `.env.local` dosyası oluştur:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1 # (Laravel API kullanıyorsan)
```
Supabase projenizden bu bilgileri alın.

### 4. Geliştirme Sunucusunu Başlat
```bash
npm run dev
# veya
yarn dev
# veya
pnpm dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışır.

---

## Supabase Kurulumu

1. [Supabase](https://supabase.com/) hesabı açın ve yeni bir proje oluşturun.
2. **Tabloları oluşturun:**
   - `posts`, `categories`, `authors`, `tags`, `media`, `users`, `comments` vb.
   - Gerekli ilişkileri (foreign key) kurun.
3. **Storage bucket** oluşturun (ör: `media`) ve public yapın.
4. **Auth** ayarlarını yapın (email ile kayıt/giriş önerilir).
5. Ortam değişkenlerini `.env.local` dosyanıza ekleyin.

---

## Proje Yapısı

```
blog-page-easytradetr/
├── frontend/
│   ├── app/           # Next.js app router sayfaları
│   ├── components/    # UI ve yardımcı bileşenler
│   ├── hooks/         # React custom hook'lar
│   ├── lib/           # API, Supabase client, yardımcı fonksiyonlar
│   ├── public/        # Statik dosyalar/görseller
│   ├── styles/        # Global ve output CSS
│   └── ...
├── README.md
└── ...
```

---

## Geliştirme

- **Yeni Sayfa Eklemek:**
  - `frontend/app/` altında yeni bir klasör ve `page.tsx` oluştur.
- **Yeni Bileşen Eklemek:**
  - `frontend/components/` altında oluştur.
- **API Fonksiyonu Eklemek:**
  - `frontend/lib/api.ts` dosyasına ekle.
- **Supabase ile Çalışmak:**
  - `frontend/lib/supabaseClient.ts` ile Supabase fonksiyonlarını kullan.

---

## Ortam Değişkenleri

| Değişken                      | Açıklama                        |
|-------------------------------|---------------------------------|
| NEXT_PUBLIC_SUPABASE_URL      | Supabase projesi URL'i          |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase anon anahtarı          |
| NEXT_PUBLIC_API_URL           | (Varsa) Laravel API endpoint'i  |

---

## Sık Kullanılan Komutlar

| Komut           | Açıklama                |
|-----------------|------------------------|
| npm run dev     | Geliştirme sunucusu    |
| npm run build   | Production build       |
| npm run start   | Production başlat      |
| npm run lint    | Linter çalıştır        |

---

## Katkı Sağlama

1. Fork'la ve yeni bir branch aç.
2. Değişikliklerini yap.
3. PR (Pull Request) gönder.
4. Kodun okunabilir, test edilebilir ve açıklamalı olmasına dikkat et.

---

## Sıkça Sorulan Sorular

- **Görseller yüklenmiyor:** Supabase Storage bucket'ı public mi, ortam değişkenleri doğru mu?
- **Yazar/Kategori gözükmüyor:** Post tablosunda author_id ve category_id alanları doğru mu?
- **Admin paneline giriş yapamıyorum:** Supabase Auth ayarlarını ve kullanıcı kaydını kontrol et.

---

## Lisans

MIT

---

## İletişim & Destek

Her türlü soru ve destek için [EasyTradeTR](mailto:destek@easytradetr.com) ile iletişime geçebilirsiniz. 