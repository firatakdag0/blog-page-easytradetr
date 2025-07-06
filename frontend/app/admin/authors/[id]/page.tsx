"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Author } from "@/lib/api"
import { ArrowLeft, Edit, User, Mail, Globe, Twitter, Linkedin, Instagram, Facebook, Youtube, Calendar, MapPin, Award, BookOpen, Eye, Heart, MessageSquare, Loader2 } from "lucide-react"
import Link from "next/link"

export default function AuthorProfilePage() {
  const params = useParams()
  const router = useRouter()
  const authorId = Number(params.id)
  
  const [author, setAuthor] = useState<Author | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAuthor()
  }, [authorId])

  async function fetchAuthor() {
    setLoading(true)
    try {
      const res = await fetch(`http://localhost:8000/api/v1/authors/${authorId}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setAuthor(data)
    } catch (e) {
      setError("Yazar bilgileri yüklenemedi")
      toast.error("Yazar bilgileri yüklenemedi")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin h-8 w-8" />
    </div>
  )

  if (error || !author) return (
    <div className="p-8 text-center">
      <p className="text-red-500 mb-4">{error || "Yazar bulunamadı"}</p>
      <Button onClick={() => router.back()}>Geri Dön</Button>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Yazar Profili</h1>
            <p className="text-gray-600 dark:text-gray-400">Yazar detayları ve istatistikleri</p>
          </div>
        </div>
        <Button onClick={() => router.push(`/admin/authors`)}>
          <Edit className="h-4 w-4 mr-2" />
          Düzenle
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol Kolon - Profil Bilgileri */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profil Kartı */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                {author.profile_image ? (
                  <img 
                    src={author.profile_image} 
                    alt={`${author.first_name} ${author.last_name}`}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-gray-200 dark:border-gray-700"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full mx-auto mb-4 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User className="h-16 w-16 text-gray-400" />
                  </div>
                )}
                
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {author.first_name} {author.last_name}
                </h2>
                
                {author.title && (
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{author.title}</p>
                )}
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  {author.is_active ? (
                    <Badge className="bg-green-500">Aktif</Badge>
                  ) : (
                    <Badge className="bg-gray-400">Pasif</Badge>
                  )}
                  {author.is_featured && (
                    <Badge className="bg-blue-500">Öne Çıkan</Badge>
                  )}
                </div>

                {author.bio && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {author.bio}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* İletişim Bilgileri */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                İletişim Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{author.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm">@{author.username}</span>
              </div>
              {author.website && (
                <div className="flex items-center gap-3">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <a href={author.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                    {author.website}
                  </a>
                </div>
              )}
              {author.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{author.location}</span>
                </div>
              )}
              {author.birth_date && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{new Date(author.birth_date).toLocaleDateString('tr-TR')}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sosyal Medya */}
          {(author.twitter || author.linkedin || author.instagram || author.facebook || author.youtube) && (
            <Card>
              <CardHeader>
                <CardTitle>Sosyal Medya</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {author.twitter && (
                  <a href={author.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-blue-400 hover:text-blue-600">
                    <Twitter className="h-4 w-4" />
                    <span className="text-sm">Twitter</span>
                  </a>
                )}
                {author.linkedin && (
                  <a href={author.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-blue-600 hover:text-blue-800">
                    <Linkedin className="h-4 w-4" />
                    <span className="text-sm">LinkedIn</span>
                  </a>
                )}
                {author.instagram && (
                  <a href={author.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-pink-500 hover:text-pink-600">
                    <Instagram className="h-4 w-4" />
                    <span className="text-sm">Instagram</span>
                  </a>
                )}
                {author.facebook && (
                  <a href={author.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-blue-600 hover:text-blue-800">
                    <Facebook className="h-4 w-4" />
                    <span className="text-sm">Facebook</span>
                  </a>
                )}
                {author.youtube && (
                  <a href={author.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-red-500 hover:text-red-600">
                    <Youtube className="h-4 w-4" />
                    <span className="text-sm">YouTube</span>
                  </a>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sağ Kolon - İstatistikler ve Detaylar */}
        <div className="lg:col-span-2 space-y-6">
          {/* İstatistikler */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{author.posts_count}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Yazı</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Eye className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{author.views_count}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Görüntülenme</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{author.likes_count}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Beğeni</div>
              </CardContent>
            </Card>
          </div>

          {/* Uzmanlık Alanları */}
          {author.expertise && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Uzmanlık Alanları
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400">{author.expertise}</p>
              </CardContent>
            </Card>
          )}

          {/* Son Yazılar (Gelecekte eklenebilir) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Son Yazılar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Yazarın yazıları burada görünecek</p>
                <p className="text-sm">(Gelecekte eklenecek)</p>
              </div>
            </CardContent>
          </Card>

          {/* Sistem Bilgileri */}
          <Card>
            <CardHeader>
              <CardTitle>Sistem Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Kayıt Tarihi:</span>
                <span>{new Date(author.created_at).toLocaleDateString('tr-TR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Son Güncelleme:</span>
                <span>{new Date(author.updated_at).toLocaleDateString('tr-TR')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Durum:</span>
                <span>{author.is_active ? 'Aktif' : 'Pasif'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Öne Çıkan:</span>
                <span>{author.is_featured ? 'Evet' : 'Hayır'}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 