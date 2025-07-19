"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
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
import TooltipProvider, {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
  CheckCircle,
  XCircle,
  Loader2,
  Filter,
  SortAsc,
  SortDesc,
  RefreshCw,
  BarChart3,
  Users,
  Activity,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { apiClient, BlogPost, Category } from "@/lib/api"
import { Label } from "@/components/ui/label"
import { getAdminPostsFromSupabase, getCategoriesFromSupabase, deletePostWithSupabase, updatePostWithSupabase } from '@/lib/api';

export default function PostsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tümü")
  const [selectedStatus, setSelectedStatus] = useState("Tümü")
  const [selectedPosts, setSelectedPosts] = useState<number[]>([])
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [categoriesLoading, setCategoriesLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Yeni state'ler
  const [allTotal, setAllTotal] = useState(0)
  const [publishedTotal, setPublishedTotal] = useState(0)
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [showFilters, setShowFilters] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // Kategorileri yükle
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true)
      try {
        const cats = await getCategoriesFromSupabase()
        setCategories(cats)
      } catch (err) {
        console.error("Categories fetch error:", err)
        toast.error("Kategoriler yüklenemedi")
      } finally {
        setCategoriesLoading(false)
      }
    }
    fetchCategories()
  }, [])

  // fetchPosts fonksiyonunu useEffect dışına çıkar:
  const fetchPosts = async () => {
    setLoading(true)
    setError(null)
    try {
      const params: any = {}
      if (searchQuery) params.search = searchQuery
      if (selectedCategory !== "Tümü") params.category = selectedCategory
      if (selectedStatus !== "Tümü") params.status = selectedStatus
      if (sortBy) params.sort_by = sortBy
      if (sortOrder) params.sort_order = sortOrder
      params.page = currentPage
      params.per_page = itemsPerPage
      const res = await getAdminPostsFromSupabase(params)
      setPosts(res.data)
      setAllTotal(res.pagination.all_total)
      setPublishedTotal(res.pagination.published_total)
    } catch (err: any) {
      console.error("Posts fetch error:", err)
      setError("Yazılar yüklenemedi.")
      setPosts([])
      toast.error("Yazılar yüklenemedi", {
        description: "Bir hata oluştu. Lütfen tekrar deneyin."
      })
    } finally {
      setLoading(false)
    }
  }

  // useEffect içinde fetchPosts'u çağır:
  useEffect(() => {
    fetchPosts()
  }, [searchQuery, selectedCategory, selectedStatus, sortBy, sortOrder, currentPage, itemsPerPage, refreshKey])

  // İstatistikleri hesapla
  const stats = {
    total: allTotal,
    published: publishedTotal,
    draft: posts.filter(p => p.status === "draft").length,
    scheduled: posts.filter(p => p.status === "scheduled").length,
    featured: posts.filter(p => p.is_featured).length,
    trending: posts.filter(p => p.is_trending).length,
    totalViews: posts.reduce((sum, p) => sum + p.views_count, 0),
    totalLikes: posts.reduce((sum, p) => sum + p.likes_count, 0),
    totalComments: posts.reduce((sum, p) => sum + p.comments_count, 0),
  }

  const togglePostSelection = (postId: number) => {
    setSelectedPosts((prev) => (prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]))
  }

  const toggleSelectAll = () => {
    setSelectedPosts(selectedPosts.length === posts.length ? [] : posts.map((post) => post.id))
  }

  const getStatusBadge = (status: string, publishedAt?: string | null) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Yayında</Badge>
      case "draft":
        return <Badge variant="secondary">Taslak</Badge>
      case "scheduled":
        if (publishedAt) {
          const scheduledDate = new Date(publishedAt)
          const now = new Date()
          const isOverdue = scheduledDate < now
          
          return (
            <div className="flex flex-col gap-1">
              <Badge className={`${isOverdue ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'}`}>
                {isOverdue ? 'Gecikmiş' : 'Zamanlanmış'}
              </Badge>
              <div className="text-xs text-gray-500">
                {scheduledDate.toLocaleDateString("tr-TR")} {scheduledDate.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          )
        }
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Zamanlanmış</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleBulkAction = async (action: string) => {
    if (action === "delete" && selectedPosts.length > 0) {
      try {
        await Promise.all(selectedPosts.map(id => deletePostWithSupabase(id)))
        setPosts(posts.filter(post => !selectedPosts.includes(post.id)))
        setSelectedPosts([])
        toast.success("Toplu silme işlemi başarılı!", {
          description: `${selectedPosts.length} içerik silindi.`
        })
      } catch (err: any) {
        setError("Toplu silme işlemi başarısız oldu.")
        toast.error("Toplu silme işlemi başarısız", {
          description: "Bir hata oluştu. Lütfen tekrar deneyin."
        })
      }
    }
    // Diğer toplu işlemler için placeholder
    setSelectedPosts([])
  }

  const handleDeletePost = async (postId: number) => {
    try {
      await deletePostWithSupabase(postId)
      toast.success("İçerik başarıyla silindi!")
      fetchPosts()
    } catch (err: any) {
      setError("İçerik silinemedi.")
      toast.error("İçerik silinemedi", {
        description: "Bir hata oluştu. Lütfen tekrar deneyin."
      })
    }
  }

  const handlePublishPost = async (postId: number) => {
    try {
      const post = posts.find(p => p.id === postId)
      if (!post) return
      
      await updatePostWithSupabase(postId, {
        status: "published",
        published_at: new Date().toISOString()
      })
      
      setPosts(posts.map(p => 
        p.id === postId 
          ? { ...p, status: "published", published_at: new Date().toISOString() }
          : p
      ))
      
      toast.success("İçerik başarıyla yayınlandı!", {
        description: `${post.title} yayınlandı.`
      })
      fetchPosts()
    } catch (err: any) {
      console.error("Publish error:", err)
      toast.error("İçerik yayınlanamadı", {
        description: "Bir hata oluştu. Lütfen tekrar deneyin."
      })
    }
  }

  const handleUnpublishPost = async (postId: number) => {
    try {
      const post = posts.find(p => p.id === postId)
      if (!post) return
      
      await updatePostWithSupabase(postId, {
        status: "draft",
        published_at: null
      })
      
      setPosts(posts.map(p => 
        p.id === postId 
          ? { ...p, status: "draft", published_at: null }
          : p
      ))
      
      toast.success("İçerik yayından kaldırıldı!", {
        description: `${post.title} taslak durumuna alındı.`
      })
      fetchPosts()
    } catch (err: any) {
      console.error("Unpublish error:", err)
      toast.error("İçerik yayından kaldırılamadı", {
        description: "Bir hata oluştu. Lütfen tekrar deneyin."
      })
    }
  }

  const handleRefresh = () => {
    setCurrentPage(1)
    setSearchQuery("")
    setSelectedCategory("Tümü")
    setSelectedStatus("Tümü")
    setSortBy("created_at")
    setSortOrder("desc")
    setRefreshKey((k) => k + 1)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("URL kopyalandı!")
    } catch (err) {
      toast.error("URL kopyalanamadı")
    }
  }

  // Yeni fonksiyonlar
  const handleToggleFeatured = async (postId: number, current: boolean) => {
    try {
      // Eğer öne çıkarma işlemi yapılacaksa ve zaten 4 öne çıkan varsa, en eskiyi çıkar
      if (!current) {
        const featuredPosts = posts.filter(p => p.is_featured)
        if (featuredPosts.length >= 4) {
          // En eski öne çıkanı bul
          const oldest = featuredPosts.reduce((a, b) => {
            const dateA = a.published_at ? new Date(a.published_at).getTime() : 0
            const dateB = b.published_at ? new Date(b.published_at).getTime() : 0
            return dateA < dateB ? a : b
          })
          // Önce en eskiyi normal yap
          await updatePostWithSupabase(oldest.id, { is_featured: false })
          toast.info("En eski öne çıkan içerik normal içeriğe alındı.", { description: oldest.title })
        }
      }
      // Şimdi seçileni güncelle
      const response = await updatePostWithSupabase(postId, { is_featured: !current })
      let updated: any
      if (response && typeof response === 'object' && 'data' in response) {
        updated = (response as any).data
      } else {
        updated = response
      }
      setRefreshKey((k) => k + 1) // Post listesini güncelle
      toast.success(
        updated.is_featured ? "İçerik öne çıkarıldı!" : "İçerik öne çıkanlıktan çıkarıldı!"
      )
    } catch (err: any) {
      toast.error("İşlem başarısız oldu.", {
        description: err?.message || "Lütfen tekrar deneyin."
      })
    }
  }

  const handleToggleTrending = async (postId: number, current: boolean) => {
    try {
      const response = await updatePostWithSupabase(postId, { is_trending: !current })
      let updated: any
      if (response && typeof response === 'object' && 'data' in response) {
        updated = (response as any).data
      } else {
        updated = response
      }
      setPosts(posts.map(p => p.id === postId ? { ...p, is_trending: updated.is_trending } : p))
      toast.success(
        updated.is_trending ? "İçerik trend yapıldı!" : "İçerik trendden çıkarıldı!"
      )
    } catch (err: any) {
      toast.error("İşlem başarısız oldu.", {
        description: err?.message || "Lütfen tekrar deneyin."
      })
    }
  }

  const totalPages = Math.max(1, Math.ceil(allTotal / itemsPerPage));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">İçerik Yönetimi</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Blog yazılarınızı oluşturun, düzenleyin ve yönetin.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Yenile
          </Button>
          <Button className="bg-[hsl(135,100%,50%)] hover:bg-[hsl(135,100%,45%)] text-black" asChild>
            <Link href="/admin/posts/new">
              <Plus className="h-4 w-4 mr-2" />
              Yeni İçerik
            </Link>
          </Button>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam İçerik</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Yayında</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.published}</p>
                </div>
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Görüntülenme</p>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.totalViews.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Beğeni</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.totalLikes.toLocaleString()}</p>
                </div>
                <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                  <Heart className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
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
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filtreler
              </Button>
            </div>
          </div>

          {/* Gelişmiş Filtreler */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label className="text-sm font-medium">Kategori</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Kategori seç" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="Tümü" value="Tümü">
                        Tümü
                      </SelectItem>
                      {categoriesLoading ? (
                        <SelectItem value="loading" disabled>
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Yükleniyor...
                          </div>
                        </SelectItem>
                      ) : (
                        categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: cat.color }}
                              />
                              {cat.name}
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Durum</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Durum seç" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem key="Tümü" value="Tümü">
                        Tümü
                      </SelectItem>
                      <SelectItem key="published" value="published">
                        Yayında
                      </SelectItem>
                      <SelectItem key="draft" value="draft">
                        Taslak
                      </SelectItem>
                      <SelectItem key="scheduled" value="scheduled">
                        Zamanlanmış
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Sıralama</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at">Oluşturma Tarihi</SelectItem>
                      <SelectItem value="updated_at">Güncelleme Tarihi</SelectItem>
                      <SelectItem value="published_at">Yayın Tarihi</SelectItem>
                      <SelectItem value="title">Başlık</SelectItem>
                      <SelectItem value="views_count">Görüntülenme</SelectItem>
                      <SelectItem value="likes_count">Beğeni</SelectItem>
                      <SelectItem value="comments_count">Yorum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Sıra</Label>
                  <div className="flex gap-1 mt-1">
                    <Button
                      variant={sortOrder === "asc" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSortOrder("asc")}
                    >
                      <SortAsc className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={sortOrder === "desc" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSortOrder("desc")}
                    >
                      <SortDesc className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Bulk Actions */}
          {selectedPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
            >
              <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                {selectedPosts.length} içerik seçildi
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("feature")}>
                  <Star className="h-4 w-4 mr-1" />
                  Öne Çıkar
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("trending")}>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Trend Yap
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("publish")}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Yayınla
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Sil
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Seçili içerikleri silmek istediğinizden emin misiniz?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bu işlem geri alınamaz. {selectedPosts.length} içerik kalıcı olarak silinecektir.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>İptal</AlertDialogCancel>
                      <AlertDialogAction 
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleBulkAction("delete")}
                      >
                        Sil
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Zamanlanmış İçerikler Uyarısı */}
      {posts.some(post => post.status === "scheduled" && post.published_at && new Date(post.published_at) < new Date()) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Gecikmiş Zamanlanmış İçerikler
              </h3>
              <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                Bazı zamanlanmış içeriklerin yayın tarihi geçmiş. Bu içerikler otomatik olarak yayınlanacaktır.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              İçerikler
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedPosts.length === posts.length && posts.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-500">Tümünü Seç</span>
              </div>
              
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
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
            </table>
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Yükleniyor...
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-red-500 dark:text-red-400">
                      {error}
                    </td>
                  </tr>
                ) : posts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      <div className="py-8">
                        <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-lg font-medium">İçerik bulunamadı</p>
                        <p className="text-sm text-gray-500">Arama kriterlerinizi değiştirmeyi deneyin.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  posts.map((post, index) => (
                    <motion.tr
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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
                              <Link 
                                href={`/admin/posts/${post.id}/edit`}
                                className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                              >
                                {post.title}
                              </Link>
                              {post.is_featured && (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Badge variant="secondary" className="text-xs">
                                      <Star className="h-3 w-3 mr-1" />
                                      Öne Çıkan
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Öne çıkan içerik</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                              {post.is_trending && (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Badge className="bg-[hsl(135,100%,50%)] text-black text-xs">
                                      <TrendingUp className="h-3 w-3 mr-1" />
                                      Trend
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Trend içerik</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">{post.excerpt}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                              <div className="flex items-center gap-1">
                                <Avatar className="h-4 w-4">
                                  <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                                  <AvatarFallback className="text-xs">
                                    {(post.author?.name || '')
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{post.author.name}</span>
                              </div>
                              <Badge variant="outline" className="text-xs flex items-center gap-1">
                                <div 
                                  className="w-2 h-2 rounded-full" 
                                  style={{ backgroundColor: post.category.color }}
                                />
                                {post.category.name}
                              </Badge>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {post.read_time} dk
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(post.status, post.published_at)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="flex items-center gap-1">
                                <Eye className="h-4 w-4" />
                                {(typeof post.views_count === 'number' ? post.views_count : 0).toLocaleString()}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Görüntülenme sayısı</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4" />
                                {post.comments_count}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Yorum sayısı</p>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="flex items-center gap-1">
                                <Heart className="h-4 w-4" />
                                {post.likes_count}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Beğeni sayısı</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {post.status === "scheduled" && post.published_at ? (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-blue-500" />
                              <span className="text-blue-600 dark:text-blue-400 font-medium">
                                {new Date(post.published_at).toLocaleDateString("tr-TR")}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(post.published_at).toLocaleTimeString("tr-TR", {
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </div>
                          </div>
                        ) : post.status === "published" && post.published_at ? (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-green-500" />
                            <span className="text-green-600 dark:text-green-400">
                              {new Date(post.published_at).toLocaleDateString("tr-TR")}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400">Yayınlanmamış</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Quick Publish/Unpublish Toggle */}
                          {post.status === "published" ? (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleUnpublishPost(post.id)}
                                >
                                  <XCircle className="h-4 w-4 text-orange-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Yayından kaldır</p>
                              </TooltipContent>
                            </Tooltip>
                          ) : (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handlePublishPost(post.id)}
                                >
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Yayınla</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                          
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
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => copyToClipboard(`${window.location.origin}/blog/${post.slug}`)}
                              >
                                <Copy className="h-4 w-4 mr-2" />
                                Bağlantıyı Kopyala
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Canlıda Gör
                                </a>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleToggleFeatured(post.id, post.is_featured)}
                              >
                                <Star className={`h-4 w-4 mr-2 ${post.is_featured ? "text-yellow-500" : ""}`} />
                                {post.is_featured ? "Öne Çıkanlıktan Çıkar" : "Öne Çıkar"}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleToggleTrending(post.id, post.is_trending)}
                              >
                                <TrendingUp className={`h-4 w-4 mr-2 ${post.is_trending ? "text-green-500" : ""}`} />
                                {post.is_trending ? "Trendden Çıkar" : "Trend Yap"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem className="text-red-600">
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
                                    <AlertDialogAction
                                      className="bg-red-600 hover:bg-red-700"
                                      onClick={() => handleDeletePost(post.id)}
                                    >
                                      Sil
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}