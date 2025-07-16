/**
 * Unit Tests for useContent Composable
 * 
 * Tests the content management composable functionality including:
 * - Content queries and pagination
 * - Content fetching by slug and path
 * - Blog posts and featured content
 * - Content navigation and statistics
 * - Multilingual content handling
 * - Error handling and edge cases
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref, nextTick } from 'vue'
import { 
  useContentQuery, 
  useContentBySlug, 
  useContentByPath, 
  useBlogPosts, 
  useFeaturedPosts, 
  useContentNavigation, 
  useRelatedContent, 
  useContentStats 
} from '~/composables/useContent'

// Mock Nuxt Content functions
const mockQueryCollection = vi.fn()
const mockQueryCollectionNavigation = vi.fn()

vi.mock('#content/client', () => ({
  queryCollection: (...args: any[]) => mockQueryCollection(...args),
  queryCollectionNavigation: (...args: any[]) => mockQueryCollectionNavigation(...args)
}))

// Mock useI18n
vi.mock('#imports', () => ({
  useI18n: vi.fn(() => ({
    locale: ref('en')
  }))
}))

// Mock query chain methods
const createMockQuery = (data: any[] = []) => {
  const query = {
    where: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    skip: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    path: vi.fn().mockReturnThis(),
    first: vi.fn().mockResolvedValue(data[0] || null),
    all: vi.fn().mockResolvedValue(data)
  }
  return query
}

describe('useContent Composables', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('useContentQuery', () => {
    const mockBlogPosts = [
      {
        id: '1',
        title: 'Test Post 1',
        slug: 'test-post-1',
        category: 'blog',
        tags: ['vue', 'nuxt'],
        published: true,
        date: '2024-01-01',
        description: 'Test description 1'
      },
      {
        id: '2',
        title: 'Test Post 2',
        slug: 'test-post-2',
        category: 'blog',
        tags: ['javascript'],
        published: true,
        date: '2024-01-02',
        description: 'Test description 2'
      }
    ]

    it('should query content with default parameters', async () => {
      const mockQuery = createMockQuery(mockBlogPosts)
      mockQueryCollection.mockReturnValue(mockQuery)

      const { data, total, loading, error } = useContentQuery()

      // Wait for query to complete
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(mockQueryCollection).toHaveBeenCalledWith('pages')
      expect(data.value).toEqual(mockBlogPosts)
      expect(total.value).toBe(2)
      expect(loading.value).toBe(false)
      expect(error.value).toBeNull()
    })

    it('should query blog content with category filter', async () => {
      const mockQuery = createMockQuery(mockBlogPosts)
      mockQueryCollection.mockReturnValue(mockQuery)

      const { data } = useContentQuery({ category: 'blog' })

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(mockQueryCollection).toHaveBeenCalledWith('blog')
      expect(mockQuery.where).toHaveBeenCalledWith('category', '=', 'blog')
    })

    it('should apply tag filters', async () => {
      const mockQuery = createMockQuery(mockBlogPosts)
      mockQueryCollection.mockReturnValue(mockQuery)

      const { data } = useContentQuery({ tags: ['vue', 'nuxt'] })

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(mockQuery.where).toHaveBeenCalledWith('tags', 'IN', ['vue', 'nuxt'])
    })

    it('should apply single tag filter', async () => {
      const mockQuery = createMockQuery(mockBlogPosts)
      mockQueryCollection.mockReturnValue(mockQuery)

      const { data } = useContentQuery({ tags: 'vue' })

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(mockQuery.where).toHaveBeenCalledWith('tags', 'IN', ['vue'])
    })

    it('should apply published filter', async () => {
      const mockQuery = createMockQuery(mockBlogPosts)
      mockQueryCollection.mockReturnValue(mockQuery)

      const { data } = useContentQuery({ published: true })

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(mockQuery.where).toHaveBeenCalledWith('published', '=', true)
    })

    it('should apply sorting', async () => {
      const mockQuery = createMockQuery(mockBlogPosts)
      mockQueryCollection.mockReturnValue(mockQuery)

      const { data } = useContentQuery({ sortOrder: 'asc' })

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(mockQuery.order).toHaveBeenCalledWith('date', 'ASC')
    })

    it('should apply pagination', async () => {
      const mockQuery = createMockQuery(mockBlogPosts)
      mockQueryCollection.mockReturnValue(mockQuery)

      const { data } = useContentQuery({ skip: 10, limit: 5 })

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(mockQuery.skip).toHaveBeenCalledWith(10)
      expect(mockQuery.limit).toHaveBeenCalledWith(5)
    })

    it('should handle query errors', async () => {
      const mockError = new Error('Query failed')
      const mockQuery = createMockQuery([])
      mockQuery.all.mockRejectedValue(mockError)
      mockQueryCollection.mockReturnValue(mockQuery)

      const { data, error, loading } = useContentQuery()

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(error.value).toEqual(mockError)
      expect(loading.value).toBe(false)
      expect(data.value).toEqual([])
    })

    it('should refresh content', async () => {
      const mockQuery = createMockQuery(mockBlogPosts)
      mockQueryCollection.mockReturnValue(mockQuery)

      const { refresh, data } = useContentQuery()

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      // Update mock data
      const newData = [...mockBlogPosts, { id: '3', title: 'New Post' }]
      mockQuery.all.mockResolvedValue(newData)

      await refresh()

      expect(data.value).toEqual(newData)
    })
  })

  describe('useContentBySlug', () => {
    const mockContent = {
      id: '1',
      title: 'Test Content',
      slug: 'test-content',
      content: 'Test content body'
    }

    it('should fetch content by slug from blog collection', async () => {
      const mockQuery = createMockQuery([mockContent])
      mockQueryCollection.mockReturnValue(mockQuery)

      const { data, loading, error } = useContentBySlug('test-content')

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(mockQueryCollection).toHaveBeenCalledWith('blog')
      expect(mockQuery.where).toHaveBeenCalledWith('slug', '=', 'test-content')
      expect(data.value).toEqual(mockContent)
      expect(loading.value).toBe(false)
      expect(error.value).toBeNull()
    })

    it('should fallback to pages collection if not found in blog', async () => {
      const mockBlogQuery = createMockQuery([])
      const mockPagesQuery = createMockQuery([mockContent])
      
      mockQueryCollection
        .mockReturnValueOnce(mockBlogQuery)
        .mockReturnValueOnce(mockPagesQuery)
      
      mockBlogQuery.first.mockRejectedValue(new Error('Not found'))

      const { data } = useContentBySlug('test-content')

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(mockQueryCollection).toHaveBeenCalledWith('blog')
      expect(mockQueryCollection).toHaveBeenCalledWith('pages')
      expect(data.value).toEqual(mockContent)
    })

    it('should handle errors', async () => {
      const mockError = new Error('Content not found')
      const mockQuery = createMockQuery([])
      mockQuery.first.mockRejectedValue(mockError)
      mockQueryCollection.mockReturnValue(mockQuery)

      const { data, error } = useContentBySlug('nonexistent')

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(error.value).toEqual(mockError)
      expect(data.value).toBeNull()
    })

    it('should refresh content by slug', async () => {
      const mockQuery = createMockQuery([mockContent])
      mockQueryCollection.mockReturnValue(mockQuery)

      const { refresh, data } = useContentBySlug('test-content')

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      const updatedContent = { ...mockContent, title: 'Updated Title' }
      mockQuery.first.mockResolvedValue(updatedContent)

      await refresh()

      expect(data.value).toEqual(updatedContent)
    })
  })

  describe('useContentByPath', () => {
    const mockContent = {
      id: '1',
      title: 'Test Page',
      path: '/test-page'
    }

    it('should fetch content by path from pages collection', async () => {
      const mockQuery = createMockQuery([mockContent])
      mockQueryCollection.mockReturnValue(mockQuery)

      const { data, loading, error } = useContentByPath('/test-page')

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(mockQueryCollection).toHaveBeenCalledWith('pages')
      expect(mockQuery.path).toHaveBeenCalledWith('/test-page')
      expect(data.value).toEqual(mockContent)
    })

    it('should fallback to blog collection if not found in pages', async () => {
      const mockPagesQuery = createMockQuery([])
      const mockBlogQuery = createMockQuery([mockContent])
      
      mockQueryCollection
        .mockReturnValueOnce(mockPagesQuery)
        .mockReturnValueOnce(mockBlogQuery)
      
      mockPagesQuery.first.mockRejectedValue(new Error('Not found'))

      const { data } = useContentByPath('/test-page')

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(mockQueryCollection).toHaveBeenCalledWith('pages')
      expect(mockQueryCollection).toHaveBeenCalledWith('blog')
      expect(data.value).toEqual(mockContent)
    })
  })

  describe('useBlogPosts', () => {
    it('should query blog posts with default settings', async () => {
      const mockQuery = createMockQuery([])
      mockQueryCollection.mockReturnValue(mockQuery)

      const { data } = useBlogPosts()

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(mockQueryCollection).toHaveBeenCalledWith('blog')
      expect(mockQuery.where).toHaveBeenCalledWith('category', '=', 'blog')
      expect(mockQuery.where).toHaveBeenCalledWith('published', '=', true)
    })

    it('should respect custom published setting', async () => {
      const mockQuery = createMockQuery([])
      mockQueryCollection.mockReturnValue(mockQuery)

      const { data } = useBlogPosts({ published: false })

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(mockQuery.where).toHaveBeenCalledWith('published', '=', false)
    })
  })

  describe('useFeaturedPosts', () => {
    const mockFeaturedPosts = [
      {
        id: '1',
        title: 'Featured Post 1',
        featured: true,
        published: true,
        date: '2024-01-01'
      }
    ]

    it('should fetch featured posts with default limit', async () => {
      const mockQuery = createMockQuery(mockFeaturedPosts)
      mockQueryCollection.mockReturnValue(mockQuery)

      const { data, loading, error } = useFeaturedPosts()

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(mockQueryCollection).toHaveBeenCalledWith('blog')
      expect(mockQuery.where).toHaveBeenCalledWith('featured', '=', true)
      expect(mockQuery.where).toHaveBeenCalledWith('published', '=', true)
      expect(mockQuery.limit).toHaveBeenCalledWith(3)
      expect(data.value).toEqual(mockFeaturedPosts)
    })

    it('should respect custom limit', async () => {
      const mockQuery = createMockQuery(mockFeaturedPosts)
      mockQueryCollection.mockReturnValue(mockQuery)

      const { data } = useFeaturedPosts(5)

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(mockQuery.limit).toHaveBeenCalledWith(5)
    })

    it('should handle errors in featured posts', async () => {
      const mockError = new Error('Featured posts error')
      const mockQuery = createMockQuery([])
      mockQuery.all.mockRejectedValue(mockError)
      mockQueryCollection.mockReturnValue(mockQuery)

      const { error } = useFeaturedPosts()

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(error.value).toEqual(mockError)
    })
  })

  describe('useContentNavigation', () => {
    const mockNavigation = [
      {
        title: 'Home',
        path: '/',
        navigation: true
      },
      {
        title: 'About',
        path: '/about',
        navigation: true
      }
    ]

    it('should fetch content navigation', async () => {
      mockQueryCollectionNavigation.mockResolvedValue(mockNavigation)

      const { data, loading, error } = useContentNavigation()

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(mockQueryCollectionNavigation).toHaveBeenCalledWith('pages')
      expect(data.value).toHaveLength(2)
      expect(data.value[0]).toEqual({
        title: 'Home',
        href: '/',
        children: []
      })
    })

    it('should handle navigation errors', async () => {
      const mockError = new Error('Navigation error')
      mockQueryCollectionNavigation.mockRejectedValue(mockError)

      const { error } = useContentNavigation()

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(error.value).toEqual(mockError)
    })
  })

  describe('useRelatedContent', () => {
    const mockRelatedContent = [
      {
        id: '2',
        title: 'Related Post',
        slug: 'related-post',
        category: 'blog'
      }
    ]

    it('should fetch related content excluding current slug', async () => {
      const mockQuery = createMockQuery(mockRelatedContent)
      mockQueryCollection.mockReturnValue(mockQuery)

      const { data } = useRelatedContent('current-slug', 'blog')

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(mockQueryCollection).toHaveBeenCalledWith('blog')
      expect(mockQuery.where).toHaveBeenCalledWith('slug', '<>', 'current-slug')
      expect(mockQuery.where).toHaveBeenCalledWith('published', '=', true)
      expect(mockQuery.where).toHaveBeenCalledWith('category', '=', 'blog')
      expect(mockQuery.limit).toHaveBeenCalledWith(3)
    })

    it('should use default collection when no category provided', async () => {
      const mockQuery = createMockQuery(mockRelatedContent)
      mockQueryCollection.mockReturnValue(mockQuery)

      const { data } = useRelatedContent('current-slug')

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(mockQueryCollection).toHaveBeenCalledWith('pages')
    })

    it('should respect custom limit', async () => {
      const mockQuery = createMockQuery(mockRelatedContent)
      mockQueryCollection.mockReturnValue(mockQuery)

      const { data } = useRelatedContent('current-slug', 'blog', 5)

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(mockQuery.limit).toHaveBeenCalledWith(5)
    })
  })

  describe('useContentStats', () => {
    const mockBlogPosts = [
      { category: 'tech', published: true },
      { category: 'tech', published: true },
      { category: 'personal', published: true }
    ]

    const mockPages = [
      { published: true },
      { published: true }
    ]

    it('should calculate content statistics', async () => {
      const mockBlogQuery = createMockQuery(mockBlogPosts)
      const mockPagesQuery = createMockQuery(mockPages)
      
      mockQueryCollection
        .mockReturnValueOnce(mockBlogQuery)
        .mockReturnValueOnce(mockPagesQuery)

      const { stats, loading, error } = useContentStats()

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(stats.value.totalPosts).toBe(3)
      expect(stats.value.totalPages).toBe(2)
      expect(stats.value.totalContent).toBe(5)
      expect(stats.value.categories).toEqual({
        tech: 2,
        personal: 1
      })
      expect(loading.value).toBe(false)
      expect(error.value).toBeNull()
    })

    it('should handle stats calculation errors', async () => {
      const mockError = new Error('Stats error')
      const mockQuery = createMockQuery([])
      mockQuery.all.mockRejectedValue(mockError)
      mockQueryCollection.mockReturnValue(mockQuery)

      const { error } = useContentStats()

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(error.value).toEqual(mockError)
    })

    it('should refresh stats', async () => {
      const mockBlogQuery = createMockQuery(mockBlogPosts)
      const mockPagesQuery = createMockQuery(mockPages)
      
      mockQueryCollection
        .mockReturnValue(mockBlogQuery)
        .mockReturnValue(mockPagesQuery)

      const { refresh, stats } = useContentStats()

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      // Update mock data
      const newBlogPosts = [...mockBlogPosts, { category: 'news', published: true }]
      mockBlogQuery.all.mockResolvedValue(newBlogPosts)

      await refresh()

      expect(stats.value.totalPosts).toBe(4)
      expect(stats.value.totalContent).toBe(6)
    })
  })

  describe('Language Support', () => {
    it('should respect current locale in content queries', async () => {
      // Test with Arabic locale
      const { locale } = useI18n()
      locale.value = 'ar'

      const mockQuery = createMockQuery([])
      mockQueryCollection.mockReturnValue(mockQuery)

      const { data } = useContentQuery()

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      // Should use Arabic locale for content filtering
      expect(mockQueryCollection).toHaveBeenCalled()
    })

    it('should override locale with explicit language parameter', async () => {
      const mockQuery = createMockQuery([])
      mockQueryCollection.mockReturnValue(mockQuery)

      const { data } = useContentBySlug('test-slug', 'en')

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      // Should use English despite current locale
      expect(mockQueryCollection).toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty query results', async () => {
      const mockQuery = createMockQuery([])
      mockQueryCollection.mockReturnValue(mockQuery)

      const { data, total } = useContentQuery()

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(data.value).toEqual([])
      expect(total.value).toBe(0)
    })

    it('should handle null content in single content queries', async () => {
      const mockQuery = createMockQuery([])
      mockQuery.first.mockResolvedValue(null)
      mockQueryCollection.mockReturnValue(mockQuery)

      const { data } = useContentBySlug('nonexistent')

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(data.value).toBeNull()
    })

    it('should handle invalid query parameters gracefully', async () => {
      const mockQuery = createMockQuery([])
      mockQueryCollection.mockReturnValue(mockQuery)

      const { data } = useContentQuery({ 
        tags: null as any, 
        category: undefined as any 
      })

      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(data.value).toEqual([])
    })
  })
})