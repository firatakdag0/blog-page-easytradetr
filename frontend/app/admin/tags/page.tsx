"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Tag } from "lucide-react"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Tag {
  id: number
  name: string
  description: string | null
  slug: string
  posts_count: number
  created_at: string
  updated_at: string
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchTags()
  }, [])

  const fetchTags = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getTags()
      // API'den gelen veri yapısını kontrol et
      const tagsData = Array.isArray(response) ? response : (response?.data || [])
      setTags(tagsData)
    } catch (error) {
      console.error("Error fetching tags:", error)
      toast({
        title: "Hata",
        description: "Etiketler yüklenirken bir hata oluştu.",
        variant: "destructive",
      })
      setTags([]) // Hata durumunda boş array
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingTag) {
        await apiClient.updateTag(editingTag.id, formData)
        toast({
          title: "✅ Başarılı!",
          description: `"${formData.name}" etiketi başarıyla güncellendi.`,
          duration: 3000,
        })
      } else {
        await apiClient.createTag(formData)
        toast({
          title: "🎉 Yeni Etiket Oluşturuldu!",
          description: `"${formData.name}" etiketi başarıyla oluşturuldu.`,
          duration: 4000,
        })
      }
      
      setIsDialogOpen(false)
      setEditingTag(null)
      setFormData({ name: "", description: "" })
      fetchTags()
    } catch (error: any) {
      console.error("Error saving tag:", error)
      // Laravel validation hatası
      if (error && error.response && error.response.errors && error.response.errors.name) {
        toast({
          title: "❌ Hata!",
          description: error.response.errors.name[0],
          variant: "destructive",
          duration: 5000,
        })
      } else {
        toast({
          title: "❌ Hata!",
          description: "Etiket kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.",
          variant: "destructive",
          duration: 5000,
        })
      }
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Bu etiketi silmek istediğinizden emin misiniz?")) return
    
    try {
      await apiClient.deleteTag(id)
      toast({
        title: "Başarılı",
        description: "Etiket başarıyla silindi.",
      })
      fetchTags()
    } catch (error) {
      console.error("Error deleting tag:", error)
      toast({
        title: "Hata",
        description: "Etiket silinirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag)
    setFormData({
      name: tag.name,
      description: tag.description || "",
    })
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingTag(null)
    setFormData({ name: "", description: "" })
    setIsDialogOpen(true)
  }

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tag.description && tag.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Etiketler</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Blog içeriklerinizi kategorize etmek için etiketleri yönetin.
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-[hsl(135,100%,50%)] hover:bg-[hsl(135,100%,45%)] text-black">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Etiket
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <Tag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Toplam Etiket</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{tags.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <Tag className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Aktif Etiketler</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tags.filter(tag => tag.posts_count > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                <Tag className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">En Popüler</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {tags.length > 0 ? Math.max(...tags.map(tag => tag.posts_count)) : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Etiket ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tags Table */}
      <Card>
        <CardHeader>
          <CardTitle>Etiket Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(135,100%,50%)] mx-auto"></div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Yükleniyor...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Etiket Adı</TableHead>
                    <TableHead>Açıklama</TableHead>
                    <TableHead>Kullanım</TableHead>
                    <TableHead className="w-20">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableBody>
                    {filteredTags.map(tag => (
                      <TableRow key={tag.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20">
                              {tag.name}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                            {tag.description || "Açıklama yok"}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge variant={tag.posts_count > 0 ? "default" : "secondary"}>
                            {tag.posts_count} yazı
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(tag)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Düzenle
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDelete(tag.id)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Sil
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {filteredTags.length === 0 && !loading && (
                <div className="text-center py-8">
                  <Tag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchTerm ? "Arama kriterlerine uygun etiket bulunamadı." : "Henüz etiket eklenmemiş."}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              {editingTag ? "Etiketi Düzenle" : "Yeni Etiket Ekle"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Etiket Adı *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Örn: Teknoloji, İş Dünyası, Dijital Pazarlama"
                  className="focus:ring-[hsl(135,100%,50%)] focus:border-[hsl(135,100%,50%)]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Açıklama
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Etiket hakkında kısa bir açıklama..."
                  rows={3}
                  className="focus:ring-[hsl(135,100%,50%)] focus:border-[hsl(135,100%,50%)]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                İptal
              </Button>
              <Button
                type="submit"
                className="bg-[hsl(135,100%,50%)] hover:bg-[hsl(135,100%,45%)] text-black"
              >
                {editingTag ? "Güncelle" : "Oluştur"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 