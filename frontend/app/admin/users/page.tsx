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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Users,
  Search,
  MoreHorizontal,
  Ban,
  Shield,
  Mail,
  Calendar,
  MessageSquare,
  Heart,
  Eye,
  Flag,
  UserCheck,
  UserX,
  Activity,
} from "lucide-react"

// Mock user data
const users = [
  {
    id: 1,
    name: "Ayşe Özkan",
    email: "ayse@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "user",
    status: "active",
    joinDate: "2024-01-15",
    lastActive: "2024-01-20T14:30:00Z",
    stats: {
      comments: 12,
      likes: 45,
      posts: 0,
      reports: 0,
    },
    ipAddress: "192.168.1.100",
    location: "İstanbul, Türkiye",
    isBanned: false,
    banReason: null,
  },
  {
    id: 2,
    name: "Mehmet Yıldız",
    email: "mehmet@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "user",
    status: "active",
    joinDate: "2024-01-10",
    lastActive: "2024-01-19T16:45:00Z",
    stats: {
      comments: 8,
      likes: 23,
      posts: 0,
      reports: 0,
    },
    ipAddress: "192.168.1.101",
    location: "Ankara, Türkiye",
    isBanned: false,
    banReason: null,
  },
  {
    id: 3,
    name: "Fatma Kaya",
    email: "fatma@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "user",
    status: "active",
    joinDate: "2024-01-08",
    lastActive: "2024-01-18T10:20:00Z",
    stats: {
      comments: 15,
      likes: 67,
      posts: 0,
      reports: 0,
    },
    ipAddress: "192.168.1.102",
    location: "İzmir, Türkiye",
    isBanned: false,
    banReason: null,
  },
  {
    id: 4,
    name: "Spam User",
    email: "spam@spam.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "user",
    status: "banned",
    joinDate: "2024-01-05",
    lastActive: "2024-01-12T08:15:00Z",
    stats: {
      comments: 25,
      likes: 2,
      posts: 0,
      reports: 8,
    },
    ipAddress: "10.0.0.1",
    location: "Bilinmiyor",
    isBanned: true,
    banReason: "Spam içerik ve kötüye kullanım",
  },
  {
    id: 5,
    name: "Ali Demir",
    email: "ali@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "moderator",
    status: "active",
    joinDate: "2023-12-01",
    lastActive: "2024-01-20T09:30:00Z",
    stats: {
      comments: 45,
      likes: 123,
      posts: 3,
      reports: 0,
    },
    ipAddress: "192.168.1.103",
    location: "Bursa, Türkiye",
    isBanned: false,
    banReason: null,
  },
]

const roles = ["Tümü", "user", "moderator", "admin"]
const statuses = ["Tümü", "active", "banned", "inactive"]

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRole, setSelectedRole] = useState("Tümü")
  const [selectedStatus, setSelectedStatus] = useState("Tümü")
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [userDetailDialog, setUserDetailDialog] = useState<any>(null)
  const [banDialog, setBanDialog] = useState<any>(null)
  const [banReason, setBanReason] = useState("")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = selectedRole === "Tümü" || user.role === selectedRole
    const matchesStatus = selectedStatus === "Tümü" || user.status === selectedStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  const toggleUserSelection = (userId: number) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  const toggleSelectAll = () => {
    setSelectedUsers(selectedUsers.length === filteredUsers.length ? [] : filteredUsers.map((user) => user.id))
  }

  const getStatusBadge = (status: string, isBanned: boolean) => {
    if (isBanned) {
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Banlandı</Badge>
    }

    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Aktif</Badge>
      case "inactive":
        return <Badge variant="secondary">Pasif</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">Admin</Badge>
      case "moderator":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Moderatör</Badge>
      case "user":
        return <Badge variant="outline">Kullanıcı</Badge>
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const handleBanUser = (user: any) => {
    setBanDialog(user)
    setBanReason("")
  }

  const confirmBan = () => {
    console.log(`Banning user ${banDialog.id} with reason: ${banReason}`)
    setBanDialog(null)
    setBanReason("")
  }

  const handleUnbanUser = (userId: number) => {
    console.log(`Unbanning user ${userId}`)
  }

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for users:`, selectedUsers)
    setSelectedUsers([])
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR")
  }

  const formatLastActive = (dateString: string) => {
    const now = new Date()
    const lastActive = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - lastActive.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Az önce"
    if (diffInHours < 24) return `${diffInHours} saat önce`
    return `${Math.floor(diffInHours / 24)} gün önce`
  }

  const getUserStats = () => {
    return {
      total: users.length,
      active: users.filter((u) => u.status === "active" && !u.isBanned).length,
      banned: users.filter((u) => u.isBanned).length,
      moderators: users.filter((u) => u.role === "moderator").length,
      totalComments: users.reduce((sum, u) => sum + u.stats.comments, 0),
      totalReports: users.reduce((sum, u) => sum + u.stats.reports, 0),
    }
  }

  const userStats = getUserStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kullanıcı Yönetimi</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Kullanıcıları yönetin, moderasyon yapın ve güvenlik önlemleri alın.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>{userStats.banned} banlandı</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>{userStats.totalReports} şikayet</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {[
          { label: "Toplam", value: userStats.total, color: "bg-blue-500" },
          { label: "Aktif", value: userStats.active, color: "bg-green-500" },
          { label: "Banlandı", value: userStats.banned, color: "bg-red-500" },
          { label: "Moderatör", value: userStats.moderators, color: "bg-purple-500" },
          { label: "Yorum", value: userStats.totalComments, color: "bg-orange-500" },
          { label: "Şikayet", value: userStats.totalReports, color: "bg-yellow-500" },
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

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Kullanıcı ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Rol seç" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role === "Tümü"
                      ? "Tümü"
                      : role === "user"
                        ? "Kullanıcı"
                        : role === "moderator"
                          ? "Moderatör"
                          : "Admin"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Durum seç" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status === "Tümü"
                      ? "Tümü"
                      : status === "active"
                        ? "Aktif"
                        : status === "banned"
                          ? "Banlandı"
                          : "Pasif"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-4 mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                {selectedUsers.length} kullanıcı seçildi
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("message")}>
                  <Mail className="h-4 w-4 mr-1" />
                  Mesaj Gönder
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("ban")}>
                  <Ban className="h-4 w-4 mr-1" />
                  Banla
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction("role")}>
                  <Shield className="h-4 w-4 mr-1" />
                  Rol Değiştir
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Kullanıcılar ({filteredUsers.length})
            </span>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Seç
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Kullanıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Rol & Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    Aktivite
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    İstatistikler
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{user.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">{user.location}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {getRoleBadge(user.role)}
                        {getStatusBadge(user.status, user.isBanned)}
                        {user.stats.reports > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            <Flag className="h-3 w-3 mr-1" />
                            {user.stats.reports} şikayet
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4" />
                          <span>Katılım: {formatDate(user.joinDate)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                          <Activity className="h-4 w-4" />
                          <span>Son: {formatLastActive(user.lastActive)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          <span>{user.stats.comments}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{user.stats.likes}</span>
                        </div>
                        {user.stats.posts > 0 && (
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{user.stats.posts}</span>
                          </div>
                        )}
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
                          <DropdownMenuItem onClick={() => setUserDetailDialog(user)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Detayları Görüntüle
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="h-4 w-4 mr-2" />
                            Mesaj Gönder
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.isBanned ? (
                            <DropdownMenuItem onClick={() => handleUnbanUser(user.id)}>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Banı Kaldır
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleBanUser(user)}>
                              <Ban className="h-4 w-4 mr-2" />
                              Banla
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Shield className="h-4 w-4 mr-2" />
                            Rol Değiştir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* User Detail Dialog */}
      <Dialog open={!!userDetailDialog} onOpenChange={(open) => !open && setUserDetailDialog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Kullanıcı Detayları</DialogTitle>
            <DialogDescription>{userDetailDialog?.name} kullanıcısının detaylı bilgileri</DialogDescription>
          </DialogHeader>

          {userDetailDialog && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={userDetailDialog.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-lg">
                    {userDetailDialog.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{userDetailDialog.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{userDetailDialog.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {getRoleBadge(userDetailDialog.role)}
                    {getStatusBadge(userDetailDialog.status, userDetailDialog.isBanned)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Hesap Bilgileri</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Katılım Tarihi:</span>
                      <span>{formatDate(userDetailDialog.joinDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Son Aktivite:</span>
                      <span>{formatLastActive(userDetailDialog.lastActive)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">IP Adresi:</span>
                      <span className="font-mono">{userDetailDialog.ipAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Konum:</span>
                      <span>{userDetailDialog.location}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Aktivite İstatistikleri</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Yorumlar:</span>
                      <span>{userDetailDialog.stats.comments}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Beğeniler:</span>
                      <span>{userDetailDialog.stats.likes}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Gönderiler:</span>
                      <span>{userDetailDialog.stats.posts}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Şikayetler:</span>
                      <span className={userDetailDialog.stats.reports > 0 ? "text-red-600" : ""}>
                        {userDetailDialog.stats.reports}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {userDetailDialog.isBanned && userDetailDialog.banReason && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">Ban Nedeni</h4>
                  <p className="text-sm text-red-700 dark:text-red-300">{userDetailDialog.banReason}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setUserDetailDialog(null)}>
              Kapat
            </Button>
            {userDetailDialog && !userDetailDialog.isBanned && (
              <Button variant="destructive" onClick={() => handleBanUser(userDetailDialog)}>
                <Ban className="h-4 w-4 mr-2" />
                Banla
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ban Dialog */}
      <Dialog open={!!banDialog} onOpenChange={(open) => !open && setBanDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kullanıcıyı Banla</DialogTitle>
            <DialogDescription>{banDialog?.name} kullanıcısını banlamak istediğinizden emin misiniz?</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Ban Nedeni *</label>
              <textarea
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="Ban nedenini açıklayın..."
                className="mt-1 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                rows={3}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setBanDialog(null)}>
              İptal
            </Button>
            <Button variant="destructive" onClick={confirmBan} disabled={!banReason.trim()}>
              <UserX className="h-4 w-4 mr-2" />
              Banla
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
