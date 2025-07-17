"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { apiClient, BlogPost, getResponsiveImageUrl, getPostBySlugFromSupabase, incrementPostViewCount } from "@/lib/api"
import { Calendar, Clock, Facebook, Twitter, Linkedin, Link2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import rehypeSanitize from "rehype-sanitize"
import "highlight.js/styles/github.css"
import Link from "next/link"
import { Inter } from "next/font/google"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination as SwiperPagination, A11y } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { AnimatePresence } from "framer-motion"
const inter = Inter({ subsets: ["latin"], weight: ["400", "700"] })

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [prevPost, setPrevPost] = useState<BlogPost | null>(null)
  const [nextPost, setNextPost] = useState<BlogPost | null>(null)
  // Benzer yazılar için state
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [relatedError, setRelatedError] = useState<string | null>(null);
  const [contentPage, setContentPage] = useState(0)
  const contentCardMobileRef = useRef<HTMLDivElement>(null)
  const contentCardDesktopRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        // const fetchedPost = await apiClient.getBlogPostBySlug(slug)
        const fetchedPost = await getPostBySlugFromSupabase(slug)
        setPost(fetchedPost)
        // const { prev, next } = await apiClient.getPrevNextPosts(slug)
        // setPrevPost(prev)
        // setNextPost(next)
      } catch (err) {
        setError("Blog yazısı bulunamadı.")
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [slug])

  const postData: any = (post && (typeof post === 'object' && 'data' in post ? post.data : post)) || null

  // Post görüntülenince views_count artır
  useEffect(() => {
    if (postData?.id) {
      incrementPostViewCount(postData.id);
    }
  }, [postData?.id]);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  useEffect(() => {
    if (!postData?.category?.slug) return;
    setRelatedLoading(true);
    setRelatedError(null);
    fetch(`${API_BASE_URL}/api/v1/posts?per_page=10`)
      .then(res => res.json())
      .then(data => {
        console.log('Benzer yazılar API URL:', `${API_BASE_URL}/api/v1/posts?per_page=10`);
        console.log('Benzer yazılar API yanıtı:', data);
        if (data && data.data && Array.isArray(data.data.data)) {
          const allPosts = data.data.data.filter((p: any) => p.id !== postData.id);
          const shuffled = allPosts.sort(() => 0.5 - Math.random());
          setRelatedPosts(shuffled.slice(0, 3));
        } else {
          setRelatedPosts([]);
        }
      })
      .catch(() => setRelatedError("Benzer yazılar yüklenemedi."))
      .finally(() => setRelatedLoading(false));
  }, [postData?.category?.slug, postData?.id]);

  // Split content into pages by every 5 '##' (h2) sections, including all content up to the 6th heading in the next page
  function splitContentByH2(content: string, perPage: number = 5): string[] {
    const lines = content.split(/\n/)
    let pages: string[] = []
    let buffer = ""
    let h2Count = 0
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith("## ")) {
        h2Count++
        if (h2Count > perPage) {
          pages.push(buffer.trim())
          buffer = ""
          h2Count = 1 // current heading starts new page
        }
      }
      buffer += lines[i] + "\n"
    }
    if (buffer.trim()) {
      pages.push(buffer.trim())
    }
    return pages
  }
  const contentPages = postData?.content ? splitContentByH2(postData.content, 5) : []

  if (loading && !postData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <span className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full block" />
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
  if (!postData) return null

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

  // Devamını Oku butonuna tıklanınca mobilde başa scroll
  const handleReadMore = () => {
    setContentPage((p) => Math.min(contentPages.length - 1, p + 1))
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setTimeout(() => {
        const anchor = contentCardMobileRef.current
        if (anchor) {
          anchor.scrollIntoView({ behavior: "smooth", block: "start" })
          setTimeout(() => {
            window.scrollBy({ top: -40, behavior: "smooth" })
          }, 400)
        }
      }, 150)
    }
  }

  return (
    <div className="w-full min-h-screen bg-background transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      {/* Blog badge ve breadcrumb */}
      <div className="flex items-center gap-2 mt-8 mb-4">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 text-foreground text-sm font-semibold shadow hover:bg-[hsl(135,100%,50%)] hover:text-black dark:hover:bg-[hsl(135,100%,40%)] transition-all"
        >
          <span className="inline-block -ml-1 mr-1 text-base">←</span>
          Bloga Dön
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span
          className="text-base font-bold text-foreground truncate max-w-[180px] md:max-w-[320px]"
          title={postData?.title}
        >
          {postData?.title}
        </span>
      </div>
      {/* İçerik ve Görsel: Yanyana iki sütun */}
        <div className="w-full">
          {/* Mobilde: görsel ve içerik hemen animasyonla gelsin, diğer kutular scroll ile animasyonlansın */}
          <div className="block md:hidden">
            {/* Kapak görseli */}
        {postData.featured_image && (
          <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full flex flex-col items-center gap-8 mb-8 mt-8"
          >
            <div className="aspect-[16/10] w-full max-w-none overflow-hidden rounded-3xl shadow-2xl relative group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              <motion.img
                    src={postData.featured_image || '/placeholder.svg'}
                alt={postData.title}
                className="w-full h-full object-cover object-center scale-105 blur-[1px] brightness-90 transition-all duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            </div>
              </motion.div>
            )}
            {/* İçerik alanı */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
              className="w-full"
            >
              {/* Başlık, meta, etiketler, içerik, kart, vs. (mevcut sağ sütun kodu) */}
              <div className="text-left mb-8"
              >
                {postData.category && (
                  <span className="bg-[hsl(135,100%,50%)] text-black px-4 py-1 rounded-full text-xs font-semibold shadow-lg mb-2 inline-block animate-fade-in">
                    {postData.category.name}
                  </span>
                )}
                <h1 className="text-4xl md:text-5xl font-extrabold mt-4 mb-2 animate-fade-in-slow bg-gradient-to-r from-[hsl(135,100%,50%)] via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  {postData.title}
                </h1>
                {/* Replace the meta info and tags area with a flex row: meta info left, tags right */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-2 animate-fade-in-slow">
                  <div className="flex flex-wrap gap-4 text-sm opacity-90 items-center">
                    <span className="flex items-center gap-1"><Calendar className="h-4 w-4 text-[hsl(135,100%,50%)]" />{new Date(postData.published_at).toLocaleDateString("tr-TR")}</span>
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-[hsl(135,100%,50%)]" />{postData.read_time} dk okuma</span>
                    <span>{postData.author?.name}</span>
                  </div>
                  {postData.tags && postData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {postData.tags.map((tag: any) => (
                        <span key={tag.id} className="bg-[hsl(135,100%,10%)]/10 text-black dark:text-white px-3 py-1 rounded-full text-xs font-semibold">
                          #{tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* İçerik animasyonlu sayfalandırma */}
              <Card className="rounded-2xl shadow-xl bg-gradient-to-br from-[hsl(135,100%,98%)] via-white to-blue-50/40 dark:from-gray-900/80 dark:via-gray-800/60 dark:to-gray-700/40 p-6 md:p-10 my-8 pb-20">
                {/* Animasyonlu içerik alanı */}
                <div
                  className="relative min-h-[400px]"
                  ref={contentCardMobileRef}
                  style={{ scrollMarginTop: 120 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={contentPage}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5 }}
                      className="relative w-full"
                    >
                      <div className={`${inter.className} prose prose-lg max-w-none text-foreground dark:prose-invert`}>
                        <ReactMarkdown
                          rehypePlugins={[rehypeHighlight, rehypeSanitize]}
                          children={contentPages[contentPage]}
                        />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
                {/* Sayfa bilgisi ve butonlar (alta alındı) */}
                <div className="flex flex-col items-center gap-4 mt-8 md:flex-row md:items-center md:justify-between md:gap-4">
                  {contentPage > 0 ? (
                    <Button
                      variant="outline"
                      onClick={() => setContentPage((p) => Math.max(0, p - 1))}
                      className="rounded-full px-6 py-2 shadow-md hover:bg-[hsl(135,100%,50%)] hover:text-black transition-all font-semibold text-base"
                      style={{ minWidth: 140 }}
                    >
                      ← Önceki
                    </Button>
                  ) : <div style={{ minWidth: 140 }} />}
                  {contentPages.length > 1 && (
                    <div className="flex flex-col items-center">
                      <span className="text-sm text-muted-foreground">Sayfa {contentPage + 1} / {contentPages.length}</span>
                      {contentPage < contentPages.length - 1 && (
                        <span className="text-xs text-muted-foreground">Devamı için sağdaki butonu kullanın →</span>
                      )}
                    </div>
                  )}
                  {contentPage < contentPages.length - 1 ? (
                    <Button
                      variant="outline"
                      onClick={handleReadMore}
                      className="rounded-full px-6 py-2 shadow-md hover:bg-[hsl(135,100%,50%)] hover:text-black transition-all font-semibold text-base"
                      style={{ minWidth: 140 }}
                    >
                      Devamını Oku →
                    </Button>
                  ) : <div style={{ minWidth: 140 }} />}
                </div>
              </Card>
              {/* Etiketler */}
              {/* Önceki/Sonraki yazı okları */}
              {/* Remove any code that renders previous/next post navigation links such as 'Önceki Yazı' and 'Sonraki Yazı' at the bottom of the page. */}
              {/* Only keep the paginated content navigation inside the Card. */}
            </motion.div>
            {/* Yazar kutusu (her yerde aynı, modern ve sade) */}
            <Card className="rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 flex flex-col items-center gap-3 mt-6 w-full max-w-none">
              <div className="w-full font-semibold text-base mb-3 text-foreground flex items-center gap-2 justify-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline" viewBox="0 0 24 24">
                  <circle cx="12" cy="7" r="4"></circle>
                  <path d="M5.5 21a8.38 8.38 0 0 1 13 0"></path>
                </svg>
                <span className="text-xl font-extrabold tracking-tight ml-1">Yazar</span>
              </div>
              <Avatar className="h-20 w-20 mb-2 shadow-lg border-4 border-[hsl(135,100%,50%)]">
                <AvatarImage src={postData.author?.avatar || '/placeholder-user.jpg'} />
                <AvatarFallback>
                  {postData.author?.name ? postData.author.name.split(' ').map((n: string) => n[0]).join('') : '??'}
                </AvatarFallback>
              </Avatar>
              <div className="font-bold text-lg text-foreground text-center">{postData.author?.name || 'Bilinmeyen Yazar'}</div>
            </Card>
            {/* Benzer yazılar kutusu */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
              viewport={{ once: true, amount: 0.3 }}
              className="bg-gradient-to-br from-[hsl(210,100%,98%)] via-white to-[hsl(135,100%,90%)] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-8 md:p-10 w-full max-w-none mt-2 border border-[hsl(135,100%,50%)]/10 min-h-[340px] md:min-h-[380px] flex flex-col justify-start"
            >
              <div className="font-semibold text-base mb-3 text-foreground flex items-center gap-2">
                <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='inline' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10'></circle><path d='M12 8v4l3 3'></path></svg>
                <span className="text-xl font-extrabold tracking-tight ml-1">Benzer Yazılar</span>
              </div>
              <div className="mb-4" />
              {relatedLoading ? (
                <div className="text-center py-8 text-muted-foreground">Yükleniyor...</div>
              ) : relatedError ? (
                <div className="text-center py-8 text-red-500">{relatedError}</div>
              ) : relatedPosts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">Benzer yazı bulunamadı.</div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {relatedPosts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                      <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-500 bg-card rounded-2xl h-full flex flex-col">
                      <div className="relative overflow-hidden">
                        <img
                          src={post.featured_image || "/placeholder.jpg"}
                          alt={post.title}
                          className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-white/90 text-foreground dark:bg-gray-800/90 border-0 rounded-xl px-3 py-1 text-xs font-medium backdrop-blur-sm">{post.category?.name}</span>
                        </div>
                      </div>
                      <CardHeader className="p-4 pb-2 flex-1">
                        <CardTitle className="text-lg transition-colors line-clamp-2 mb-2 leading-tight">
                          {post.title}
                        </CardTitle>
                        <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">{post.excerpt}</p>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"></circle><path d="M5.5 21a8.38 8.38 0 0 1 13 0"></path></svg>
                          <span className="text-xs font-medium text-foreground">{post.author?.name}</span>
                        </div>
                        <Button
                          className="bg-[hsl(135,100%,50%)] hover:bg-[hsl(135,100%,45%)] text-black rounded-xl px-4 py-2 text-xs font-semibold transition-all"
                          style={{ minWidth: 48, minHeight: 32 }}
                        >
                          Oku
                        </Button>
                      </CardContent>
                    </Card>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
          {/* Move the <div className='hidden md:flex ...'> block so it is a sibling of <div className='block md:hidden'>, not nested inside it. */}
          {/* The structure should be: */}
          {/* <div className='w-full'> */}
          {/*   <div className='block md:hidden'>...</div> */}
          {/*   <div className='hidden md:flex ...'>...</div> */}
          {/* </div> */}
          <div className="hidden md:flex flex-row gap-8 md:gap-12 items-start">
            {/* Sol: Kapak görseli, benzer yazılar, yazar kutusu */}
            <div className="w-full md:w-2/5 flex-shrink-0 flex flex-col items-center md:items-start gap-8 mb-8 md:mb-0 mt-8">
              {/* Kapak görseli */}
              {postData.featured_image && (
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="w-full flex flex-col items-center gap-8 mb-8 mt-8"
                >
                  <div className="aspect-[16/10] w-full max-w-none overflow-hidden rounded-3xl shadow-2xl relative group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                    <motion.img
                      src={postData.featured_image || '/placeholder.svg'}
                      alt={postData.title}
                      className="w-full h-full object-cover object-center scale-105 blur-[1px] brightness-90 transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                  </div>
                </motion.div>
              )}
              {/* Benzer yazılar kutusu */}
              <div className="bg-gradient-to-br from-[hsl(210,100%,98%)] via-white to-[hsl(135,100%,90%)] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 w-full max-w-none mt-2 border border-[hsl(135,100%,50%)]/10">
                <div className="font-semibold text-base mb-3 text-foreground flex items-center gap-2">
                  <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='inline' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10'></circle><path d='M12 8v4l3 3'></path></svg>
                  <span className="text-xl font-extrabold tracking-tight ml-1">Benzer Yazılar</span>
                </div>
                {relatedLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Yükleniyor...</div>
                ) : relatedError ? (
                  <div className="text-center py-8 text-red-500">{relatedError}</div>
                ) : relatedPosts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">Benzer yazı bulunamadı.</div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {relatedPosts.map((post) => (
                      <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                        <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-500 bg-card rounded-2xl h-full flex flex-col">
                          <div className="relative overflow-hidden">
                            <img
                              src={post.featured_image || "/placeholder.jpg"}
                              alt={post.title}
                              className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute top-3 left-3">
                              <span className="bg-white/90 text-foreground dark:bg-gray-800/90 border-0 rounded-xl px-3 py-1 text-xs font-medium backdrop-blur-sm">{post.category?.name}</span>
                            </div>
                          </div>
                          <CardHeader className="p-4 pb-2 flex-1">
                            <CardTitle className="text-lg transition-colors line-clamp-2 mb-2 leading-tight">
                              {post.title}
                            </CardTitle>
                            <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">{post.excerpt}</p>
                          </CardHeader>
                          <CardContent className="p-4 pt-0 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"></circle><path d="M5.5 21a8.38 8.38 0 0 1 13 0"></path></svg>
                              <span className="text-xs font-medium text-foreground">{post.author?.name}</span>
                            </div>
                            <Button
                              className="bg-[hsl(135,100%,50%)] hover:bg-[hsl(135,100%,45%)] text-black rounded-xl px-4 py-2 text-xs font-semibold transition-all"
                              style={{ minWidth: 48, minHeight: 32 }}
                            >
                              Oku
                            </Button>
                          </CardContent>
                        </Card>
                      </Link>
                  ))}
                </div>
              )}
            </div>
              {/* Yazar kutusu (mobildekiyle aynı) */}
              <Card className="rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 flex flex-col items-center gap-3 mt-6 w-full max-w-none">
                <div className="w-full font-semibold text-base mb-3 text-foreground flex items-center gap-2 justify-start">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline" viewBox="0 0 24 24">
                    <circle cx="12" cy="7" r="4"></circle>
                    <path d="M5.5 21a8.38 8.38 0 0 1 13 0"></path>
                  </svg>
                  <span className="text-xl font-extrabold tracking-tight ml-1">Yazar</span>
                </div>
                <Avatar className="h-20 w-20 mb-2 shadow-lg border-4 border-[hsl(135,100%,50%)]">
                  <AvatarImage src={postData.author?.avatar || '/placeholder-user.jpg'} />
                  <AvatarFallback>
                    {postData.author?.name ? postData.author.name.split(' ').map((n: string) => n[0]).join('') : '??'}
                  </AvatarFallback>
                </Avatar>
                <div className="font-bold text-lg text-foreground text-center">{postData.author?.name || 'Bilinmeyen Yazar'}</div>
              </Card>
            </div>
          {/* Sağ: Başlık, meta ve içerik */}
        <div className="w-full md:w-3/5">
            <div className="text-left mb-8">
            {postData.category && (
              <span className="bg-[hsl(135,100%,50%)] text-black px-4 py-1 rounded-full text-xs font-semibold shadow-lg mb-2 inline-block animate-fade-in">
                {postData.category.name}
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-extrabold mt-4 mb-2 animate-fade-in-slow bg-gradient-to-r from-[hsl(135,100%,50%)] via-blue-500 to-purple-600 bg-clip-text text-transparent">
              {postData.title}
            </h1>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-2 animate-fade-in-slow">
                <div className="flex flex-wrap gap-4 text-sm opacity-90 items-center">
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4 text-[hsl(135,100%,50%)]" />{new Date(postData.published_at).toLocaleDateString("tr-TR")}</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-[hsl(135,100%,50%)]" />{postData.read_time} dk okuma</span>
              <span>{postData.author?.name}</span>
            </div>
            {postData.tags && postData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                {postData.tags.map((tag: any) => (
                  <span key={tag.id} className="bg-[hsl(135,100%,10%)]/10 text-black dark:text-white px-3 py-1 rounded-full text-xs font-semibold">
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}
              </div>
            </div>
            {/* İçerik animasyonlu sayfalandırma */}
            <Card className="rounded-2xl shadow-xl bg-gradient-to-br from-[hsl(135,100%,98%)] via-white to-blue-50/40 dark:from-gray-900/80 dark:via-gray-800/60 dark:to-gray-700/40 p-6 md:p-10 my-8 pb-20">
              {/* Animasyonlu içerik alanı */}
              <div className="relative min-h-[400px]" ref={contentCardDesktopRef}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={contentPage}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="relative w-full"
                  >
                    <div className={`${inter.className} prose prose-lg max-w-none text-foreground dark:prose-invert`}>
                      <ReactMarkdown
                        rehypePlugins={[rehypeHighlight, rehypeSanitize]}
                        children={contentPages[contentPage]}
                      />
            </div>
          </motion.div>
                </AnimatePresence>
              </div>
              {/* Sayfa bilgisi ve butonlar (responsive) */}
              <div className="flex flex-col items-center gap-4 mt-8 md:flex-row md:items-center md:justify-between md:gap-4">
                {contentPage > 0 ? (
                  <Button
                    variant="outline"
                    onClick={() => setContentPage((p) => Math.max(0, p - 1))}
                    className="rounded-full px-6 py-2 shadow-md hover:bg-[hsl(135,100%,50%)] hover:text-black transition-all font-semibold text-base"
                    style={{ minWidth: 140 }}
                  >
                    ← Önceki
                  </Button>
                ) : <div style={{ minWidth: 140 }} />}
                {contentPages.length > 1 && (
                  <div className="flex flex-col items-center">
                    <span className="text-sm text-muted-foreground">Sayfa {contentPage + 1} / {contentPages.length}</span>
                    {contentPage < contentPages.length - 1 && (
                      <span className="text-xs text-muted-foreground">Devamı için sağdaki butonu kullanın →</span>
                    )}
                  </div>
                )}
                {contentPage < contentPages.length - 1 ? (
                  <Button
                    variant="outline"
                    onClick={handleReadMore}
                    className="rounded-full px-6 py-2 shadow-md hover:bg-[hsl(135,100%,50%)] hover:text-black transition-all font-semibold text-base"
                    style={{ minWidth: 140 }}
                  >
                    Devamını Oku →
                  </Button>
                ) : <div style={{ minWidth: 140 }} />}
              </div>
            </Card>
          </div>
        </div>
      </div>
      <style>{`
            .prose h1 { font-size: 2rem !important; }
            .prose h2 { font-size: 1.5rem !important; }
            .prose h3 { font-size: 1.25rem !important; }
            .prose h4 { font-size: 1.1rem !important; }
            .prose h5 { font-size: 1rem !important; }
            .prose h6 { font-size: 0.95rem !important; }
            .prose p, .prose ul, .prose ol { font-size: 1.1rem !important; }
          `}</style>
        </div>
    </div>
  )
}
