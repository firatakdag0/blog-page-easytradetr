// Laravel API endpoints
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export interface BlogPost {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image: string
  category_id: number
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
  published_at: string
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

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
}

class ApiClient {
  private baseURL: string

  constructor() {
    this.baseURL = API_BASE_URL
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
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
    return this.request<PaginatedResponse<BlogPost>>(`/posts${query ? `?${query}` : ""}`)
  }

  async getPost(slug: string): Promise<BlogPost> {
    return this.request<BlogPost>(`/posts/${slug}`)
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>("/categories")
  }

  // Newsletter
  async subscribeNewsletter(email: string): Promise<{ message: string }> {
    return this.request<{ message: string }>("/newsletter/subscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  }

  // Post interactions
  async likePost(postId: number): Promise<{ likes_count: number }> {
    return this.request<{ likes_count: number }>(`/posts/${postId}/like`, {
      method: "POST",
    })
  }

  async incrementViews(postId: number): Promise<void> {
    await this.request(`/posts/${postId}/views`, {
      method: "POST",
    })
  }
}

export const apiClient = new ApiClient()
