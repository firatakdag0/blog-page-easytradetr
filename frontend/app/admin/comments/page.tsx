"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  MessageSquare,
  Search,
  MoreHorizontal,
  Check,
  X,
  Trash2,
  Eye,
  Reply,
  Flag,
  Calendar,
  Clock,
  User,
  Mail,
  Plus,
  Edit,
} from "lucide-react"
import Link from "next/link"
import { apiClient, Comment, BlogPost } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { getCommentsFromSupabase } from '@/lib/api';

export default function CommentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("Tümü")
  const [selectedComments, setSelectedComments] = useState<number[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingComment, setEditingComment] = useState<Comment | null>(null)
  const [formData, setFormData] = useState({
    post_id: "",
    author_name: "",
    author_email: "",
    author_avatar: "",
    content: "",
    status: "approved"
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        // const [commentsRes, postsRes] = await Promise.all([
        //   apiClient.getAllComments(),
        //   apiClient.getAdminPosts({ per_page: 100 })
        // ])
        const commentsRes = await getCommentsFromSupabase({ per_page: 100 })
        setComments(commentsRes.data)
        // Postlar için Supabase fonksiyonu eklenebilir
        // setPosts(postsRes)
      } catch (err: any) {
        setError("Veriler yüklenemedi.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const resetForm = () => {
    setFormData({
      post_id: "",
      author_name: "",
      author_email: "",
      author_avatar: "",
      content: "",
      status: "approved"
    })
    setEditingComment(null)
  }

  const handleAddComment = async () => {
    if (!formData.post_id || !formData.author_name || !formData.content) {
      toast({
        title: "Hata",
        description: "Lütfen gerekli alanları doldurun.",
        variant: "destructive"
      })
      return
    }

    try {
      const newComment = await apiClient.createComment({
        post_id: parseInt(formData.post_id),
        author_name: formData.author_name,
        author_email: formData.author_email || null,
        author_avatar: formData.author_avatar || null,
        content: formData.content,
        status: formData.status
      })

      setComments(prev => [newComment, ...prev])
      setIsAddModalOpen(false)
      resetForm()
      
      toast({
        title: "Başarılı",
        description: "Yorum başarıyla eklendi.",
      })
    } catch (err: any) {
      toast({
        title: "Hata",
        description: "Yorum eklenirken bir hata oluştu.",
        variant: "destructive"
      })
    }
  }

  const handleEditComment = async () => {
    if (!editingComment || !formData.author_name || !formData.content) {
      toast({
        title: "Hata",
        description: "Lütfen gerekli alanları doldurun.",
        variant: "destructive"
      })
      return
    }

    try {
      const updatedComment = await apiClient.updateComment(editingComment.id, {
        author_name: formData.author_name,
        author_email: formData.author_email || null,
        author_avatar: formData.author_avatar || null,
        content: formData.content,
        status: formData.status
      })

      setComments(prev => prev.map(c => c.id === editingComment.id ? updatedComment : c))
      setIsAddModalOpen(false)
      resetForm()
      
      toast({
        title: "Başarılı",
        description: "Yorum başarıyla güncellendi.",
      })
    } catch (err: any) {
      toast({
        title: "Hata",
        description: "Yorum güncellenirken bir hata oluştu.",
        variant: "destructive"
      })
    }
  }

  const openEditModal = (comment: Comment) => {
    setEditingComment(comment)
    setFormData({
      post_id: comment.post_id.toString(),
      author_name: comment.author_name,
      author_email: comment.author_email || "",
      author_avatar: comment.author_avatar || "",
      content: comment.content,
      status: comment.status
    })
    setIsAddModalOpen(true)
  }

  const toggleCommentSelection = (commentId: number) => {
    setSelectedComments((prev) => (prev.includes(commentId) ? prev.filter((id) => id !== commentId) : [...prev, commentId]))
  }

  const toggleSelectAll = () => {
    setSelectedComments(selectedComments.length === (comments || []).length ? [] : (comments || []).map((comment) => comment.id))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Onaylandı</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Beklemede</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Reddedildi</Badge>
      case "spam":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Spam</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleBulkAction = async (action: string) => {
    if (selectedComments.length === 0) return

    try {
      const promises = selectedComments.map(commentId => {
        switch (action) {
          case "approve":
            return apiClient.updateComment(commentId, { status: "approved" })
          case "reject":
            return apiClient.updateComment(commentId, { status: "rejected" })
          case "delete":
            return apiClient.deleteComment(commentId)
          default:
            return Promise.resolve()
        }
      })

      await Promise.all(promises)

      // Refresh comments
      const updatedComments = await apiClient.getAllComments()
      setComments(updatedComments)
      setSelectedComments([])

      toast({
        title: "Başarılı",
        description: `${selectedComments.length} yorum ${action === "approve" ? "onaylandı" : action === "reject" ? "reddedildi" : "silindi"}.`,
      })
    } catch (err: any) {
      toast({
        title: "Hata",
        description: "İşlem sırasında bir hata oluştu.",
        variant: "destructive"
      })
    }
  }

  const handleStatusChange = async (commentId: number, newStatus: string) => {
    try {
      const updatedComment = await apiClient.updateComment(commentId, { status: newStatus })
      setComments(prev => prev.map(c => c.id === commentId ? updatedComment : c))
      
      toast({
        title: "Başarılı",
        description: "Yorum durumu güncellendi.",
      })
    } catch (err: any) {
      toast({
        title: "Hata",
        description: "Durum güncellenirken bir hata oluştu.",
        variant: "destructive"
      })
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    try {
      await apiClient.deleteComment(commentId)
      setComments(prev => prev.filter(c => c.id !== commentId))
      
      toast({
        title: "Başarılı",
        description: "Yorum başarıyla silindi.",
      })
    } catch (err: any) {
      toast({
        title: "Hata",
        description: "Yorum silinirken bir hata oluştu.",
        variant: "destructive"
      })
    }
  }

  const filteredComments = (comments || []).filter(comment => {
    const matchesSearch = comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         comment.author_name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = selectedStatus === "Tümü" || comment.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Yorum Yönetimi</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Blog yorumlarınızı moderasyon edin ve yönetin.</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Yeni Yorum Ekle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingComment ? "Yorumu Düzenle" : "Yeni Yorum Ekle"}</DialogTitle>
              <DialogDescription>
                {editingComment ? "Mevcut yorumu düzenleyin." : "Yeni bir yorum ekleyin."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-sm font-medium">Yazı</label>
                <div className="col-span-3">
                  <Select value={formData.post_id} onValueChange={(value) => setFormData({ ...formData, post_id: value })} disabled={!!editingComment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Yazı seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {posts.map(post => (
                        <SelectItem key={post.id} value={post.id.toString()}>
                          {post.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <label className="text-sm font-medium">Yazar Adı</label>
                <div className="col-span-3">
                  <Input
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    placeholder="Yazar adını girin"
                  />
                </div>
                <label className="text-sm font-medium">E-posta</label>
                <div className="col-span-3">
                  <Input
                    value={formData.author_email}
                    onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
                    placeholder="E-posta adresi (opsiyonel)"
                  />
                </div>
                <label className="text-sm font-medium">Avatar URL</label>
                <div className="col-span-3">
                  <Input
                    value={formData.author_avatar}
                    onChange={(e) => setFormData({ ...formData, author_avatar: e.target.value })}
                    placeholder="Avatar resmi URL'si (opsiyonel)"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Yorum</label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Yorum içeriğini girin"
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Durum</label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Durum seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Onaylandı</SelectItem>
                    <SelectItem value="pending">Beklemede</SelectItem>
                    <SelectItem value="rejected">Reddedildi</SelectItem>
                    <SelectItem value="spam">Spam</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={resetForm}>İptal</Button>
              <Button onClick={editingComment ? handleEditComment : handleAddComment}>
                {editingComment ? <Edit className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                {editingComment ? "Düzenle" : "Ekle"}
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
                  placeholder="Yorum ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Durum seç" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="Tümü" value="Tümü">
                  Tümü
                </SelectItem>
                <SelectItem key="pending" value="pending">
                  Beklemede
                </SelectItem>
                <SelectItem key="approved" value="approved">
                  Onaylandı
                </SelectItem>
                <SelectItem key="rejected" value="rejected">
                  Reddedildi
                </SelectItem>
                <SelectItem key="spam" value="spam">
                  Spam
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedComments.length > 0 && (
            <div className="flex items-center gap-4 mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                {selectedComments.length} yorum seçildi
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("approve")}>
                  <Check className="h-4 w-4 mr-1" />
                  Onayla
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("reject")}>
                  <X className="h-4 w-4 mr-1" />
                  Reddet
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

      {/* Comments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Yorumlar ({filteredComments.length})
            </span>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedComments.length === filteredComments.length && filteredComments.length > 0}
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
                    Yorum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Yazar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Durum
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
                      Yükleniyor...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-red-500 dark:text-red-400">
                      {error}
                    </td>
                  </tr>
                ) : filteredComments.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      Yorum bulunamadı.
                    </td>
                  </tr>
                ) : (
                  filteredComments.map((comment, index) => (
                    <motion.tr
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedComments.includes(comment.id)}
                          onChange={() => toggleCommentSelection(comment.id)}
                          className="rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-md">
                          <p className="text-sm text-gray-900 dark:text-white line-clamp-3 mb-2">
                            {comment.content}
                          </p>
                          {comment.post && (
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <span>Yazı:</span>
                              <Link 
                                href={`/blog/${comment.post.slug}`} 
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                target="_blank"
                              >
                                {comment.post.title}
                              </Link>
                            </div>
                          )}
                          {comment.parent_id && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <Reply className="h-3 w-3" />
                              <span>Yanıt</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.author_avatar || "/placeholder-user.jpg"} />
                            <AvatarFallback className="text-xs">
                              {comment.author_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {comment.author_name}
                            </div>
                            {comment.author_email && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {comment.author_email}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(comment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(comment.created_at).toLocaleDateString("tr-TR")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {comment.status === "pending" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(comment.id, "approved")}>
                                <Check className="h-4 w-4 mr-2" />
                                Onayla
                              </DropdownMenuItem>
                            )}
                            {comment.status === "pending" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(comment.id, "rejected")}>
                                <X className="h-4 w-4 mr-2" />
                                Reddet
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleStatusChange(comment.id, "spam")}>
                              <Flag className="h-4 w-4 mr-2" />
                              Spam Olarak İşaretle
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openEditModal(comment)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Düzenle
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {comment.post && (
                              <DropdownMenuItem asChild>
                                <Link href={`/blog/${comment.post.slug}`} target="_blank">
                                  <Eye className="h-4 w-4 mr-2" />
                                  Yazıyı Görüntüle
                                </Link>
                              </DropdownMenuItem>
                            )}
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
                                  <AlertDialogTitle>Yorumu silmek istediğinizden emin misiniz?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Bu işlem geri alınamaz. Yorum kalıcı olarak silinecektir.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>İptal</AlertDialogCancel>
                                  <AlertDialogAction 
                                    className="bg-red-600 hover:bg-red-700"
                                    onClick={() => handleDeleteComment(comment.id)}
                                  >
                                    Sil
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
