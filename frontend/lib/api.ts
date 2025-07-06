// Laravel API endpoints
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

// Cache utility
class ApiCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  set(key: string, data: any, ttl: number = 300000) { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get(key: string): any | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  clear() {
    this.cache.clear()
  }

  delete(key: string) {
    this.cache.delete(key)
  }
}

const apiCache = new ApiCache()

// Utility function to format datetime for Turkish timezone
export function formatDateTimeForAPI(dateTimeString: string): string {
  if (!dateTimeString) return ""
  
  // Create a date object from the datetime-local input
  const date = new Date(dateTimeString)
  
  // Format to ISO string (this will be in local timezone)
  // The backend will now interpret this correctly as Turkey time
  return date.toISOString()
}

// Utility functions for image sizing
export function getImageUrl(media: MediaFile, size: 'thumbnail' | 'small' | 'medium' | 'large' | 'featured' | 'original' = 'original'): string {
  if (media.sizes_data && media.sizes_data[size]) {
    return media.sizes_data[size]!.url
  }
  return media.url
}

export function getImageSize(media: MediaFile, size: 'thumbnail' | 'small' | 'medium' | 'large' | 'featured' | 'original' = 'original'): { width: number; height: number } | null {
  if (media.sizes_data && media.sizes_data[size]) {
    return {
      width: media.sizes_data[size]!.width,
      height: media.sizes_data[size]!.height
    }
  }
  return media.width && media.height ? { width: media.width, height: media.height } : null
}

export function getResponsiveImageUrl(media: MediaFile, maxWidth: number): string {
  if (!media.sizes_data) return media.url
  
  // En uygun boyutu seç
  const sizes = ['thumbnail', 'small', 'medium', 'large', 'featured', 'original'] as const
  for (const size of sizes) {
    if (media.sizes_data[size] && media.sizes_data[size]!.width <= maxWidth) {
      return media.sizes_data[size]!.url
    }
  }
  
  // Eğer hiçbiri uygun değilse en küçük boyutu döndür
  return media.sizes_data.thumbnail?.url || media.url
}

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image: string
  category_id: number
  status: string
  category: {
    id: number
    name: string
    slug: string
    color: string
  }
  author: {
    id: number
    name: string
    email: string
    avatar: string
    bio: string
  }
  tags: Array<{
    id: number
    name: string
    slug: string
  }>
  published_at: string | null
  read_time: number
  views_count: number
  likes_count: number
  comments_count: number
  is_featured: boolean
  is_trending: boolean
  meta_title?: string
  meta_description?: string
  created_at: string
  updated_at: string
}

export interface CreatePostData {
  title: string
  slug: string
  excerpt: string
  content: string
  category_id: number
  author_id: number
  tags: string[]
  featured_image: string
  is_featured: boolean
  is_trending: boolean
  status: string
  published_at: string | null
  read_time: number
  meta_title: string
  meta_description: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string
  color: string
  posts_count: number
  created_at: string
  updated_at: string
}

export interface Tag {
  id: number
  name: string
  slug: string
  description: string
  color: string
  posts_count: number
  created_at: string
  updated_at: string
}

export interface Comment {
  id: number
  post_id: number
  user_id: number | null
  author_name: string
  author_email: string | null
  author_avatar: string | null
  content: string
  status: string
  parent_id: number | null
  likes_count: number
  created_at: string
  updated_at: string
  user?: any
  post?: any
  replies?: Comment[]
}

export interface MediaFile {
  id: number
  name: string
  filename: string
  path: string
  url: string
  size: number
  mime_type: string
  width?: number
  height?: number
  alt_text?: string
  caption?: string
  is_active: boolean
  sizes_data?: {
    original: {
      path: string
      url: string
      width: number
      height: number
      size: number
    }
    thumbnail?: {
      path: string
      url: string
      width: number
      height: number
      size: number
    }
    small?: {
      path: string
      url: string
      width: number
      height: number
      size: number
    }
    medium?: {
      path: string
      url: string
      width: number
      height: number
      size: number
    }
    large?: {
      path: string
      url: string
      width: number
      height: number
      size: number
    }
    featured?: {
      path: string
      url: string
      width: number
      height: number
      size: number
    }
  }
  created_at: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

export interface Author {
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

class ApiClient {
  private baseURL: string

  constructor() {
    this.baseURL = API_BASE_URL
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    // FormData için Content-Type header'ını kaldır
    const headers: Record<string, string> = {
      Accept: "application/json",
    }

    // Eğer FormData değilse JSON Content-Type ekle
    if (!(options?.body instanceof FormData)) {
      headers["Content-Type"] = "application/json"
    }

    // Diğer header'ları ekle
    if (options?.headers) {
      Object.assign(headers, options.headers)
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      try {
        const errorData = await response.json()
        const errorMessage = errorData.message || `API Error: ${response.status}`
        throw new Error(errorMessage)
      } catch (parseError) {
        throw new Error(`API Error: ${response.status}`)
      }
    }

    return response.json()
  }

  // Blog Posts
  async getPosts(params?: {
    page?: number
    per_page?: number
    category?: string
    search?: string
    featured?: boolean
    trending?: boolean
  }): Promise<PaginatedResponse<BlogPost>> {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.per_page) searchParams.append("per_page", params.per_page.toString())
    if (params?.category) searchParams.append("category", params.category)
    if (params?.search) searchParams.append("search", params.search)
    if (params?.featured) searchParams.append("featured", "1")
    if (params?.trending) searchParams.append("trending", "1")

    const query = searchParams.toString()
    
    // Cache'i geçici olarak devre dışı bırak
    // const cacheKey = `posts:${query}`
    // const cached = apiCache.get(cacheKey)
    // if (cached) return cached
    
    const response = await this.request<{ success: boolean; data: PaginatedResponse<BlogPost> }>(`/posts${query ? `?${query}` : ""}`)
    // apiCache.set(cacheKey, response.data, 300000) // 5 minutes cache
    
    return response.data
  }

  async getAdminPosts(params?: {
    page?: number
    per_page?: number
    category?: string
    search?: string
    status?: string
    sort_by?: string
    sort_order?: "asc" | "desc"
  }): Promise<BlogPost[]> {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.per_page) searchParams.append("per_page", params.per_page.toString())
    if (params?.category) searchParams.append("category", params.category)
    if (params?.search) searchParams.append("search", params.search)
    if (params?.status) searchParams.append("status", params.status)
    if (params?.sort_by) searchParams.append("sort_by", params.sort_by)
    if (params?.sort_order) searchParams.append("sort_order", params.sort_order)

    const query = searchParams.toString()
    const response = await this.request<{ success: boolean; data: BlogPost[] }>(`/admin/posts${query ? `?${query}` : ""}`)
    return response.data
  }

  async getPost(id: number): Promise<BlogPost> {
    return this.request<BlogPost>(`/posts/${id}`)
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost> {
    return this.request<BlogPost>(`/posts/slug/${slug}`)
  }

  async createPost(data: CreatePostData): Promise<BlogPost> {
    return this.request<BlogPost>(`/admin/posts`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updatePost(id: number, data: Partial<CreatePostData>): Promise<BlogPost> {
    return this.request<BlogPost>(`/admin/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deletePost(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/admin/posts/${id}`, {
      method: "DELETE",
    })
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    const cacheKey = "categories"
    const cached = apiCache.get(cacheKey)
    if (cached) return cached
    
    const response = await this.request<{ success: boolean; data: Category[] }>("/categories")
    apiCache.set(cacheKey, response.data, 600000) // 10 minutes cache for categories
    
    return response.data
  }

  async createCategory(data: Partial<Category>): Promise<Category> {
    const response = await this.request<{ success: boolean; data: Category }>(`/admin/categories`, {
      method: "POST",
      body: JSON.stringify(data),
    })
    return response.data
  }

  async updateCategory(id: number, data: Partial<Category>): Promise<Category> {
    return this.request<Category>(`/admin/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteCategory(id: number): Promise<{ message: string }> {
    const response = await this.request<{ success: boolean; message: string }>(`/admin/categories/${id}`, {
      method: "DELETE",
    })
    return { message: response.message }
  }

  // Tags
  async getTags(): Promise<Tag[]> {
    const response = await this.request<{ success: boolean; data: Tag[] }>("/admin/tags")
    return response.data
  }

  async createTag(data: Partial<Tag>): Promise<Tag> {
    return this.request<Tag>(`/admin/tags`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateTag(id: number, data: Partial<Tag>): Promise<Tag> {
    return this.request<Tag>(`/admin/tags/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteTag(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/admin/tags/${id}`, {
      method: "DELETE",
    })
  }

  // Comments
  async getComments(postId: number): Promise<Comment[]> {
    return this.request<Comment[]>(`/comments?post_id=${postId}`)
  }

  async getAllComments(params?: {
    search?: string
    status?: string
    post_id?: number
  }): Promise<Comment[]> {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append("search", params.search)
    if (params?.status) searchParams.append("status", params.status)
    if (params?.post_id) searchParams.append("post_id", params.post_id.toString())
    
    const query = searchParams.toString()
    const response = await this.request<{ success: boolean; data: Comment[] }>(`/admin/comments${query ? `?${query}` : ""}`)
    return response.data
  }

  async createComment(data: Partial<Comment>): Promise<Comment> {
    return this.request<Comment>(`/admin/comments`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateComment(id: number, data: Partial<Comment>): Promise<Comment> {
    return this.request<Comment>(`/admin/comments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteComment(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/admin/comments/${id}`, {
      method: "DELETE",
    })
  }

  // Likes
  async toggleLike(likeableType: "App\\Models\\Post" | "App\\Models\\Comment", likeableId: number): Promise<{ liked: boolean }> {
    return this.request<{ liked: boolean }>(`/likes/toggle`, {
      method: "POST",
      body: JSON.stringify({ likeable_type: likeableType, likeable_id: likeableId }),
    })
  }

  async checkLike(likeableType: "App\\Models\\Post" | "App\\Models\\Comment", likeableId: number): Promise<{ liked: boolean }> {
    return this.request<{ liked: boolean }>(`/likes/check?likeable_type=${likeableType}&likeable_id=${likeableId}`)
  }

  async getLikeCount(likeableType: "App\\Models\\Post" | "App\\Models\\Comment", likeableId: number): Promise<{ count: number }> {
    return this.request<{ count: number }>(`/likes/count?likeable_type=${likeableType}&likeable_id=${likeableId}`)
  }

  // Saves
  async getSaves(): Promise<BlogPost[]> {
    return this.request<BlogPost[]>(`/saves`)
  }

  async toggleSave(postId: number): Promise<{ saved: boolean }> {
    return this.request<{ saved: boolean }>(`/saves/toggle`, {
      method: "POST",
      body: JSON.stringify({ post_id: postId }),
    })
  }

  async checkSave(postId: number): Promise<{ saved: boolean }> {
    return this.request<{ saved: boolean }>(`/saves/check?post_id=${postId}`)
  }

  async deleteSave(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/admin/saves/${id}`, {
      method: "DELETE",
    })
  }

  // Media
  async getMedia(params?: {
    page?: number
    per_page?: number
    search?: string
    type?: string
  }): Promise<PaginatedResponse<MediaFile>> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.per_page) searchParams.append("per_page", params.per_page.toString())
    if (params?.search) searchParams.append("search", params.search)
    if (params?.type) searchParams.append("type", params.type)
    
    const query = searchParams.toString()
    const response = await this.request<{ success: boolean; data: PaginatedResponse<MediaFile> }>(`/media${query ? `?${query}` : ""}`)
    return response.data
  }

  async uploadMedia(file: File, altText?: string, caption?: string): Promise<MediaFile> {
    const formData = new FormData()
    formData.append('file', file)
    if (altText) formData.append('alt_text', altText)
    if (caption) formData.append('caption', caption)

    const response = await this.request<{ success: boolean; data: MediaFile }>('/media/upload', {
      method: 'POST',
      headers: {
        // FormData için Content-Type header'ını kaldırıyoruz
      },
      body: formData,
    })
    return response.data
  }

  async getMediaFile(id: number): Promise<MediaFile> {
    const response = await this.request<{ success: boolean; data: MediaFile }>(`/media/${id}`)
    return response.data
  }

  async updateMedia(id: number, data: Partial<MediaFile>): Promise<MediaFile> {
    const response = await this.request<{ success: boolean; data: MediaFile }>(`/media/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return response.data
  }

  async deleteMedia(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/media/${id}`, {
      method: 'DELETE',
    })
  }

  async bulkDeleteMedia(ids: number[]): Promise<{ message: string }> {
    return this.request<{ message: string }>('/media/bulk-destroy', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    })
  }

  // Authors
  async getAuthors(): Promise<Author[]> {
    return this.request<Author[]>("/authors")
  }

  async getAuthor(id: number): Promise<Author> {
    return this.request<Author>(`/authors/${id}`)
  }

  async createAuthor(data: Partial<Author>): Promise<Author> {
    return this.request<Author>(`/admin/authors`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateAuthor(id: number, data: Partial<Author>): Promise<Author> {
    return this.request<Author>(`/admin/authors/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async deleteAuthor(id: number): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/admin/authors/${id}`, {
      method: "DELETE",
    })
  }
}

export const apiClient = new ApiClient()
