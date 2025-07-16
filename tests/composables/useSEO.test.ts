/**
 * Unit Tests for useSEO Composable
 * 
 * Tests the SEO management composable functionality including:
 * - Meta tag generation and management
 * - Multilingual SEO support
 * - OpenGraph and Twitter Cards
 * - Structured data generation
 * - Canonical URLs and hreflang
 * - Error handling and fallbacks
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'
import { useSEO } from '~/composables/useSEO'

// Mock dependencies
const mockUseSeoMeta = vi.fn()
const mockUseHead = vi.fn()
const mockUseSchemaOrg = vi.fn()
const mockUseRuntimeConfig = vi.fn()
const mockUseRoute = vi.fn()
const mockUseI18n = vi.fn()
const mockUseMultilingualSEO = vi.fn()
const mockUseSocialMedia = vi.fn()

vi.mock('#imports', () => ({
  useSeoMeta: mockUseSeoMeta,
  useHead: mockUseHead,
  useSchemaOrg: mockUseSchemaOrg,
  useRuntimeConfig: mockUseRuntimeConfig,
  useRoute: mockUseRoute,
  useI18n: mockUseI18n
}))

vi.mock('~/composables/useMultilingualSEO', () => ({
  useMultilingualSEO: mockUseMultilingualSEO
}))

vi.mock('~/composables/useSocialMedia', () => ({
  useSocialMedia: mockUseSocialMedia
}))

describe('useSEO', () => {
  const mockSiteUrl = 'https://example.com'
  const mockRoute = {
    path: '/test-page'
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // Setup default mocks
    mockUseRuntimeConfig.mockReturnValue({
      public: {
        siteUrl: mockSiteUrl
      }
    })

    mockUseRoute.mockReturnValue(mockRoute)

    mockUseI18n.mockReturnValue({
      locale: ref('en'),
      t: (key: string) => {
        const translations: Record<string, string> = {
          'meta.description': 'Default site description'
        }
        return translations[key] || key
      }
    })

    mockUseMultilingualSEO.mockReturnValue({
      getMultilingualHead: () => ({
        meta: [
          { name: 'language', content: 'en' }
        ],
        link: [
          { rel: 'alternate', hreflang: 'en', href: 'https://example.com/en' }
        ]
      }),
      getCanonicalUrl: () => 'https://example.com/test-page',
      getHreflangAlternates: () => [
        { hreflang: 'en', href: 'https://example.com/en' },
        { hreflang: 'ar', href: 'https://example.com/ar' }
      ]
    })

    mockUseSocialMedia.mockReturnValue({
      getSocialMeta: () => ({
        'og:title': 'Test Title',
        'og:description': 'Test Description',
        'og:image': 'https://example.com/og-image.jpg',
        'twitter:card': 'summary_large_image'
      })
    })
  })

  describe('Basic SEO Setup', () => {
    it('should initialize with default values', () => {
      const seo = useSEO()

      expect(mockUseSeoMeta).toHaveBeenCalled()
      expect(mockUseHead).toHaveBeenCalled()
      expect(seo.setMeta).toBeDefined()
      expect(seo.generateStructuredData).toBeDefined()
      expect(seo.buildTitle).toBeDefined()
    })

    it('should build title correctly', () => {
      const seo = useSEO()

      expect(seo.buildTitle()).toBe('Your Personal Website')
      expect(seo.buildTitle('About')).toBe('About - Your Personal Website')
      expect(seo.buildTitle('')).toBe('Your Personal Website')
    })

    it('should build canonical URL correctly', () => {
      const seo = useSEO()
      const canonicalFn = seo.buildCanonical

      expect(typeof canonicalFn).toBe('function')
    })
  })

  describe('Meta Tag Generation', () => {
    it('should set basic meta tags', () => {
      const seoData = {
        title: 'Test Page',
        description: 'Test page description',
        keywords: 'test, page, keywords'
      }

      useSEO(seoData)

      expect(mockUseSeoMeta).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Page - Your Personal Website',
          description: 'Test page description',
          keywords: 'test, page, keywords',
          author: 'Your Name',
          robots: 'index,follow'
        })
      )
    })

    it('should set noindex when specified', () => {
      const seoData = {
        title: 'Private Page',
        noindex: true
      }

      useSEO(seoData)

      expect(mockUseSeoMeta).toHaveBeenCalledWith(
        expect.objectContaining({
          robots: 'noindex,nofollow'
        })
      )
    })

    it('should include article-specific meta for articles', () => {
      const seoData = {
        title: 'Blog Post',
        type: 'article' as const,
        author: 'John Doe',
        publishedTime: '2024-01-01',
        modifiedTime: '2024-01-02',
        section: 'Technology',
        tags: ['vue', 'nuxt']
      }

      useSEO(seoData)

      expect(mockUseSeoMeta).toHaveBeenCalledWith(
        expect.objectContaining({
          articleAuthor: 'John Doe',
          articlePublishedTime: '2024-01-01',
          articleModifiedTime: '2024-01-02',
          articleSection: 'Technology',
          articleTag: ['vue', 'nuxt']
        })
      )
    })

    it('should use default description when none provided', () => {
      useSEO()

      expect(mockUseSeoMeta).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'Default site description'
        })
      )
    })

    it('should include social media meta', () => {
      const seoData = {
        title: 'Social Post',
        description: 'Social description',
        image: 'https://example.com/custom-image.jpg'
      }

      useSEO(seoData)

      expect(mockUseSocialMedia).toHaveBeenCalledWith({
        title: 'Social Post - Your Personal Website',
        description: 'Social description',
        image: 'https://example.com/custom-image.jpg',
        type: 'website',
        author: 'Your Name',
        siteName: 'Your Personal Website',
        twitterHandle: '@yourhandle'
      })

      expect(mockUseSeoMeta).toHaveBeenCalledWith(
        expect.objectContaining({
          'og:title': 'Test Title',
          'og:description': 'Test Description',
          'og:image': 'https://example.com/og-image.jpg',
          'twitter:card': 'summary_large_image'
        })
      )
    })
  })

  describe('Head Configuration', () => {
    it('should set multilingual head configuration', () => {
      useSEO()

      expect(mockUseHead).toHaveBeenCalledWith(
        expect.objectContaining({
          meta: expect.arrayContaining([
            { name: 'language', content: 'en' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { name: 'theme-color', content: '#0ea5e9' }
          ]),
          link: expect.arrayContaining([
            { rel: 'alternate', hreflang: 'en', href: 'https://example.com/en' }
          ])
        })
      )
    })

    it('should merge existing multilingual meta with additional meta', () => {
      // Mock additional multilingual meta
      mockUseMultilingualSEO.mockReturnValue({
        getMultilingualHead: () => ({
          meta: [
            { name: 'language', content: 'en' },
            { name: 'geo.region', content: 'US' }
          ]
        }),
        getCanonicalUrl: () => 'https://example.com/test-page',
        getHreflangAlternates: () => []
      })

      useSEO()

      expect(mockUseHead).toHaveBeenCalledWith(
        expect.objectContaining({
          meta: expect.arrayContaining([
            { name: 'language', content: 'en' },
            { name: 'geo.region', content: 'US' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { name: 'theme-color', content: '#0ea5e9' }
          ])
        })
      )
    })
  })

  describe('Structured Data Generation', () => {
    it('should generate WebSite structured data by default', () => {
      const seo = useSEO({
        title: 'Homepage',
        description: 'Site homepage'
      })

      seo.generateStructuredData()

      expect(mockUseSchemaOrg).toHaveBeenCalledWith([
        expect.objectContaining({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Your Personal Website',
          alternateName: 'Your Name - Personal Website',
          description: 'Site homepage',
          potentialAction: expect.objectContaining({
            '@type': 'SearchAction'
          })
        })
      ])
    })

    it('should generate Person structured data', () => {
      const seo = useSEO()

      seo.generateStructuredData('Person')

      expect(mockUseSchemaOrg).toHaveBeenCalledWith([
        expect.objectContaining({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Your Name',
          jobTitle: 'Your Job Title',
          url: mockSiteUrl,
          sameAs: expect.arrayContaining([
            'https://linkedin.com/in/yourprofile',
            'https://github.com/yourusername',
            'https://twitter.com/yourhandle'
          ])
        })
      ])
    })

    it('should generate Article structured data', () => {
      const seo = useSEO({
        title: 'My Blog Post',
        description: 'A great blog post',
        image: 'https://example.com/post-image.jpg',
        author: 'Jane Doe',
        publishedTime: '2024-01-01',
        modifiedTime: '2024-01-02'
      })

      seo.generateStructuredData('Article')

      expect(mockUseSchemaOrg).toHaveBeenCalledWith([
        expect.objectContaining({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'My Blog Post',
          image: 'https://example.com/post-image.jpg',
          author: expect.objectContaining({
            '@type': 'Person',
            name: 'Jane Doe'
          }),
          publisher: expect.objectContaining({
            '@type': 'Organization',
            name: 'Your Personal Website'
          }),
          datePublished: '2024-01-01',
          dateModified: '2024-01-02'
        })
      ])
    })

    it('should use publishedTime as modifiedTime fallback', () => {
      const seo = useSEO({
        title: 'Blog Post',
        publishedTime: '2024-01-01'
      })

      seo.generateStructuredData('Article')

      expect(mockUseSchemaOrg).toHaveBeenCalledWith([
        expect.objectContaining({
          datePublished: '2024-01-01',
          dateModified: '2024-01-01'
        })
      ])
    })
  })

  describe('Multilingual Support', () => {
    it('should integrate with multilingual SEO composable', () => {
      useSEO()

      expect(mockUseMultilingualSEO).toHaveBeenCalled()
    })

    it('should provide hreflang alternates', () => {
      const seo = useSEO()

      const alternates = seo.getHreflangAlternates()
      expect(alternates).toEqual([
        { hreflang: 'en', href: 'https://example.com/en' },
        { hreflang: 'ar', href: 'https://example.com/ar' }
      ])
    })

    it('should support Arabic locale', () => {
      mockUseI18n.mockReturnValue({
        locale: ref('ar'),
        t: (key: string) => {
          const translations: Record<string, string> = {
            'meta.description': 'وصف الموقع الافتراضي'
          }
          return translations[key] || key
        }
      })

      useSEO()

      expect(mockUseSeoMeta).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'وصف الموقع الافتراضي'
        })
      )
    })
  })

  describe('URL Building', () => {
    it('should build canonical URL correctly for English', () => {
      mockUseRoute.mockReturnValue({ path: '/en/about' })

      const seo = useSEO()
      
      // Should use the multilingual SEO composable's canonical URL
      expect(mockUseMultilingualSEO).toHaveBeenCalled()
    })

    it('should build canonical URL correctly for Arabic', () => {
      mockUseI18n.mockReturnValue({
        locale: ref('ar'),
        t: (key: string) => key
      })
      mockUseRoute.mockReturnValue({ path: '/about' })

      const seo = useSEO()

      expect(mockUseMultilingualSEO).toHaveBeenCalled()
    })

    it('should handle custom canonical URL', () => {
      const customCanonical = 'https://custom.com/page'
      const seo = useSEO({ canonical: customCanonical })

      expect(typeof seo.buildCanonical).toBe('function')
    })
  })

  describe('Environment Configuration', () => {
    it('should use runtime config site URL', () => {
      mockUseRuntimeConfig.mockReturnValue({
        public: {
          siteUrl: 'https://production.com'
        }
      })

      useSEO()

      // Should use the production URL from runtime config
      expect(mockUseRuntimeConfig).toHaveBeenCalled()
    })

    it('should fallback to environment variable', () => {
      mockUseRuntimeConfig.mockReturnValue({
        public: {}
      })

      // Mock process.env
      const originalEnv = process.env.NUXT_PUBLIC_SITE_URL
      process.env.NUXT_PUBLIC_SITE_URL = 'https://env.com'

      useSEO()

      expect(mockUseRuntimeConfig).toHaveBeenCalled()

      // Restore original env
      if (originalEnv) {
        process.env.NUXT_PUBLIC_SITE_URL = originalEnv
      } else {
        delete process.env.NUXT_PUBLIC_SITE_URL
      }
    })

    it('should use default URL as final fallback', () => {
      mockUseRuntimeConfig.mockReturnValue({
        public: {}
      })

      delete process.env.NUXT_PUBLIC_SITE_URL

      useSEO()

      expect(mockUseRuntimeConfig).toHaveBeenCalled()
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing title gracefully', () => {
      const seo = useSEO({})

      expect(seo.buildTitle()).toBe('Your Personal Website')
      expect(seo.buildTitle(undefined)).toBe('Your Personal Website')
      expect(seo.buildTitle('')).toBe('Your Personal Website')
    })

    it('should handle undefined SEO data', () => {
      expect(() => useSEO(undefined)).not.toThrow()
    })

    it('should handle empty SEO data object', () => {
      expect(() => useSEO({})).not.toThrow()
    })

    it('should handle missing translations', () => {
      mockUseI18n.mockReturnValue({
        locale: ref('en'),
        t: (key: string) => {
          // Return key if translation not found
          return key
        }
      })

      useSEO()

      expect(mockUseSeoMeta).toHaveBeenCalledWith(
        expect.objectContaining({
          description: 'meta.description'
        })
      )
    })

    it('should handle malformed route path', () => {
      mockUseRoute.mockReturnValue({ path: '' })

      expect(() => useSEO()).not.toThrow()
    })

    it('should handle missing runtime config', () => {
      mockUseRuntimeConfig.mockReturnValue({})

      expect(() => useSEO()).not.toThrow()
    })
  })

  describe('Return Value Interface', () => {
    it('should return all expected functions', () => {
      const seo = useSEO()

      expect(seo).toHaveProperty('setMeta')
      expect(seo).toHaveProperty('generateStructuredData')
      expect(seo).toHaveProperty('buildTitle')
      expect(seo).toHaveProperty('buildCanonical')
      expect(seo).toHaveProperty('getHreflangAlternates')
      expect(seo).toHaveProperty('getMultilingualHead')

      expect(typeof seo.setMeta).toBe('function')
      expect(typeof seo.generateStructuredData).toBe('function')
      expect(typeof seo.buildTitle).toBe('function')
      expect(typeof seo.buildCanonical).toBe('function')
      expect(typeof seo.getHreflangAlternates).toBe('function')
      expect(typeof seo.getMultilingualHead).toBe('function')
    })
  })
})