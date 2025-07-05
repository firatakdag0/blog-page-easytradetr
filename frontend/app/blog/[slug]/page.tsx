"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Footer } from "@/components/ui/footer"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Share2,
  Bookmark,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Heart,
  BookOpen,
  User,
  Tag,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"

// Mock blog post data
const mockPost = {
  id: 1,
  title: "2024'te Küçük İşletmeler İçin Dijital Dönüşüm Stratejileri",
  slug: "dijital-donusum-stratejileri-2024",
  excerpt:
    "Geleneksel işletmelerin modern teknolojilerle nasıl rekabet avantajı elde edebileceğini ve Easytrade ile dijital dönüşümlerini nasıl başlatabileceklerini detaylı olarak inceliyoruz.",
  content: `
    <h2>Dijital Dönüşümün Önemi</h2>
    <p>Günümüzde dijital dönüşüm, işletmelerin rekabet avantajı elde etmesi için kritik bir faktör haline gelmiştir. Özellikle küçük ve orta ölçekli işletmeler (KOBİ'ler) için bu dönüşüm, sadece bir seçenek değil, bir zorunluluk olarak karşımıza çıkmaktadır.</p>
    
    <h3>Neden Dijital Dönüşüm?</h3>
    <p>Dijital dönüşüm, işletmelerin operasyonel verimliliğini artırırken, müşteri deneyimini de iyileştirmektedir. Easytrade gibi modern çözümlerle:</p>
    
    <ul>
      <li><strong>Stok yönetimi</strong> otomatikleşir ve hata oranları düşer</li>
      <li><strong>Satış süreçleri</strong> hızlanır ve müşteri memnuniyeti artar</li>
      <li><strong>Finansal raporlama</strong> gerçek zamanlı hale gelir</li>
      <li><strong>İş süreçleri</strong> optimize edilir ve maliyet tasarrufu sağlanır</li>
    </ul>
    
    <h3>Dijital Dönüşüm Adımları</h3>
    <p>Başarılı bir dijital dönüşüm için izlenmesi gereken temel adımlar:</p>
    
    <ol>
      <li><strong>Mevcut Durumu Analiz Edin:</strong> İşletmenizin dijital olgunluk seviyesini belirleyin</li>
      <li><strong>Hedefleri Tanımlayın:</strong> Dijital dönüşümle neyi başarmak istediğinizi netleştirin</li>
      <li><strong>Doğru Araçları Seçin:</strong> İhtiyaçlarınıza uygun teknolojik çözümleri belirleyin</li>
      <li><strong>Ekibi Eğitin:</strong> Çalışanlarınızın yeni sistemlere adaptasyonunu sağlayın</li>
      <li><strong>Aşamalı Geçiş Yapın:</strong> Tüm süreçleri bir anda değiştirmek yerine aşamalı geçiş planlayın</li>
    </ol>
    
    <h3>Easytrade ile Dijital Dönüşüm</h3>
    <p>Easytrade, küçük işletmelerin dijital dönüşüm yolculuğunda güvenilir bir partner olarak:</p>
    
    <blockquote>
      <p>"Geleneksel kağıt-kalem yöntemiyle çalışan bir market olarak, Easytrade'e geçtikten sonra stok takibimiz %90 daha hızlandı ve satış raporlarımızı gerçek zamanlı olarak görebiliyoruz."</p>
      <cite>- Ahmet Bey, Market Sahibi</cite>
    </blockquote>
    
    <h3>Sonuç</h3>
    <p>Dijital dönüşüm, günümüzde işletmelerin sürdürülebilir büyüme sağlaması için kaçınılmaz bir süreçtir. Doğru strateji ve araçlarla bu dönüşümü başarıyla gerçekleştiren işletmeler, rekabet avantajı elde ederken, müşteri memnuniyetini de artırmaktadır.</p>
  `,
  featured_image: "/placeholder.svg?height=400&width=800",
  category: { id: 4, name: "Bulut Teknoloji", slug: "cloud", color: "#64748b" },
  author: {
    id: 1,
    name: "Ahmet Yılmaz",
    email: "ahmet@easytrade.com",
    avatar: "/placeholder.svg?height=80&width=80",
    bio: "10 yıllık deneyime sahip Dijital Dönüşüm Uzmanı. KOBİ'lerin teknoloji adaptasyonu konusunda danışmanlık veriyor.",
  },
  tags: [
    { id: 1, name: "Dijital Dönüşüm", slug: "dijital-donusum" },
    { id: 2, name: "KOBİ", slug: "kobi" },
    { id: 3, name: "Teknoloji", slug: "teknoloji" },
    { id: 4, name: "Strateji", slug: "strateji" },
  ],
  published_at: "2024-01-15T10:00:00Z",
  read_time: 8,
  views_count: 2300,
  likes_count: 45,
  comments_count: 12,
  is_featured: true,
  is_trending: true,
}

// Related posts
const relatedPosts = [
  {
    id: 2,
    title: "Barkod Sistemi ile Stok Yönetiminde %90 Zaman Tasarrufu",
    slug: "barkod-sistemi-stok-yonetimi",
    excerpt: "Manuel stok takibinden barkodlu sisteme geçen işletmelerin deneyimleri...",
    featured_image: "/placeholder.svg?height=200&width=300",
    category: { name: "Barkod Sistemi", color: "#64748b" },
    read_time: 6,
    published_at: "2024-01-12T10:00:00Z",
  },
  {
    id: 3,
    title: "Perakende Sektöründe Müşteri Deneyimi Optimizasyonu",
    slug: "perakende-musteri-deneyimi",
    excerpt: "Modern POS sistemleriyle müşteri memnuniyetini artırmanın yolları...",
    featured_image: "/placeholder.svg?height=200&width=300",
    category: { name: "Perakende", color: "#64748b" },
    read_time: 5,
    published_at: "2024-01-10T10:00:00Z",
  },
  {
    id: 4,
    title: "Bulut Tabanlı Muhasebe Sistemlerinin Avantajları",
    slug: "bulut-muhasebe-avantajlari",
    excerpt: "Geleneksel muhasebe yöntemlerinden bulut çözümlerine geçişin faydaları...",
    featured_image: "/placeholder.svg?height=200&width=300",
    category: { name: "Ön Muhasebe", color: "#64748b" },
    read_time: 7,
    published_at: "2024-01-08T10:00:00Z",
  },
]

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likesCount, setLikesCount] = useState(mockPost.likes_count)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
  }

  const handleShare = (platform: string) => {
    const url = window.location.href
    const title = mockPost.title

    switch (platform) {
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank")
        break
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, "_blank")
        break
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank")
        break
      case "copy":
        navigator.clipboard.writeText(url)
        break
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/blog" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm font-medium">Blog'a Dön</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 md:mb-8">
            <Link href="/blog" className="hover:text-foreground transition-colors">
              Blog
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/blog/category/${mockPost.category.slug}`} className="hover:text-foreground transition-colors">
              {mockPost.category.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground line-clamp-1">{mockPost.title}</span>
          </nav>

          {/* Article Header */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 md:mb-8"
          >
            {/* Category and Meta */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 md:mb-6">
              <Badge className="bg-muted text-foreground w-fit rounded-xl">{mockPost.category.name}</Badge>
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(mockPost.published_at).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {mockPost.read_time} dakika okuma
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {mockPost.views_count.toLocaleString()} görüntülenme
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 md:mb-6 leading-tight">
              {mockPost.title}
            </h1>

            {/* Excerpt */}
            <p className="text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 leading-relaxed">{mockPost.excerpt}</p>

            {/* Author and Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 pb-6 md:pb-8 border-b">
              <div className="flex items-center gap-3 md:gap-4">
                <Avatar className="h-10 w-10 md:h-12 md:w-12">
                  <AvatarImage src={mockPost.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {mockPost.author.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{mockPost.author.name}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{mockPost.author.bio}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLike}
                  className={`rounded-xl ${isLiked ? "text-red-500 border-red-500" : ""}`}
                >
                  <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                  {likesCount}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`rounded-xl ${isBookmarked ? "text-[hsl(135,100%,50%)] border-[hsl(135,100%,50%)]" : ""}`}
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl bg-transparent">
                  <Share2 className="h-4 w-4 mr-1" />
                  Paylaş
                </Button>
              </div>
            </div>
          </motion.article>

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 md:mb-12"
          >
            <img
              src={mockPost.featured_image || "/placeholder.svg"}
              alt={mockPost.title}
              className="w-full h-48 md:h-64 lg:h-96 object-cover rounded-2xl shadow-lg"
            />
          </motion.div>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="prose prose-lg max-w-none mb-8 md:mb-12"
            dangerouslySetInnerHTML={{ __html: mockPost.content }}
          />

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-8 md:mb-12"
          >
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold text-foreground">Etiketler</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {mockPost.tags.map((tag) => (
                <Badge key={tag.id} variant="outline" className="hover:bg-muted cursor-pointer rounded-full">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </motion.div>

          {/* Share Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-8 md:mb-12"
          >
            <Card className="rounded-2xl">
              <CardContent className="p-4 md:p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Bu yazıyı paylaş</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare("facebook")}
                    className="hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 rounded-xl"
                  >
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare("twitter")}
                    className="hover:bg-sky-50 hover:border-sky-500 hover:text-sky-600 rounded-xl"
                  >
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare("linkedin")}
                    className="hover:bg-blue-50 hover:border-blue-600 hover:text-blue-700 rounded-xl"
                  >
                    <Linkedin className="h-4 w-4 mr-2" />
                    LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleShare("copy")}
                    className="hover:bg-gray-50 hover:border-gray-500 hover:text-gray-600 rounded-xl"
                  >
                    <Link2 className="h-4 w-4 mr-2" />
                    Linki Kopyala
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Author Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mb-8 md:mb-12"
          >
            <Card className="rounded-2xl">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Avatar className="h-12 w-12 md:h-16 md:w-16 mx-auto sm:mx-0">
                    <AvatarImage src={mockPost.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {mockPost.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold text-foreground">Yazar Hakkında</h3>
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">{mockPost.author.name}</h4>
                    <p className="text-muted-foreground mb-4 text-sm md:text-base">{mockPost.author.bio}</p>
                    <Button size="sm" variant="outline" className="rounded-xl bg-transparent">
                      Tüm Yazılarını Gör
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Related Posts */}
          <ScrollReveal delay={0.1} direction="up">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <BookOpen className="h-5 w-5 text-[hsl(135,100%,50%)]" />
                <h3 className="text-xl md:text-2xl font-bold text-foreground">İlgili Yazılar</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {relatedPosts.map((post, index) => (
                  <ScrollReveal key={post.id} delay={index * 0.1} direction="up">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
                      whileHover={{ y: -4 }}
                      className="group"
                    >
                      <Link href={`/blog/${post.slug}`}>
                        <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 bg-card h-full rounded-2xl cursor-pointer">
                          <div className="relative overflow-hidden">
                            <img
                              src={post.featured_image || "/placeholder.svg"}
                              alt={post.title}
                              className="w-full h-32 md:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-3 left-3">
                              <Badge className="bg-muted/90 text-foreground text-xs rounded-xl backdrop-blur-sm">
                                {post.category.name}
                              </Badge>
                            </div>
                          </div>

                          <CardContent className="p-3 md:p-4">
                            <h4 className="font-semibold text-foreground line-clamp-2 mb-2 text-sm md:text-base">
                              {post.title}
                            </h4>
                            <p className="text-muted-foreground line-clamp-2 text-xs md:text-sm mb-3 md:mb-4">
                              {post.excerpt}
                            </p>

                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <div className="flex items-center gap-1 md:gap-2">
                                <Calendar className="h-3 w-3" />
                                {new Date(post.published_at).toLocaleDateString("tr-TR")}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {post.read_time} dk
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  </ScrollReveal>
                ))}
              </div>
            </motion.section>
          </ScrollReveal>

          {/* Newsletter CTA */}
          <ScrollReveal delay={0.3} direction="up">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              className="mt-12 md:mt-16"
            >
              <Card className="bg-gradient-to-r from-[hsl(135,100%,97%)] to-[hsl(135,100%,95%)] dark:from-[hsl(135,100%,8%)] dark:to-[hsl(135,100%,6%)] border-[hsl(135,100%,85%)] dark:border-[hsl(135,100%,15%)] rounded-2xl">
                <CardContent className="p-6 md:p-8 text-center">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                    Daha fazla içerik için abone olun!
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto text-sm md:text-base">
                    İşletmenizi büyütecek en güncel bilgileri ve Easytrade'den haberları e-posta adresinize gönderelim.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                    <input
                      type="email"
                      placeholder="E-posta adresiniz"
                      className="flex-1 px-4 py-2 rounded-xl border border-input bg-background text-foreground"
                    />
                    <Button className="bg-[hsl(135,100%,50%)] hover:bg-[hsl(135,100%,45%)] text-black whitespace-nowrap px-6 md:px-8 rounded-xl">
                      Abone Ol
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.section>
          </ScrollReveal>
        </div>
      </main>

      <Footer />
    </div>
  )
}
