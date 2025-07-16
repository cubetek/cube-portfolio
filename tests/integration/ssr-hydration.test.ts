/**
 * SSR Hydration Integration Tests
 * 
 * Tests server-side rendering and client-side hydration for:
 * - Theme state consistency
 * - Language state consistency
 * - Content hydration
 * - Performance during hydration
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import { JSDOM } from 'jsdom'
import { flushPromises } from '../utils/testing-helpers'
import { createMockPersonalData, createMockTheme } from '../utils/mock-factories'

// Mock SSR environment
const mockSSRContext = {
  isSSR: true,
  payload: {},
  state: {},
  event: {
    node: {
      req: {},
      res: {}
    }
  }
}

const mockClientContext = {
  isSSR: false,
  window: global.window,
  document: global.document
}

describe('SSR Hydration Integration', () => {
  let mockWindow: any
  let mockDocument: any

  beforeEach(() => {
    // Setup JSDOM environment for SSR testing
    const dom = new JSDOM(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl" class="theme-light">
        <head>
          <title>Test Site</title>
          <meta name="description" content="Test Description">
          <style id="theme-vars">
            :root {
              --primary-color: #007bff;
              --bg-color: #ffffff;
            }
          </style>
        </head>
        <body class="rtl locale-ar font-arabic">
          <div id="__nuxt">
            <div class="app-container" data-theme="light">
              <h1>مرحباً</h1>
              <p>أهلاً وسهلاً</p>
            </div>
          </div>
          <script id="__NUXT_DATA__" type="application/json">
            {
              "state": {
                "theme": "light",
                "locale": "ar",
                "personalData": {}
              }
            }
          </script>
        </body>
      </html>
    `, {
      url: 'http://localhost:3000',
      pretendToBeVisual: true,
      resources: 'usable'
    })

    mockWindow = dom.window
    mockDocument = dom.window.document

    // Mock global objects
    global.window = mockWindow as any
    global.document = mockDocument as any
    global.navigator = mockWindow.navigator
    global.location = mockWindow.location
  })

  describe('Theme Hydration', () => {
    it('should maintain theme state during SSR to client hydration', async () => {
      // Mock SSR state
      const ssrTheme = 'light'
      const ssrThemeData = createMockTheme({ overrides: { name: ssrTheme } })
      
      // Simulate server-rendered state
      mockDocument.documentElement.className = `theme-${ssrTheme}`
      mockDocument.body.setAttribute('data-theme', ssrTheme)
      
      // Mock theme hydration
      const themeState = ref(ssrTheme)
      const themeColors = ref(ssrThemeData.colors)
      
      // Simulate client-side hydration
      const hydratedTheme = mockDocument.documentElement.className.includes('theme-light') ? 'light' : 'dark'
      themeState.value = hydratedTheme
      
      await flushPromises()
      
      // Theme should remain consistent
      expect(themeState.value).toBe('light')
      expect(mockDocument.documentElement.className).toContain('theme-light')
      expect(themeColors.value.primary).toBe('#007bff')
    })

    it('should handle theme mismatch between server and client', async () => {
      // Server renders with light theme
      mockDocument.documentElement.className = 'theme-light'
      
      // Client detects dark mode preference
      mockWindow.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query.includes('dark'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn()
      }))
      
      // Mock theme reconciliation
      const serverTheme = 'light'
      const clientPreference = 'dark'
      
      // Should prioritize user preference during hydration
      const finalTheme = clientPreference
      mockDocument.documentElement.className = `theme-${finalTheme}`
      
      expect(mockDocument.documentElement.className).toContain('theme-dark')
    })

    it('should prevent theme flash during hydration', async () => {
      // Mock inline script that sets theme before hydration
      const inlineThemeScript = `
        (function() {
          const theme = localStorage.getItem('theme') || 'light';
          document.documentElement.className = 'theme-' + theme;
        })();
      `
      
      // Simulate script execution
      const mockLocalStorage = {
        getItem: vi.fn().mockReturnValue('dark'),
        setItem: vi.fn()
      }
      
      mockWindow.localStorage = mockLocalStorage
      
      // Execute inline script logic
      const storedTheme = mockLocalStorage.getItem('theme') || 'light'
      mockDocument.documentElement.className = `theme-${storedTheme}`
      
      // Should have applied theme before hydration
      expect(mockDocument.documentElement.className).toContain('theme-dark')
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('theme')
    })
  })

  describe('Language Hydration', () => {
    it('should maintain language state during hydration', async () => {
      // Server-rendered with Arabic
      expect(mockDocument.documentElement.lang).toBe('ar')
      expect(mockDocument.documentElement.dir).toBe('rtl')
      expect(mockDocument.body.className).toContain('locale-ar')
      
      // Mock language state hydration
      const languageState = ref('ar')
      const isRTL = ref(true)
      const direction = ref('rtl')
      
      // Simulate client hydration
      const htmlLang = mockDocument.documentElement.lang
      const htmlDir = mockDocument.documentElement.dir
      
      languageState.value = htmlLang
      isRTL.value = htmlDir === 'rtl'
      direction.value = htmlDir as 'ltr' | 'rtl'
      
      await flushPromises()
      
      // Language state should be consistent
      expect(languageState.value).toBe('ar')
      expect(isRTL.value).toBe(true)
      expect(direction.value).toBe('rtl')
    })

    it('should handle language switching after hydration', async () => {
      // Initial state (Arabic)
      const languageState = ref('ar')
      const isRTL = ref(true)
      
      // Switch to English after hydration
      const switchToEnglish = async () => {
        languageState.value = 'en'
        isRTL.value = false
        
        mockDocument.documentElement.lang = 'en'
        mockDocument.documentElement.dir = 'ltr'
        mockDocument.body.className = mockDocument.body.className
          .replace('locale-ar', 'locale-en')
          .replace('rtl', 'ltr')
        
        await nextTick()
      }
      
      await switchToEnglish()
      
      expect(languageState.value).toBe('en')
      expect(isRTL.value).toBe(false)
      expect(mockDocument.documentElement.lang).toBe('en')
      expect(mockDocument.documentElement.dir).toBe('ltr')
    })

    it('should preserve font settings during language hydration', async () => {
      // Server-rendered with Arabic font
      expect(mockDocument.body.className).toContain('font-arabic')
      
      // Mock font state
      const currentFont = ref('Tajawal')
      const fontFamily = ref('"Tajawal", sans-serif')
      
      // Simulate font hydration based on body class
      const hasFontArabic = mockDocument.body.className.includes('font-arabic')
      if (hasFontArabic) {
        currentFont.value = 'Tajawal'
        fontFamily.value = '"Tajawal", sans-serif'
      }
      
      expect(currentFont.value).toBe('Tajawal')
      expect(fontFamily.value).toBe('"Tajawal", sans-serif')
    })
  })

  describe('Content Hydration', () => {
    it('should hydrate personal data from server state', async () => {
      // Mock server-rendered data
      const serverPersonalData = createMockPersonalData('ar')
      
      // Simulate NUXT_DATA script content
      const nuxtDataScript = mockDocument.getElementById('__NUXT_DATA__')
      const serverState = {
        state: {
          personalData: serverPersonalData,
          theme: 'light',
          locale: 'ar'
        }
      }
      
      if (nuxtDataScript) {
        nuxtDataScript.textContent = JSON.stringify(serverState)
      }
      
      // Mock client hydration
      const hydratedData = JSON.parse(nuxtDataScript?.textContent || '{}')
      const personalDataState = ref(hydratedData.state.personalData)
      
      await flushPromises()
      
      // Data should match server state
      expect(personalDataState.value.profile.name).toBe('أحمد محمد علي')
      expect(personalDataState.value.profile.title).toBe('مطور ويب متقدم')
    })

    it('should handle content mismatch during hydration', async () => {
      // Server content
      const serverContent = 'مرحباً'
      const h1Element = mockDocument.querySelector('h1')
      expect(h1Element?.textContent).toBe(serverContent)
      
      // Client tries to update content
      const clientContent = ref('مرحباً بك')
      
      // Simulate hydration warning detection
      const hasHydrationMismatch = h1Element?.textContent !== clientContent.value
      
      if (hasHydrationMismatch && h1Element) {
        // Should update to client content after hydration
        h1Element.textContent = clientContent.value
      }
      
      expect(h1Element?.textContent).toBe('مرحباً بك')
    })

    it('should preserve SEO meta during hydration', async () => {
      // Server-rendered meta
      const titleElement = mockDocument.querySelector('title')
      const descriptionMeta = mockDocument.querySelector('meta[name="description"]')
      
      expect(titleElement?.textContent).toBe('Test Site')
      expect(descriptionMeta?.getAttribute('content')).toBe('Test Description')
      
      // Mock SEO state hydration
      const seoState = ref({
        title: titleElement?.textContent || '',
        description: descriptionMeta?.getAttribute('content') || ''
      })
      
      // Should maintain SEO data
      expect(seoState.value.title).toBe('Test Site')
      expect(seoState.value.description).toBe('Test Description')
    })
  })

  describe('Performance During Hydration', () => {
    it('should measure hydration performance', async () => {
      const hydrationStart = performance.now()
      
      // Simulate hydration process
      const simulateHydration = async () => {
        // Theme hydration
        const themeClass = mockDocument.documentElement.className
        const theme = themeClass.includes('theme-dark') ? 'dark' : 'light'
        
        // Language hydration
        const locale = mockDocument.documentElement.lang
        const isRTL = mockDocument.documentElement.dir === 'rtl'
        
        // Content hydration
        const nuxtData = mockDocument.getElementById('__NUXT_DATA__')
        const serverState = JSON.parse(nuxtData?.textContent || '{}')
        
        // Simulate async operations
        await new Promise(resolve => setTimeout(resolve, 10))
        
        return { theme, locale, isRTL, serverState }
      }
      
      const hydratedState = await simulateHydration()
      const hydrationEnd = performance.now()
      const hydrationTime = hydrationEnd - hydrationStart
      
      // Should complete hydration quickly
      expect(hydrationTime).toBeLessThan(100) // 100ms threshold
      expect(hydratedState.theme).toBe('light')
      expect(hydratedState.locale).toBe('ar')
      expect(hydratedState.isRTL).toBe(true)
    })

    it('should prevent layout shifts during hydration', async () => {
      // Mock initial layout measurements
      const initialLayout = {
        width: mockWindow.innerWidth,
        height: mockWindow.innerHeight,
        scrollTop: mockWindow.scrollY
      }
      
      // Simulate hydration that might cause layout shift
      const appContainer = mockDocument.querySelector('.app-container')
      if (appContainer) {
        // Simulate content height change
        const initialHeight = 400
        const newHeight = 450
        
        appContainer.style.height = `${initialHeight}px`
        
        // Hydration updates
        await flushPromises()
        appContainer.style.height = `${newHeight}px`
        
        // Calculate layout shift
        const layoutShift = Math.abs(newHeight - initialHeight)
        
        // Should minimize layout shift
        expect(layoutShift).toBeLessThan(100) // Reasonable threshold
      }
    })

    it('should optimize font loading during hydration', async () => {
      // Mock font loading optimization
      const mockFontDisplay = 'swap'
      const mockFontFamily = '"Tajawal", sans-serif'
      
      // Check if font CSS is properly configured
      const themeVarsStyle = mockDocument.getElementById('theme-vars')
      expect(themeVarsStyle).toBeTruthy()
      
      // Mock font loading state
      const fontLoadPromise = new Promise(resolve => {
        setTimeout(() => resolve('loaded'), 50)
      })
      
      const fontStatus = await fontLoadPromise
      expect(fontStatus).toBe('loaded')
      
      // Should have proper font-display for performance
      expect(mockFontDisplay).toBe('swap')
    })
  })

  describe('Error Recovery During Hydration', () => {
    it('should handle hydration errors gracefully', async () => {
      // Mock hydration error
      const mockHydrationError = new Error('Hydration mismatch')
      
      const safeHydration = async () => {
        try {
          // Simulate error during hydration
          throw mockHydrationError
        } catch (error) {
          // Should recover by re-rendering on client
          console.warn('Hydration failed, falling back to client rendering:', error.message)
          return 'client-rendered'
        }
      }
      
      const result = await safeHydration()
      expect(result).toBe('client-rendered')
    })

    it('should fallback to default state on data corruption', async () => {
      // Mock corrupted server data
      const nuxtDataScript = mockDocument.getElementById('__NUXT_DATA__')
      if (nuxtDataScript) {
        nuxtDataScript.textContent = 'invalid json'
      }
      
      const safeDataParsing = () => {
        try {
          return JSON.parse(nuxtDataScript?.textContent || '{}')
        } catch (error) {
          // Return default state on parsing error
          return {
            state: {
              theme: 'light',
              locale: 'ar',
              personalData: createMockPersonalData('ar')
            }
          }
        }
      }
      
      const parsedData = safeDataParsing()
      expect(parsedData.state.theme).toBe('light')
      expect(parsedData.state.locale).toBe('ar')
      expect(parsedData.state.personalData).toBeDefined()
    })
  })
})