"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ui/theme-toggle"
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
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Suspense } from "react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: "İçerikler",
    href: "/admin/posts",
    icon: FileText,
    badge: "24",
  },
  {
    title: "Kategoriler",
    href: "/admin/categories",
    icon: FolderOpen,
    badge: null,
  },
  {
    title: "Yorumlar",
    href: "/admin/comments",
    icon: MessageSquare,
    badge: "12",
  },
  {
    title: "Kullanıcılar",
    href: "/admin/users",
    icon: Users,
    badge: null,
  },
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

const quickStats = [
  { label: "Toplam Görüntülenme", value: "45.2K", icon: Eye, color: "text-blue-500" },
  { label: "Aktif İçerik", value: "24", icon: FileText, color: "text-green-500" },
  { label: "Trend İçerik", value: "8", icon: TrendingUp, color: "text-orange-500" },
  { label: "Öne Çıkan", value: "6", icon: Star, color: "text-yellow-500" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin"
    }
    return pathname.startsWith(href)
  }

  return (
    <Suspense fallback={null}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{
            x: sidebarOpen ? 0 : "-100%",
          }}
          className="fixed left-0 top-0 z-50 h-full w-72 bg-white dark:bg-gray-800 shadow-xl lg:translate-x-0 lg:shadow-none border-r border-gray-200 dark:border-gray-700"
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

          {/* Quick Stats */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
              Hızlı İstatistikler
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {quickStats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div
                    key={index}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                      <span className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-6">
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
                          className={`ml-auto text-xs ${active ? "bg-black/10 text-black" : ""}`}
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

          {/* User Profile */}
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>AY</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Ahmet Yılmaz</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                <Link href="/blog">
                  <Home className="h-4 w-4 mr-2" />
                  Blog'a Git
                </Link>
              </Button>

              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <div className="lg:ml-72">
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
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>AY</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6">{children}</main>
        </div>
      </div>
    </Suspense>
  )
}
