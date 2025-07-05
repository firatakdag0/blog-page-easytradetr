"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  FileText,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Star,
  TrendingUp,
  Calendar,
  Clock,
  MessageSquare,
  Heart,
  Copy,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

// Mock data
const posts = [
  {
    id: 1,
    title: "2024'te Küçük İşletmeler İçin Dijital Dönüşüm Stratejileri",
    slug: "dijital-donusum-stratejileri-2024",
    excerpt: "Geleneksel işletmelerin modern teknolojilerle nasıl rekabet avantajı elde edebileceğini...",
    status: "published",
    category: "Bulut Teknoloji",
    author: {
      name: "Ahmet Yılmaz",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    publishedAt: "2024-01-15T10:00:00Z",
    views: 2300,
    comments: 12,
    likes: 45,
    isFeatured: true,
    isTrending: true,
    readTime: 8,
  },
  {
    id: 2,
    title: "Barkod Sistemi ile Stok Yönetiminde %90 Zaman Tasarrufu",
    slug: "barkod-sistemi-stok-yonetimi",
    excerpt: "Manuel stok takibinden barkodlu sisteme geçen işletmelerin deneyimleri...",
    status: "published",
    category: "Barkod Sistemi",
    author: {
      name: "Zeynep Kaya",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    publishedAt: "2024-01-12T10:00:00Z",
    views: 1900,
    comments: 8,
    likes: 38,
    isFeatured: true,
    isTrending: false,
    readTime: 6,
  },
  {
    id: 3,
    title: "Perakende Sektöründe Müşteri Deneyimi Optimizasyonu",
    slug: "perakende-musteri-deneyimi",
    excerpt: "Modern POS sistemleriyle müşteri memnuniyetini artırmanın yolları...",
    status: "draft",
    category: "Perakende",
    author: {
      name: "Mehmet Demir",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    publishedAt: null,
    views: 0,
    comments: 0,
    likes: 0,
    isFeatured: false,
    isTrending: false,
    readTime: 5,
  },
  {
    id: 4,
    title: "Bulut Tabanlı Muhasebe Sistemlerinin Avantajları",
    slug: "bulut-muhasebe-avantajlari",
    excerpt: "Geleneksel muhasebe yöntemlerinden bulut çözümlerine geçişin faydaları...",
    status: "scheduled",
    category: "Ön Muhasebe",
    author: {
      name: "Ayşe Özkan",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    publishedAt: "2024-01-20T10:00:00Z",
    views: 0,
    comments: 0,
    likes: 0,
    isFeatured: false,
    isTrending: false,
    readTime: 7,
  },
]

const categories = ["Tümü", "Ön Muhasebe", "Barkod Sistemi", "Satış Noktası", "Bulut Teknoloji", "Perakende"]
const statuses = ["Tümü", "published", "draft", "scheduled"]

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tümü")
  const [selectedStatus, setSelectedStatus] = useState("Tümü")
  const [selectedPosts, setSelectedPosts] = useState<number[]>([])

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "Tümü" || post.category === selectedCategory
    const matchesStatus = selectedStatus === "Tümü" || post.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const togglePostSelection = (postId: number) => {
    setSelectedPosts((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]))
  }

  const toggleSelectAll = () => {
    setSelectedPosts(selectedPosts.length === filteredPosts.length ? [] : filteredPosts.map((post) => post.id))
  }

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

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for posts:`, selectedPosts)
    // Implement bulk actions here
    setSelectedPosts([])
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">İçerik Yönetimi</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Blog yazılarınızı oluşturun, düzenleyin ve yönetin.</p>
        </div>
        <Button className="bg-[hsl(135,100%,50%)] hover:bg-[hsl(135,100%,45%)] text-black" asChild>
          <Link href="/admin/posts/new">
            <Plus className="h-4 w-4 mr-2" />
            Yeni İçerik
          </Link>
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="İçerik ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Kategori seç" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Durum seç" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "Tümü"
                      ? "Tümü"
                      : status === "published"
                        ? "Yayında"
                        : status === "draft"
                          ? "Taslak"
                          : "Zamanlanmış"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedPosts.length > 0 && (
            <div className="flex items-center gap-4 mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                {selectedPosts.length} içerik seçildi
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("feature")}>
                  Öne Çıkar
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("trending")}>
                  Trend Yap
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("publish")}>
                  Yayınla
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleBulkAction("delete")}>
                  Sil
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              İçerikler ({filteredPosts.length})
            </span>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedPosts.length === filteredPosts.length && filteredPosts.length > 0}
                onChange={toggleSelectAll}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-500">Tümünü Seç</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Seç
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    İçerik
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    İstatistikler
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredPosts.map((post, index) => (
                  <motion.tr
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedPosts.includes(post.id)}
                        onChange={() => togglePostSelection(post.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
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
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">{post.excerpt}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-1">
                              <Avatar className="h-4 w-4">
                                <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-xs">
                                  {post.author.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span>{post.author.name}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {post.category}
                            </Badge>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {post.readTime} dk
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(post.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {post.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {post.comments}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {post.likes}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {post.publishedAt ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(post.publishedAt).toLocaleDateString("tr-TR")}
                        </div>
                      ) : (
                        <span className="text-gray-400">Yayınlanmamış</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/posts/${post.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Düzenle
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/blog/${post.slug}`} target="_blank">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Görüntüle
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Kopyala
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Star className="h-4 w-4 mr-2" />
                            {post.isFeatured ? "Öne Çıkanlıktan Çıkar" : "Öne Çıkar"}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <TrendingUp className="h-4 w-4 mr-2" />
                            {post.isTrending ? "Trendden Çıkar" : "Trend Yap"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Sil
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>İçeriği silmek istediğinizden emin misiniz?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Bu işlem geri alınamaz. İçerik kalıcı olarak silinecektir.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>İptal</AlertDialogCancel>
                                <AlertDialogAction className="bg-red-600 hover:bg-red-700">Sil</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
