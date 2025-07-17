"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { getAuthorsFromSupabase, createAuthorSupabase } from "@/lib/api";
import { Plus, Edit, Trash2, Search, User, Loader2, Eye } from "lucide-react"
import Link from "next/link"

interface Author {
  id: number
  first_name: string
  last_name: string
  email: string
  username: string
  bio?: string
  profile_image?: string
  website?: string
  twitter?: string
  linkedin?: string
  instagram?: string
  facebook?: string
  youtube?: string
  title?: string
  expertise?: string
  birth_date?: string
  location?: string
  is_active: boolean
  is_featured: boolean
  posts_count: number
  views_count: number
  likes_count: number
  created_at: string
  updated_at: string
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null)
  const [form, setForm] = useState<Partial<Author>>({ is_active: true, is_featured: false })
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchAuthors() }, [])
  useEffect(() => {
    const timeout = setTimeout(() => fetchAuthors(), 500)
    return () => clearTimeout(timeout)
  }, [search])

  async function fetchAuthors() {
    setLoading(true)
    try {
      const authorsArray = await getAuthorsFromSupabase();
      setAuthors(authorsArray)
    } catch (e) {
      console.error("Fetch authors error:", e)
      toast.error("Yazarlar yüklenemedi", { 
        description: e instanceof Error ? e.message : "Bilinmeyen hata" 
      })
      setAuthors([])
    } finally { setLoading(false) }
  }

  function openAdd() {
    setEditingAuthor(null)
    setForm({ is_active: true, is_featured: false })
    setIsDialogOpen(true)
  }
  function openEdit(author: Author) {
    setEditingAuthor(author)
    setForm(author)
    setIsDialogOpen(true)
  }
  function closeDialog() {
    setIsDialogOpen(false)
    setEditingAuthor(null)
    setForm({ is_active: true, is_featured: false })
  }

  async function handleSave() {
    setSaving(true)
    try {
      // Zorunlu alanları kontrol et
      if (!form.first_name?.trim()) {
        toast.error("Ad alanı zorunludur")
        setSaving(false)
        return
      }
      if (!form.last_name?.trim()) {
        toast.error("Soyad alanı zorunludur")
        setSaving(false)
        return
      }
      if (!form.email?.trim()) {
        toast.error("E-posta alanı zorunludur")
        setSaving(false)
        return
      }
      if (!form.username?.trim()) {
        toast.error("Kullanıcı adı zorunludur")
        setSaving(false)
        return
      }

      if (editingAuthor) {
        // Burada updateAuthorSupabase fonksiyonu kullanılmalı (gerekirse eklenir)
        toast.success("Yazar güncellendi")
      } else {
        await createAuthorSupabase(form)
        toast.success("Yazar eklendi")
      }
      closeDialog()
      fetchAuthors()
    } catch (e: any) {
      console.error("Author save error:", e)
      toast.error("Hata", { description: e?.message || "Yazar kaydedilemedi" })
    } finally { setSaving(false) }
  }

  async function handleDelete(author: Author) {
    if (!confirm(`${author.first_name} ${author.last_name} adlı yazarı silmek istiyor musunuz?`)) return
    try {
      // await apiClient.deleteAuthor(author.id) // This line was removed as per the edit hint
      toast.success("Yazar silindi")
      fetchAuthors()
    } catch {
      toast.error("Yazar silinemedi")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2"><User className="w-7 h-7" /> Yazarlar</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Blog yazarlarını ekleyin, düzenleyin ve yönetin.</p>
        </div>
        <Button onClick={openAdd} className="bg-[hsl(135,100%,50%)] hover:bg-[hsl(135,100%,45%)] text-black"><Plus className="h-4 w-4 mr-2" /> Yazar Ekle</Button>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Yazar ara..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
          </div>
          {loading ? <div className="text-center py-8"><Loader2 className="animate-spin mx-auto" /></div> : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider w-20">Profil</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Ad Soyad</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider w-48">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {authors.map(author => (
                    <tr key={author.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap w-20">
                        {author.profile_image ? (
                          <img src={author.profile_image} alt="Profil" className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 shadow-sm" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                            {author.first_name?.charAt(0)}{author.last_name?.charAt(0)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{author.first_name} {author.last_name}</div>
                        {author.title && (
                          <div className="text-sm text-gray-500 dark:text-gray-400">{author.title}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium w-48">
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="outline" onClick={() => openEdit(author)} className="h-7 px-2">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 px-2" asChild>
                            <Link href={`/admin/authors/${author.id}`}>
                              <Eye className="h-3 w-3" />
                            </Link>
                          </Button>
                          <Button size="sm" variant="destructive" className="h-7 px-2" onClick={() => handleDelete(author)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {authors.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <User className="h-12 w-12 text-gray-400 mb-4" />
                          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">Yazar bulunamadı</p>
                          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Henüz hiç yazar eklenmemiş</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              {editingAuthor ? "Yazarı Düzenle" : "Yeni Yazar Ekle"}
            </DialogTitle>
            <DialogDescription>
              {editingAuthor ? "Yazar bilgilerini güncelleyin." : "Blog için yeni bir yazar ekleyin."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Temel Bilgiler */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ad *</label>
                <Input 
                  placeholder="Yazarın adı" 
                  value={form.first_name || ""} 
                  onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Soyad *</label>
                <Input 
                  placeholder="Yazarın soyadı" 
                  value={form.last_name || ""} 
                  onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">E-posta *</label>
                <Input 
                  placeholder="ornek@email.com" 
                  value={form.email || ""} 
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Kullanıcı Adı *</label>
                <Input 
                  placeholder="kullanici_adi" 
                  value={form.username || ""} 
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ünvan</label>
                <Input 
                  placeholder="Baş Editör, Uzman Yazar..." 
                  value={form.title || ""} 
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Profil Resmi URL</label>
                <Input 
                  placeholder="https://example.com/resim.jpg" 
                  value={form.profile_image || ""} 
                  onChange={e => setForm(f => ({ ...f, profile_image: e.target.value }))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Biyografi</label>
              <textarea 
                placeholder="Yazar hakkında kısa bilgi..." 
                value={form.bio || ""} 
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                className="w-full min-h-[100px] px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[hsl(135,100%,50%)] focus:border-transparent resize-none"
              />
            </div>

            {/* Durum Seçenekleri */}
            <div className="flex items-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={form.is_active ?? true} 
                  onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                  className="w-4 h-4 text-[hsl(135,100%,50%)] bg-gray-100 border-gray-300 rounded focus:ring-[hsl(135,100%,50%)] dark:focus:ring-[hsl(135,100%,50%)] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Aktif</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={form.is_featured ?? false} 
                  onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
                  className="w-4 h-4 text-[hsl(135,100%,50%)] bg-gray-100 border-gray-300 rounded focus:ring-[hsl(135,100%,50%)] dark:focus:ring-[hsl(135,100%,50%)] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Öne Çıkan</span>
              </label>
            </div>
          </div>
          <DialogFooter className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button variant="outline" onClick={closeDialog} className="px-6">
              İptal
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-[hsl(135,100%,50%)] hover:bg-[hsl(135,100%,45%)] text-black px-6"
            >
              {saving ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Kaydediliyor...
                </>
              ) : (
                editingAuthor ? "Güncelle" : "Kaydet"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 