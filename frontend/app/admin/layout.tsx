"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Card, CardContent } from "@/components/ui/card"
import { Toaster } from "@/components/ui/toaster"
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  MessageSquare,
  Users,
  ImageIcon,
  BarChart3,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  Plus,
  LogOut,
  Home,
  Eye,
  TrendingUp,
  Star,
  Tag,
  Heart,
  Activity,
  CheckCircle,
  Zap,
  ExternalLink,
  Calendar,
  Clock,
  AlertCircle,
  User,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Suspense } from "react"
import { getCurrentUser } from "@/lib/api";
import { supabase } from "@/lib/supabaseClient";
import { getAdminPostsFromSupabase, getCommentsFromSupabase } from "@/lib/api";
import TooltipProvider from "@/components/ui/tooltip"

const sidebarItems = [
  {
    title: "Anasayfa",
    href: "/admin",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: "İçerikler",
    href: "/admin/posts",
    icon: FileText,
    badge: null,
  },
  {
    title: "Kategoriler",
    href: "/admin/categories",
    icon: FolderOpen,
    badge: null,
  },
  {
    title: "Yazarlar",
    href: "/admin/authors",
    icon: User,
    badge: null,
  },
  {
    title: "Etiketler",
    href: "/admin/tags",
    icon: Tag,
    badge: null,
  },
  // Yorumlar ve Kullanıcılar kaldırıldı
  {
    title: "Medya",
    href: "/admin/media",
    icon: ImageIcon,
    badge: null,
  },
  {
    title: "Analitik",
    href: "/admin/analytics",
    icon: BarChart3,
    badge: null,
  },
  {
    title: "Ayarlar",
    href: "/admin/settings",
    icon: Settings,
    badge: null,
  },
]

const quickActions = [
  {
    title: "Yeni İçerik",
    href: "/admin/posts/new",
    icon: Plus,
    color: "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-[hsl(135,100%,50%)] hover:text-black border border-gray-200 dark:border-gray-700",
  },
  {
    title: "Yeni Kategori",
    href: "/admin/categories",
    icon: FolderOpen,
    color: "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-[hsl(135,100%,50%)] hover:text-black border border-gray-200 dark:border-gray-700",
  },
  {
    title: "Medya Yükle",
    href: "/admin/media",
    icon: ImageIcon,
    color: "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-[hsl(135,100%,50%)] hover:text-black border border-gray-200 dark:border-gray-700",
  },
  {
    title: "Blog'a Git",
    href: "/blog",
    icon: ExternalLink,
    color: "bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-[hsl(135,100%,50%)] hover:text-black border border-gray-200 dark:border-gray-700",
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    featuredPosts: 0,
    trendingPosts: 0,
  })
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const router = useRouter()

  // Authentication kontrolü ve veri yükleme
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      // Authentication kontrolü
      const { data } = await supabase.auth.getSession();
      if (!data?.session) {
        router.push('/admin/login')
        return
      }
      try {
        // Kullanıcı bilgilerini al
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        // İstatistikleri yükle
        const [postsData, commentsData] = await Promise.all([
          getAdminPostsFromSupabase({ per_page: 100 }),
          getCommentsFromSupabase({ per_page: 100 }),
        ]);
        const posts: any[] = postsData?.data || [];
        const comments: any[] = commentsData?.data || [];

        const publishedPosts = posts.filter((p: any) => p.status === "published").length;
        const featuredPosts = posts.filter((p: any) => p.is_featured).length;
        const trendingPosts = posts.filter((p: any) => p.is_trending).length;
        const totalViews = posts.reduce((sum: number, p: any) => sum + (p.views_count || 0), 0);
        const totalLikes = posts.reduce((sum: number, p: any) => sum + (p.likes_count || 0), 0);

        setStats({
          totalPosts: posts.length,
          publishedPosts,
          totalViews,
          totalLikes,
          totalComments: comments.length,
          featuredPosts,
          trendingPosts,
        });
      } catch (err) {
        console.error("Auth or stats fetch error:", err)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuthAndLoadData()
  }, [router])

  const handleLogout = async () => {
    try {
      // apiClient.logout() // Bu kısım Supabase Auth'a geçirilebilir
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Hata olsa bile login sayfasına yönlendir
      router.push('/admin/login')
    }
  }

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin"
    }
    return pathname.startsWith(href)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  // Eğer giriş sayfasındaysak sadece children'ı döndür
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <Suspense fallback={null}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <aside
            className={`fixed left-0 top-0 z-50 h-full w-80 bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700 overflow-y-auto transition-transform duration-300 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
            }`}
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-[hsl(135,100%,50%)] to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Easytrade Blog</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="lg:hidden">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
                Navigasyon
              </h3>
              <ul className="space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                          active
                            ? "bg-[hsl(135,100%,50%)] text-black shadow-lg"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon
                          className={`h-5 w-5 ${active ? "text-black" : "text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-200"}`}
                        />
                        <span className="font-medium">{item.title}</span>
                        {item.badge && (
                          <Badge
                            variant={active ? "secondary" : "outline"}
                            className={`ml-auto text-xs ${active ? "bg-[hsl(135,100%,50%)] text-black" : ""}`}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* Quick Actions */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
                Hızlı Eylemler
              </h3>
              <div className="space-y-2">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Button
                      key={action.href}
                      asChild
                      size="sm"
                      className={`w-full justify-start text-white ${action.color}`}
                    >
                      <Link href={action.href} onClick={() => setSidebarOpen(false)} target={action.title === "Blog'a Git" ? "_blank" : undefined} rel={action.title === "Blog'a Git" ? "noopener noreferrer" : undefined}>
                        <Icon className="h-4 w-4 mr-2" />
                        {action.title}
                      </Link>
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
                Hızlı İstatistikler
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Eye className="h-4 w-4 text-blue-500" />
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {loading ? "..." : formatNumber(stats.totalViews)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Görüntülenme</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-green-500" />
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {loading ? "..." : stats.publishedPosts}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Yayında</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {loading ? "..." : formatNumber(stats.totalLikes)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Beğeni</p>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="h-4 w-4 text-orange-500" />
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {loading ? "..." : stats.totalComments}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Yorum</p>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
                Sistem Durumu
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">API</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Aktif
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Veritabanı</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Bağlı
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Medya</span>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Hazır
                  </Badge>
                </div>
              </div>
            </div>

            {/* User Profile */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar || "/placeholder.svg?height=40&width=40"} />
                  <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || "AY"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.name || "Admin"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role || "Admin"}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                  <Link href="/blog" target="_blank" rel="noopener noreferrer">
                    <Home className="h-4 w-4 mr-2" />
                    Blog'a Git
                  </Link>
                </Button>

                <Button variant="destructive" size="sm" className="flex-1" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Çıkış Yap
                </Button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:ml-80">
            {/* Top Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)} className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>

                  <div className="hidden md:flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="İçerik, kategori veya kullanıcı ara..."
                        className="pl-10 pr-4 py-2 w-80 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(135,100%,50%)] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Button size="sm" className="bg-[hsl(135,100%,50%)] hover:bg-[hsl(135,100%,45%)] text-black" asChild>
                    <Link href="/admin/posts/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Yeni İçerik
                    </Link>
                  </Button>

                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
                  </Button>

                  <ThemeToggle />

                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || "/placeholder.svg?height=32&width=32"} />
                    <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || "AY"}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </header>

            {/* Page Content */}
            <main className="p-6">{children}</main>
          </div>
        </div>
      </TooltipProvider>
      <Toaster />
    </Suspense>
  )
}
