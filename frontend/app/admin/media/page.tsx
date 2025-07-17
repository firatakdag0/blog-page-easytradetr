"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Image,
  Plus,
  Search,
  MoreHorizontal,
  Download,
  Copy,
  Trash2,
  Eye,
  Calendar,
  FileText,
  Upload,
  Grid3X3,
  List,
  Filter,
  Loader2,
} from "lucide-react"
import { apiClient, MediaFile, getImageUrl, getMediaFromSupabase, uploadMediaToSupabase, deleteMediaFromSupabase } from "@/lib/api"
import { supabase } from "@/lib/supabaseClient"

export default function MediaPage() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedFiles, setSelectedFiles] = useState<number[]>([])
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [customFileName, setCustomFileName] = useState("")
  const [selectedUploadFile, setSelectedUploadFile] = useState<File | null>(null)

  useEffect(() => {
    fetchMediaFiles()
  }, [])

  const fetchMediaFiles = async () => {
    setLoading(true)
    setError(null)
    try {
      // const response = await apiClient.getMedia({
      //   search: searchQuery,
      //   per_page: 50
      // })
      const response = await getMediaFromSupabase({
        search: searchQuery,
        per_page: 50
      })
      setMediaFiles(response.data)
    } catch (err: any) {
      console.error("Media fetch error:", err)
      setError("Medya dosyaları yüklenemedi.")
      toast.error("Medya dosyaları yüklenemedi", {
        description: "Bir hata oluştu. Lütfen tekrar deneyin."
      })
    } finally {
      setLoading(false)
    }
  }

  // Arama değiştiğinde dosyaları yeniden yükle
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchMediaFiles()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedUploadFile(e.target.files[0])
      setCustomFileName(e.target.files[0].name)
    }
  }

  const handleFileUploadWithName = async () => {
    if (!selectedUploadFile) return
    setUploading(true)
    setUploadProgress(0)
    try {
      // Kullanıcı bilgisini al
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      // uploadMediaToSupabase fonksiyonunu customFileName ve userId ile çağır
      const uploaded = await uploadMediaToSupabase(selectedUploadFile, customFileName, userId)
      const newFiles = uploaded.mediaRow ? [uploaded.mediaRow, ...mediaFiles] : [...mediaFiles]
      setMediaFiles(newFiles)
      setIsUploadDialogOpen(false)
      setUploadProgress(0)
      setSelectedUploadFile(null)
      setCustomFileName("")
      toast.success("Dosya başarıyla yüklendi!", {
        description: `${customFileName}`
      })
    } catch (err: any) {
      console.error("Upload error:", err)
      const errorMessage = err.message || "Bir hata oluştu. Lütfen tekrar deneyin."
      setError("Dosya yüklenemedi.")
      toast.error("Dosya yüklenemedi", {
        description: errorMessage
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteFile = async (fileId: number, fileUrl: string) => {
    try {
      await deleteMediaFromSupabase(fileId, fileUrl)
      setMediaFiles(mediaFiles.filter(file => file.id !== fileId))
      toast.success("Dosya başarıyla silindi!")
    } catch (err: any) {
      console.error("Delete error:", err)
      setError("Dosya silinemedi.")
      toast.error("Dosya silinemedi", {
        description: "Bir hata oluştu. Lütfen tekrar deneyin."
      })
    }
  }

  const handleBulkDelete = async () => {
    try {
      // await apiClient.bulkDeleteMedia(selectedFiles)
      // Supabase ile toplu silme
      for (const fileId of selectedFiles) {
        const file = mediaFiles.find(f => f.id === fileId)
        if (file) {
          await deleteMediaFromSupabase(fileId, file.url)
        }
      }
      setMediaFiles(mediaFiles.filter(file => !selectedFiles.includes(file.id)))
      setSelectedFiles([])
      toast.success("Dosyalar başarıyla silindi!", {
        description: `${selectedFiles.length} dosya silindi.`
      })
    } catch (err: any) {
      console.error("Bulk delete error:", err)
      setError("Dosyalar silinemedi.")
      toast.error("Dosyalar silinemedi", {
        description: "Bir hata oluştu. Lütfen tekrar deneyin."
      })
    }
  }

  const toggleFileSelection = (fileId: number) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const toggleSelectAll = () => {
    setSelectedFiles(selectedFiles.length === mediaFiles.length ? [] : mediaFiles.map(file => file.id))
  }

  const formatFileSize = (bytes: number) => {
    if (!bytes || isNaN(bytes)) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileTypeIcon = (mimeType: string) => {
    if ((mimeType || '').startsWith("image/")) return "🖼️"
    if ((mimeType || '').startsWith("video/")) return "🎥"
    if ((mimeType || '').startsWith("audio/")) return "🎵"
    return "📄"
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("URL kopyalandı!")
    } catch (err) {
      toast.error("URL kopyalanamadı")
    }
  }

  const filteredFiles = mediaFiles.filter(file =>
    (file.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (file.alt_text?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (file.caption?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Medya Yönetimi</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Resimlerinizi ve dosyalarınızı yükleyin ve yönetin.</p>
        </div>
        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[hsl(135,100%,50%)] hover:bg-[hsl(135,100%,45%)] text-black">
              <Upload className="h-4 w-4 mr-2" />
              Dosya Yükle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dosya Yükle</DialogTitle>
              <DialogDescription>
                Bilgisayarınızdan dosya seçin veya sürükleyip bırakın.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-4">
                  Dosyaları buraya sürükleyin veya seçmek için tıklayın
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*,audio/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Yükleniyor...
                    </>
                  ) : (
                    "Dosya Seç"
                  )}
                </Button>
                {selectedUploadFile && (
                  <div className="mt-4 space-y-2">
                    <Input
                      value={customFileName}
                      onChange={e => setCustomFileName(e.target.value)}
                      placeholder="Dosya adı"
                      className="w-full"
                    />
                  </div>
                )}
              </div>
              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Yükleniyor...</span>
                    <span>{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                İptal
              </Button>
              <Button onClick={handleFileUploadWithName} disabled={!selectedUploadFile || uploading}>
                Yükle
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Dosya ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedFiles.length > 0 && (
            <div className="flex items-center gap-4 mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                {selectedFiles.length} dosya seçildi
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  İndir
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
                      <AlertDialogTitle>Seçili dosyaları silmek istediğinizden emin misiniz?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bu işlem geri alınamaz. Dosyalar kalıcı olarak silinecektir.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>İptal</AlertDialogCancel>
                      <AlertDialogAction 
                        className="bg-red-600 hover:bg-red-700"
                        onClick={handleBulkDelete}
                      >
                        Sil
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Media Files */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-4">
                <Skeleton className="h-32 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-500 dark:text-red-400">
          {error}
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">
          Dosya bulunamadı.
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredFiles.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="relative group">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.id)}
                      onChange={() => toggleFileSelection(file.id)}
                      className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-3">
                      {(file.mime_type || '').startsWith("image/") ? (
                        <img
                          src={getImageUrl(file, 'original') || '/placeholder.jpg'}
                          alt={file.alt_text || file.name || "Görsel"}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          {getFileTypeIcon(file.mime_type)}
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {file.name || "İsimsiz"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatFileSize(Number(file.size) || 0)}
                      </p>
                      {file.width && file.height && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {file.width} × {file.height}
                        </p>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => window.open(file.url, "_blank")}> 
                          <Eye className="h-4 w-4 mr-2" />
                          Görüntüle
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyToClipboard(file.url)}>
                          <Copy className="h-4 w-4 mr-2" />
                          URL Kopyala
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
                              <AlertDialogTitle>Dosyayı silmek istediğinizden emin misiniz?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bu işlem geri alınamaz. Dosya kalıcı olarak silinecektir.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>İptal</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDeleteFile(file.id, file.url)}
                              >
                                Sil
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Dosya
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Boyut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Boyutlar
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
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(file.id)}
                          onChange={() => toggleFileSelection(file.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
                            {(file.mime_type || '').startsWith("image/") ? (
                              <img
                                src={getImageUrl(file, 'original') || '/placeholder.jpg'}
                                alt={file.alt_text || file.name || "Görsel"}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-lg">
                                {getFileTypeIcon(file.mime_type)}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {file.name || "İsimsiz"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {file.mime_type}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {formatFileSize(Number(file.size) || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {file.width && file.height ? `${file.width} × ${file.height}` : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {new Date(file.created_at).toLocaleDateString("tr-TR")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => window.open(file.url, "_blank")}> 
                              <Eye className="h-4 w-4 mr-2" />
                              Görüntüle
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => copyToClipboard(file.url)}>
                              <Copy className="h-4 w-4 mr-2" />
                              URL Kopyala
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
                                  <AlertDialogTitle>Dosyayı silmek istediğinizden emin misiniz?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Bu işlem geri alınamaz. Dosya kalıcı olarak silinecektir.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>İptal</AlertDialogCancel>
                                  <AlertDialogAction 
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={() => handleDeleteFile(file.id, file.url)}
                                  >
                                    Sil
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
      )}
    </div>
  )
}

// Skeleton component for loading state
const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}></div>
)
