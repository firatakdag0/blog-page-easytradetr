"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  BarChart3,
  TrendingUp,
  Eye,
  MessageSquare,
  Heart,
  FileText,
  Calendar,
  Clock,
  Star,
  ArrowUpRight,
  Activity,
  Target,
  Zap,
} from "lucide-react"
import Link from "next/link"

// Mock data
const dashboardStats = [
  {
    title: "Toplam Görüntülenme",
    value: "45,234",
    change: "+12.5%",
    changeType: "increase" as const,
    icon: Eye,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    title: "Toplam İçerik",
    value: "24",
    change: "+3",
    changeType: "increase" as const,
    icon: FileText,
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
  {
    title: "Toplam Yorum",
    value: "1,234",
    change: "+8.2%",
    changeType: "increase" as const,
    icon: MessageSquare,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    title: "Toplam Beğeni",
    value: "3,456",
    change: "+15.3%",
    changeType: "increase" as const,
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-900/20",
  },
]

const recentPosts = [
  {
    id: 1,
    title: "2024'te Küçük İşletmeler İçin Dijital Dönüşüm Stratejileri",
    status: "published",
    views: 2300,
    comments: 12,
    likes: 45,
    publishedAt: "2024-01-15",
    author: "Ahmet Yılmaz",
    isFeatured: true,
    isTrending: true,
  },
  {
    id: 2,
    title: "Barkod Sistemi ile Stok Yönetiminde %90 Zaman Tasarrufu",
    status: "published",
    views: 1900,
    comments: 8,
    likes: 38,
    publishedAt: "2024-01-12",
    author: "Zeynep Kaya",
    isFeatured: true,
    isTrending: false,
  },
  {
    id: 3,
    title: "Perakende Sektöründe Müşteri Deneyimi Optimizasyonu",
    status: "draft",
    views: 0,
    comments: 0,
    likes: 0,
    publishedAt: null,
    author: "Mehmet Demir",
    isFeatured: false,
    isTrending: false,
  },
]

const recentComments = [
  {
    id: 1,
    author: "Ayşe Özkan",
    content: "Çok faydalı bir yazı olmuş, teşekkürler!",
    postTitle: "Dijital Dönüşüm Stratejileri",
    createdAt: "2 saat önce",
    status: "approved",
  },
  {
    id: 2,
    author: "Mehmet Yıldız",
    content: "Bu konuda daha detaylı bilgi alabilir miyim?",
    postTitle: "Barkod Sistemi ile Stok Yönetimi",
    createdAt: "4 saat önce",
    status: "pending",
  },
  {
    id: 3,
    author: "Fatma Kaya",
    content: "Harika açıklamalar, işime çok yarayacak.",
    postTitle: "Müşteri Deneyimi Optimizasyonu",
    createdAt: "6 saat önce",
    status: "approved",
  },
]

const quickActions = [
  {
    title: "Yeni İçerik Oluştur",
    description: "Blog yazısı ekle",
    icon: FileText,
    href: "/admin/posts/new",
    color: "bg-blue-500",
  },
  {
    title: "Kategorileri Yönet",
    description: "Kategori düzenle",
    icon: Target,
    href: "/admin/categories",
    color: "bg-green-500",
  },
  {
    title: "Yorumları İncele",
    description: "Bekleyen yorumlar",
    icon: MessageSquare,
    href: "/admin/comments",
    color: "bg-purple-500",
  },
  {
    title: "Analitikleri Gör",
    description: "Detaylı raporlar",
    icon: BarChart3,
    href: "/admin/analytics",
    color: "bg-orange-500",
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Blog yönetim paneline hoş geldiniz. İşte güncel istatistikleriniz.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="h-4 w-4" />
          Son güncelleme: {new Date().toLocaleDateString("tr-TR")}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        <span
                          className={`text-sm font-medium ${
                            stat.changeType === "increase" ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {stat.change}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">bu ay</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-[hsl(135,100%,50%)]" />
              Hızlı İşlemler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Link key={index} href={action.href}>
                    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-[hsl(135,100%,50%)] hover:shadow-md transition-all duration-300 group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{action.title}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{action.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Posts */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Son İçerikler
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/posts">
                  Tümünü Gör
                  <ArrowUpRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPosts.map((post) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1">
                          {post.title}
                        </h3>
                        {post.isFeatured && (
                          <Badge variant="secondary" className="text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            Öne Çıkan
                          </Badge>
                        )}
                        {post.isTrending && (
                          <Badge className="bg-[hsl(135,100%,50%)] text-black text-xs">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Trend
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>{post.author}</span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {post.comments}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {post.likes}
                        </span>
                      </div>
                    </div>
                    <Badge variant={post.status === "published" ? "default" : "secondary"} className="ml-4">
                      {post.status === "published" ? "Yayında" : "Taslak"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Comments */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-500" />
                Son Yorumlar
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/comments">
                  Tümünü Gör
                  <ArrowUpRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentComments.map((comment) => (
                  <div key={comment.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {comment.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">{comment.author}</span>
                      </div>
                      <Badge variant={comment.status === "approved" ? "default" : "secondary"} className="text-xs">
                        {comment.status === "approved" ? "Onaylı" : "Bekliyor"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">{comment.content}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{comment.postTitle}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {comment.createdAt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              Son Aktiviteler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  action: "Yeni içerik yayınlandı",
                  item: "Dijital Dönüşüm Stratejileri",
                  time: "2 saat önce",
                  type: "post",
                },
                { action: "Yorum onaylandı", item: "Barkod Sistemi yazısında", time: "4 saat önce", type: "comment" },
                { action: "Kategori güncellendi", item: "Bulut Teknoloji", time: "6 saat önce", type: "category" },
                { action: "Yeni kullanıcı kaydı", item: "Ayşe Özkan", time: "8 saat önce", type: "user" },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "post"
                        ? "bg-blue-500"
                        : activity.type === "comment"
                          ? "bg-purple-500"
                          : activity.type === "category"
                            ? "bg-green-500"
                            : "bg-orange-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      <span className="font-medium">{activity.action}:</span> {activity.item}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
