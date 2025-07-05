"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Calendar,
  Clock,
  Search,
  TrendingUp,
  DollarSign,
  BarChart3,
  BookOpen,
  Users,
  Target,
  Zap,
  ArrowRight,
  Eye,
} from "lucide-react"
import Image from "next/image"

const categories = [
  { id: "all", name: "Tümü", icon: BookOpen, count: 24 },
  { id: "forex", name: "Forex", icon: DollarSign, count: 8 },
  { id: "crypto", name: "Kripto", icon: Zap, count: 6 },
  { id: "stocks", name: "Hisse Senetleri", icon: TrendingUp, count: 5 },
  { id: "analysis", name: "Teknik Analiz", icon: BarChart3, count: 3 },
  { id: "education", name: "Eğitim", icon: Users, count: 2 },
]

const featuredPosts = [
  {
    id: 1,
    title: "2024'te Forex Piyasasında Dikkat Edilmesi Gereken 5 Trend",
    excerpt:
      "Küresel ekonomik değişimler ve merkez bankası politikaları ışığında forex piyasasının 2024 yılındaki beklentileri...",
    category: "Forex",
    categoryColor: "bg-emerald-500",
    author: "Ahmet Yılmaz",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    publishDate: "15 Aralık 2024",
    readTime: "8 dk",
    image: "/placeholder.svg?height=300&width=500",
    views: "2.1K",
    featured: true,
  },
  {
    id: 2,
    title: "Bitcoin'in Yeni ATH Seviyesi: Piyasa Analizi ve Gelecek Beklentileri",
    excerpt:
      "Bitcoin'in son zamanlardaki yükseliş trendini analiz ediyor ve gelecek dönem için öngörülerimizi paylaşıyoruz...",
    category: "Kripto",
    categoryColor: "bg-orange-500",
    author: "Elif Kaya",
    authorAvatar: "/placeholder.svg?height=40&width=40",
    publishDate: "12 Aralık 2024",
    readTime: "6 dk",
    image: "/placeholder.svg?height=300&width=500",
    views: "1.8K",
    featured: true,
  },
]

const blogPosts = [
  {
    id: 3,
    title: "Yeni Başlayanlar İçin Risk Yönetimi Stratejileri",
    excerpt: "Trading'de başarılı olmak için risk yönetimi temel prensiplerini öğrenin...",
    category: "Eğitim",
    categoryColor: "bg-blue-500",
    author: "Mehmet Demir",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    publishDate: "10 Aralık 2024",
    readTime: "5 dk",
    image: "/placeholder.svg?height=200&width=350",
    views: "956",
  },
  {
    id: 4,
    title: "BIST 100'de Haftalık Teknik Analiz",
    excerpt: "Borsa İstanbul'da bu hafta dikkat çeken hisse senetleri ve teknik seviyeler...",
    category: "Teknik Analiz",
    categoryColor: "bg-purple-500",
    author: "Ayşe Özkan",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    publishDate: "8 Aralık 2024",
    readTime: "7 dk",
    image: "/placeholder.svg?height=200&width=350",
    views: "1.2K",
  },
  {
    id: 5,
    title: "Altın Fiyatlarında Son Durum ve Yatırım Fırsatları",
    excerpt: "Küresel belirsizlikler altın fiyatlarını nasıl etkiliyor? Uzman görüşleri...",
    category: "Forex",
    categoryColor: "bg-emerald-500",
    author: "Can Yıldız",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    publishDate: "5 Aralık 2024",
    readTime: "4 dk",
    image: "/placeholder.svg?height=200&width=350",
    views: "834",
  },
  {
    id: 6,
    title: "Ethereum 2.0 Güncellemesi: Yatırımcılar İçin Ne Anlama Geliyor?",
    excerpt: "Ethereum'un son güncellemeleri ve bu değişikliklerin piyasa üzerindeki etkileri...",
    category: "Kripto",
    categoryColor: "bg-orange-500",
    author: "Zeynep Arslan",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    publishDate: "3 Aralık 2024",
    readTime: "6 dk",
    image: "/placeholder.svg?height=200&width=350",
    views: "1.1K",
  },
  {
    id: 7,
    title: "Teknoloji Hisselerinde Yılsonu Değerlendirmesi",
    excerpt: "2024 yılında teknoloji sektörünün performansı ve 2025 beklentileri...",
    category: "Hisse Senetleri",
    categoryColor: "bg-indigo-500",
    author: "Oğuz Kılıç",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    publishDate: "1 Aralık 2024",
    readTime: "9 dk",
    image: "/placeholder.svg?height=200&width=350",
    views: "743",
  },
  {
    id: 8,
    title: "Psikolojik Destek ve Direnç Seviyeleri Nasıl Belirlenir?",
    excerpt: "Teknik analizde kritik öneme sahip destek ve direnç seviyelerini belirleme yöntemleri...",
    category: "Teknik Analiz",
    categoryColor: "bg-purple-500",
    author: "Fatma Şen",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    publishDate: "28 Kasım 2024",
    readTime: "8 dk",
    image: "/placeholder.svg?height=200&width=350",
    views: "892",
  },
]

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      selectedCategory === "all" ||
      post.category.toLowerCase().includes(selectedCategory) ||
      (selectedCategory === "crypto" && post.category === "Kripto") ||
      (selectedCategory === "stocks" && post.category === "Hisse Senetleri") ||
      (selectedCategory === "analysis" && post.category === "Teknik Analiz") ||
      (selectedCategory === "education" && post.category === "Eğitim")

    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">EasyTrade Blog</h1>
              <p className="text-slate-600 text-sm">Finansal piyasalar hakkında güncel haberler ve analizler</p>
            </div>
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 size-4" />
              <Input
                placeholder="Blog yazılarında ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Posts */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Target className="size-5 text-emerald-600" />
            <h2 className="text-2xl font-bold text-slate-900">Öne Çıkan Yazılar</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <Card
                key={post.id}
                className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={post.image || "/placeholder.svg"}
                    alt={post.title}
                    width={500}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={`${post.categoryColor} text-white border-0`}>{post.category}</Badge>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
                    <Eye className="size-3" />
                    {post.views}
                  </div>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 line-clamp-2">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-8">
                        <AvatarImage src={post.authorAvatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {post.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{post.author}</p>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Calendar className="size-3" />
                          {post.publishDate}
                          <Separator orientation="vertical" className="h-3" />
                          <Clock className="size-3" />
                          {post.readTime}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="group-hover:bg-emerald-50 group-hover:text-emerald-600"
                    >
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => {
              const Icon = category.icon
              const isActive = selectedCategory === category.id
              return (
                <Button
                  key={category.id}
                  variant={isActive ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 ${
                    isActive
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                  }`}
                >
                  <Icon className="size-4" />
                  {category.name}
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {category.count}
                  </Badge>
                </Button>
              )
            })}
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              {selectedCategory === "all" ? "Tüm Yazılar" : categories.find((c) => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-slate-600">{filteredPosts.length} yazı bulundu</p>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="size-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Yazı bulunamadı</h3>
              <p className="text-slate-600">Arama kriterlerinizi değiştirmeyi deneyin.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="group overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white"
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      width={350}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className={`${post.categoryColor} text-white border-0 text-xs`}>{post.category}</Badge>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                      <Eye className="size-3" />
                      {post.views}
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg group-hover:text-emerald-600 transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-slate-600 line-clamp-2 text-sm">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6">
                          <AvatarImage src={post.authorAvatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs">
                            {post.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs font-medium text-slate-900">{post.author}</p>
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Calendar className="size-3" />
                            {post.publishDate}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="size-3" />
                        {post.readTime}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Load More Button */}
        {filteredPosts.length > 0 && (
          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 bg-transparent"
            >
              Daha Fazla Yazı Yükle
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
