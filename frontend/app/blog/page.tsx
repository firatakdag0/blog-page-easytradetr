"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useInView, useAnimation } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ModernHeader } from "@/components/ui/modern-header"
import { Footer } from "@/components/ui/footer"
import { Pagination } from "@/components/ui/pagination"
import { FilterTabs } from "@/components/ui/filter-tabs"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { apiClient, getResponsiveImageUrl } from "@/lib/api"
import type { BlogPost, Category } from "@/lib/api"
import {
  BookOpen,
  Calendar,
  Clock,
  Eye,
  MessageCircle,
  Share2,
  Bookmark,
  ArrowRight,
  TrendingUp,
  Loader2,
  Target,
} from "lucide-react"
import Link from "next/link"

const POSTS_PER_PAGE = 12

// Professional Counter Component with smooth animations
const ProfessionalCounter = ({
  value,
  label,
  delay = 0,
}: {
  value: string
  label: string
  delay?: number
}) => {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const controls = useAnimation()

  const numericValue = Number.parseInt(value.replace(/\D/g, "")) || 0
  const hasPlus = value.includes("+")
  const hasPercent = value.includes("%")
  const isSpecial = value.includes("/")

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true)

      // Card animation
      controls.start({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.6,
          delay: delay,
          ease: [0.25, 0.46, 0.45, 0.94],
        },
      })

      // Counter animation
      if (!isSpecial && numericValue > 0) {
        const startTime = Date.now()
        const duration = 2000 // 2 seconds

        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)

          // Easing function for smooth animation
          const easeOutQuart = 1 - Math.pow(1 - progress, 4)
          const currentValue = Math.floor(easeOutQuart * numericValue)

          setCount(currentValue)

          if (progress < 1) {
            requestAnimationFrame(animate)
          }
        }

        setTimeout(
          () => {
            requestAnimationFrame(animate)
          },
          (delay + 0.3) * 1000,
        )
      }
    }
  }, [isInView, hasAnimated, numericValue, delay, controls, isSpecial])

  const displayValue = isSpecial ? value : hasPlus ? `${count}+` : hasPercent ? `${count}%` : count

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 60, scale: 0.8 }} animate={controls} className="relative group">
      <motion.div
        className="relative p-6 rounded-3xl bg-gradient-to-br from-white/80 to-white/40 dark:from-gray-900/80 dark:to-gray-800/40 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 shadow-xl hover:shadow-2xl transition-all duration-500"
        whileHover={{
          scale: 1.05,
          y: -8,
          transition: { duration: 0.3, ease: "easeOut" },
        }}
      >
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[hsl(135,100%,50%)] via-blue-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl" />

        {/* Content */}
        <div className="relative z-10 text-center">
          <motion.div
            className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[hsl(135,100%,50%)] to-blue-600 bg-clip-text text-transparent mb-2"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
          >
            {displayValue}
          </motion.div>

          <motion.div
            className="text-sm md:text-base font-medium text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: delay + 0.4 }}
          >
            {label}
          </motion.div>
        </div>

        {/* Floating particles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[hsl(135,100%,50%)] rounded-full opacity-60"
            style={{
              left: `${20 + i * 30}%`,
              top: `${20 + i * 20}%`,
            }}
            animate={{
              y: [-10, -20, -10],
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  )
}

// Professional Hero Text Animation
const ProfessionalHeroText = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const words = ["Geleceğe", "Dijitale", "Başarıya", "Zirveye"]
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const interval = setInterval(() => {
        setCurrentWordIndex((prev) => (prev + 1) % words.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isInView, words.length])

  return (
    <motion.h1
      ref={ref}
      className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.span
        initial={{ opacity: 0, x: -30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        İşletmenizi{" "}
      </motion.span>

      <div className="relative inline-block">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentWordIndex}
            className="relative inline-block"
            initial={{ opacity: 0, y: 50, rotateX: -90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -50, rotateX: 90 }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <span className="bg-gradient-to-r from-[hsl(135,100%,50%)] via-blue-500 to-purple-600 bg-clip-text text-transparent relative">
              {words[currentWordIndex]}
            </span>

            {/* Animated underline */}
            <motion.div
              className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-[hsl(135,100%,50%)] to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </motion.span>
        </AnimatePresence>
      </div>

      <motion.span
        initial={{ opacity: 0, x: 30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {" "}
        Taşıyın
      </motion.span>

      {/* Floating elements */}
      <div className="absolute -top-4 -right-4 w-8 h-8">
        <motion.div
          className="w-full h-full bg-gradient-to-r from-[hsl(135,100%,50%)] to-blue-500 rounded-full opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>
    </motion.h1>
  )
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set())

  const toggleSavedPost = (postId: number) => {
    const newSavedPosts = new Set(savedPosts)
    if (newSavedPosts.has(postId)) {
      newSavedPosts.delete(postId)
    } else {
      newSavedPosts.add(postId)
    }
    setSavedPosts(newSavedPosts)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch categories
        const categoriesRes = await apiClient.getCategories()
        setCategories(categoriesRes)

        // Fetch posts with pagination
        const postsRes = await apiClient.getPosts({
          page: currentPage,
          per_page: POSTS_PER_PAGE,
          category: selectedCategory || undefined,
          search: searchQuery,
        })
        
        // API'den gelen veri yapısını doğru şekilde işle
        // postsRes artık PaginatedResponse<BlogPost> tipinde
        const postsArray = postsRes.data;
        
        setPosts(postsArray)
      } catch (err) {
        setError("Blog yazıları yüklenirken bir hata oluştu.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [currentPage, selectedCategory, searchQuery, activeFilter])

  // Otomatik polling ile veri yenileme
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    let isTabActive = true;

    const handleVisibility = () => {
      isTabActive = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    if (!searchQuery) {
      interval = setInterval(() => {
        if (isTabActive) {
          // Sadece arama yoksa ve tab aktifse veri çek
          // fetchData fonksiyonunu tekrar tanımla
          (async () => {
            try {
              setLoading(true)
              setError(null)
              // Fetch categories
              const categoriesRes = await apiClient.getCategories()
              setCategories(categoriesRes)
              // Fetch posts with pagination
              const postsRes = await apiClient.getPosts({
                page: currentPage,
                per_page: POSTS_PER_PAGE,
                category: selectedCategory || undefined,
                search: searchQuery,
              })
              const postsArray = postsRes.data;
              setPosts(postsArray)
            } catch (err) {
              setError("Blog yazıları yüklenirken bir hata oluştu.")
              console.error(err)
            } finally {
              setLoading(false)
            }
          })();
        }
      }, 20000) // 20 saniye
    }
    return () => {
      if (interval) clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [currentPage, selectedCategory, searchQuery, activeFilter])

  const getFilteredPosts = () => {
    let filtered = posts.filter((post) => {
      const matchesCategory = !selectedCategory || post.category.slug === selectedCategory
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) => tag.name.toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesCategory && matchesSearch
    })

    // Apply filter
    switch (activeFilter) {
      case "saved":
        filtered = filtered.filter((post) => savedPosts.has(post.id))
        break
      case "trending":
        filtered = filtered.filter((post) => post.is_trending)
        break
      case "recent":
        filtered = filtered.sort((a, b) => {
          const dateA = a.published_at ? new Date(a.published_at).getTime() : 0
          const dateB = b.published_at ? new Date(b.published_at).getTime() : 0
          return dateB - dateA
        })
        break
      case "featured":
        filtered = filtered.filter((post) => post.is_featured)
        break
    }

    return filtered
  }

  const filteredPosts = getFilteredPosts()
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE)

  const featuredPosts = paginatedPosts.filter((post) => post.is_featured)
  const regularPosts = paginatedPosts.filter((post) => !post.is_featured)

  const filterCounts = {
    all: posts.length,
    saved: savedPosts.size,
    trending: posts.filter((p) => p.is_trending).length,
    recent: posts.length,
    featured: posts.filter((p) => p.is_featured).length,
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Yazıların başına scroll et
    const postsSection = document.querySelector("[data-posts-section]")
    if (postsSection) {
      postsSection.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300" style={{ scrollBehavior: "smooth" }}>
      {/* Modern Header */}
      <ModernHeader
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={(category) => {
          setSelectedCategory(category)
          setCurrentPage(1)
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="pt-20">
        {" "}
        {/* pt-16'dan pt-20'ye çıkardık */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {" "}
          {/* py-8'den py-4'e düşürdük */}
          {/* Professional Hero Section - Daha kompakt */}
          <section className="text-center py-6 md:py-8 mb-8 relative overflow-hidden">
            {" "}
            {/* py-12 md:py-16 mb-12'den py-6 md:py-8 mb-8'e */}
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[hsl(135,100%,98%)] via-blue-50/30 to-purple-50/20 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-700/20 rounded-3xl" />
            {/* Animated background elements */}
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-32 h-32 bg-gradient-to-r from-[hsl(135,100%,50%)] to-blue-500 rounded-full opacity-5"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    x: [0, 30, 0],
                    y: [0, -30, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 8 + i * 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
            <div className="relative z-10">
              <ProfessionalHeroText />

              <motion.p
                className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto mb-8 leading-relaxed" /* text-xl md:text-2xl'den text-lg md:text-xl'e, mb-12'den mb-8'e */
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
              >
                Ön muhasebe, barkod sistemleri ve modern satış çözümleri hakkında{" "}
                <span className="text-[hsl(135,100%,50%)] font-semibold">uzman görüşleri</span>, pratik rehberler ve
                ilham verici başarı hikayeleri.
              </motion.p>

              {/* Professional Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                {" "}
                {/* gap-6'dan gap-4'e */}
                {[
                  { value: "500+", label: "Mutlu Müşteri" },
                  { value: "50+", label: "Blog Yazısı" },
                  { value: "24/7", label: "Destek" },
                  { value: "99%", label: "Uptime" },
                ].map((stat, index) => (
                  <ProfessionalCounter key={index} value={stat.value} label={stat.label} delay={index * 0.1} />
                ))}
              </div>
            </div>
          </section>
          {/* Filter Tabs */}
          <ScrollReveal delay={0.2}>
            <FilterTabs
              activeFilter={activeFilter}
              onFilterChange={(filter) => {
                setActiveFilter(filter)
                setCurrentPage(1)
              }}
              counts={filterCounts}
            />
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <div className="flex items-center gap-4 mb-6">
              <h3 className="text-xl font-bold text-foreground">
                {!selectedCategory ? "Tüm Yazılar" : categories.find((c) => c.slug === selectedCategory)?.name}
              </h3>
              <span className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                {filteredPosts.length} yazı
              </span>
            </div>
          </ScrollReveal>
          {/* Featured Posts - 2 büyük kart */}
          {!selectedCategory && activeFilter === "all" && featuredPosts.length > 0 && (
            <ScrollReveal delay={0.4}>
              <section className="mb-6">
                <div className="flex items-center gap-2 mb-6">
                  <Target className="h-6 w-6 text-[hsl(135,100%,50%)]" />
                  <h3 className="text-2xl font-bold text-foreground">Öne Çıkan Yazılar</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {featuredPosts.map((post, index) => (
                    <ScrollReveal key={post.id} delay={index * 0.1} direction="up">
                      <Link href={`/blog/${post.slug}`}>
                        <Card className="overflow-hidden border-0 shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 bg-card rounded-3xl h-full flex flex-col group cursor-pointer">
                          <div className="relative overflow-hidden">
                            <img
                              src={getResponsiveImageUrl({ url: post.featured_image || "/placeholder.svg" } as any, 400)}
                              alt={post.title}
                              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                            <div className="absolute top-6 left-6 flex gap-3">
                              <Badge className="bg-white/90 text-foreground border-0 rounded-2xl px-4 py-2 font-semibold backdrop-blur-sm">
                                Öne Çıkan
                              </Badge>
                              {post.is_trending && (
                                <Badge className="bg-[hsl(135,100%,50%)] text-black rounded-2xl px-4 py-2 font-semibold">
                                  <TrendingUp className="h-4 w-4 mr-2" />
                                  Trend
                                </Badge>
                              )}
                            </div>
                            <div className="absolute top-6 right-6">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault()
                                  toggleSavedPost(post.id)
                                }}
                                className={`h-10 w-10 p-0 bg-white/90 hover:bg-white rounded-2xl transition-all duration-200 ${
                                  savedPosts.has(post.id) ? "text-[hsl(135,100%,50%)]" : ""
                                }`}
                              >
                                <Bookmark className={`h-5 w-5 ${savedPosts.has(post.id) ? "fill-current" : ""}`} />
                              </Button>
                            </div>
                            <div className="absolute bottom-6 right-6 bg-black/80 text-white px-4 py-2 rounded-2xl text-sm flex items-center gap-2 font-medium">
                              <Eye className="h-4 w-4" />
                              {post.views_count.toLocaleString()}
                            </div>
                          </div>

                          <CardHeader className="p-8 pb-4 flex-1">
                            <div className="flex flex-wrap gap-2 mb-4">
                              {post.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag.id} variant="outline" className="text-sm rounded-full px-3 py-1">
                                  {tag.name}
                                </Badge>
                              ))}
                            </div>
                            <CardTitle className="text-2xl transition-colors line-clamp-2 mb-4 leading-tight">
                              {post.title}
                            </CardTitle>
                            <p className="text-muted-foreground line-clamp-3 text-lg leading-relaxed">{post.excerpt}</p>
                          </CardHeader>

                          <CardContent className="p-8 pt-0">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                  <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                                  <AvatarFallback>
                                    {post.author.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-lg font-semibold text-foreground">{post.author.name}</p>
                                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    {post.published_at && new Date(post.published_at).toLocaleDateString("tr-TR")}
                                    <span>•</span>
                                    <Clock className="h-4 w-4" />
                                    {post.read_time} dk
                                  </div>
                                </div>
                              </div>
                              <Button
                                size="lg"
                                className="bg-[hsl(135,100%,50%)] hover:bg-[hsl(135,100%,45%)] text-black rounded-2xl px-8 py-3 font-semibold"
                              >
                                Oku
                                <ArrowRight className="h-5 w-5 ml-2" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </ScrollReveal>
                  ))}
                </div>
              </section>
            </ScrollReveal>
          )}
          {/* Regular Posts - 3 küçük kart per row */}
          <ScrollReveal delay={0.6}>
            <section data-posts-section>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[hsl(135,100%,50%)]" />
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <BookOpen className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-foreground mb-4">Yazı bulunamadı</h3>
                  <p className="text-lg text-muted-foreground mb-6">{error}</p>
                  <Button
                    onClick={() => {
                      setSelectedCategory("")
                      setActiveFilter("all")
                      setSearchQuery("")
                    }}
                    variant="outline"
                    className="rounded-2xl px-8 py-3"
                    size="lg"
                  >
                    Tüm Yazıları Görüntüle
                  </Button>
                </div>
              ) : regularPosts.length === 0 && paginatedPosts.length === 0 ? (
                <div className="text-center py-16">
                  <BookOpen className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-foreground mb-4">Yazı bulunamadı</h3>
                  <p className="text-lg text-muted-foreground mb-6">Arama kriterlerinizi değiştirmeyi deneyin.</p>
                  <Button
                    onClick={() => {
                      setSelectedCategory("")
                      setActiveFilter("all")
                      setSearchQuery("")
                    }}
                    variant="outline"
                    className="rounded-2xl px-8 py-3"
                    size="lg"
                  >
                    Tüm Yazıları Görüntüle
                  </Button>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${currentPage}-${activeFilter}-${selectedCategory}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {(featuredPosts.length === 0 ? paginatedPosts : regularPosts).map((post, index) => (
                      <ScrollReveal key={post.id} delay={index * 0.05} direction="up">
                        <Link href={`/blog/${post.slug}`}>
                          <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-500 bg-card rounded-2xl h-full flex flex-col group cursor-pointer">
                            <div className="relative overflow-hidden">
                              <img
                                src={getResponsiveImageUrl({ url: post.featured_image || "/placeholder.svg" } as any, 300)}
                                alt={post.title}
                                className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                              <div className="absolute top-3 left-3">
                                <Badge className="bg-white/90 text-foreground border-0 rounded-xl px-3 py-1 text-xs font-medium backdrop-blur-sm">
                                  {post.category.name}
                                </Badge>
                              </div>
                              <div className="absolute top-3 right-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    toggleSavedPost(post.id)
                                  }}
                                  className={`h-8 w-8 p-0 bg-white/90 hover:bg-white rounded-xl transition-all duration-200 ${
                                    savedPosts.has(post.id) ? "text-[hsl(135,100%,50%)]" : ""
                                  }`}
                                >
                                  <Bookmark className={`h-4 w-4 ${savedPosts.has(post.id) ? "fill-current" : ""}`} />
                                </Button>
                              </div>
                              {post.is_trending && (
                                <div className="absolute bottom-3 left-3">
                                  <Badge className="bg-[hsl(135,100%,50%)] text-black rounded-xl px-2 py-1 text-xs font-medium">
                                    <TrendingUp className="h-3 w-3 mr-1" />
                                    Trend
                                  </Badge>
                                </div>
                              )}
                            </div>

                            <CardHeader className="p-5 pb-3 flex-1">
                              <div className="flex flex-wrap gap-1 mb-3">
                                {post.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag.id} variant="outline" className="text-xs rounded-full px-2 py-1">
                                    {tag.name}
                                  </Badge>
                                ))}
                              </div>
                              <CardTitle className="text-lg transition-colors line-clamp-2 mb-3 leading-tight">
                                {post.title}
                              </CardTitle>
                              <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                                {post.excerpt}
                              </p>
                            </CardHeader>

                            <CardContent className="p-5 pt-0">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-7 w-7">
                                    <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                                    <AvatarFallback className="text-xs">
                                      {post.author.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-semibold text-foreground">{post.author.name}</p>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                      <Calendar className="h-3 w-3" />
                                      {post.published_at && new Date(post.published_at).toLocaleDateString("tr-TR")}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {post.read_time} dk
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-3 border-t">
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Eye className="h-3 w-3" />
                                    {post.views_count.toLocaleString()}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MessageCircle className="h-3 w-3" />
                                    {post.comments_count}
                                  </span>
                                </div>
                                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs rounded-xl">
                                  <Share2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </ScrollReveal>
                    ))}
                  </motion.div>
                </AnimatePresence>
              )}
            </section>
          </ScrollReveal>
          {/* Pagination */}
          {totalPages > 1 && (
            <ScrollReveal delay={0.8}>
              <div className="mt-12">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              </div>
            </ScrollReveal>
          )}
          {/* Newsletter */}
          <ScrollReveal delay={1.0}>
            <section className="mt-16">
              <Card className="bg-gradient-to-r from-[hsl(135,100%,97%)] to-[hsl(135,100%,95%)] dark:from-[hsl(135,100%,8%)] dark:to-[hsl(135,100%,6%)] border-[hsl(135,100%,85%)] dark:border-[hsl(135,100%,15%)] rounded-3xl">
                <CardContent className="p-8 md:p-12 text-center">
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                    Blog güncellemelerini kaçırmayın!
                  </h3>
                  <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                    İşletmenizi büyütecek en güncel bilgileri ve Easytrade'den haberları e-posta adresinize gönderelim.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto items-center justify-center">
                    <input
                      type="email"
                      placeholder="E-posta adresiniz"
                      className="flex-1 px-6 py-4 rounded-2xl border border-input bg-background text-foreground text-lg focus:outline-none focus:ring-2 focus:ring-[hsl(135,100%,50%)] focus:border-transparent transition-all duration-200"
                    />
                    <Button className="bg-[hsl(135,100%,50%)] hover:bg-[hsl(135,100%,45%)] text-black whitespace-nowrap px-8 py-4 text-lg font-semibold rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl">
                      Abone Ol
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </ScrollReveal>
        </div>
      </main>

      <Footer />
    </div>
  )
}
