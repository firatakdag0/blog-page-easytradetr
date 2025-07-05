"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Users,
  Clock,
  Heart,
  MessageSquare,
  Share2,
  Download,
  Globe,
  Smartphone,
  Monitor,
  Target,
  Activity,
} from "lucide-react"

// Mock analytics data
const analyticsData = {
  overview: {
    totalViews: 125430,
    uniqueVisitors: 45230,
    avgSessionDuration: "3:45",
    bounceRate: 32.5,
    totalPosts: 24,
    totalComments: 892,
    totalLikes: 3421,
    conversionRate: 4.2,
  },
  trends: {
    views: { current: 125430, previous: 98230, change: 27.7 },
    visitors: { current: 45230, previous: 38920, change: 16.2 },
    engagement: { current: 4.2, previous: 3.8, change: 10.5 },
    comments: { current: 892, previous: 756, change: 18.0 },
  },
  topPosts: [
    {
      id: 1,
      title: "2024'te Küçük İşletmeler İçin Dijital Dönüşüm Stratejileri",
      views: 15420,
      likes: 234,
      comments: 45,
      shares: 89,
      conversionRate: 5.2,
      category: "Bulut Teknoloji",
    },
    {
      id: 2,
      title: "Barkod Sistemi ile Stok Yönetiminde %90 Zaman Tasarrufu",
      views: 12890,
      likes: 198,
      comments: 32,
      shares: 67,
      conversionRate: 4.8,
      category: "Barkod Sistemi",
    },
    {
      id: 3,
      title: "Perakende Sektöründe Müşteri Deneyimi Optimizasyonu",
      views: 9870,
      likes: 156,
      comments: 28,
      shares: 45,
      conversionRate: 3.9,
      category: "Perakende",
    },
  ],
  deviceStats: {
    desktop: 45.2,
    mobile: 38.7,
    tablet: 16.1,
  },
  trafficSources: {
    organic: 42.3,
    direct: 28.9,
    social: 18.4,
    referral: 10.4,
  },
  categoryPerformance: [
    { name: "Bulut Teknoloji", posts: 8, views: 45230, engagement: 4.8 },
    { name: "Barkod Sistemi", posts: 6, views: 32140, engagement: 4.2 },
    { name: "Perakende", posts: 5, views: 28950, engagement: 3.9 },
    { name: "Ön Muhasebe", posts: 3, views: 19110, engagement: 3.6 },
    { name: "Satış Noktası", posts: 2, views: 12450, engagement: 3.2 },
  ],
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [timeRange])

  const getTrendIcon = (change: number) => {
    return change > 0 ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    )
  }

  const getTrendColor = (change: number) => {
    return change > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-48 animate-pulse"></div>
          <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analitik Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Blog performansınızı detaylı olarak inceleyin ve optimize edin.
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Son 7 Gün</SelectItem>
              <SelectItem value="30d">Son 30 Gün</SelectItem>
              <SelectItem value="90d">Son 90 Gün</SelectItem>
              <SelectItem value="1y">Son 1 Yıl</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Rapor İndir
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Toplam Görüntülenme",
            value: analyticsData.overview.totalViews.toLocaleString(),
            change: analyticsData.trends.views.change,
            icon: Eye,
            color: "text-blue-500",
            bgColor: "bg-blue-50 dark:bg-blue-900/20",
          },
          {
            title: "Benzersiz Ziyaretçi",
            value: analyticsData.overview.uniqueVisitors.toLocaleString(),
            change: analyticsData.trends.visitors.change,
            icon: Users,
            color: "text-green-500",
            bgColor: "bg-green-50 dark:bg-green-900/20",
          },
          {
            title: "Ortalama Oturum",
            value: analyticsData.overview.avgSessionDuration,
            change: 12.3,
            icon: Clock,
            color: "text-purple-500",
            bgColor: "bg-purple-50 dark:bg-purple-900/20",
          },
          {
            title: "Etkileşim Oranı",
            value: `${analyticsData.overview.conversionRate}%`,
            change: analyticsData.trends.engagement.change,
            icon: Target,
            color: "text-orange-500",
            bgColor: "bg-orange-50 dark:bg-orange-900/20",
          },
        ].map((stat, index) => {
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
                        {getTrendIcon(stat.change)}
                        <span className={`text-sm font-medium ml-1 ${getTrendColor(stat.change)}`}>
                          {stat.change > 0 ? "+" : ""}
                          {stat.change}%
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Stats */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-blue-500" />
                Cihaz Dağılımı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Masaüstü", value: analyticsData.deviceStats.desktop, icon: Monitor, color: "bg-blue-500" },
                  { name: "Mobil", value: analyticsData.deviceStats.mobile, icon: Smartphone, color: "bg-green-500" },
                  { name: "Tablet", value: analyticsData.deviceStats.tablet, icon: Monitor, color: "bg-purple-500" },
                ].map((device, index) => {
                  const Icon = device.icon
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${device.color} text-white`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{device.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-24">
                          <Progress value={device.value} className="h-2" />
                        </div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12">
                          {device.value}%
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Traffic Sources */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-500" />
                Trafik Kaynakları
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Organik Arama", value: analyticsData.trafficSources.organic, color: "bg-green-500" },
                  { name: "Doğrudan", value: analyticsData.trafficSources.direct, color: "bg-blue-500" },
                  { name: "Sosyal Medya", value: analyticsData.trafficSources.social, color: "bg-purple-500" },
                  { name: "Referans", value: analyticsData.trafficSources.referral, color: "bg-orange-500" },
                ].map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${source.color}`}></div>
                      <span className="font-medium text-gray-900 dark:text-white">{source.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24">
                        <Progress value={source.value} className="h-2" />
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12">{source.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Performing Posts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              En Performanslı İçerikler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">İçerik</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Görüntülenme</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Etkileşim</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Dönüşüm</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.topPosts.map((post, index) => (
                    <tr
                      key={post.id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="py-4 px-4">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1 mb-1">{post.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {post.category}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-blue-500" />
                          <span className="font-medium">{post.views.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4 text-red-500" />
                            <span>{post.likes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4 text-blue-500" />
                            <span>{post.comments}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Share2 className="w-4 h-4 text-green-500" />
                            <span>{post.shares}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16">
                            <Progress value={post.conversionRate * 10} className="h-2" />
                          </div>
                          <span className="text-sm font-medium">{post.conversionRate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Category Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-orange-500" />
              Kategori Performansı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.categoryPerformance.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">{category.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>{category.posts} yazı</span>
                        <span>{category.views.toLocaleString()} görüntülenme</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <Progress value={category.engagement * 20} className="h-2" />
                      </div>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {category.engagement}/5.0 etkileşim
                      </span>
                    </div>
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
