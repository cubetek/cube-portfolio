/**
 * Content Helper Composables
 * 
 * This module provides utility functions for content transformation,
 * formatting, and helper operations.
 */

import type {
  ParsedContent,
  ContentMeta,
  BaseFrontmatter
} from '~/types/content'

/**
 * Content formatting composable
 */
export function useContentFormatting() {
  const { locale } = useI18n()

  /**
   * Formats a date string according to current locale
   */
  const formatDate = (dateString: string, options: Intl.DateTimeFormatOptions = {}) => {
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }

    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat(locale.value, { ...defaultOptions, ...options }).format(date)
    } catch (error) {
      console.warn('Invalid date format:', dateString)
      return dateString
    }
  }

  /**
   * Formats relative time (e.g., "2 days ago")
   */
  const formatRelativeTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

      const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 }
      ]

      for (const interval of intervals) {
        const count = Math.floor(diffInSeconds / interval.seconds)
        if (count > 0) {
          const rtf = new Intl.RelativeTimeFormat(locale.value, { numeric: 'auto' })
          return rtf.format(-count, interval.label as Intl.RelativeTimeFormatUnit)
        }
      }

      return 'just now'
    } catch (error) {
      console.warn('Invalid date for relative formatting:', dateString)
      return dateString
    }
  }

  /**
   * Estimates reading time based on content
   */
  const calculateReadingTime = (content: string, wordsPerMinute = 200) => {
    const words = content.trim().split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  /**
   * Truncates text to specified length
   */
  const truncateText = (text: string, maxLength = 150, suffix = '...') => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + suffix
  }

  /**
   * Generates excerpt from content body
   */
  const generateExcerpt = (content: any, maxLength = 200) => {
    if (typeof content === 'string') {
      // Remove markdown formatting
      const plainText = content
        .replace(/#{1,6}\s+/g, '') // Headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
        .replace(/\*(.*?)\*/g, '$1') // Italic
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
        .replace(/`(.*?)`/g, '$1') // Inline code
        .replace(/```[\s\S]*?```/g, '') // Code blocks
        .trim()

      return truncateText(plainText, maxLength)
    }

    // Handle parsed content object
    if (content && content.children) {
      const textContent = extractTextFromNodes(content.children)
      return truncateText(textContent, maxLength)
    }

    return ''
  }

  /**
   * Extracts plain text from parsed content nodes
   */
  const extractTextFromNodes = (nodes: any[]): string => {
    let text = ''
    
    for (const node of nodes) {
      if (node.type === 'text') {
        text += node.value + ' '
      } else if (node.children) {
        text += extractTextFromNodes(node.children) + ' '
      }
    }
    
    return text.trim()
  }

  return {
    formatDate,
    formatRelativeTime,
    calculateReadingTime,
    truncateText,
    generateExcerpt,
    extractTextFromNodes
  }
}

/**
 * Content metadata composable
 */
export function useContentMeta() {
  const { locale } = useI18n()
  const route = useRoute()

  /**
   * Generates complete meta tags for a content item
   */
  const generateMetaTags = (content: ParsedContent) => {
    const meta = content.frontmatter.meta
    const baseUrl = 'https://yourwebsite.com' // Replace with actual base URL

    const tags = [
      // Basic meta tags
      { name: 'description', content: meta.description },
      { name: 'keywords', content: Array.isArray(meta.keywords) ? meta.keywords.join(', ') : meta.keywords },
      
      // Open Graph tags
      { property: 'og:title', content: meta.ogTitle || meta.title },
      { property: 'og:description', content: meta.ogDescription || meta.description },
      { property: 'og:type', content: 'article' },
      { property: 'og:url', content: `${baseUrl}${content._path}` },
      { property: 'og:locale', content: locale.value },
      
      // Twitter Card tags
      { name: 'twitter:card', content: meta.twitterCard || 'summary_large_image' },
      { name: 'twitter:title', content: meta.ogTitle || meta.title },
      { name: 'twitter:description', content: meta.ogDescription || meta.description },
      
      // Article specific tags
      { property: 'article:published_time', content: content.frontmatter.created },
      { property: 'article:modified_time', content: content.frontmatter.updated }
    ]

    // Add image tags if available
    if (meta.ogImage) {
      tags.push(
        { property: 'og:image', content: meta.ogImage },
        { name: 'twitter:image', content: meta.ogImage }
      )
    }

    // Add author for blog posts
    if (content.frontmatter.category === 'blog' && 'author' in content.frontmatter) {
      tags.push({ property: 'article:author', content: content.frontmatter.author })
    }

    // Add tags as article:tag
    if (content.frontmatter.tags && content.frontmatter.tags.length > 0) {
      content.frontmatter.tags.forEach((tag: string) => {
        tags.push({ property: 'article:tag', content: tag })
      })
    }

    return tags.filter(tag => tag.content) // Remove empty tags
  }

  /**
   * Generates structured data (JSON-LD) for content
   */
  const generateStructuredData = (content: ParsedContent) => {
    const meta = content.frontmatter.meta
    const baseUrl = 'https://yourwebsite.com' // Replace with actual base URL

    const structuredData: any = {
      '@context': 'https://schema.org',
      '@type': content.frontmatter.category === 'blog' ? 'BlogPosting' : 'WebPage',
      headline: meta.title,
      description: meta.description,
      url: `${baseUrl}${content._path}`,
      datePublished: content.frontmatter.created,
      dateModified: content.frontmatter.updated,
      inLanguage: locale.value
    }

    // Add author for blog posts
    if (content.frontmatter.category === 'blog' && 'author' in content.frontmatter) {
      structuredData.author = {
        '@type': 'Person',
        name: content.frontmatter.author
      }
    }

    // Add image if available
    if (meta.ogImage) {
      structuredData.image = meta.ogImage
    }

    // Add publisher information
    structuredData.publisher = {
      '@type': 'Organization',
      name: 'Your Website Name' // Replace with actual name
    }

    return structuredData
  }

  return {
    generateMetaTags,
    generateStructuredData
  }
}

/**
 * Content URL generation composable
 */
export function useContentUrls() {
  const { locale } = useI18n()
  const localePath = useLocalePath()

  /**
   * Generates localized URL for content
   */
  const getContentUrl = (slug: string, category?: string) => {
    const path = category === 'blog' ? `/blog/${slug}` : `/${slug}`
    return localePath(path)
  }

  /**
   * Generates category archive URL
   */
  const getCategoryUrl = (category: string) => {
    return localePath(`/${category}`)
  }

  /**
   * Generates tag URL
   */
  const getTagUrl = (tag: string) => {
    return localePath(`/tags/${tag}`)
  }

  /**
   * Generates archive URL for date
   */
  const getArchiveUrl = (year: number, month?: number) => {
    const path = month ? `/archive/${year}/${month}` : `/archive/${year}`
    return localePath(path)
  }

  return {
    getContentUrl,
    getCategoryUrl,
    getTagUrl,
    getArchiveUrl
  }
}

/**
 * Content state management composable
 */
export function useContentCache() {
  // Global content loading state
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  // Content cache
  const contentCache = reactive(new Map<string, ParsedContent>())

  /**
   * Sets global loading state
   */
  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  /**
   * Sets global error state
   */
  const setError = (err: Error | null) => {
    error.value = err
  }

  /**
   * Caches content item
   */
  const cacheContent = (key: string, content: ParsedContent) => {
    contentCache.set(key, content)
  }

  /**
   * Retrieves cached content
   */
  const getCachedContent = (key: string): ParsedContent | undefined => {
    return contentCache.get(key)
  }

  /**
   * Clears content cache
   */
  const clearCache = () => {
    contentCache.clear()
  }

  /**
   * Clears specific cache entry
   */
  const clearCacheEntry = (key: string) => {
    contentCache.delete(key)
  }

  return {
    isLoading: readonly(isLoading),
    error: readonly(error),
    contentCache: readonly(contentCache),
    setLoading,
    setError,
    cacheContent,
    getCachedContent,
    clearCache,
    clearCacheEntry
  }
}

/**
 * Content validation helpers
 */
export function useContentValidation() {
  /**
   * Validates if content is published and visible
   */
  const isContentVisible = (content: ParsedContent): boolean => {
    return content.frontmatter.published === true
  }

  /**
   * Validates if content has required fields
   */
  const hasRequiredFields = (content: ParsedContent): boolean => {
    const required = ['title', 'description', 'slug', 'category']
    return required.every(field => 
      content.frontmatter[field as keyof BaseFrontmatter] !== undefined
    )
  }

  /**
   * Checks if content is recent (within specified days)
   */
  const isRecentContent = (content: ParsedContent, days = 30): boolean => {
    const contentDate = new Date(content.frontmatter.created)
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)
    return contentDate >= cutoffDate
  }

  return {
    isContentVisible,
    hasRequiredFields,
    isRecentContent
  }
}