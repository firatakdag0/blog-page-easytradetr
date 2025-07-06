"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Footer } from "@/components/ui/footer"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { apiClient, BlogPost, getResponsiveImageUrl } from "@/lib/api"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Share2,
  Bookmark,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Heart,
  BookOpen,
  User,
  Tag,
  ChevronRight,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import ReactMarkdown from "react-markdown"

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        const fetchedPost = await apiClient.getBlogPostBySlug(slug)
        console.log('POST DATA:', fetchedPost)
        setPost(fetchedPost)
        setLikesCount(fetchedPost.likes_count || 0)
      } catch (err) {
        setError("Blog yazısı bulunamadı.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [slug])

  // Helper: unwrap post if API returns { success, data }
  const postData: any = (post && (typeof post === 'object' && 'data' in post ? post.data : post)) || null

  if (loading && !postData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-lg text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (!postData) {
    return null // Should not happen if loading and error are handled
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
  }

  const handleShare = (platform: string) => {
    const url = window.location.href
    const title = postData.title

    switch (platform) {
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank")
        break
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, "_blank")
        break
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank")
        break
      case "copy":
        navigator.clipboard.writeText(url)
        break
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Back Link */}
      <header className="w-full border-b bg-background/95 mb-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
          <Link href="/blog" className="flex items-center gap-2 hover:opacity-80 transition-opacity text-sm font-medium">
            <span className="inline-block rotate-180">➔</span>
            Blog'a Dön
          </Link>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            {postData.category && (
              <>
                <span className="mx-1">/</span>
                <Link href={`/blog/category/${postData.category.slug}`} className="hover:text-foreground transition-colors">{postData.category.name}</Link>
              </>
            )}
            <span className="mx-1">/</span>
            <span className="text-foreground line-clamp-1">{postData.title}</span>
          </nav>

          {/* Header Section */}
          <div className="mb-8">
            {/* Category */}
            {postData.category && (
              <span className="inline-block bg-muted text-foreground px-3 py-1 rounded-full text-xs font-semibold mb-2">
                {postData.category.name}
              </span>
            )}
            {/* Title */}
            <h1 className="text-4xl font-bold text-foreground mb-2 mt-2 leading-tight">
              {postData.title}
            </h1>
            {/* Excerpt */}
            {postData.excerpt && (
              <p className="text-lg text-muted-foreground italic mb-4 mt-2">{postData.excerpt}</p>
            )}
            {/* Author & Date */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              {postData.author?.name && <span>{postData.author.name}</span>}
              {postData.published_at && (
                <>
                  <span>|</span>
                  <span>
                    {new Date(postData.published_at).toLocaleDateString("tr-TR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </>
              )}
            </div>
            {/* Cover Image */}
            {postData.featured_image && (
              <div className="mb-8 flex justify-center">
                <img
                  src={getResponsiveImageUrl({ url: postData.featured_image } as any, 800)}
                  alt={postData.title}
                  className="rounded-xl max-h-96 object-cover shadow-md w-full"
                />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-8 font-serif leading-relaxed">
            <ReactMarkdown>{postData.content || ""}</ReactMarkdown>
          </div>

          {/* Tags */}
          {postData.tags && postData.tags.length > 0 && (
            <div className="mb-8">
              <div className="text-sm font-semibold mb-2">Etiketler:</div>
              <div className="flex flex-wrap gap-2">
                {postData.tags.map((tag: any) => (
                  <span key={tag.id} className="bg-muted px-3 py-1 rounded-full text-xs">
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="mt-12 border-t pt-8">
            <h2 className="text-xl font-bold mb-6">Yorumlar ({postData.comments_count || 0})</h2>
            {postData.comments && postData.comments.length > 0 ? (
              <div className="space-y-6">
                {postData.comments.map((comment: any) => (
                  <div key={comment.id} className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={comment.author_avatar || "/placeholder-user.jpg"} />
                      <AvatarFallback>
                        {comment.author_name?.split(" ").map((n: string) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-sm">{comment.author_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString("tr-TR")}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
