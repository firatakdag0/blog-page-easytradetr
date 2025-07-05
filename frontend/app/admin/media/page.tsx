"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ImageIcon,
  Upload,
  Search,
  MoreHorizontal,
  Download,
  Trash2,
  Copy,
  Eye,
  Edit,
  FolderOpen,
  File,
  Video,
  Music,
  Archive,
  Grid3X3,
  List,
  Calendar,
  HardDrive,
} from "lucide-react"

// Mock media data
const mediaFiles = [
  {
    id: 1,
    name: "dijital-donusum-hero.jpg",
    type: "image",
    size: "2.4 MB",
    dimensions: "1920x1080",
    url: "/placeholder.svg?height=200&width=300",
    uploadDate: "2024-01-15T10:00:00Z",
    usedIn: ["Dijital Dönüşüm Stratejileri"],
    alt: "Dijital dönüşüm görseli",
  },
  {
    id: 2,
    name: "barkod-sistemi-demo.mp4",
    type: "video",
    size: "15.7 MB",
    dimensions: "1280x720",
    url: "/placeholder.svg?height=200&width=300",
    uploadDate: "2024-01-12T14:30:00Z",
    usedIn: ["Barkod Sistemi Rehberi"],
    alt: "Barkod sistemi demo videosu",
  },
  {
    id: 3,
    name: "perakende-infografik.png",
    type: "image",
    size: "1.8 MB",
    dimensions: "800x1200",
    url: "/placeholder.svg?height=200&width=300",
    uploadDate: "2024-01-10T16:45:00Z",
    usedIn: ["Perakende Optimizasyonu"],
    alt: "Perakende infografiği",
  },
  {
    id: 4,
    name: "muhasebe-rapor-template.pdf",
    type: "document",
    size: "892 KB",
    dimensions: null,
    url: "/placeholder.svg?height=200&width=300",
    uploadDate: "2024-01-08T09:15:00Z",
    usedIn: ["Muhasebe Çözümleri"],
    alt: "Muhasebe rapor şablonu",
  },
  {
    id: 5,
    name: "pos-sistem-ses.mp3",
    type: "audio",
    size: "3.2 MB",
    dimensions: null,
    url: "/placeholder.svg?height=200&width=300",
    uploadDate: "2024-01-05T11:20:00Z",
    usedIn: [],
    alt: "POS sistem ses dosyası",
  },
  {
    id: 6,
    name: "logo-variations.zip",
    type: "archive",
    size: "5.1 MB",
    dimensions: null,
    url: "/placeholder.svg?height=200&width=300",
    uploadDate: "2024-01-03T13:30:00Z",
    usedIn: ["Marka Rehberi"],
    alt: "Logo varyasyonları arşivi",
  },
]

const fileTypes = ["Tümü", "image", "video", "document", "audio", "archive"]
const sortOptions = ["Yeni", "Eski", "Boyut (Büyük)", "Boyut (Küçük)", "İsim (A-Z)", "İsim (Z-A)"]

export default function MediaPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("Tümü")
  const [sortBy, setSortBy] = useState("Yeni")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedFiles, setSelectedFiles] = useState<number[]>([])
  const [uploadDialog, setUploadDialog] = useState(false)
  const [fileDetailDialog, setFileDetailDialog] = useState<any>(null)
  const [dragOver, setDragOver] = useState(false)

  const filteredFiles = mediaFiles.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType === "Tümü" || file.type === selectedType
    return matchesSearch && matchesType
  })

  const toggleFileSelection = (fileId: number) => {
    setSelectedFiles((prev) => (prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]))
  }

  const toggleSelectAll = () => {
    setSelectedFiles(selectedFiles.length === filteredFiles.length ? [] : filteredFiles.map((file) => file.id))
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-5 h-5 text-blue-500" />
      case "video":
        return <Video className="w-5 h-5 text-purple-500" />
      case "audio":
        return <Music className="w-5 h-5 text-green-500" />
      case "document":
        return <File className="w-5 h-5 text-red-500" />
      case "archive":
        return <Archive className="w-5 h-5 text-orange-500" />
      default:
        return <File className="w-5 h-5 text-gray-500" />
    }
  }

  const getFileTypeBadge = (type: string) => {
    const colors = {
      image: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      video: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      audio: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      document: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      archive: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    }

    return (
      <Badge className={colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800"}>{type.toUpperCase()}</Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for files:`, selectedFiles)
    setSelectedFiles([])
  }

  const handleFileAction = (fileId: number, action: string) => {
    console.log(`Action: ${action} for file:`, fileId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    console.log("Dropped files:", files)
    // Handle file upload
  }

  const getStorageStats = () => {
    const totalSize = mediaFiles.reduce((sum, file) => {
      const sizeInMB = Number.parseFloat(file.size.replace(/[^\d.]/g, ""))
      return sum + sizeInMB
    }, 0)

    return {
      totalFiles: mediaFiles.length,
      totalSize: `${totalSize.toFixed(1)} MB`,
      images: mediaFiles.filter((f) => f.type === "image").length,
      videos: mediaFiles.filter((f) => f.type === "video").length,
      documents: mediaFiles.filter((f) => f.type === "document").length,
      others: mediaFiles.filter((f) => !["image", "video", "document"].includes(f.type)).length,
    }
  }

  const storageStats = getStorageStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Medya Yönetimi</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Resim, video ve dosyalarınızı yükleyin, organize edin ve yönetin.
          </p>
        </div>
        <Button
          className="bg-[hsl(135,100%,50%)] hover:bg-[hsl(135,100%,45%)] text-black"
          onClick={() => setUploadDialog(true)}
        >
          <Upload className="h-4 w-4 mr-2" />
          Dosya Yükle
        </Button>
      </div>

      {/* Storage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: "Toplam Dosya", value: storageStats.totalFiles, icon: FolderOpen, color: "text-blue-500" },
          { label: "Toplam Boyut", value: storageStats.totalSize, icon: HardDrive, color: "text-purple-500" },
          { label: "Resimler", value: storageStats.images, icon: ImageIcon, color: "text-green-500" },
          { label: "Videolar", value: storageStats.videos, icon: Video, color: "text-red-500" },
          { label: "Diğer", value: storageStats.others, icon: File, color: "text-orange-500" },
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
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
            <div className="flex gap-3">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Tür seç" />
                </SelectTrigger>
                <SelectContent>
                  {fileTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "Tümü"
                        ? "Tümü"
                        : type === "image"
                          ? "Resim"
                          : type === "video"
                            ? "Video"
                            : type === "document"
                              ? "Belge"
                              : type === "audio"
                                ? "Ses"
                                : "Arşiv"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sırala" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedFiles.length > 0 && (
            <div className="flex items-center gap-4 mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                {selectedFiles.length} dosya seçildi
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("download")}>
                  <Download className="h-4 w-4 mr-1" />
                  İndir
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("copy")}>
                  <Copy className="h-4 w-4 mr-1" />
                  Kopyala
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleBulkAction("delete")}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  Sil
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Media Grid/List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Medya Dosyaları ({filteredFiles.length})
            </span>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                onChange={toggleSelectAll}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-500">Tümünü Seç</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFiles.map((file, index) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200"
                >
                  <div className="absolute top-3 left-3 z-10">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.id)}
                      onChange={() => toggleFileSelection(file.id)}
                      className="rounded border-gray-300"
                    />
                  </div>

                  <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="bg-white/80 dark:bg-gray-800/80">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setFileDetailDialog(file)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Görüntüle
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleFileAction(file.id, "download")}>
                          <Download className="h-4 w-4 mr-2" />
                          İndir
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleFileAction(file.id, "copy")}>
                          <Copy className="h-4 w-4 mr-2" />
                          URL Kopyala
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleFileAction(file.id, "edit")}>
                          <Edit className="h-4 w-4 mr-2" />
                          Düzenle
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
                                onClick={() => handleFileAction(file.id, "delete")}
                              >
                                Sil
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-t-lg flex items-center justify-center overflow-hidden">
                    {file.type === "image" ? (
                      <img src={file.url || "/placeholder.svg"} alt={file.alt} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        {getFileIcon(file.type)}
                        <span className="text-sm text-gray-500 dark:text-gray-400">{file.type.toUpperCase()}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white truncate flex-1 mr-2">{file.name}</h4>
                      {getFileTypeBadge(file.type)}
                    </div>

                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex justify-between">
                        <span>Boyut:</span>
                        <span>{file.size}</span>
                      </div>
                      {file.dimensions && (
                        <div className="flex justify-between">
                          <span>Boyutlar:</span>
                          <span>{file.dimensions}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Tarih:</span>
                        <span>{formatDate(file.uploadDate)}</span>
                      </div>
                    </div>

                    {file.usedIn.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Kullanıldığı yerler:</p>
                        <div className="flex flex-wrap gap-1">
                          {file.usedIn.slice(0, 2).map((usage, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {usage}
                            </Badge>
                          ))}
                          {file.usedIn.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{file.usedIn.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Seç
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Dosya
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Tür
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Boyut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Tarih
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      Kullanım
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredFiles.map((file, index) => (
                    <motion.tr
                      key={file.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
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
                          {getFileIcon(file.type)}
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">{file.name}</h4>
                            {file.dimensions && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">{file.dimensions}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getFileTypeBadge(file.type)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {file.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(file.uploadDate)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {file.usedIn.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {file.usedIn.slice(0, 2).map((usage, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {usage}
                              </Badge>
                            ))}
                            {file.usedIn.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{file.usedIn.length - 2}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Kullanılmıyor</span>
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
                            <DropdownMenuItem onClick={() => setFileDetailDialog(file)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Görüntüle
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleFileAction(file.id, "download")}>
                              <Download className="h-4 w-4 mr-2" />
                              İndir
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleFileAction(file.id, "copy")}>
                              <Copy className="h-4 w-4 mr-2" />
                              URL Kopyala
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleFileAction(file.id, "delete")}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Sil
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={uploadDialog} onOpenChange={setUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dosya Yükle</DialogTitle>
            <DialogDescription>Resim, video, belge ve diğer dosyalarınızı yükleyin.</DialogDescription>
          </DialogHeader>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver
                ? "border-[hsl(135,100%,50%)] bg-green-50 dark:bg-green-900/20"
                : "border-gray-300 dark:border-gray-600"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Dosyaları buraya sürükleyin</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">veya dosya seçmek için tıklayın</p>
            <Button>Dosya Seç</Button>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              Desteklenen formatlar: JPG, PNG, GIF, MP4, PDF, ZIP (Maks. 50MB)
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialog(false)}>
              İptal
            </Button>
            <Button>Yükle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File Detail Dialog */}
      <Dialog open={!!fileDetailDialog} onOpenChange={(open) => !open && setFileDetailDialog(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Dosya Detayları</DialogTitle>
            <DialogDescription>{fileDetailDialog?.name} dosyasının detaylı bilgileri</DialogDescription>
          </DialogHeader>

          {fileDetailDialog && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden mb-4">
                  {fileDetailDialog.type === "image" ? (
                    <img
                      src={fileDetailDialog.url || "/placeholder.svg"}
                      alt={fileDetailDialog.alt}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      {getFileIcon(fileDetailDialog.type)}
                      <span className="text-lg text-gray-500 dark:text-gray-400">
                        {fileDetailDialog.type.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    İndir
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    <Copy className="h-4 w-4 mr-2" />
                    URL Kopyala
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Dosya Bilgileri</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Dosya Adı:</span>
                      <span className="font-medium">{fileDetailDialog.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tür:</span>
                      {getFileTypeBadge(fileDetailDialog.type)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Boyut:</span>
                      <span>{fileDetailDialog.size}</span>
                    </div>
                    {fileDetailDialog.dimensions && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Boyutlar:</span>
                        <span>{fileDetailDialog.dimensions}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Yüklenme Tarihi:</span>
                      <span>{formatDate(fileDetailDialog.uploadDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Alt Metin:</span>
                      <span className="text-right max-w-48 truncate">{fileDetailDialog.alt}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Kullanım Alanları</h4>
                  {fileDetailDialog.usedIn.length > 0 ? (
                    <div className="space-y-2">
                      {fileDetailDialog.usedIn.map((usage: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                          <File className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{usage}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Bu dosya henüz hiçbir yerde kullanılmıyor.
                    </p>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-3">URL</h4>
                  <div className="flex gap-2">
                    <Input
                      value={`https://example.com/media/${fileDetailDialog.name}`}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button size="sm" variant="outline">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setFileDetailDialog(null)}>
              Kapat
            </Button>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Düzenle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
