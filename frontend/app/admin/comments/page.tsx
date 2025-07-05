"use client"

import { useState } from "react"
import { motion } from "framer-motion"
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
import {
  MessageSquare,
  Search,
  MoreHorizontal,
  Check,
  X,
  Trash2,
  Clock,
  Calendar,
  ExternalLink,
  Flag,
  Reply,
} from "lucide-react"
import Link from "next/link"

// Mock data
const comments = [
  {
    id: 1,
    author: {
      name: "Ayşe Özkan",
      email: "ayse@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    content:
      "Çok faydalı bir yazı olmuş, teşekkürler! Özellikle dijital dönüşüm konusundaki örnekler çok açıklayıcıydı.",
    post: {
      id: 1,
      title: "2024'te Küçük İşletmeler İçin Dijital Dönüşüm Stratejileri",
      slug: "dijital-donusum-stratejileri-2024",
    },
    status: "approved",
    createdAt: "2024-01-15T14:30:00Z",
    updatedAt: "2024-01-15T14:30:00Z",
    isSpam: false,
    replies: [],
  },
  {
    id: 2,
    author: {
      name: "Mehmet Yıldız",
      email: "mehmet@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    content: "Bu konuda daha detaylı bilgi alabilir miyim? Özellikle barkod sistemi kurulumu hakkında.",
    post: {
      id: 2,
      title: "Barkod Sistemi ile Stok Yönetiminde %90 Zaman Tasarrufu",
      slug: "barkod-sistemi-stok-yonetimi",
    },
    status: "pending",
    createdAt: "2024-01-14T16:45:00Z",
    updatedAt: "2024-01-14T16:45:00Z",
    isSpam: false,
    replies: [],
  },
  {
    id: 3,
    author: {
      name: "Fatma Kaya",
      email: "fatma@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    content: "Harika açıklamalar, işime çok yarayacak. Teşekkür ederim.",
    post: {
      id: 3,
      title: "Perakende Sektöründe Müşteri Deneyimi Optimizasyonu",
      slug: "perakende-musteri-deneyimi",
    },
    status: "approved",
    createdAt: "2024-01-13T10:20:00Z",
    updatedAt: "2024-01-13T10:20:00Z",
    isSpam: false,
    replies: [],
  },
  {
    id: 4,
    author: {
      name: "Spam User",
      email: "spam@spam.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    content: "Click here for amazing deals! Buy now and get 50% off!",
    post: {
      id: 1,
      title: "2024'te Küçük İşletmeler İçin Dijital Dönüşüm Stratejileri",
      slug: "dijital-donusum-stratejileri-2024",
    },
    status: "spam",
    createdAt: "2024-01-12T08:15:00Z",
    updatedAt: "2024-01-12T08:15:00Z",
    isSpam: true,
    replies: [],
  },
]

const statuses = ["Tümü", "pending", "approved", "spam", "rejected"]

export default function CommentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("Tümü")
  const [selectedComments, setSelectedComments] = useState<number[]>([])

  const filteredComments = comments.filter((comment) => {
    const matchesSearch =
      comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comment.post.title.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = selectedStatus === "Tümü" || comment.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const toggleCommentSelection = (commentId: number) => {
    setSelectedComments((prev) =>
      prev.includes(commentId) ? prev.filter((id) => id !== commentId) : [...prev, commentId],
    )
  }

  const toggleSelectAll = () => {
    setSelectedComments(
      selectedComments.length === filteredComments.length ? [] : filteredComments.map((comment) => comment.id),
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Onaylı</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Bekliyor</Badge>
      case "spam":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Spam</Badge>
      case "rejected":
        return <Badge variant="secondary">Reddedildi</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for comments:`, selectedComments)
    setSelectedComments([])
  }

  const handleCommentAction = (commentId: number, action: string) => {
    console.log(`Action: ${action} for comment:`, commentId)
  }

  const getStatusCounts = () => {
    return {
      total: comments.length,
      pending: comments.filter((c) => c.status === "pending").length,
      approved: comments.filter((c) => c.status === "approved").length,
      spam: comments.filter((c) => c.status === "spam").length,
      rejected: comments.filter((c) => c.status === "rejected").length,
    }
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Yorum Yönetimi</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Blog yorumlarını inceleyin, onaylayın veya silin.</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>{statusCounts.pending} bekliyor</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>{statusCounts.spam} spam</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: "Toplam", value: statusCounts.total, color: "bg-blue-500" },
          { label: "Bekliyor", value: statusCounts.pending, color: "bg-yellow-500" },
          { label: "Onaylı", value: statusCounts.approved, color: "bg-green-500" },
          { label: "Spam", value: statusCounts.spam, color: "bg-red-500" },
          { label: "Reddedildi", value: statusCounts.rejected, color: "bg-gray-500" },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
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
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "Tümü"
                      ? "Tümü"
                      : status === "pending"
                        ? "Bekliyor"
                        : status === "approved"
                          ? "Onaylı"
                          : status === "spam"
                            ? "Spam"
                            : "Reddedildi"}
                  </SelectItem>
                ))}
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
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("spam")}>
                  <Flag className="h-4 w-4 mr-1" />
                  Spam İşaretle
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

      {/* Comments List */}
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
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredComments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <div className="flex items-start gap-4">
                  <input
                    type="checkbox"
                    checked={selectedComments.includes(comment.id)}
                    onChange={() => toggleCommentSelection(comment.id)}
                    className="rounded border-gray-300 mt-1"
                  />

                  <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {comment.author.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{comment.author.name}</h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{comment.author.email}</span>
                      {getStatusBadge(comment.status)}
                      {comment.isSpam && (
                        <Badge variant="destructive" className="text-xs">
                          <Flag className="h-3 w-3 mr-1" />
                          Spam
                        </Badge>
                      )}
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">{comment.content}</p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(comment.createdAt).toLocaleDateString("tr-TR")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(comment.createdAt).toLocaleTimeString("tr-TR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                      <Link
                        href={`/blog/${comment.post.slug}`}
                        className="flex items-center gap-1 hover:text-[hsl(135,100%,50%)] transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        {comment.post.title}
                      </Link>
                    </div>

                    <div className="flex items-center gap-2">
                      {comment.status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCommentAction(comment.id, "approve")}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Onayla
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleCommentAction(comment.id, "reject")}>
                            <X className="h-4 w-4 mr-1" />
                            Reddet
                          </Button>
                        </>
                      )}

                      <Button size="sm" variant="outline" onClick={() => handleCommentAction(comment.id, "reply")}>
                        <Reply className="h-4 w-4 mr-1" />
                        Yanıtla
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {comment.status !== "spam" && (
                            <DropdownMenuItem onClick={() => handleCommentAction(comment.id, "spam")}>
                              <Flag className="h-4 w-4 mr-2" />
                              Spam İşaretle
                            </DropdownMenuItem>
                          )}
                          {comment.status === "spam" && (
                            <DropdownMenuItem onClick={() => handleCommentAction(comment.id, "not-spam")}>
                              <Check className="h-4 w-4 mr-2" />
                              Spam Değil
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
                                  onClick={() => handleCommentAction(comment.id, "delete")}
                                >
                                  Sil
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
