/**
 * Content Query Composables
 * 
 * This module provides reusable composables for efficient content fetching,
 * caching, and parsing across the application. It integrates with Nuxt Content v3
 * and provides type-safe content queries with proper error handling.
 */

import type {
  ParsedContent,
  ContentQueryParams,
  ContentCategory,
  ContentLanguage,
  ContentNavItem,
  ContentSearchResult,
  BaseFrontmatter,
  BlogFrontmatter,
  PageFrontmatter
} from '~/types/content'

/**
 * Content query response interface
 */
interface ContentQueryResponse<T = any> {
  data: Ref<T[]>
  total: Ref<number>
  loading: Ref<boolean>
  error: Ref<Error | null>
  refresh: () => Promise<void>
}

/**
 * Single content response interface
 */
interface SingleContentResponse<T = any> {
  data: Ref<T | null>
  loading: Ref<boolean>
  error: Ref<Error | null>
  refresh: () => Promise<void>
}

/**
 * Main content query composable using Nuxt Content v3 API
 */
export function useContentQuery(params: ContentQueryParams = {}): ContentQueryResponse {
  const { locale } = useI18n()
  
  // Reactive state
  const data = ref<any[]>([])
  const total = ref(0)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  // Default language from current locale
  const language = params.language || (locale.value as ContentLanguage)

  /**
   * Builds the content query based on parameters
   */
  const buildQuery = () => {
    // Determine collection name based on category or default to 'pages'
    const collection = params.category === 'blog' ? 'blog' : 'pages'
    let query = queryCollection(collection)

    // Apply category filter
    if (params.category) {
      query = query.where('category', '=', params.category)
    }

    // Apply tag filter
    if (params.tags) {
      const tags = Array.isArray(params.tags) ? params.tags : [params.tags]
      query = query.where('tags', 'IN', tags)
    }

    // Apply publication filter
    if (params.published !== undefined) {
      query = query.where('published', '=', params.published)
    }

    // Apply sorting - using date field for sorting
    const sortOrder = params.sortOrder || 'desc'
    query = query.order('date' as any, sortOrder.toUpperCase() as 'ASC' | 'DESC')

    // Apply pagination
    if (params.skip) {
      query = query.skip(params.skip)
    }

    if (params.limit) {
      query = query.limit(params.limit)
    }

    return query
  }

  /**
   * Executes the content query
   */
  const executeQuery = async () => {
    try {
      loading.value = true
      error.value = null

      const query = buildQuery()
      const result = await query.all()

      data.value = result
      total.value = result.length

      // If no limit was set, total equals data length
      // Otherwise, we'd need a separate count query
      if (!params.limit) {
        total.value = result.length
      }
    } catch (err) {
      error.value = err as Error
      console.error('Content query error:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Refresh function
   */
  const refresh = async () => {
    await executeQuery()
  }

  // Execute query on composition
  executeQuery()

  return {
    data,
    total,
    loading,
    error,
    refresh
  }
}

/**
 * Composable for fetching a single content item by slug
 */
export function useContentBySlug(slug: string, language?: ContentLanguage): SingleContentResponse {
  const { locale } = useI18n()
  
  const data = ref<any | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const lang = language || (locale.value as ContentLanguage)

  const executeQuery = async () => {
    try {
      loading.value = true
      error.value = null

      // Get all content and filter by slug and language
      let result = null
      
      try {
        // First try blog collection
        const blogPosts = await queryCollection('blog').all()
        result = blogPosts.find(post => 
          post.slug === slug && 
          post.path && 
          post.path.startsWith(`/${lang}/`)
        )
        
        if (!result) {
          // If not found in blog, try pages
          const pages = await queryCollection('pages').all()
          result = pages.find(page => 
            page.slug === slug && 
            page.path && 
            page.path.startsWith(`/${lang}/`)
          )
        }
      } catch (queryError) {
        console.warn('Error in content query:', queryError)
        result = null
      }

      data.value = result
    } catch (err) {
      error.value = err as Error
      console.error('Content by slug error:', err)
    } finally {
      loading.value = false
    }
  }

  const refresh = async () => {
    await executeQuery()
  }

  executeQuery()

  return {
    data,
    loading,
    error,
    refresh
  }
}

/**
 * Composable for fetching content by path
 */
export function useContentByPath(path: string): SingleContentResponse {
  const data = ref<any | null>(null)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const executeQuery = async () => {
    try {
      loading.value = true
      error.value = null

      // Get all content and filter by path
      let result = null
      
      try {
        // First try pages collection
        const pages = await queryCollection('pages').all()
        result = pages.find(page => page.path === path)
        
        if (!result) {
          // If not found in pages, try blog
          const blogPosts = await queryCollection('blog').all()
          result = blogPosts.find(post => post.path === path)
        }
      } catch (queryError) {
        console.warn('Error in content by path query:', queryError)
        result = null
      }

      data.value = result
    } catch (err) {
      error.value = err as Error
      console.error('Content by path error:', err)
    } finally {
      loading.value = false
    }
  }

  const refresh = async () => {
    await executeQuery()
  }

  executeQuery()

  return {
    data,
    loading,
    error,
    refresh
  }
}

/**
 * Composable for blog posts with enhanced features
 */
export function useBlogPosts(params: Omit<ContentQueryParams, 'category'> = {}) {
  return useContentQuery({
    ...params,
    category: 'blog',
    published: params.published !== undefined ? params.published : true,
    sortBy: params.sortBy || 'created',
    sortOrder: params.sortOrder || 'desc'
  })
}

/**
 * Composable for featured blog posts
 */
export function useFeaturedPosts(limit = 3, language?: ContentLanguage) {
  const { locale } = useI18n()
  
  const data = ref<any[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const lang = language || (locale.value as ContentLanguage)

  const executeQuery = async () => {
    try {
      loading.value = true
      error.value = null

      const result = await queryCollection('blog')
        .where('featured', '=', true)
        .where('published', '=', true)
        .order('date' as any, 'DESC')
        .limit(limit)
        .all()

      data.value = result
    } catch (err) {
      error.value = err as Error
      console.error('Featured posts error:', err)
    } finally {
      loading.value = false
    }
  }

  const refresh = async () => {
    await executeQuery()
  }

  executeQuery()

  return {
    data,
    loading,
    error,
    refresh
  }
}

/**
 * Composable for content navigation
 */
export function useContentNavigation(language?: ContentLanguage) {
  const { locale } = useI18n()
  
  const data = ref<ContentNavItem[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const lang = language || (locale.value as ContentLanguage)

  const executeQuery = async () => {
    try {
      loading.value = true
      error.value = null

      // Use the new queryCollectionNavigation method
      const navigation = await queryCollectionNavigation('pages')
        .where('navigation', '=', true)
        .order('title' as any, 'ASC')

      data.value = navigation.map((page: any) => ({
        title: page.title,
        href: page.path,
        children: []
      }))
    } catch (err) {
      error.value = err as Error
      console.error('Content navigation error:', err)
    } finally {
      loading.value = false
    }
  }

  const refresh = async () => {
    await executeQuery()
  }

  executeQuery()

  return {
    data,
    loading,
    error,
    refresh
  }
}

/**
 * Composable for related content
 */
export function useRelatedContent(currentSlug: string, category?: ContentCategory, limit = 3) {
  const { locale } = useI18n()
  
  const data = ref<any[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const executeQuery = async () => {
    try {
      loading.value = true
      error.value = null

      // Determine which collection to use
      const collection = category === 'blog' ? 'blog' : 'pages'
      let query = queryCollection(collection)
        .where('slug', '<>', currentSlug)
        .where('published', '=', true)

      if (category) {
        query = query.where('category', '=', category)
      }

      const result = await query
        .limit(limit)
        .select('title', 'description', 'path', 'id')
        .order('date' as any, 'DESC')
        .all()

      data.value = result
    } catch (err) {
      error.value = err as Error
      console.error('Related content error:', err)
    } finally {
      loading.value = false
    }
  }

  const refresh = async () => {
    await executeQuery()
  }

  executeQuery()

  return {
    data,
    loading,
    error,
    refresh
  }
}



/**
 * Utility function to get content statistics
 */
export function useContentStats(language?: ContentLanguage) {
  const { locale } = useI18n()
  
  const stats = ref({
    totalPosts: 0,
    totalPages: 0,
    totalContent: 0,
    categories: {} as Record<string, number>
  })
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const lang = language || (locale.value as ContentLanguage)

  const calculateStats = async () => {
    try {
      loading.value = true
      error.value = null

      // Get all blog posts
      const blogPosts = await queryCollection('blog')
        .where('published', '=', true)
        .all()

      // Get all pages
      const pages = await queryCollection('pages')
        .where('published', '=', true)
        .all()

      const categories: Record<string, number> = {}
      let totalPosts = blogPosts.length
      let totalPages = pages.length

      // Count categories in blog posts
      blogPosts.forEach((item: any) => {
        if (item.category) {
          categories[item.category] = (categories[item.category] || 0) + 1
        }
      })

      stats.value = {
        totalPosts,
        totalPages,
        totalContent: totalPosts + totalPages,
        categories
      }
    } catch (err) {
      error.value = err as Error
      console.error('Content stats error:', err)
    } finally {
      loading.value = false
    }
  }

  calculateStats()

  return {
    stats,
    loading,
    error,
    refresh: calculateStats
  }
}