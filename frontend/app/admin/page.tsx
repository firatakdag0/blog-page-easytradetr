"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { apiClient, BlogPost, Category } from "@/lib/api"
import { getAdminPostsFromSupabase, getCategoriesFromSupabase, getCommentsFromSupabase } from '@/lib/api';
import Link from "next/link"
import { 
  FileText, 
  FolderOpen, 
  MessageSquare, 
  Image, 
  Plus, 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  Calendar,
  Clock,
  BarChart3,
  Activity,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Zap,
  Target,
  Award,
  RefreshCw
} from "lucide-react"

export default function AdminDashboard() {
  const [postCount, setPostCount] = useState(0)
  const [categoryCount, setCategoryCount] = useState(0)
  const [commentCount, setCommentCount] = useState(0)
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    publishedPosts: 0,
    draftPosts: 0,
    featuredPosts: 0,
    trendingPosts: 0
  })

  // fetchData fonksiyonunu useEffect dışına çıkar
  const fetchData = async () => {
    setLoading(true)
    try {
      // Posts
      const postsApiRes = await getAdminPostsFromSupabase({ per_page: 50 })
      const postsRes = postsApiRes.data
      const postsPagination = postsApiRes.pagination
      setRecentPosts(postsRes.slice(0, 5))
      setPostCount(postsPagination?.all_total || postsRes.length)
      // Categories
      const categoriesRes = await getCategoriesFromSupabase()
      setCategoryCount(categoriesRes.length)
      // Comments
      const commentsRes = await getCommentsFromSupabase()
      setCommentCount(commentsRes.data ? commentsRes.data.length : 0)
      // İstatistikleri hesapla
      const publishedPosts = postsRes.filter(p => p.status === "published").length
      const draftPosts = postsRes.filter(p => p.status === "draft").length
      const featuredPosts = postsRes.filter(p => p.is_featured).length
      const trendingPosts = postsRes.filter(p => p.is_trending).length
      const totalViews = postsRes.reduce((sum, p) => sum + p.views_count, 0)
      const totalLikes = postsRes.reduce((sum, p) => sum + p.likes_count, 0)
      const totalComments = postsRes.reduce((sum, p) => sum + p.comments_count, 0)
      setStats({
        totalViews,
        totalLikes,
        totalComments,
        publishedPosts,
        draftPosts,
        featuredPosts,
        trendingPosts
      })
    } catch (err) {
      console.error("Dashboard data fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  // useEffect ile ilk yüklemede ve pencere odağı değiştiğinde verileri çek
  useEffect(() => {
    fetchData()
    const onFocus = () => {
      if (localStorage.getItem('dashboardNeedsRefresh')) {
        fetchData()
        localStorage.removeItem('dashboardNeedsRefresh')
      }
    }
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onFocus)
    return () => {
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onFocus)
    }
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Yayında</Badge>
      case "draft":
        return <Badge variant="secondary">Taslak</Badge>
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Zamanlanmış</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    trend, 
    trendValue, 
    link 
  }: {
    title: string
    value: string | number
    icon: any
    color: string
    trend?: "up" | "down"
    trendValue?: string
    link?: string
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</p>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                {trend && (
                  <div className={`flex items-center gap-1 text-sm ${
                    trend === "up" ? "text-green-600" : "text-red-600"
                  }`}>
                    {trend === "up" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                    {trendValue}
                  </div>
                )}
              </div>
            </div>
            <div className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
          {link && (
            <Link href={link} className="block mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
              Detayları gör →
            </Link>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-2"
          >
            Anasayfa
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-600 dark:text-gray-400"
          >
            Blog yönetim panelinize hoş geldiniz. İçeriklerinizi ve istatistiklerinizi buradan takip edin.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Yenile
          </Button>
          <Button className="bg-[hsl(135,100%,50%)] hover:bg-[hsl(135,100%,45%)] text-black ml-3" asChild>
            <Link href="/admin/posts/new">
              <Plus className="h-4 w-4 mr-2" />
              Yeni İçerik
            </Link>
          </Button>
        </motion.div>
      </div>

      {/* Ana İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Toplam İçerik"
          value={loading ? "..." : postCount}
          icon={FileText}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
          trend="up"
          trendValue="12%"
          link="/admin/posts"
        />
        <StatCard
          title="Toplam Görüntülenme"
          value={loading ? "..." : stats.totalViews.toLocaleString()}
          icon={Eye}
          color="bg-gradient-to-br from-purple-500 to-purple-600"
          trend="up"
          trendValue="8%"
        />
        <StatCard
          title="Toplam Beğeni"
          value={loading ? "..." : stats.totalLikes.toLocaleString()}
          icon={Heart}
          color="bg-gradient-to-br from-red-500 to-red-600"
          trend="up"
          trendValue="15%"
        />
        <StatCard
          title="Toplam Yorum"
          value={loading ? "..." : commentCount}
          icon={MessageSquare}
          color="bg-gradient-to-br from-orange-500 to-orange-600"
          trend="up"
          trendValue="5%"
          link="/admin/comments"
        />
      </div>

      {/* İkinci Satır İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Yayında"
          value={loading ? "..." : stats.publishedPosts}
          icon={CheckCircle}
          color="bg-gradient-to-br from-green-500 to-green-600"
        />
        <StatCard
          title="Taslak"
          value={loading ? "..." : stats.draftPosts}
          icon={Clock}
          color="bg-gradient-to-br from-gray-500 to-gray-600"
        />
        <StatCard
          title="Öne Çıkan"
          value={loading ? "..." : stats.featuredPosts}
          icon={Star}
          color="bg-gradient-to-br from-yellow-500 to-yellow-600"
        />
        <StatCard
          title="Trend"
          value={loading ? "..." : stats.trendingPosts}
          icon={TrendingUp}
          color="bg-gradient-to-br from-[hsl(135,100%,50%)] to-[hsl(135,100%,45%)]"
        />
      </div>

      {/* Ana İçerik Alanı */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Son İçerikler */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Son İçerikler
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    En son eklenen blog yazıları
                  </p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href="/admin/posts">
                    Tümünü Gör
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : recentPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Henüz içerik eklenmemiş</p>
                    <Button asChild className="mt-4" size="sm">
                      <Link href="/admin/posts/new">
                        <Plus className="h-4 w-4 mr-2" />
                        İlk İçeriğinizi Oluşturun
                      </Link>
                    </Button>
                  </div>
                ) : (
                  recentPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                            {post.title}
                          </h3>
                          {post.is_featured && (
                            <Star className="h-4 w-4 text-yellow-500" />
                          )}
                          {post.is_trending && (
                            <TrendingUp className="h-4 w-4 text-[hsl(135,100%,50%)]" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Avatar className="h-4 w-4">
                              <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">
                                {(post.author?.name || "").split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            {post.author.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.created_at).toLocaleDateString("tr-TR")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.views_count}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(post.status)}
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/admin/posts/${post.id}/edit`}>
                            Düzenle
                          </Link>
                        </Button>
                      </div>
                    </motion.div>
                  ))
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Hızlı Eylemler ve İstatistikler */}
        <div className="space-y-6">
          {/* Hızlı Eylemler */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Hızlı Eylemler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/admin/posts/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Yeni İçerik Oluştur
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/admin/categories">
                    <FolderOpen className="h-4 w-4 mr-2" />
                    Kategorileri Yönet
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/admin/media">
                    <Image className="h-4 w-4 mr-2" />
                    Medya Yönetimi
                  </Link>
                </Button>
                <Button asChild className="w-full justify-start" variant="outline">
                  <Link href="/admin/comments">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Yorumları Görüntüle
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Performans Özeti */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  Performans Özeti
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Yayın Oranı</span>
                    <span className="text-sm text-gray-600">
                      {postCount > 0 ? Math.round((stats.publishedPosts / postCount) * 100) : 0}%
                    </span>
                  </div>
                  <Progress 
                    value={postCount > 0 ? (stats.publishedPosts / postCount) * 100 : 0} 
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Etkileşim Oranı</span>
                    <span className="text-sm text-gray-600">
                      {stats.totalViews > 0 ? Math.round((stats.totalLikes / stats.totalViews) * 100) : 0}%
                    </span>
                  </div>
                  <Progress 
                    value={stats.totalViews > 0 ? (stats.totalLikes / stats.totalViews) * 100 : 0} 
                    className="h-2"
                  />
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Ortalama Görüntülenme</span>
                    <span className="font-medium">
                      {postCount > 0 ? Math.round(stats.totalViews / postCount) : 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sistem Durumu */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Sistem Durumu
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Durumu</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Aktif
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Veritabanı</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Bağlı
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Medya Depolama</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Hazır
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
