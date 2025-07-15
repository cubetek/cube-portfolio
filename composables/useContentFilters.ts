/**
 * Content Filtering and Pagination Composables
 * 
 * This module provides advanced filtering, sorting, and pagination
 * functionality for content lists and search results.
 */

import type {
  ParsedContent,
  ContentCategory,
  ContentLanguage
} from '~/types/content'

/**
 * Filter options interface
 */
interface FilterOptions {
  categories: ContentCategory[]
  tags: string[]
  dateRange: {
    start?: string
    end?: string
  }
  searchQuery: string
}

/**
 * Sort options interface
 */
interface SortOptions {
  field: 'title' | 'created' | 'updated' | 'readTime'
  direction: 'asc' | 'desc'
}

/**
 * Pagination options interface
 */
interface PaginationOptions {
  page: number
  perPage: number
}

/**
 * Filtered content response
 */
interface FilteredContentResponse {
  items: ParsedContent[]
  total: number
  totalPages: number
  currentPage: number
  hasNext: boolean
  hasPrev: boolean
  filters: FilterOptions
  sort: SortOptions
  loading: boolean
  error: Error | null
}

/**
 * Content filtering composable
 */
export function useContentFilters(initialFilters?: Partial<FilterOptions>) {
  const { $content } = useNuxtApp()
  const { locale } = useI18n()

  // Reactive filter state
  const filters = ref<FilterOptions>({
    categories: [],
    tags: [],
    dateRange: {},
    searchQuery: '',
    ...initialFilters
  })

  // Reactive sort state
  const sort = ref<SortOptions>({
    field: 'created',
    direction: 'desc'
  })

  // Reactive pagination state
  const pagination = ref<PaginationOptions>({
    page: 1,
    perPage: 10
  })

  // Response state
  const items = ref<ParsedContent[]>([])
  const total = ref(0)
  const loading = ref(false)
  const error = ref<Error | null>(null)

  /**
   * Builds the content query with filters
   */
  const buildFilteredQuery = () => {
    // Determine collection based on category filter
    const hasCategory = filters.value.categories.length > 0
    const collection = hasCategory && filters.value.categories.includes('blog') ? 'blog' : 'pages'
    let query = queryCollection(collection)
      .where('published', '=', true)

    // Apply category filter
    if (filters.value.categories.length > 0) {
      query = query.where('category', 'IN', filters.value.categories)
    }

    // Apply tag filter
    if (filters.value.tags.length > 0) {
      query = query.where('tags', 'IN', filters.value.tags)
    }

    // Apply date range filter
    if (filters.value.dateRange.start || filters.value.dateRange.end) {
      if (filters.value.dateRange.start) {
        query = query.where('created', '>=', filters.value.dateRange.start)
      }
      if (filters.value.dateRange.end) {
        query = query.where('created', '<=', filters.value.dateRange.end)
      }
    }

    // Apply search filter - using LIKE for text search
    if (filters.value.searchQuery.trim()) {
      const searchQuery = `%${filters.value.searchQuery.trim()}%`
      query = query.andWhere((subQuery) => 
        subQuery
          .where('title', 'LIKE', searchQuery)
          .orWhere((innerQuery) => innerQuery.where('description', 'LIKE', searchQuery))
      )
    }

    // Apply sorting
    const sortDirection = sort.value.direction === 'desc' ? 'DESC' : 'ASC'
    query = query.order(sort.value.field as any, sortDirection as 'ASC' | 'DESC')

    return query
  }

  /**
   * Executes the filtered query with pagination
   */
  const executeFilteredQuery = async () => {
    try {
      loading.value = true
      error.value = null

      const query = buildFilteredQuery()

      // Get total count
      const allItems = await query.all()
      total.value = allItems.length

      // Apply pagination
      const startIndex = (pagination.value.page - 1) * pagination.value.perPage
      const endIndex = startIndex + pagination.value.perPage
      items.value = allItems.slice(startIndex, endIndex) as any
    } catch (err) {
      error.value = err as Error
      console.error('Filtered content query error:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Computed properties for pagination
   */
  const totalPages = computed(() => 
    Math.ceil(total.value / pagination.value.perPage)
  )

  const hasNext = computed(() => 
    pagination.value.page < totalPages.value
  )

  const hasPrev = computed(() => 
    pagination.value.page > 1
  )

  /**
   * Filter update functions
   */
  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    filters.value = { ...filters.value, ...newFilters }
    pagination.value.page = 1 // Reset to first page
    executeFilteredQuery()
  }

  const updateSort = (newSort: Partial<SortOptions>) => {
    sort.value = { ...sort.value, ...newSort }
    pagination.value.page = 1 // Reset to first page
    executeFilteredQuery()
  }

  const updatePagination = (newPagination: Partial<PaginationOptions>) => {
    pagination.value = { ...pagination.value, ...newPagination }
    executeFilteredQuery()
  }

  /**
   * Navigation functions
   */
  const nextPage = () => {
    if (hasNext.value) {
      updatePagination({ page: pagination.value.page + 1 })
    }
  }

  const prevPage = () => {
    if (hasPrev.value) {
      updatePagination({ page: pagination.value.page - 1 })
    }
  }

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      updatePagination({ page })
    }
  }

  /**
   * Clear filters
   */
  const clearFilters = () => {
    filters.value = {
      categories: [],
      tags: [],
      dateRange: {},
      searchQuery: ''
    }
    pagination.value.page = 1
    executeFilteredQuery()
  }

  // Initial query execution
  executeFilteredQuery()

  return {
    // Data
    items: readonly(items),
    total: readonly(total),
    totalPages,
    currentPage: computed(() => pagination.value.page),
    hasNext,
    hasPrev,
    filters: readonly(filters),
    sort: readonly(sort),
    loading: readonly(loading),
    error: readonly(error),

    // Actions
    updateFilters,
    updateSort,
    updatePagination,
    nextPage,
    prevPage,
    goToPage,
    clearFilters,
    refresh: executeFilteredQuery
  }
}

/**
 * Composable for available filter options
 */
export function useFilterOptions(language?: ContentLanguage) {
  const { $content } = useNuxtApp()
  const { locale } = useI18n()

  const availableCategories = ref<ContentCategory[]>([])
  const availableTags = ref<string[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const lang = language || (locale.value as ContentLanguage)

  const loadFilterOptions = async () => {
    try {
      loading.value = true
      error.value = null

      // Get all content from both collections
      const [blogContent, pagesContent] = await Promise.all([
        queryCollection('blog').where('published', '=', true).all(),
        queryCollection('pages').where('published', '=', true).all()
      ])

      const allContent = [...blogContent, ...pagesContent]

      // Extract unique categories
      const categories = new Set<ContentCategory>()
      const tags = new Set<string>()

      allContent.forEach((item: any) => {
        if (item.category) {
          categories.add(item.category)
        }
        if (item.tags && Array.isArray(item.tags)) {
          item.tags.forEach((tag: string) => tags.add(tag))
        }
      })

      availableCategories.value = Array.from(categories)
      availableTags.value = Array.from(tags).sort()
    } catch (err) {
      error.value = err as Error
      console.error('Filter options error:', err)
    } finally {
      loading.value = false
    }
  }

  loadFilterOptions()

  return {
    availableCategories: readonly(availableCategories),
    availableTags: readonly(availableTags),
    loading: readonly(loading),
    error: readonly(error),
    refresh: loadFilterOptions
  }
}

/**
 * Composable for content archives (organized by date)
 */
export function useContentArchive(category?: ContentCategory) {
  const { $content } = useNuxtApp()
  const { locale } = useI18n()

  const archives = ref<Record<string, ParsedContent[]>>({})
  const loading = ref(false)
  const error = ref<Error | null>(null)

  const loadArchive = async () => {
    try {
      loading.value = true
      error.value = null

      // Determine which collection to use
      const collection = category === 'blog' ? 'blog' : 'pages'
      let query = queryCollection(collection)
        .where('published', '=', true)

      if (category) {
        query = query.where('category', '=', category)
      }

      const content = await query
        .order('created' as any, 'DESC')
        .all()

      // Group by year-month
      const grouped: Record<string, any[]> = {}
      content.forEach((item: any) => {
        const date = new Date(item.created || item.date)
        const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        
        if (!grouped[yearMonth]) {
          grouped[yearMonth] = []
        }
        grouped[yearMonth].push(item)
      })

      archives.value = grouped
    } catch (err) {
      error.value = err as Error
      console.error('Content archive error:', err)
    } finally {
      loading.value = false
    }
  }

  loadArchive()

  return {
    archives: readonly(archives),
    loading: readonly(loading),
    error: readonly(error),
    refresh: loadArchive
  }
}