"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Plus, Edit, Trash2, MoreHorizontal, FileText, Search } from "lucide-react"
import { toast } from "sonner"

// Mock data - bu gerçek uygulamada state management ile yönetilecek
const initialCategories = [
  {
    id: 1,
    name: "Ön Muhasebe",
    slug: "on-muhasebe",
    description: "Ön muhasebe sistemleri ve uygulamaları hakkında yazılar",
    color: "#3b82f6",
    postsCount: 8,
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    name: "Barkod Sistemi",
    slug: "barkod-sistemi",
    description: "Barkod teknolojileri ve stok yönetimi çözümleri",
    color: "#10b981",
    postsCount: 6,
    createdAt: "2024-01-02",
  },
  {
    id: 3,
    name: "Satış Noktası",
    slug: "satis-noktasi",
    description: "POS sistemleri ve satış yönetimi",
    color: "#f59e0b",
    postsCount: 5,
    createdAt: "2024-01-03",
  },
  {
    id: 4,
    name: "Bulut Teknoloji",
    slug: "bulut-teknoloji",
    description: "Bulut tabanlı çözümler ve dijital dönüşüm",
    color: "#8b5cf6",
    postsCount: 4,
    createdAt: "2024-01-04",
  },
  {
    id: 5,
    name: "Perakende",
    slug: "perakende",
    description: "Perakende sektörü ve müşteri deneyimi",
    color: "#ef4444",
    postsCount: 3,
    createdAt: "2024-01-05",
  },
  {
    id: 6,
    name: "Başarı Hikayeleri",
    slug: "basari-hikayeleri",
    description: "Müşteri başarı hikayeleri ve vaka çalışmaları",
    color: "#06b6d4",
    postsCount: 2,
    createdAt: "2024-01-06",
  },
]

const colorOptions = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#84cc16",
  "#f97316",
  "#ec4899",
  "#6366f1",
  "#14b8a6",
  "#f43f5e",
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)

  // Form states
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [color, setColor] = useState(colorOptions[0])

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleNameChange = (value: string) => {
    setName(value)
    if (!editingCategory) {
      setSlug(generateSlug(value))
    }
  }

  const resetForm = () => {
    setName("")
    setSlug("")
    setDescription("")
    setColor(colorOptions[0])
    setEditingCategory(null)
  }

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error("Kategori adı gereklidir!")
      return
    }

    // Slug kontrolü
    const slugExists = categories.some((cat) => cat.slug === slug)
    if (slugExists) {
      toast.error("Bu URL slug zaten kullanılıyor!")
      return
    }

    const newCategory = {
      id: Math.max(...categories.map((c) => c.id)) + 1,
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      color,
      postsCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setCategories([...categories, newCategory])
    toast.success("Kategori başarıyla oluşturuldu!")
    resetForm()
    setIsCreateDialogOpen(false)
  }

  const handleEdit = (category: any) => {
    setEditingCategory(category)
    setName(category.name)
    setSlug(category.slug)
    setDescription(category.description)
    setColor(category.color)
    setIsEditDialogOpen(true)
  }

  const handleUpdate = () => {
    if (!name.trim()) {
      toast.error("Kategori adı gereklidir!")
      return
    }

    // Slug kontrolü (kendi kategorisi hariç)
    const slugExists = categories.some((cat) => cat.slug === slug && cat.id !== editingCategory.id)
    if (slugExists) {
      toast.error("Bu URL slug zaten kullanılıyor!")
      return
    }

    const updatedCategories = categories.map((cat) =>
      cat.id === editingCategory.id
        ? {
            ...cat,
            name: name.trim(),
            slug: slug.trim(),
            description: description.trim(),
            color,
          }
        : cat,
    )

    setCategories(updatedCategories)
    toast.success("Kategori başarıyla güncellendi!")
    resetForm()
    setIsEditDialogOpen(false)
  }

  const handleDelete = (categoryId: number) => {
    const categoryToDelete = categories.find((cat) => cat.id === categoryId)

    if (categoryToDelete && categoryToDelete.postsCount > 0) {
      toast.error("Bu kategoride yazılar bulunuyor! Önce yazıları başka kategoriye taşıyın.")
      return
    }

    setCategories(categories.filter((cat) => cat.id !== categoryId))
    toast.success("Kategori başarıyla silindi!")
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kategori Yönetimi</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Blog kategorilerini oluşturun, düzenleyin ve yönetin.</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[hsl(135,100%,50%)] hover:bg-[hsl(135,100%,45%)] text-black">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Kategori
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Kategori Oluştur</DialogTitle>
              <DialogDescription>Blog için yeni bir kategori oluşturun.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Kategori Adı *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Kategori adını girin..."
                />
              </div>
              <div>
                <Label htmlFor="slug">URL Slug</Label>
                <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="url-slug" />
                <p className="text-xs text-gray-500 mt-1">URL'de görünecek kısım (örn: /kategori/url-slug)</p>
              </div>
              <div>
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Kategori açıklaması..."
                  rows={3}
                />
              </div>
              <div>
                <Label>Renk</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {colorOptions.map((colorOption) => (
                    <button
                      key={colorOption}
                      onClick={() => setColor(colorOption)}
                      className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                        color === colorOption ? "border-gray-900 dark:border-white scale-110" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: colorOption }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  resetForm()
                  setIsCreateDialogOpen(false)
                }}
              >
                İptal
              </Button>
              <Button onClick={handleCreate} className="bg-[hsl(135,100%,50%)] hover:bg-[hsl(135,100%,45%)] text-black">
                Oluştur
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Kategori ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(category)}>
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
                            <AlertDialogTitle>Kategoriyi silmek istediğinizden emin misiniz?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Bu işlem geri alınamaz.{" "}
                              {category.postsCount > 0 && `Bu kategoride ${category.postsCount} yazı bulunuyor.`}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>İptal</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => handleDelete(category.id)}
                            >
                              Sil
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{category.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <FileText className="h-4 w-4" />
                    <span>{category.postsCount} yazı</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    /{category.slug}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open)
          if (!open) resetForm()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kategoriyi Düzenle</DialogTitle>
            <DialogDescription>Kategori bilgilerini güncelleyin.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Kategori Adı *</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Kategori adını girin..."
              />
            </div>
            <div>
              <Label htmlFor="edit-slug">URL Slug</Label>
              <Input id="edit-slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="url-slug" />
              <p className="text-xs text-gray-500 mt-1">URL'de görünecek kısım (örn: /kategori/url-slug)</p>
            </div>
            <div>
              <Label htmlFor="edit-description">Açıklama</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Kategori açıklaması..."
                rows={3}
              />
            </div>
            <div>
              <Label>Renk</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {colorOptions.map((colorOption) => (
                  <button
                    key={colorOption}
                    onClick={() => setColor(colorOption)}
                    className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                      color === colorOption ? "border-gray-900 dark:border-white scale-110" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: colorOption }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm()
                setIsEditDialogOpen(false)
              }}
            >
              İptal
            </Button>
            <Button onClick={handleUpdate} className="bg-[hsl(135,100%,50%)] hover:bg-[hsl(135,100%,45%)] text-black">
              Güncelle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {filteredCategories.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <FileText className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery ? "Kategori bulunamadı" : "Henüz kategori yok"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchQuery
                ? "Arama kriterlerinize uygun kategori bulunamadı."
                : "İlk kategorinizi oluşturmak için yukarıdaki butonu kullanın."}
            </p>
            {!searchQuery && (
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-[hsl(135,100%,50%)] hover:bg-[hsl(135,100%,45%)] text-black"
              >
                <Plus className="h-4 w-4 mr-2" />
                İlk Kategorinizi Oluşturun
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
