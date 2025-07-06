"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { apiClient, BlogPost, Category, MediaFile, formatDateTimeForAPI, getImageUrl, Author } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Save, Eye, X, Plus, Calendar, Tag, ImageIcon, Settings, Star, TrendingUp, FileText, User, Search, Grid3X3, List, Check } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = Number(params.id)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [authors, setAuthors] = useState<Author[]>([])

  // Medya seçici için state'ler
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [mediaLoading, setMediaLoading] = useState(false)
  const [mediaSearchQuery, setMediaSearchQuery] = useState("")
  const [mediaViewMode, setMediaViewMode] = useState<"grid" | "list">("grid")
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null)

  // Form state
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [author, setAuthor] = useState("")
  const [tags, setTags] = useState<{ id: number; name: string }[]>([])
  const [newTag, setNewTag] = useState("")
  const [featuredImage, setFeaturedImage] = useState("")
  const [isFeatured, setIsFeatured] = useState(false)
  const [isTrending, setIsTrending] = useState(false)
  const [status, setStatus] = useState("draft")
  const [publishDate, setPublishDate] = useState("")
  const [readTime, setReadTime] = useState(5)
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const [post, cats, auths] = await Promise.all([
          apiClient.getPost(postId),
          apiClient.getCategories(),
          apiClient.getAuthors(),
        ])
        setCategories(cats)
        setAuthors((auths as any)?.data || [])
        const postData: any = post && (typeof post === 'object' && 'data' in post ? post.data : post)
        setTitle(postData.title)
        setSlug(postData.slug)
        setExcerpt(postData.excerpt)
        setContent(postData.content)
        setCategory(postData.category.id.toString())
        setAuthor(postData.author.id.toString())
        setTags(postData.tags.map((tag: any, i: number) => ({ id: i + 1, name: tag.name })))
        setFeaturedImage(postData.featured_image || "")
        setIsFeatured(postData.is_featured)
        setIsTrending(postData.is_trending)
        setStatus(postData.status || "draft")
        setPublishDate(postData.published_at ? postData.published_at.slice(0, 16) : "")
        setReadTime(postData.read_time)
        setMetaTitle(postData.meta_title || "")
        setMetaDescription(postData.meta_description || "")
      } catch (err: any) {
        setError("İçerik yüklenemedi.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [postId])

  // Medya dosyalarını yükle
  const fetchMediaFiles = async () => {
    setMediaLoading(true)
    try {
      const response = await apiClient.getMedia({
        search: mediaSearchQuery,
        type: "image",
        per_page: 50
      })
      setMediaFiles(response.data)
    } catch (err: any) {
      console.error("Media fetch error:", err)
      toast.error("Medya dosyaları yüklenemedi")
    } finally {
      setMediaLoading(false)
    }
  }

  // Medya seçici açıldığında dosyaları yükle
  useEffect(() => {
    if (isMediaSelectorOpen) {
      fetchMediaFiles()
    }
  }, [isMediaSelectorOpen])

  // Arama değiştiğinde medya dosyalarını yeniden yükle
  useEffect(() => {
    if (isMediaSelectorOpen) {
      const timeoutId = setTimeout(() => {
        fetchMediaFiles()
      }, 500)

      return () => clearTimeout(timeoutId)
    }
  }, [mediaSearchQuery, isMediaSelectorOpen])

  const addTag = () => {
    if (newTag.trim() && !tags.some((tag) => tag.name === newTag.trim())) {
      setTags([...tags, { id: tags.length + 1, name: newTag.trim() }])
      setNewTag("")
    }
  }
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag.name !== tagToRemove))
  }

  // Medya seçme işlemi
  const handleSelectMedia = (media: MediaFile) => {
    setSelectedMedia(media)
    setFeaturedImage(media.url)
    setIsMediaSelectorOpen(false)
    toast.success("Görsel seçildi!", {
      description: media.name
    })
  }

  const handleSave = async (saveStatus: string) => {
    setLoading(true)
    setError(null)
    try {
      const selectedCategory = categories.find((c) => c.id.toString() === category)
      const selectedAuthor = authors.find((a) => a.id.toString() === author)
      const postData = {
        title,
        slug,
        excerpt,
        content,
        category_id: selectedCategory?.id,
        author_id: selectedAuthor?.id,
        tags: tags.map((tag) => tag.name),
        featured_image: featuredImage,
        is_featured: isFeatured,
        is_trending: isTrending,
        status: saveStatus,
        published_at: publishDate ? formatDateTimeForAPI(publishDate) : null,
        read_time: readTime,
        meta_title: metaTitle,
        meta_description: metaDescription,
      }
      await apiClient.updatePost(postId, postData)
      router.push("/admin/posts")
    } catch (err: any) {
      setError("İçerik güncellenemedi.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Yükleniyor...</div>
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">İçeriği Düzenle</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Blog yazınızı güncelleyin ve kaydedin.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/admin/posts">
              <X className="h-4 w-4 mr-2" />
              İptal
            </Link>
          </Button>
          <Button variant="outline" onClick={() => handleSave("draft")}>Taslak Kaydet</Button>
          <Button className="bg-[hsl(135,100%,50%)] hover:bg-[hsl(135,100%,45%)] text-black" onClick={() => handleSave(status)}>Kaydet</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Temel Bilgiler */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Temel Bilgiler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Başlık *</Label>
                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" value={slug} onChange={e => setSlug(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="excerpt">Özet</Label>
                <Textarea id="excerpt" value={excerpt} onChange={e => setExcerpt(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          {/* İçerik */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                İçerik
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={content} onChange={e => setContent(e.target.value)} rows={12} />
            </CardContent>
          </Card>

          {/* SEO Ayarları */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                SEO Ayarları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Başlık</Label>
                <Input
                  id="metaTitle"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="SEO için özel başlık"
                />
              </div>
              <div>
                <Label htmlFor="metaDescription">Meta Açıklama</Label>
                <Textarea
                  id="metaDescription"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Arama motorları için açıklama"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Yayın Ayarları */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Yayın Ayarları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Durum</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Taslak</SelectItem>
                    <SelectItem value="published">Yayında</SelectItem>
                    <SelectItem value="scheduled">Zamanlanmış</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {status === "scheduled" && (
                <div>
                  <Label htmlFor="publishDate">Yayın Tarihi</Label>
                  <Input
                    id="publishDate"
                    type="datetime-local"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="readTime">Okuma Süresi (dakika)</Label>
                <Input
                  id="readTime"
                  type="number"
                  value={readTime}
                  onChange={(e) => setReadTime(Number(e.target.value))}
                  min="1"
                  max="60"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="featured" className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Öne Çıkan
                  </Label>
                  <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="trending" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Trend
                  </Label>
                  <Switch id="trending" checked={isTrending} onCheckedChange={setIsTrending} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kategori & Yazar */}
          <Card>
            <CardHeader>
              <CardTitle>Kategori & Yazar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Kategori *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="author">Yazar *</Label>
                <Select value={author} onValueChange={setAuthor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Yazar seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {authors.map((auth) => (
                      <SelectItem key={auth.id} value={auth.id.toString()}>
                        {auth.first_name} {auth.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Öne Çıkan Görsel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Öne Çıkan Görsel
              </CardTitle>
            </CardHeader>
            <CardContent>
              {featuredImage ? (
                <div className="space-y-3">
                  <img
                    src={featuredImage || "/placeholder.svg"}
                    alt="Öne çıkan görsel"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setFeaturedImage("")} 
                      className="flex-1"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Kaldır
                    </Button>
                    <Dialog open={isMediaSelectorOpen} onOpenChange={setIsMediaSelectorOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Değiştir
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                        <DialogHeader>
                          <DialogTitle>Medya Seç</DialogTitle>
                          <DialogDescription>
                            Öne çıkan görsel için bir resim seçin.
                          </DialogDescription>
                        </DialogHeader>
                        
                        {/* Medya Seçici İçeriği */}
                        <div className="space-y-4">
                          {/* Arama ve Görünüm */}
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="Resim ara..."
                                value={mediaSearchQuery}
                                onChange={(e) => setMediaSearchQuery(e.target.value)}
                                className="pl-10"
                              />
                            </div>
                            <Button
                              variant={mediaViewMode === "grid" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setMediaViewMode("grid")}
                            >
                              <Grid3X3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={mediaViewMode === "list" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setMediaViewMode("list")}
                            >
                              <List className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Medya Listesi */}
                          <div className="max-h-96 overflow-y-auto">
                            {mediaLoading ? (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Array.from({ length: 8 }).map((_, index) => (
                                  <div key={index} className="animate-pulse">
                                    <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-2" />
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                  </div>
                                ))}
                              </div>
                            ) : mediaFiles.length === 0 ? (
                              <div className="text-center text-gray-500 py-8">
                                Resim bulunamadı.
                              </div>
                            ) : mediaViewMode === "grid" ? (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {mediaFiles.map((file) => (
                                  <div
                                    key={file.id}
                                    className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                                      selectedMedia?.id === file.id 
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                    }`}
                                    onClick={() => handleSelectMedia(file)}
                                  >
                                    <div className="aspect-square">
                                      <img
                                        src={getImageUrl(file, 'featured')}
                                        alt={file.alt_text || file.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                                      {selectedMedia?.id === file.id && (
                                        <div className="bg-blue-500 text-white rounded-full p-1">
                                          <Check className="h-4 w-4" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="p-2 bg-white dark:bg-gray-800">
                                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                                        {file.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {file.width} × {file.height}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {mediaFiles.map((file) => (
                                  <div
                                    key={file.id}
                                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                                      selectedMedia?.id === file.id 
                                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-500' 
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                                    onClick={() => handleSelectMedia(file)}
                                  >
                                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                                      <img
                                        src={file.url}
                                        alt={file.alt_text || file.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {file.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {file.width} × {file.height}
                                      </p>
                                    </div>
                                    {selectedMedia?.id === file.id && (
                                      <Check className="h-4 w-4 text-blue-500" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsMediaSelectorOpen(false)}>
                            İptal
                          </Button>
                          <Button 
                            onClick={() => setIsMediaSelectorOpen(false)}
                            disabled={!selectedMedia}
                          >
                            Seç
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Görsel yükleyin veya URL girin</p>
                  <div className="space-y-2">
                    <Dialog open={isMediaSelectorOpen} onOpenChange={setIsMediaSelectorOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="w-full">
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Medyadan Seç
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
                        <DialogHeader>
                          <DialogTitle>Medya Seç</DialogTitle>
                          <DialogDescription>
                            Öne çıkan görsel için bir resim seçin.
                          </DialogDescription>
                        </DialogHeader>
                        
                        {/* Medya Seçici İçeriği */}
                        <div className="space-y-4">
                          {/* Arama ve Görünüm */}
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                placeholder="Resim ara..."
                                value={mediaSearchQuery}
                                onChange={(e) => setMediaSearchQuery(e.target.value)}
                                className="pl-10"
                              />
                            </div>
                            <Button
                              variant={mediaViewMode === "grid" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setMediaViewMode("grid")}
                            >
                              <Grid3X3 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={mediaViewMode === "list" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setMediaViewMode("list")}
                            >
                              <List className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Medya Listesi */}
                          <div className="max-h-96 overflow-y-auto">
                            {mediaLoading ? (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {Array.from({ length: 8 }).map((_, index) => (
                                  <div key={index} className="animate-pulse">
                                    <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg mb-2" />
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                                  </div>
                                ))}
                              </div>
                            ) : mediaFiles.length === 0 ? (
                              <div className="text-center text-gray-500 py-8">
                                Resim bulunamadı.
                              </div>
                            ) : mediaViewMode === "grid" ? (
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {mediaFiles.map((file) => (
                                  <div
                                    key={file.id}
                                    className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                                      selectedMedia?.id === file.id 
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                    }`}
                                    onClick={() => handleSelectMedia(file)}
                                  >
                                    <div className="aspect-square">
                                      <img
                                        src={getImageUrl(file, 'featured')}
                                        alt={file.alt_text || file.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                                      {selectedMedia?.id === file.id && (
                                        <div className="bg-blue-500 text-white rounded-full p-1">
                                          <Check className="h-4 w-4" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="p-2 bg-white dark:bg-gray-800">
                                      <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                                        {file.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {file.width} × {file.height}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {mediaFiles.map((file) => (
                                  <div
                                    key={file.id}
                                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                                      selectedMedia?.id === file.id 
                                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-500' 
                                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                                    onClick={() => handleSelectMedia(file)}
                                  >
                                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
                                      <img
                                        src={file.url}
                                        alt={file.alt_text || file.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {file.name}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {file.width} × {file.height}
                                      </p>
                                    </div>
                                    {selectedMedia?.id === file.id && (
                                      <Check className="h-4 w-4 text-blue-500" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>

                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsMediaSelectorOpen(false)}>
                            İptal
                          </Button>
                          <Button 
                            onClick={() => setIsMediaSelectorOpen(false)}
                            disabled={!selectedMedia}
                          >
                            Seç
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Input
                      placeholder="Görsel URL'si..."
                      value={featuredImage}
                      onChange={(e) => setFeaturedImage(e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Etiketler */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Etiketler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Etiket ekle..."
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                  className="flex-1"
                />
                <Button size="sm" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary" className="flex items-center gap-1">
                      {tag.name}
                      <button onClick={() => removeTag(tag.name)} className="ml-1 hover:text-red-500">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 