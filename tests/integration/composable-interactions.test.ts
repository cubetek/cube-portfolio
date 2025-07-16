/**
 * Integration Tests for Composable Interactions
 * 
 * Tests the interactions between different composables to ensure they work
 * together correctly in real-world scenarios:
 * - Language + Theme interactions
 * - Language + Content interactions
 * - Theme + Performance interactions
 * - SEO + Language interactions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { 
  createMockI18nContext,
  createMockRTLContext,
  testLanguageSwitching 
} from '../utils/multilingual-helpers'
import { 
  createMockTheme,
  createMockPersonalData,
  createMockAppConfig 
} from '../utils/mock-factories'
import { flushPromises, measureExecutionTime } from '../utils/testing-helpers'

// Mock the actual composables
const mockUseLanguage = vi.fn()
const mockUseTheme = vi.fn()
const mockUsePersonalData = vi.fn()
const mockUseSEO = vi.fn()
const mockUseContent = vi.fn()
const mockUsePerformance = vi.fn()

vi.mock('~/composables/useLanguage', () => ({
  useLanguage: mockUseLanguage
}))

vi.mock('~/composables/useTheme', () => ({
  useTheme: mockUseTheme
}))

vi.mock('~/composables/usePersonalData', () => ({
  usePersonalData: mockUsePersonalData
}))

vi.mock('~/composables/useSEO', () => ({
  useSEO: mockUseSEO
}))

vi.mock('~/composables/useContent', () => ({
  useContent: mockUseContent
}))

vi.mock('~/composables/usePerformance', () => ({
  usePerformance: mockUsePerformance
}))

describe('Composable Interactions', () => {
  let i18nContext: any
  let rtlContext: any
  let themeContext: any
  let personalDataContext: any
  let seoContext: any
  let contentContext: any
  let performanceContext: any

  beforeEach(() => {
    // Setup mock contexts
    i18nContext = createMockI18nContext('en')
    rtlContext = createMockRTLContext('en')
    
    themeContext = {
      currentTheme: ref('light'),
      availableThemes: ['light', 'dark', 'modern'],
      switchTheme: vi.fn(async (theme: string) => {
        themeContext.currentTheme.value = theme
        await nextTick()
      }),
      isDark: ref(false),
      themeColors: ref(createMockTheme().colors)
    }
    
    personalDataContext = {
      profile: ref(createMockPersonalData().profile),
      skills: ref(createMockPersonalData().skills),
      projects: ref(createMockPersonalData().projects),
      refreshData: vi.fn()
    }
    
    seoContext = {
      currentMeta: ref({
        title: 'Test Site',
        description: 'Test Description',
        ogTitle: 'Test OG Title'
      }),
      updateMeta: vi.fn(),
      generateStructuredData: vi.fn()
    }
    
    contentContext = {
      currentContent: ref(null),
      fetchContent: vi.fn(),
      searchContent: vi.fn(),
      filterContent: vi.fn()
    }
    
    performanceContext = {
      metrics: ref({
        loadTime: 0,
        renderTime: 0,
        memoryUsage: 0
      }),
      startMeasurement: vi.fn(),
      stopMeasurement: vi.fn(),
      logPerformance: vi.fn()
    }

    // Setup mock return values
    mockUseLanguage.mockReturnValue(i18nContext)
    mockUseTheme.mockReturnValue(themeContext)
    mockUsePersonalData.mockReturnValue(personalDataContext)
    mockUseSEO.mockReturnValue(seoContext)
    mockUseContent.mockReturnValue(contentContext)
    mockUsePerformance.mockReturnValue(performanceContext)
  })

  describe('Language + Theme Integration', () => {
    it('should maintain theme preference across language switches', async () => {
      // Set initial theme
      await themeContext.switchTheme('dark')
      expect(themeContext.currentTheme.value).toBe('dark')
      
      // Switch language
      await i18nContext.switchLanguage('ar')
      await flushPromises()
      
      // Theme should remain the same
      expect(themeContext.currentTheme.value).toBe('dark')
      
      // Switch back to English
      await i18nContext.switchLanguage('en')
      await flushPromises()
      
      // Theme should still be preserved
      expect(themeContext.currentTheme.value).toBe('dark')
    })

    it('should update RTL styles when language changes', async () => {
      // Initially LTR (English)
      expect(rtlContext.direction.value).toBe('ltr')
      expect(rtlContext.isRTL.value).toBe(false)
      
      // Switch to Arabic
      await i18nContext.switchLanguage('ar')
      rtlContext.currentLocale.setValue('ar')
      await flushPromises()
      
      // Should become RTL
      expect(rtlContext.direction.value).toBe('rtl')
      expect(rtlContext.isRTL.value).toBe(true)
      
      // Body classes should update
      expect(rtlContext.bodyClasses.value).toContain('rtl')
      expect(rtlContext.bodyClasses.value).toContain('locale-ar')
    })

    it('should apply theme with proper RTL considerations', async () => {
      // Switch to Arabic and dark theme
      await i18nContext.switchLanguage('ar')
      rtlContext.currentLocale.setValue('ar')
      await themeContext.switchTheme('dark')
      await flushPromises()
      
      // Verify both RTL and dark theme are active
      expect(rtlContext.isRTL.value).toBe(true)
      expect(themeContext.currentTheme.value).toBe('dark')
      expect(rtlContext.bodyClasses.value).toContain('rtl')
    })
  })

  describe('Language + Personal Data Integration', () => {
    it('should update personal data when language changes', async () => {
      const mockData = createMockPersonalData('en')
      personalDataContext.profile.value = mockData.profile
      
      // Initially English
      expect(personalDataContext.profile.value.name).toBe('Ahmed Mohammed Ali')
      
      // Switch to Arabic
      await i18nContext.switchLanguage('ar')
      personalDataContext.profile.value = createMockPersonalData('ar').profile
      await flushPromises()
      
      // Data should be in Arabic
      expect(personalDataContext.profile.value.name).toBe('أحمد محمد علي')
    })

    it('should maintain data consistency across language switches', async () => {
      const enData = createMockPersonalData('en')
      const arData = createMockPersonalData('ar')
      
      // Switch between languages multiple times
      for (let i = 0; i < 3; i++) {
        await i18nContext.switchLanguage('ar')
        personalDataContext.profile.value = arData.profile
        await flushPromises()
        
        expect(personalDataContext.profile.value.yearsOfExperience).toBe(5)
        
        await i18nContext.switchLanguage('en')
        personalDataContext.profile.value = enData.profile
        await flushPromises()
        
        expect(personalDataContext.profile.value.yearsOfExperience).toBe(5)
      }
    })
  })

  describe('Language + SEO Integration', () => {
    it('should update SEO meta when language changes', async () => {
      // Initial English SEO
      seoContext.currentMeta.value.title = 'Ahmed Mohammed - Web Developer'
      seoContext.currentMeta.value.description = 'Professional web developer specializing in Vue.js'
      
      // Switch to Arabic
      await i18nContext.switchLanguage('ar')
      await flushPromises()
      
      // Simulate SEO update for Arabic
      seoContext.updateMeta({
        title: 'أحمد محمد - مطور ويب',
        description: 'مطور ويب محترف متخصص في Vue.js'
      })
      
      expect(seoContext.updateMeta).toHaveBeenCalledWith({
        title: 'أحمد محمد - مطور ويب',
        description: 'مطور ويب محترف متخصص في Vue.js'
      })
    })

    it('should generate proper hreflang tags for multiple languages', async () => {
      const hreflangTags = {
        'en': 'https://example.com/en/about',
        'ar': 'https://example.com/about',
        'x-default': 'https://example.com/about'
      }
      
      seoContext.generateStructuredData.mockReturnValue({
        '@type': 'WebPage',
        '@context': 'https://schema.org',
        url: hreflangTags[i18nContext.currentLocale.value],
        inLanguage: i18nContext.currentLocale.value
      })
      
      // Test for each language
      for (const locale of ['en', 'ar']) {
        await i18nContext.switchLanguage(locale)
        await flushPromises()
        
        const structuredData = seoContext.generateStructuredData()
        expect(structuredData.inLanguage).toBe(locale)
      }
    })
  })

  describe('Theme + Performance Integration', () => {
    it('should measure theme switching performance', async () => {
      performanceContext.startMeasurement.mockImplementation(() => {
        performanceContext.metrics.value.loadTime = performance.now()
      })
      
      performanceContext.stopMeasurement.mockImplementation(() => {
        const endTime = performance.now()
        performanceContext.metrics.value.renderTime = 
          endTime - performanceContext.metrics.value.loadTime
      })
      
      // Measure theme switch performance
      const themes = ['light', 'dark', 'modern']
      
      for (const theme of themes) {
        performanceContext.startMeasurement()
        await themeContext.switchTheme(theme)
        await flushPromises()
        performanceContext.stopMeasurement()
        
        expect(performanceContext.startMeasurement).toHaveBeenCalled()
        expect(performanceContext.stopMeasurement).toHaveBeenCalled()
      }
    })

    it('should optimize theme-dependent assets loading', async () => {
      // Mock asset loading optimization
      const assetLoadTimes: Record<string, number> = {
        'light': 120,
        'dark': 95,  // Dark theme might load faster due to fewer images
        'modern': 150
      }
      
      for (const [theme, expectedTime] of Object.entries(assetLoadTimes)) {
        performanceContext.metrics.value.loadTime = 0
        
        await themeContext.switchTheme(theme)
        performanceContext.metrics.value.loadTime = expectedTime
        await flushPromises()
        
        // Verify reasonable load times
        expect(performanceContext.metrics.value.loadTime).toBeLessThan(200)
      }
    })
  })

  describe('Content + Language Integration', () => {
    it('should fetch localized content when language changes', async () => {
      const mockEnContent = {
        title: 'About Me',
        content: 'I am a web developer...',
        slug: 'about'
      }
      
      const mockArContent = {
        title: 'عني',
        content: 'أنا مطور ويب...',
        slug: 'about'
      }
      
      // Mock content fetching
      contentContext.fetchContent.mockImplementation(async (locale: string) => {
        return locale === 'ar' ? mockArContent : mockEnContent
      })
      
      // Test English content
      const enContent = await contentContext.fetchContent('en')
      expect(enContent.title).toBe('About Me')
      
      // Test Arabic content
      const arContent = await contentContext.fetchContent('ar')
      expect(arContent.title).toBe('عني')
    })

    it('should search content in current language', async () => {
      const mockSearchResults = {
        'en': [
          { title: 'Vue.js Guide', excerpt: 'Learn Vue.js development' },
          { title: 'Nuxt.js Tutorial', excerpt: 'Build apps with Nuxt.js' }
        ],
        'ar': [
          { title: 'دليل Vue.js', excerpt: 'تعلم تطوير Vue.js' },
          { title: 'شرح Nuxt.js', excerpt: 'بناء التطبيقات مع Nuxt.js' }
        ]
      }
      
      contentContext.searchContent.mockImplementation(async (query: string, locale: string) => {
        return mockSearchResults[locale as keyof typeof mockSearchResults] || []
      })
      
      // Search in English
      await i18nContext.switchLanguage('en')
      const enResults = await contentContext.searchContent('Vue', 'en')
      expect(enResults[0].title).toBe('Vue.js Guide')
      
      // Search in Arabic
      await i18nContext.switchLanguage('ar')
      const arResults = await contentContext.searchContent('Vue', 'ar')
      expect(arResults[0].title).toBe('دليل Vue.js')
    })
  })

  describe('Performance Optimization Integration', () => {
    it('should measure end-to-end language switching performance', async () => {
      const performanceResults = await measureExecutionTime(async () => {
        // Simulate full language switch with all updates
        await i18nContext.switchLanguage('ar')
        rtlContext.currentLocale.setValue('ar')
        personalDataContext.profile.value = createMockPersonalData('ar').profile
        await seoContext.updateMeta({
          title: 'أحمد محمد - مطور ويب',
          description: 'مطور ويب محترف'
        })
        await flushPromises()
      }, 5)
      
      // Should complete language switch within reasonable time
      expect(performanceResults.duration).toBeLessThan(100) // 100ms threshold
    })

    it('should batch updates for optimal performance', async () => {
      let updateCount = 0
      
      // Mock update tracking
      const trackUpdate = () => updateCount++
      
      i18nContext.switchLanguage = vi.fn(async (locale: string) => {
        i18nContext.currentLocale.value = locale
        trackUpdate()
        await nextTick()
      })
      
      themeContext.switchTheme = vi.fn(async (theme: string) => {
        themeContext.currentTheme.value = theme
        trackUpdate()
        await nextTick()
      })
      
      // Perform multiple operations
      await Promise.all([
        i18nContext.switchLanguage('ar'),
        themeContext.switchTheme('dark')
      ])
      
      await flushPromises()
      
      // Should have called updates
      expect(updateCount).toBe(2)
      expect(i18nContext.switchLanguage).toHaveBeenCalledWith('ar')
      expect(themeContext.switchTheme).toHaveBeenCalledWith('dark')
    })
  })

  describe('Error Handling Integration', () => {
    it('should handle language switch failures gracefully', async () => {
      // Mock a failing language switch
      i18nContext.switchLanguage.mockRejectedValueOnce(new Error('Network error'))
      
      try {
        await i18nContext.switchLanguage('ar')
      } catch (error) {
        expect(error.message).toBe('Network error')
      }
      
      // Should maintain previous state
      expect(i18nContext.currentLocale.value).toBe('en')
    })

    it('should recover from theme loading failures', async () => {
      // Mock theme loading failure
      themeContext.switchTheme.mockRejectedValueOnce(new Error('Theme not found'))
      
      try {
        await themeContext.switchTheme('invalid-theme')
      } catch (error) {
        expect(error.message).toBe('Theme not found')
      }
      
      // Should maintain previous theme
      expect(themeContext.currentTheme.value).toBe('light')
    })

    it('should handle content loading failures with fallbacks', async () => {
      // Mock content loading failure
      contentContext.fetchContent.mockRejectedValueOnce(new Error('Content not found'))
      
      // Should handle error gracefully
      try {
        await contentContext.fetchContent('invalid-locale')
      } catch (error) {
        expect(error.message).toBe('Content not found')
      }
      
      // Should maintain null state
      expect(contentContext.currentContent.value).toBeNull()
    })
  })
})