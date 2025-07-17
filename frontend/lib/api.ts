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

// Auth token management
class AuthTokenManager {
  private static TOKEN_KEY = 'admin_auth_token'
  private static USER_KEY = 'admin_user_data'

  static getToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(this.TOKEN_KEY)
  }

  static setToken(token: string): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.TOKEN_KEY, token)
  }

  static removeToken(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.TOKEN_KEY)
  }

  static getUser(): any | null {
    if (typeof window === 'undefined') return null
    const userData = localStorage.getItem(this.USER_KEY)
    return userData ? JSON.parse(userData) : null
  }

  static setUser(user: any): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.USER_KEY, JSON.stringify(user))
  }

  static removeUser(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.USER_KEY)
  }

  static isAuthenticated(): boolean {
    return !!this.getToken()
  }

  static logout(): void {
    this.removeToken()
    this.removeUser()
  }
}

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
  featured_image_position_x?: number | null;
  featured_image_position_y?: number | null;
  featured_image_scale?: number | null;
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
  featured_image_position_x?: number | null;
  featured_image_position_y?: number | null;
  featured_image_scale?: number | null;
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

import { supabase } from './supabaseClient';

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

    // Auth token ekle (eğer varsa)
    const token = AuthTokenManager.getToken()
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    // Diğer header'ları ekle
    if (options?.headers) {
      Object.assign(headers, options.headers)
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    // 401 Unauthorized durumunda token'ı temizle
    if (response.status === 401) {
      AuthTokenManager.logout()
      throw new Error("Şifreniz yanlış veya oturumunuz sona erdi. Lütfen tekrar giriş yapın.")
    }

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

  // Supabase'den blog postlarını çeken fonksiyon
  async getPostsFromSupabase({
    page = 1,
    per_page = 12,
    category = '',
    search = '',
    featured = false,
    trending = false,
  }: {
    page?: number;
    per_page?: number;
    category?: string;
    search?: string;
    featured?: boolean;
    trending?: boolean;
  } = {}) {
    let query = supabase
      .from('posts')
      .select(`
        *,
        category:categories(*),
        author:authors(*),
        tags:post_tag(*, tag:tags(*))
      `, { count: 'exact' })
      .order('published_at', { ascending: false })
      .range((page - 1) * per_page, page * per_page - 1);

    if (category) {
      query = query.eq('category_id', category);
    }
    if (featured) {
      query = query.eq('is_featured', true);
    }
    if (trending) {
      query = query.eq('is_trending', true);
    }
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    // tags alanını düzleştir
    const posts = (data || []).map((post: any) => ({
      ...post,
      tags: (post.tags || []).map((pt: any) => pt.tag),
    }));

    return {
      data: posts,
      total: count,
      last_page: Math.ceil((count || 0) / per_page),
      current_page: page,
      per_page,
    };
  }

  async getAdminPosts(params?: {
    page?: number
    per_page?: number
    category?: string
    search?: string
    status?: string
    sort_by?: string
    sort_order?: "asc" | "desc"
  }): Promise<{ data: BlogPost[]; pagination: any }> {
    const searchParams = new URLSearchParams()

    if (params?.page) searchParams.append("page", params.page.toString())
    if (params?.per_page) searchParams.append("per_page", params.per_page.toString())
    if (params?.category) searchParams.append("category", params.category)
    if (params?.search) searchParams.append("search", params.search)
    if (params?.status) searchParams.append("status", params.status)
    if (params?.sort_by) searchParams.append("sort_by", params.sort_by)
    if (params?.sort_order) searchParams.append("sort_order", params.sort_order)

    const query = searchParams.toString()
    const response = await this.request<{ success: boolean; data: BlogPost[]; pagination: any }>(`/admin/posts${query ? `?${query}` : ""}`)
    return { data: response.data, pagination: response.pagination }
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

  async getPrevNextPosts(slug: string): Promise<{ prev: BlogPost | null; next: BlogPost | null }> {
    return this.request<{ prev: BlogPost | null; next: BlogPost | null }>(`/posts/prev-next/${slug}`)
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

    const response = await this.request<{ success: boolean; data: MediaFile }>('/admin/media/upload', {
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

  // Authentication methods
  async login(email: string, password: string): Promise<{ user: any; token: string; token_type: string; expires_in: number }> {
    const response = await this.request<{ success: boolean; message: string; data: { user: any; token: string; token_type: string; expires_in: number } }>('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    
    if (response.success) {
      AuthTokenManager.setToken(response.data.token)
      AuthTokenManager.setUser(response.data.user)
    }
    
    return response.data
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.request<{ success: boolean; message: string }>('/admin/auth/logout', {
        method: 'POST',
      })
      AuthTokenManager.logout()
      return response
    } catch (error) {
      // Hata olsa bile local storage'ı temizle
      AuthTokenManager.logout()
      throw error
    }
  }

  async getCurrentUser(): Promise<any> {
    const response = await this.request<{ success: boolean; data: any }>('/admin/auth/me')
    return response.data
  }

  async refreshToken(): Promise<{ token: string; token_type: string; expires_in: number }> {
    const response = await this.request<{ success: boolean; message: string; data: { token: string; token_type: string; expires_in: number } }>('/admin/auth/refresh', {
      method: 'POST',
    })
    
    if (response.success) {
      AuthTokenManager.setToken(response.data.token)
    }
    
    return response.data
  }

  async changePassword(currentPassword: string, newPassword: string, newPasswordConfirmation: string): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/admin/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirmation: newPasswordConfirmation,
      }),
    })
  }

  // Auth utility methods
  isAuthenticated(): boolean {
    return AuthTokenManager.isAuthenticated()
  }

  getStoredUser(): any {
    return AuthTokenManager.getUser()
  }

  getStoredToken(): string | null {
    return AuthTokenManager.getToken()
  }
}

export const apiClient = new ApiClient()

export async function getCategoriesFromSupabase() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getTagsFromSupabase() {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getAuthorsFromSupabase() {
  const { data, error } = await supabase
    .from('authors')
    .select('*, user:users(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  // user alanını düzleştir
  return (data || []).map((author: any) => ({ ...author, ...author.user }));
}

export async function getPostBySlugFromSupabase(slug: string) {
  const { data, error } = await supabase
    .from('posts')
    .select(`*, category:categories(*), author:authors(*), tags:post_tag(*, tag:tags(*))`)
    .eq('slug', slug)
    .single();
  if (error) throw error;
  // tags alanını düzleştir
  return {
    ...data,
    tags: (data?.tags || []).map((pt: any) => pt.tag),
  };
}

export async function getAdminPostsFromSupabase({
  page = 1,
  per_page = 10,
  category = '',
  search = '',
  status = '',
  sort_by = 'created_at',
  sort_order = 'desc',
  is_featured = false,
}: {
  page?: number;
  per_page?: number;
  category?: string;
  search?: string;
  status?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  is_featured?: boolean;
} = {}) {
  let query = supabase
    .from('posts')
    .select(`*, category:categories(*), author:authors(*), tags:post_tag(*, tag:tags(*))`, { count: 'exact' })
    .order(sort_by, { ascending: sort_order === 'asc' })
    .range((page - 1) * per_page, page * per_page - 1);

  if (category && category !== 'Tümü') {
    query = query.eq('category_id', category);
  }
  if (status && status !== 'Tümü') {
    query = query.eq('status', status);
  }
  if (is_featured) {
    query = query.eq('is_featured', true);
  }
  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  const posts = (data || []).map((post: any) => ({
    ...post,
    tags: (post.tags || []).map((pt: any) => pt.tag),
  }));

  // Ekstra istatistikler
  const published_total = posts.filter((p: any) => p.status === 'published').length;
  const all_total = count || posts.length;

  return {
    data: posts,
    pagination: {
      all_total,
      published_total,
      page,
      per_page,
      last_page: Math.ceil((count || 0) / per_page),
    },
  };
}

export async function getCommentsFromSupabase({
  post_id = undefined,
  search = '',
  status = '',
  page = 1,
  per_page = 50,
}: {
  post_id?: number | string;
  search?: string;
  status?: string;
  page?: number;
  per_page?: number;
} = {}) {
  let query = supabase
    .from('comments')
    .select('*, user:users(*), post:posts(*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * per_page, page * per_page - 1);

  if (post_id) {
    query = query.eq('post_id', post_id);
  }
  if (status && status !== 'Tümü') {
    query = query.eq('status', status);
  }
  if (search) {
    query = query.ilike('content', `%${search}%`);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data: data || [],
    total: count,
    page,
    per_page,
    last_page: Math.ceil((count || 0) / per_page),
  };
}

export async function getMediaFromSupabase({
  search = '',
  type = '',
  page = 1,
  per_page = 50,
}: {
  search?: string;
  type?: string;
  page?: number;
  per_page?: number;
} = {}) {
  let query = supabase
    .from('media')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((page - 1) * per_page, page * per_page - 1);

  if (search) {
    query = query.ilike('url', `%${search}%`);
  }
  if (type) {
    query = query.eq('type', type);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    data: data || [],
    total: count,
    page,
    per_page,
    last_page: Math.ceil((count || 0) / per_page),
  };
}

// Supabase Storage'a medya dosyası yükleme fonksiyonu
type UploadMediaResult = { url: string; id?: number; mediaRow?: any };
export async function uploadMediaToSupabase(file: File, customName?: string, uploadedBy?: string): Promise<UploadMediaResult> {
  // 1. Supabase Storage'a yükle
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const { data, error } = await supabase.storage.from('media').upload(fileName, file);
  if (error) throw error;
  // 2. Public URL al
  const { data: publicUrlData } = supabase.storage.from('media').getPublicUrl(fileName);
  const url = publicUrlData?.publicUrl || '';
  // 3. Media tablosuna kaydet
  const fileType = file.type.startsWith("image/") ? "image"
    : file.type.startsWith("video/") ? "video"
    : file.type.startsWith("audio/") ? "audio"
    : "other";
  const { data: mediaRow, error: mediaError } = await supabase
    .from('media')
    .insert([{ 
      url, 
      type: fileType, // burada
      name: customName || file.name, 
      size: file.size, 
      mime_type: file.type,
      uploaded_by: uploadedBy
    }])
    .select()
    .single();
  if (mediaError) throw mediaError;
  return { url, id: mediaRow?.id, mediaRow };
}

// Supabase'den medya dosyası silme fonksiyonu
export async function deleteMediaFromSupabase(id: number, url: string) {
  // 1. Media tablosundan sil
  const { error } = await supabase.from('media').delete().eq('id', id);
  if (error) throw error;
  // 2. Storage'dan sil (opsiyonel, url'den dosya adını çıkar)
  const fileName = url.split('/').pop();
  if (fileName) {
    await supabase.storage.from('media').remove([fileName]);
  }
}

// Supabase Auth: Kullanıcı kaydı
export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

// Supabase Auth: Kullanıcı girişi
export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

// Supabase Auth: Mevcut kullanıcıyı al
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}

export async function createCategorySupabase(formData: any) {
  const { data, error } = await supabase.from('categories').insert([formData]).select().single();
  if (error) throw error;
  return data;
}

export async function updateCategorySupabase(id: number, formData: any) {
  const { data, error } = await supabase.from('categories').update(formData).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteCategorySupabase(id: number) {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw error;
}

export async function createAuthorSupabase(formData: any) {
  const dataToSend = { ...formData, user_id: 1 };
  console.log("Supabase'a gönderilen veri:", dataToSend);
  const { data, error } = await supabase.from('authors').insert([dataToSend]).select().single();
  if (error) {
    console.error("Supabase insert error:", error);
    throw error;
  }
  return data;
}

export async function createTagSupabase(formData: any) {
  const { data, error } = await supabase.from('tags').insert([formData]).select().single();
  if (error) throw error;
  return data;
}

export async function updateTagSupabase(id: number, formData: any) {
  const { data, error } = await supabase.from('tags').update(formData).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteTagSupabase(id: number) {
  const { error } = await supabase.from('tags').delete().eq('id', id);
  if (error) throw error;
}

// Supabase ile içerik ekleme
export async function createPostWithSupabase(postData: CreatePostData) {
  // 1. Postu ekle
  const { tags, ...postFields } = postData;
  const { data: post, error } = await supabase
    .from('posts')
    .insert([postFields])
    .select()
    .single();
  if (error) throw error;
  // 2. Tag ilişkilerini ekle
  if (tags && tags.length > 0 && post) {
    const tagRows = tags.map((tagName: string) => ({ post_id: post.id, tag_name: tagName }));
    // post_tag tablosunda tag_name ile tag_id eşleştirip ekleme yapılabilir
    await Promise.all(tagRows.map(async (row) => {
      // tag var mı kontrol et
      let { data: tag, error: tagError } = await supabase
        .from('tags')
        .select('id')
        .eq('name', row.tag_name)
        .single();
      if (tagError || !tag) {
        // tag yoksa oluştur
        const { data: newTag, error: newTagError } = await supabase
          .from('tags')
          .insert([{ name: row.tag_name, slug: row.tag_name.toLowerCase().replace(/\s+/g, '-') }])
          .select()
          .single();
        if (newTagError) throw newTagError;
        tag = newTag;
      }
      // post_tag ilişkisini ekle
      if (tag) {
        await supabase.from('post_tag').insert([{ post_id: post.id, tag_id: tag.id }]);
      }
    }));
  }
  return post;
}

// Supabase ile içerik güncelleme
export async function updatePostWithSupabase(postId: number, postData: Partial<CreatePostData>) {
  const { tags, ...postFields } = postData;
  // 1. Postu güncelle
  const { data: post, error } = await supabase
    .from('posts')
    .update(postFields)
    .eq('id', postId)
    .select()
    .single();
  if (error) throw error;
  // 2. Tag ilişkilerini güncelle
  if (tags) {
    // Önce eski ilişkileri sil
    await supabase.from('post_tag').delete().eq('post_id', postId);
    // Sonra yenilerini ekle
    await Promise.all(tags.map(async (tagName: string) => {
      let { data: tag, error: tagError } = await supabase
        .from('tags')
        .select('id')
        .eq('name', tagName)
        .single();
      if (tagError || !tag) {
        const { data: newTag, error: newTagError } = await supabase
          .from('tags')
          .insert([{ name: tagName, slug: tagName.toLowerCase().replace(/\s+/g, '-') }])
          .select()
          .single();
        if (newTagError) throw newTagError;
        tag = newTag;
      }
      if (tag) {
        await supabase.from('post_tag').insert([{ post_id: postId, tag_id: tag.id }]);
      }
    }));
  }
  return post;
}

// Supabase ile içerik silme
export async function deletePostWithSupabase(postId: number) {
  // Önce post_tag ilişkilerini sil
  await supabase.from('post_tag').delete().eq('post_id', postId);
  // Sonra postu sil
  const { error } = await supabase.from('posts').delete().eq('id', postId);
  if (error) throw error;
  return { message: 'İçerik silindi' };
}

export async function incrementPostViewCount(postId: number) {
  // Önce mevcut views_count değerini çek
  const { data: post, error: fetchError } = await supabase
    .from('posts')
    .select('views_count')
    .eq('id', postId)
    .single();
  if (fetchError) throw fetchError;
  const currentCount = post?.views_count ?? 0;
  // 1 artırarak güncelle
  const { data, error } = await supabase
    .from('posts')
    .update({ views_count: currentCount + 1 })
    .eq('id', postId);
  if (error) throw error;
  return data;
}
