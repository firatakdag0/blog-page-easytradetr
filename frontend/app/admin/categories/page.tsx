"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  FolderOpen,
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  FileText,
  Calendar,
  Palette,
} from "lucide-react"
import { getCategoriesFromSupabase, Category, createCategorySupabase, updateCategorySupabase, deleteCategorySupabase } from "@/lib/api"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    color: "#3B82F6",
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getCategoriesFromSupabase()
      setCategories(res)
    } catch (err: any) {
      console.error("Kategori yükleme hatası:", err)
      setError("Kategoriler yüklenemedi.")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = async () => {
    try {
      const newCategory = await createCategorySupabase(formData)
      setCategories([...categories, newCategory])
      setIsCreateDialogOpen(false)
      resetForm()
      toast.success("Kategori başarıyla oluşturuldu!", {
        description: `${formData.name} kategorisi eklendi.`
      })
    } catch (err: any) {
      setError("Kategori oluşturulamadı.")
      toast.error("Kategori oluşturulamadı", {
        description: "Bir hata oluştu. Lütfen tekrar deneyin."
      })
    }
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory) return
    try {
      const updatedCategory = await updateCategorySupabase(editingCategory.id, formData)
      setCategories(categories.map(cat => cat.id === editingCategory.id ? updatedCategory : cat))
      setIsEditDialogOpen(false)
      setEditingCategory(null)
      resetForm()
      toast.success("Kategori başarıyla güncellendi!", {
        description: `${formData.name} kategorisi güncellendi.`
      })
    } catch (err: any) {
      setError("Kategori güncellenemedi.")
      toast.error("Kategori güncellenemedi", {
        description: "Bir hata oluştu. Lütfen tekrar deneyin."
      })
    }
  }

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await deleteCategorySupabase(categoryId)
      const deletedCategory = categories.find(cat => cat.id === categoryId)
      setCategories(categories.filter(cat => cat.id !== categoryId))
      toast.success("Kategori başarıyla silindi!", {
        description: `${deletedCategory?.name} kategorisi silindi.`
      })
    } catch (err: any) {
      console.error("Kategori silme hatası:", err)
      const errorMessage = err.message || "Kategori silinemedi."
      setError(errorMessage)
      toast.error("Kategori silinemedi", {
        description: errorMessage
      })
    }
  }

  const openEditDialog = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color,
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      color: "#3B82F6",
    })
  }

  const filteredCategories = categories.filter(category =>
    (category.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (category.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kategori Yönetimi</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Blog kategorilerinizi oluşturun, düzenleyin ve yönetin.</p>
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
              <DialogDescription>
                Blog için yeni bir kategori oluşturun.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Kategori Adı</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Kategori adını girin"
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="kategori-adi"
                />
              </div>
              <div>
                <Label htmlFor="description">Açıklama</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Kategori açıklaması"
                />
              </div>
              <div>
                <Label htmlFor="color">Renk</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-16 h-10"
                  />
                  <Input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    placeholder="#3B82F6"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                İptal
              </Button>
              <Button onClick={handleCreateCategory}>Oluştur</Button>
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
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : error ? (
          <div className="col-span-full text-center text-red-500 dark:text-red-400">
            {error}
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
            Kategori bulunamadı.
          </div>
        ) : (
          filteredCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {category.name}
                      </h3>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(category)}>
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
                                {category.posts_count > 0 ? (
                                  <span className="text-red-600 font-medium">
                                    Bu kategoriye ait {category.posts_count} yazı bulunmaktadır. 
                                    Kategoriyi silmek için önce bu yazıları başka bir kategoriye taşıyın veya silin.
                                  </span>
                                ) : (
                                  "Bu işlem geri alınamaz. Kategori kalıcı olarak silinecektir."
                                )}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>İptal</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDeleteCategory(category.id)}
                                disabled={category.posts_count > 0}
                              >
                                {category.posts_count > 0 ? "Yazılar Var" : "Sil"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span className={category.posts_count > 0 ? "text-orange-600 font-medium" : "text-gray-500"}>
                        {category.posts_count} yazı
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(category.created_at).toLocaleDateString("tr-TR")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kategori Düzenle</DialogTitle>
            <DialogDescription>
              Kategori bilgilerini güncelleyin.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Kategori Adı</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Kategori adını girin"
              />
            </div>
            <div>
              <Label htmlFor="edit-slug">Slug</Label>
              <Input
                id="edit-slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="kategori-adi"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Açıklama</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Kategori açıklaması"
              />
            </div>
            <div>
              <Label htmlFor="edit-color">Renk</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="edit-color"
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-16 h-10"
                />
                <Input
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="#3B82F6"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleUpdateCategory}>Güncelle</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
