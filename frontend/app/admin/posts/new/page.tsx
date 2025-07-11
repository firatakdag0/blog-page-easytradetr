"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState, useMemo, useRef } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import AnimatedGradientText from "@/components/ui/animated-gradient-text"
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
import {
  Save,
  Eye,
  Upload,
  X,
  Plus,
  Calendar,
  Tag,
  ImageIcon,
  FileText,
  Settings,
  Star,
  TrendingUp,
  Search,
  Grid3X3,
  List,
  Loader2,
  Check,
} from "lucide-react"
import Link from "next/link"
import { apiClient, Category, MediaFile, formatDateTimeForAPI, Author, getImageUrl } from "@/lib/api"
import dynamic from "next/dynamic"
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false }) as any
import "easymde/dist/easymde.min.css"
import { ImagePositionEditor } from "@/components/ui/image-position-editor";

export default function NewPostPage() {
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [author, setAuthor] = useState("")
  const [tags, setTags] = useState<{ id?: number; name: string }[]>([])
  const [newTag, setNewTag] = useState("")
  const [featuredImage, setFeaturedImage] = useState("")
  const [isFeatured, setIsFeatured] = useState(false)
  const [isTrending, setIsTrending] = useState(false)
  const [status, setStatus] = useState("draft")
  const [publishDate, setPublishDate] = useState("")
  const [readTime, setReadTime] = useState(5)
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Medya seçici için state'ler
  const [isMediaSelectorOpen, setIsMediaSelectorOpen] = useState(false)
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [mediaLoading, setMediaLoading] = useState(false)
  const [mediaSearchQuery, setMediaSearchQuery] = useState("")
  const [mediaViewMode, setMediaViewMode] = useState<"grid" | "list">("grid")
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null)

  // Tag state'lerini güncelle
  const [allTags, setAllTags] = useState<{ id: number; name: string }[]>([])
  // const [newTag, setNewTag] = useState("") // This line is removed

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!slug) {
      setSlug(generateSlug(value))
    }
  }

  const addTag = (tagName?: string) => {
    const name = (tagName ?? newTag).trim()
    if (!name) return
    if (!tags.some((tag) => tag.name.toLowerCase() === name.toLowerCase())) {
      setTags([...tags, { name }])
    }
    setNewTag("")
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
      
      if (!selectedCategory) {
        setError("Lütfen bir kategori seçin.")
        toast.error("Kategori seçilmedi", {
          description: "Lütfen bir kategori seçin."
        })
        setLoading(false)
        return
      }
      
      if (!selectedAuthor) {
        setError("Lütfen bir yazar seçin.")
        toast.error("Yazar seçilmedi", {
          description: "Lütfen bir yazar seçin."
        })
        setLoading(false)
        return
      }
      
      // Eğer yayın durumu 'published' ve yayın tarihi boşsa, şimdi ile doldur
      let finalPublishedAt = publishDate
      if (saveStatus === "published" && !publishDate) {
        finalPublishedAt = new Date().toISOString().slice(0, 16) // yyyy-MM-ddTHH:mm
      }
      const postData = {
        title,
        slug,
        excerpt,
        content,
        category_id: selectedCategory.id,
        author_id: selectedAuthor.id,
        tags: tags.map(tag => tag.name),
        featured_image: featuredImage,
        is_featured: isFeatured,
        is_trending: isTrending,
        status: saveStatus,
        published_at: finalPublishedAt ? formatDateTimeForAPI(finalPublishedAt) : null,
        read_time: readTime,
        meta_title: metaTitle,
        meta_description: metaDescription,
        featured_image_position_x: imgPos.x,
        featured_image_position_y: imgPos.y,
        featured_image_scale: imgScale,
      }
      await apiClient.createPost(postData)
      
      const statusText = saveStatus === "published" ? "yayınlandı" : "taslak olarak kaydedildi"
      toast.success("İçerik başarıyla oluşturuldu!", {
        description: `${title} ${statusText}.`
      })
      
      router.push("/admin/posts")
    } catch (err: any) {
      setError("İçerik kaydedilemedi.")
      toast.error("İçerik kaydedilemedi", {
        description: "Bir hata oluştu. Lütfen tekrar deneyin."
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Kategorileri çek
    apiClient.getCategories().then(setCategories)
    // Yazarları çek
    apiClient.getAuthors().then((response) => {
      const authorsArray = (response as any)?.data || []
      setAuthors(authorsArray)
    })
    apiClient.getTags().then((data) => setAllTags(data))
  }, [])

  const [slugAvailable, setSlugAvailable] = useState(true);
  const slugCheckTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!slug) return;
    if (slugCheckTimeout.current) clearTimeout(slugCheckTimeout.current);
    slugCheckTimeout.current = setTimeout(async () => {
      try {
        // Slug kontrol endpoint'i: /api/v1/posts/slug/{slug}
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"}/posts/slug/${slug}`);
        if (res.ok) {
          const data = await res.json();
          // Eğer data.success true ve data.data varsa, slug kullanılıyor demektir
          if (data.success && data.data) {
            setSlugAvailable(false);
            toast.error("Bu slug müsait değil. Lütfen başka bir slug girin.");
          } else {
            setSlugAvailable(true);
          }
        } else {
          setSlugAvailable(true);
        }
      } catch {
        setSlugAvailable(true);
      }
    }, 500);
    return () => {
      if (slugCheckTimeout.current) clearTimeout(slugCheckTimeout.current);
    };
  }, [slug]);

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

  // Kategori ve yazar seçeneklerini memoize et
  const categoryOptions = useMemo(() =>
    categories.map(cat => (
      <SelectItem key={cat.id} value={cat.id.toString()}>
        {cat.name}
      </SelectItem>
    ))
  , [categories]);

  const authorOptions = useMemo(() =>
    authors.map(auth => (
      <SelectItem key={auth.id} value={auth.id.toString()}>
        {auth.first_name} {auth.last_name}
      </SelectItem>
    ))
  , [authors]);

  // State'ler:
  const [imgPos, setImgPos] = useState({ x: 0.5, y: 0.5 }); // 0-1 arası, merkezde başla
  const [imgScale, setImgScale] = useState(1);
  const dragRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  // Sürükleme eventleri
  const handlePointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || !dragRef.current) return;
    const rect = dragRef.current.getBoundingClientRect();
    const dx = (e.clientX - last.current.x) / rect.width;
    const dy = (e.clientY - last.current.y) / rect.height;
    setImgPos(prev => {
      let nx = Math.max(0, Math.min(1, prev.x + dx));
      let ny = Math.max(0, Math.min(1, prev.y + dy));
      last.current = { x: e.clientX, y: e.clientY };
      return { x: nx, y: ny };
    });
  };
  const handlePointerUp = (e: React.PointerEvent) => {
    dragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  // Kart görseli için stil
  function getImageTransform(x: number, y: number, scale: number) {
    return {
      position: "absolute" as const,
      left: 0,
      top: 0,
      width: `360px`,
      height: `128px`,
      transform: `translate(${-x * 360 * scale + 180}px, ${-y * 128 * scale + 64}px) scale(${scale})`,
      transition: dragging.current ? "none" : "transform 0.2s cubic-bezier(.4,2,.6,1)",
      cursor: dragging.current ? "grabbing" : "grab",
      userSelect: "none" as const,
    };
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Yeni İçerik Oluştur</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Blog yazınızı oluşturun ve yayınlayın.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/admin/posts">
              <X className="h-4 w-4 mr-2" />
              İptal
            </Link>
          </Button>
          <Button variant="outline" onClick={() => handleSave("draft")}>
            <Save className="h-4 w-4 mr-2" />
            Taslak Kaydet
          </Button>
          <Button
            className="bg-[hsl(135,100%,50%)] hover:bg-[hsl(135,100%,45%)] text-black"
            onClick={() => handleSave(status)}
          >
            <Save className="h-4 w-4 mr-2" />
            Kaydet
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
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
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="İçerik başlığını girin..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="url-slug"
                    className={`mt-1 ${!slugAvailable ? 'border-red-500' : ''}`}
                  />
                  <p className="text-xs text-gray-500 mt-1">URL: /blog/{slug || "url-slug"}</p>
                </div>

                <div>
                  <Label htmlFor="excerpt">Özet *</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="İçeriğin kısa özetini yazın..."
                    rows={3}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">{excerpt.length}/300 karakter</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Content Editor */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>İçerik</CardTitle>
              </CardHeader>
              <CardContent>
                {/* İçerik alanı (SimpleMDE ile) */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">İçerik</label>
                  <div className="border rounded-lg overflow-hidden shadow">
                    <SimpleMDE
                      value={content}
                      onChange={setContent}
                      options={{
                        spellChecker: false,
                        placeholder: "Markdown ile içerik yazın veya butonları kullanın...",
                        minHeight: "400px",
                        status: false,
                      }}
                      className="bg-white"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Markdown formatını kullanabilirsiniz. Tahmini okuma süresi:{" "}
                  {Math.ceil(content.split(" ").length / 200)} dakika
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* SEO Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
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
                    placeholder="SEO için özel başlık (boş bırakılırsa normal başlık kullanılır)"
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">{metaTitle.length}/60 karakter (önerilen)</p>
                </div>

                <div>
                  <Label htmlFor="metaDescription">Meta Açıklama</Label>
                  <Textarea
                    id="metaDescription"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Arama motorları için açıklama..."
                    rows={3}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">{metaDescription.length}/160 karakter (önerilen)</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
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
                    <SelectTrigger className="mt-1">
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
                      className="mt-1"
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
                    className="mt-1"
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
          </motion.div>

          {/* Category & Author */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Kategori & Yazar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Kategori *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Kategori seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="author">Yazar *</Label>
                  <Select value={author} onValueChange={setAuthor}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Yazar seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {authorOptions}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Öne Çıkan Görsel
                </CardTitle>
              </CardHeader>
              <CardContent>
                {featuredImage ? (
                  <>
                    <img
                      src={featuredImage || "/placeholder.svg"}
                      alt="Öne çıkan görsel"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {/* Canlı Kart Önizlemesi (interaktif) */}
                    <div className="mt-4">
                      <ImagePositionEditor
                        imageUrl={featuredImage}
                        title="Canlı Kart Önizlemesi"
                        x={imgPos.x}
                        y={imgPos.y}
                        scale={imgScale}
                        onChange={(pos) => {
                          setImgPos({ x: pos.x, y: pos.y });
                          setImgScale(pos.scale);
                        }}
                      />
                    </div>
                    <div className="flex gap-2 mt-3">
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
                  </>
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
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Etiketler
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Tags alanı */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-1">Etiketler</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {tags.map((tag) => (
                      <Badge key={tag.name} variant="secondary" className="relative flex items-center gap-1 px-3 py-1 text-sm font-semibold shadow-md">
                        {tag.name}
                        <button
                          type="button"
                          className="ml-1 text-green-600 hover:bg-green-100 hover:text-green-800 rounded-full w-5 h-5 flex items-center justify-center transition"
                          onClick={() => removeTag(tag.name)}
                          title="Kaldır"
                        >
                          <span className="text-lg leading-none">×</span>
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2 items-center">
                    <select
                      className="border rounded-lg px-3 py-2 text-sm bg-white shadow focus:ring-2 focus:ring-green-400 transition"
                      value=""
                      onChange={e => {
                        const selected = allTags.find(t => t.id.toString() === e.target.value)
                        if (selected) addTag(selected.name)
                      }}
                    >
                      <option value="">Etiket seç...</option>
                      {allTags.filter(t => !tags.some(tag => tag.name === t.name)).map(tag => (
                        <option key={tag.id} value={tag.id}>{tag.name}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      className="border rounded-lg px-3 py-2 text-sm shadow focus:ring-2 focus:ring-green-400 transition"
                      placeholder="Yeni etiket yaz..."
                      value={newTag}
                      onChange={e => setNewTag(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag()
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm font-semibold shadow transition"
                      onClick={() => addTag()}
                    >
                      Ekle
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
