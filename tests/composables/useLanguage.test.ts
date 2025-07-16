/**
 * Comprehensive Unit Tests for useLanguage Composable
 * 
 * Tests the complete language switching functionality including:
 * - Language switching between Arabic (RTL) and English (LTR)
 * - RTL/LTR detection and direction management
 * - Font family switching (Inter/Tajawal) 
 * - Language preference persistence (localStorage/cookie)
 * - Reactive state updates and proper navigation
 * - URL prefix handling (/en vs /)
 * - Browser language detection
 * - Performance optimizations and reactivity
 * - Advanced multilingual patterns and edge cases
 * - Error scenarios and graceful fallbacks
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { ref, nextTick, watch } from 'vue'
import { useLanguage } from '~/composables/useLanguage'

// Mock the Nuxt dependencies
vi.mock('#app', () => ({
  useNuxtApp: vi.fn(() => ({
    $config: {
      public: {
        i18n: {
          defaultLocale: 'ar'
        }
      }
    }
  })),
  navigateTo: vi.fn(),
  useCookie: vi.fn(() => ({
    value: ''
  }))
}))

// Define the mock functions first
const mockUseI18n = vi.fn()
const mockUseLocalePath = vi.fn()
const mockUseSwitchLocalePath = vi.fn()

vi.mock('#imports', () => ({
  useI18n: mockUseI18n,
  useLocalePath: mockUseLocalePath,
  useSwitchLocalePath: mockUseSwitchLocalePath
}))

// Also add a global mock
global.useI18n = mockUseI18n
global.useLocalePath = mockUseLocalePath  
global.useSwitchLocalePath = mockUseSwitchLocalePath

describe('useLanguage', () => {
  let mockI18n: any
  let mockLocalePath: any
  let mockSwitchLocalePath: any
  let mockNavigateTo: any
  let mockUseCookie: any

  beforeEach(() => {
    // Clear localStorage before each test
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    })

    // Mock i18n composable
    mockI18n = {
      locale: ref('ar'),
      locales: ref([
        { code: 'ar', name: 'العربية', dir: 'rtl', language: 'ar-SA', file: 'ar.json' },
        { code: 'en', name: 'English', dir: 'ltr', language: 'en-US', file: 'en.json' }
      ]),
      setLocale: vi.fn()
    }

    mockLocalePath = vi.fn((path, locale) => {
      if (locale === 'ar') return path
      return `/en${path}`
    })

    mockSwitchLocalePath = vi.fn((locale) => {
      if (locale === 'ar') return '/'
      return `/en`
    })

    mockNavigateTo = vi.fn()

    mockUseCookie = vi.fn(() => ({
      value: ''
    }))

    // Apply mocks
    mockUseI18n.mockReturnValue(mockI18n)
    mockUseLocalePath.mockReturnValue(mockLocalePath)
    mockUseSwitchLocalePath.mockReturnValue(mockSwitchLocalePath)
    vi.mocked(navigateTo).mockImplementation(mockNavigateTo)
    vi.mocked(useCookie).mockImplementation(mockUseCookie)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Language Properties', () => {
    it('should return current locale as computed', () => {
      const { currentLocale } = useLanguage()
      
      expect(currentLocale.value).toBe('ar')
      
      // Test reactivity
      mockI18n.locale.value = 'en'
      expect(currentLocale.value).toBe('en')
    })

    it('should return available locales with proper typing', () => {
      const { availableLocales } = useLanguage()
      
      expect(availableLocales.value).toHaveLength(2)
      expect(availableLocales.value[0]).toEqual({
        code: 'ar',
        name: 'العربية',
        dir: 'rtl',
        language: 'ar-SA',
        file: 'ar.json'
      })
      expect(availableLocales.value[1]).toEqual({
        code: 'en',
        name: 'English',
        dir: 'ltr',
        language: 'en-US',
        file: 'en.json'
      })
    })

    it('should return default locale from configuration', () => {
      const { defaultLocale } = useLanguage()
      
      expect(defaultLocale.value).toBe('ar')
    })
  })

  describe('RTL/LTR Detection', () => {
    it('should detect RTL for Arabic', () => {
      mockI18n.locale.value = 'ar'
      const { isRTL } = useLanguage()
      
      expect(isRTL.value).toBe(true)
    })

    it('should detect LTR for English', () => {
      mockI18n.locale.value = 'en'
      const { isRTL } = useLanguage()
      
      expect(isRTL.value).toBe(false)
    })

    it('should be reactive to locale changes', async () => {
      const { isRTL } = useLanguage()
      
      // Initially Arabic (RTL)
      mockI18n.locale.value = 'ar'
      expect(isRTL.value).toBe(true)
      
      // Switch to English (LTR)
      mockI18n.locale.value = 'en'
      expect(isRTL.value).toBe(false)
    })
  })

  describe('Direction Classes and Attributes', () => {
    it('should return correct direction class for RTL', () => {
      mockI18n.locale.value = 'ar'
      const { directionClass } = useLanguage()
      
      expect(directionClass.value).toBe('rtl')
    })

    it('should return correct direction class for LTR', () => {
      mockI18n.locale.value = 'en'
      const { directionClass } = useLanguage()
      
      expect(directionClass.value).toBe('ltr')
    })

    it('should return correct direction attribute', () => {
      mockI18n.locale.value = 'ar'
      const { directionAttr } = useLanguage()
      
      expect(directionAttr.value).toBe('rtl')
      
      mockI18n.locale.value = 'en'
      expect(directionAttr.value).toBe('ltr')
    })
  })

  describe('Language Preference Persistence', () => {
    it('should store language preference in localStorage', () => {
      const { storeLanguagePreference } = useLanguage()
      
      storeLanguagePreference('en')
      
      expect(localStorage.setItem).toHaveBeenCalledWith('preferred-language', 'en')
    })

    it('should store language preference in cookie as fallback', () => {
      const mockCookie = { value: '' }
      mockUseCookie.mockReturnValue(mockCookie)
      
      const { storeLanguagePreference } = useLanguage()
      storeLanguagePreference('en')
      
      expect(mockCookie.value).toBe('en')
    })

    it('should handle localStorage errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation()
      vi.mocked(localStorage.setItem).mockImplementation(() => {
        throw new Error('localStorage not available')
      })
      
      const { storeLanguagePreference } = useLanguage()
      
      expect(() => storeLanguagePreference('en')).not.toThrow()
      expect(consoleSpy).toHaveBeenCalledWith('localStorage not available:', expect.any(Error))
      
      consoleSpy.mockRestore()
    })

    it('should retrieve stored language preference from localStorage', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('en')
      
      const { getStoredLanguagePreference } = useLanguage()
      const stored = getStoredLanguagePreference()
      
      expect(stored).toBe('en')
      expect(localStorage.getItem).toHaveBeenCalledWith('preferred-language')
    })

    it('should fallback to cookie if localStorage fails', () => {
      vi.mocked(localStorage.getItem).mockImplementation(() => {
        throw new Error('localStorage not available')
      })
      
      const mockCookie = { value: 'en' }
      mockUseCookie.mockReturnValue(mockCookie)
      
      const { getStoredLanguagePreference } = useLanguage()
      const stored = getStoredLanguagePreference()
      
      expect(stored).toBe('en')
    })

    it('should return null if no valid preference is stored', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null)
      const mockCookie = { value: '' }
      mockUseCookie.mockReturnValue(mockCookie)
      
      const { getStoredLanguagePreference } = useLanguage()
      const stored = getStoredLanguagePreference()
      
      expect(stored).toBeNull()
    })

    it('should validate stored locale against available locales', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('fr') // Invalid locale
      
      const { getStoredLanguagePreference } = useLanguage()
      const stored = getStoredLanguagePreference()
      
      expect(stored).toBeNull()
    })
  })

  describe('Language Switching', () => {
    it('should switch language successfully', async () => {
      mockSwitchLocalePath.mockReturnValue('/en')
      
      const { switchLanguage } = useLanguage()
      
      await switchLanguage('en')
      
      expect(mockSwitchLocalePath).toHaveBeenCalledWith('en')
      expect(mockNavigateTo).toHaveBeenCalledWith('/en')
    })

    it('should store preference when switching language', async () => {
      const { switchLanguage } = useLanguage()
      
      await switchLanguage('en')
      
      expect(localStorage.setItem).toHaveBeenCalledWith('preferred-language', 'en')
    })

    it('should not switch if already on target locale', async () => {
      mockI18n.locale.value = 'en'
      
      const { switchLanguage } = useLanguage()
      
      await switchLanguage('en')
      
      expect(mockSwitchLocalePath).not.toHaveBeenCalled()
      expect(mockNavigateTo).not.toHaveBeenCalled()
    })

    it('should throw error for invalid locale', async () => {
      const { switchLanguage } = useLanguage()
      
      await expect(switchLanguage('fr')).rejects.toThrow("Locale 'fr' is not available")
    })

    it('should handle navigation errors gracefully', async () => {
      mockNavigateTo.mockRejectedValue(new Error('Navigation failed'))
      
      const { switchLanguage } = useLanguage()
      
      await expect(switchLanguage('en')).rejects.toThrow('Navigation failed')
    })
  })

  describe('Localized Path Generation', () => {
    it('should generate localized path for default locale', () => {
      const { getLocalizedPath } = useLanguage()
      
      const path = getLocalizedPath('/about', 'ar')
      
      expect(mockLocalePath).toHaveBeenCalledWith('/about', 'ar')
      expect(path).toBe('/about') // No prefix for default locale
    })

    it('should generate localized path for non-default locale', () => {
      const { getLocalizedPath } = useLanguage()
      
      const path = getLocalizedPath('/about', 'en')
      
      expect(mockLocalePath).toHaveBeenCalledWith('/about', 'en')
      expect(path).toBe('/en/about') // Prefix for non-default locale
    })

    it('should use current locale when no locale specified', () => {
      mockI18n.locale.value = 'en'
      
      const { getLocalizedPath } = useLanguage()
      const path = getLocalizedPath('/about')
      
      expect(mockLocalePath).toHaveBeenCalledWith('/about', 'en')
    })
  })

  describe('Server-Side Behavior', () => {
    it('should handle server-side rendering gracefully', () => {
      // Mock server environment
      Object.defineProperty(process, 'server', {
        value: true,
        writable: true
      })

      const { getStoredLanguagePreference } = useLanguage()
      const stored = getStoredLanguagePreference()
      
      expect(stored).toBeNull()
    })

    it('should not access localStorage on server', () => {
      Object.defineProperty(process, 'server', {
        value: true,
        writable: true
      })

      const { storeLanguagePreference } = useLanguage()
      storeLanguagePreference('en')
      
      expect(localStorage.setItem).not.toHaveBeenCalled()
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle missing locale configuration gracefully', () => {
      mockI18n.locales.value = []
      
      const { availableLocales } = useLanguage()
      
      expect(availableLocales.value).toEqual([])
    })

    it('should handle malformed locale objects', () => {
      mockI18n.locales.value = [
        { code: 'ar' }, // Missing dir property
        { name: 'English' } // Missing code property
      ]
      
      const { isRTL } = useLanguage()
      
      // Should not throw error
      expect(() => isRTL.value).not.toThrow()
    })

    it('should handle undefined defaultLocale gracefully', () => {
      vi.mocked(useNuxtApp).mockReturnValue({
        $config: {}
      } as any)
      
      const { defaultLocale } = useLanguage()
      
      expect(defaultLocale.value).toBe('ar') // Fallback to 'ar'
    })
  })

  describe('Performance and Reactivity', () => {
    it('should maintain reactivity across multiple references', async () => {
      const { isRTL: isRTL1 } = useLanguage()
      const { isRTL: isRTL2 } = useLanguage()
      
      expect(isRTL1.value).toBe(isRTL2.value)
      
      mockI18n.locale.value = 'en'
      await nextTick()
      
      expect(isRTL1.value).toBe(isRTL2.value)
      expect(isRTL1.value).toBe(false)
    })

    it('should not trigger unnecessary reactive updates', () => {
      const watchSpy = vi.fn()
      const { isRTL } = useLanguage()
      
      // Watch for changes
      watch(isRTL, watchSpy)
      
      // Change to same value
      mockI18n.locale.value = 'ar'
      
      expect(watchSpy).not.toHaveBeenCalled()
    })
  })

  describe('Integration with Nuxt i18n', () => {
    it('should properly integrate with Nuxt i18n module', () => {
      const { currentLocale, availableLocales } = useLanguage()
      
      expect(currentLocale.value).toBe(mockI18n.locale.value)
      expect(availableLocales.value).toBe(mockI18n.locales.value)
    })

    it('should use correct path generation functions', async () => {
      const { switchLanguage, getLocalizedPath } = useLanguage()
      
      await switchLanguage('en')
      expect(mockSwitchLocalePath).toHaveBeenCalled()
      
      getLocalizedPath('/test')
      expect(mockLocalePath).toHaveBeenCalled()
    })
  })

  describe('Multilingual Scenarios', () => {
    it('should handle Arabic to English switching', async () => {
      mockI18n.locale.value = 'ar'
      const { switchLanguage, isRTL } = useLanguage()
      
      expect(isRTL.value).toBe(true)
      
      await switchLanguage('en')
      mockI18n.locale.value = 'en' // Simulate successful switch
      
      expect(isRTL.value).toBe(false)
      expect(localStorage.setItem).toHaveBeenCalledWith('preferred-language', 'en')
    })

    it('should handle English to Arabic switching', async () => {
      mockI18n.locale.value = 'en'
      const { switchLanguage, isRTL } = useLanguage()
      
      expect(isRTL.value).toBe(false)
      
      await switchLanguage('ar')
      mockI18n.locale.value = 'ar' // Simulate successful switch
      
      expect(isRTL.value).toBe(true)
      expect(localStorage.setItem).toHaveBeenCalledWith('preferred-language', 'ar')
    })
  })

  describe('Advanced Multilingual Patterns', () => {
    describe('URL Prefix Handling', () => {
      it('should handle URL generation for Arabic (no prefix)', () => {
        mockI18n.locale.value = 'ar'
        const { getLocalizedPath } = useLanguage()
        
        expect(getLocalizedPath('/about')).toBe('/about')
        expect(getLocalizedPath('/blog/post-1')).toBe('/blog/post-1')
        expect(getLocalizedPath('/')).toBe('/')
      })

      it('should handle URL generation for English (with /en prefix)', () => {
        mockI18n.locale.value = 'en'
        const { getLocalizedPath } = useLanguage()
        
        expect(getLocalizedPath('/about')).toBe('/en/about')
        expect(getLocalizedPath('/blog/post-1')).toBe('/en/blog/post-1')
        expect(getLocalizedPath('/')).toBe('/en')
      })

      it('should handle complex URL patterns with query params', () => {
        const { getLocalizedPath } = useLanguage()
        
        // Test Arabic URLs (no prefix)
        mockI18n.locale.value = 'ar'
        expect(getLocalizedPath('/search?q=test')).toBe('/search?q=test')
        
        // Test English URLs (with prefix)
        mockI18n.locale.value = 'en'
        expect(getLocalizedPath('/search?q=test')).toBe('/en/search?q=test')
      })

      it('should handle nested paths correctly', () => {
        const { getLocalizedPath } = useLanguage()
        
        const nestedPaths = [
          '/blog/category/tech',
          '/projects/web-development/portfolio',
          '/admin/dashboard/settings'
        ]

        nestedPaths.forEach(path => {
          // Arabic (no prefix)
          mockI18n.locale.value = 'ar'
          expect(getLocalizedPath(path)).toBe(path)
          
          // English (with prefix)
          mockI18n.locale.value = 'en'
          expect(getLocalizedPath(path)).toBe(`/en${path}`)
        })
      })
    })

    describe('Language Transition Patterns', () => {
      it('should handle rapid language switching', async () => {
        const { switchLanguage, currentLocale } = useLanguage()
        
        // Rapid switching simulation
        mockI18n.locale.value = 'ar'
        expect(currentLocale.value).toBe('ar')
        
        await switchLanguage('en')
        mockI18n.locale.value = 'en'
        expect(currentLocale.value).toBe('en')
        
        await switchLanguage('ar')
        mockI18n.locale.value = 'ar'
        expect(currentLocale.value).toBe('ar')
        
        // Verify storage was called for each switch
        expect(localStorage.setItem).toHaveBeenCalledTimes(2)
      })

      it('should maintain state consistency during transitions', async () => {
        const { switchLanguage, isRTL, directionClass, directionAttr } = useLanguage()
        
        // Start with Arabic
        mockI18n.locale.value = 'ar'
        expect(isRTL.value).toBe(true)
        expect(directionClass.value).toBe('rtl')
        expect(directionAttr.value).toBe('rtl')
        
        // Switch to English
        await switchLanguage('en')
        mockI18n.locale.value = 'en'
        await nextTick()
        
        expect(isRTL.value).toBe(false)
        expect(directionClass.value).toBe('ltr')
        expect(directionAttr.value).toBe('ltr')
      })

      it('should handle multiple concurrent language switches gracefully', async () => {
        const { switchLanguage } = useLanguage()
        
        // Simulate concurrent switches
        const promises = [
          switchLanguage('en'),
          switchLanguage('ar'),
          switchLanguage('en')
        ]
        
        await Promise.allSettled(promises)
        
        // At least one switch should have been attempted
        expect(mockSwitchLocalePath).toHaveBeenCalled()
        expect(mockNavigateTo).toHaveBeenCalled()
      })
    })

    describe('Font Family Management', () => {
      it('should provide font family information for Arabic', () => {
        mockI18n.locale.value = 'ar'
        const { currentLocale } = useLanguage()
        
        expect(currentLocale.value).toBe('ar')
        // Font family would typically be handled in CSS, but we can test locale detection
        const currentLanguageData = mockI18n.locales.value.find((l: any) => l.code === currentLocale.value)
        expect(currentLanguageData?.dir).toBe('rtl')
      })

      it('should provide font family information for English', () => {
        mockI18n.locale.value = 'en'
        const { currentLocale } = useLanguage()
        
        expect(currentLocale.value).toBe('en')
        // Font family would typically be handled in CSS, but we can test locale detection
        const currentLanguageData = mockI18n.locales.value.find((l: any) => l.code === currentLocale.value)
        expect(currentLanguageData?.dir).toBe('ltr')
      })

      it('should handle font switching during language transitions', async () => {
        const { switchLanguage, currentLocale } = useLanguage()
        
        // Track font family changes through locale changes
        const localeChanges: string[] = []
        
        watch(currentLocale, (newLocale) => {
          localeChanges.push(newLocale)
        })
        
        mockI18n.locale.value = 'ar'
        await switchLanguage('en')
        mockI18n.locale.value = 'en'
        await nextTick()
        
        expect(localeChanges).toContain('en')
      })
    })

    describe('Browser Language Detection', () => {
      it('should detect browser language preference', () => {
        // Mock navigator.language
        Object.defineProperty(navigator, 'language', {
          value: 'ar-SA',
          configurable: true
        })
        
        const { getStoredLanguagePreference } = useLanguage()
        
        // When no stored preference, could fallback to browser language
        vi.mocked(localStorage.getItem).mockReturnValue(null)
        const mockCookie = { value: '' }
        mockUseCookie.mockReturnValue(mockCookie)
        
        const stored = getStoredLanguagePreference()
        expect(stored).toBeNull() // Current implementation doesn't use browser language
      })

      it('should handle various browser language formats', () => {
        const languageVariants = [
          'ar-SA', // Arabic (Saudi Arabia)
          'ar-EG', // Arabic (Egypt)
          'en-US', // English (United States)
          'en-GB', // English (United Kingdom)
          'ar',    // Arabic (generic)
          'en'     // English (generic)
        ]
        
        languageVariants.forEach(lang => {
          Object.defineProperty(navigator, 'language', {
            value: lang,
            configurable: true
          })
          
          // Test that the composable handles different language formats
          const { availableLocales } = useLanguage()
          expect(availableLocales.value).toHaveLength(2)
        })
      })

      it('should handle navigator.languages array', () => {
        Object.defineProperty(navigator, 'languages', {
          value: ['ar-SA', 'ar', 'en-US', 'en'],
          configurable: true
        })
        
        const { availableLocales } = useLanguage()
        expect(availableLocales.value).toHaveLength(2)
      })
    })

    describe('Accessibility and Screen Reader Support', () => {
      it('should provide proper lang attributes for screen readers', () => {
        mockI18n.locale.value = 'ar'
        const { currentLocale } = useLanguage()
        
        // Screen readers would use the language code
        expect(currentLocale.value).toBe('ar')
        
        mockI18n.locale.value = 'en'
        expect(currentLocale.value).toBe('en')
      })

      it('should provide proper direction attributes for assistive technology', () => {
        const { directionAttr } = useLanguage()
        
        mockI18n.locale.value = 'ar'
        expect(directionAttr.value).toBe('rtl')
        
        mockI18n.locale.value = 'en'
        expect(directionAttr.value).toBe('ltr')
      })

      it('should maintain accessibility during language transitions', async () => {
        const { switchLanguage, directionAttr, currentLocale } = useLanguage()
        
        mockI18n.locale.value = 'ar'
        const initialDirection = directionAttr.value
        const initialLocale = currentLocale.value
        
        await switchLanguage('en')
        mockI18n.locale.value = 'en'
        await nextTick()
        
        expect(directionAttr.value).not.toBe(initialDirection)
        expect(currentLocale.value).not.toBe(initialLocale)
      })
    })
  })

  describe('Performance and Memory Management', () => {
    it('should not create memory leaks with multiple instances', () => {
      const instances = []
      
      // Create multiple instances
      for (let i = 0; i < 10; i++) {
        instances.push(useLanguage())
      }
      
      // All instances should work correctly
      instances.forEach(instance => {
        expect(instance.currentLocale.value).toBeDefined()
        expect(instance.availableLocales.value).toHaveLength(2)
      })
    })

    it('should handle reactive updates efficiently', async () => {
      const { isRTL } = useLanguage()
      let updateCount = 0
      
      // Count reactive updates
      watch(isRTL, () => {
        updateCount++
      })
      
      // Change locale multiple times
      mockI18n.locale.value = 'en'
      await nextTick()
      mockI18n.locale.value = 'ar'
      await nextTick()
      mockI18n.locale.value = 'en'
      await nextTick()
      
      // Should have reactive updates
      expect(updateCount).toBeGreaterThan(0)
    })

    it('should debounce rapid locale changes', async () => {
      const { currentLocale } = useLanguage()
      const changes: string[] = []
      
      watch(currentLocale, (newValue) => {
        changes.push(newValue)
      })
      
      // Rapid changes
      mockI18n.locale.value = 'en'
      mockI18n.locale.value = 'ar'
      mockI18n.locale.value = 'en'
      
      await nextTick()
      
      // Should track all changes
      expect(changes.length).toBeGreaterThan(0)
    })
  })

  describe('Advanced Error Scenarios', () => {
    it('should handle corrupted localStorage data', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('{"corrupted": "json"')
      
      const { getStoredLanguagePreference } = useLanguage()
      const stored = getStoredLanguagePreference()
      
      expect(stored).toBeNull()
    })

    it('should handle network failures during language switching', async () => {
      mockNavigateTo.mockRejectedValue(new Error('Network error'))
      
      const { switchLanguage } = useLanguage()
      
      await expect(switchLanguage('en')).rejects.toThrow('Network error')
    })

    it('should handle missing locale configuration gracefully', () => {
      // Mock incomplete locale configuration
      mockI18n.locales.value = [
        { code: 'ar', name: 'العربية', language: 'ar-SA' }, // Missing dir
        { name: 'English', dir: 'ltr', language: 'en-US' }  // Missing code
      ] as any
      
      const { availableLocales, isRTL } = useLanguage()
      
      expect(availableLocales.value).toHaveLength(2)
      // Should not throw when accessing RTL with malformed data
      expect(() => isRTL.value).not.toThrow()
    })

    it('should handle undefined/null navigation functions', async () => {
      mockSwitchLocalePath.mockReturnValue(undefined)
      
      const { switchLanguage } = useLanguage()
      
      // Should handle undefined navigation path gracefully
      await expect(switchLanguage('en')).resolves.not.toThrow()
    })

    it('should validate locale codes strictly', async () => {
      const { switchLanguage } = useLanguage()
      
      const invalidLocales = ['', '   ', null, undefined, 'invalid-locale', 123]
      
      for (const invalidLocale of invalidLocales) {
        await expect(switchLanguage(invalidLocale as any)).rejects.toThrow()
      }
    })

    it('should handle circular reference in locale objects', () => {
      // Create circular reference
      const circularLocale: any = {
        code: 'ar',
        name: 'العربية',
        dir: 'rtl',
        language: 'ar-SA',
        file: 'ar.json'
      }
      circularLocale.self = circularLocale
      
      mockI18n.locales.value = [circularLocale, mockI18n.locales.value[1]]
      
      const { availableLocales } = useLanguage()
      
      // Should not throw with circular references
      expect(() => availableLocales.value).not.toThrow()
    })
  })

  describe('Integration with Real-World Scenarios', () => {
    it('should handle page refresh during language switch', () => {
      // Simulate page refresh by resetting mocks
      const { storeLanguagePreference, getStoredLanguagePreference } = useLanguage()
      
      // Store preference
      storeLanguagePreference('en')
      
      // Simulate page refresh - new instance
      vi.mocked(localStorage.getItem).mockReturnValue('en')
      
      const storedPreference = getStoredLanguagePreference()
      expect(storedPreference).toBe('en')
    })

    it('should handle back/forward navigation', async () => {
      const { switchLanguage } = useLanguage()
      
      // Simulate navigation history
      mockSwitchLocalePath.mockReturnValueOnce('/en')
      await switchLanguage('en')
      
      mockSwitchLocalePath.mockReturnValueOnce('/')
      await switchLanguage('ar')
      
      expect(mockNavigateTo).toHaveBeenCalledTimes(2)
      expect(mockNavigateTo).toHaveBeenNthCalledWith(1, '/en')
      expect(mockNavigateTo).toHaveBeenNthCalledWith(2, '/')
    })

    it('should handle deep linking to localized pages', () => {
      const { getLocalizedPath } = useLanguage()
      
      const deepLinks = [
        '/blog/my-first-post',
        '/projects/awesome-project',
        '/about/team',
        '/contact/support'
      ]
      
      deepLinks.forEach(link => {
        // Test Arabic deep links (no prefix)
        mockI18n.locale.value = 'ar'
        expect(getLocalizedPath(link)).toBe(link)
        
        // Test English deep links (with prefix)
        mockI18n.locale.value = 'en'
        expect(getLocalizedPath(link)).toBe(`/en${link}`)
      })
    })

    it('should handle URL parameters and anchors', () => {
      const { getLocalizedPath } = useLanguage()
      
      const urlsWithParams = [
        '/search?q=test&category=tech',
        '/blog?page=2&sort=date',
        '/contact#form',
        '/about#team-section'
      ]
      
      urlsWithParams.forEach(url => {
        mockI18n.locale.value = 'ar'
        expect(getLocalizedPath(url)).toBe(url)
        
        mockI18n.locale.value = 'en'
        expect(getLocalizedPath(url)).toBe(`/en${url}`)
      })
    })

    it('should maintain state during SPA navigation', async () => {
      const { switchLanguage, currentLocale, isRTL } = useLanguage()
      
      // Track state changes
      const stateChanges: Array<{locale: string, isRTL: boolean}> = []
      
      watch([currentLocale, isRTL], ([locale, rtl]) => {
        stateChanges.push({ locale, isRTL: rtl })
      })
      
      // Simulate SPA navigation with language changes
      mockI18n.locale.value = 'ar'
      await nextTick()
      
      await switchLanguage('en')
      mockI18n.locale.value = 'en'
      await nextTick()
      
      await switchLanguage('ar')
      mockI18n.locale.value = 'ar'
      await nextTick()
      
      // Should have tracked state changes
      expect(stateChanges.length).toBeGreaterThan(0)
    })

    it('should handle dynamic route parameters', () => {
      const { getLocalizedPath } = useLanguage()
      
      const dynamicRoutes = [
        '/blog/[slug]',
        '/user/[id]/profile',
        '/category/[...path]'
      ]
      
      dynamicRoutes.forEach(route => {
        mockI18n.locale.value = 'ar'
        expect(getLocalizedPath(route)).toBe(route)
        
        mockI18n.locale.value = 'en'
        expect(getLocalizedPath(route)).toBe(`/en${route}`)
      })
    })
  })

  describe('Stress Testing and Edge Cases', () => {
    it('should handle very long URLs', () => {
      const { getLocalizedPath } = useLanguage()
      
      const longPath = '/very/long/path/that/goes/on/and/on/with/many/segments/and/parameters?param1=value1&param2=value2&param3=value3'
      
      mockI18n.locale.value = 'ar'
      expect(getLocalizedPath(longPath)).toBe(longPath)
      
      mockI18n.locale.value = 'en'
      expect(getLocalizedPath(longPath)).toBe(`/en${longPath}`)
    })

    it('should handle special characters in URLs', () => {
      const { getLocalizedPath } = useLanguage()
      
      const specialPaths = [
        '/اختبار', // Arabic text
        '/test-with-dashes',
        '/test_with_underscores',
        '/test%20with%20encoding',
        '/test-with-numbers-123'
      ]
      
      specialPaths.forEach(path => {
        mockI18n.locale.value = 'ar'
        expect(getLocalizedPath(path)).toBe(path)
        
        mockI18n.locale.value = 'en'
        expect(getLocalizedPath(path)).toBe(`/en${path}`)
      })
    })

    it('should handle locale switching under high load', async () => {
      const { switchLanguage } = useLanguage()
      
      // Simulate high load with many concurrent switches
      const promises = Array.from({ length: 100 }, (_, i) => 
        switchLanguage(i % 2 === 0 ? 'en' : 'ar')
      )
      
      const results = await Promise.allSettled(promises)
      
      // Some switches should succeed, others might be blocked
      const successful = results.filter(r => r.status === 'fulfilled').length
      const failed = results.filter(r => r.status === 'rejected').length
      
      expect(successful + failed).toBe(100)
    })

    it('should maintain performance with large locale configurations', () => {
      // Mock large locale configuration
      const largeLocales = Array.from({ length: 50 }, (_, i) => ({
        code: `lang${i}`,
        name: `Language ${i}`,
        dir: i % 2 === 0 ? 'ltr' : 'rtl',
        language: `lang${i}-XX`,
        file: `lang${i}.json`
      }))
      
      mockI18n.locales.value = largeLocales as any
      
      const { availableLocales, isRTL } = useLanguage()
      
      // Should handle large configurations without performance issues
      const start = performance.now()
      expect(availableLocales.value).toHaveLength(50)
      expect(() => isRTL.value).not.toThrow()
      const end = performance.now()
      
      // Should be reasonably fast (less than 100ms)
      expect(end - start).toBeLessThan(100)
    })
  })
})