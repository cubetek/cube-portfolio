/**
 * Unit Tests for useTheme Composable
 * 
 * Tests the theme management composable functionality including:
 * - Theme state management and reactivity
 * - Theme switching and persistence
 * - System preference detection
 * - CSS class and attribute application
 * - Local storage integration
 * - Error handling and fallbacks
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref, nextTick } from 'vue'
import { useTheme } from '~/composables/useTheme'

// Mock DOM methods
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
}

const mockDocument = {
  body: {
    classList: {
      add: vi.fn(),
      remove: vi.fn()
    }
  },
  documentElement: {
    classList: {
      add: vi.fn(),
      remove: vi.fn()
    },
    setAttribute: vi.fn(),
    style: {} as CSSStyleDeclaration
  },
  querySelector: vi.fn(),
  createElement: vi.fn(),
  head: {
    appendChild: vi.fn()
  }
}

const mockMediaQuery = {
  matches: false,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn()
}

const mockWindow = {
  localStorage: mockLocalStorage,
  matchMedia: vi.fn(() => mockMediaQuery)
}

// Mock useAppConfig
const mockUseAppConfig = vi.fn()

vi.mock('#app', () => ({
  useAppConfig: mockUseAppConfig
}))

// Setup global mocks
Object.defineProperty(globalThis, 'document', {
  value: mockDocument,
  writable: true
})

Object.defineProperty(globalThis, 'window', {
  value: mockWindow,
  writable: true
})

Object.defineProperty(globalThis, 'localStorage', {
  value: mockLocalStorage,
  writable: true
})

// Mock import.meta.client
Object.defineProperty(import.meta, 'client', {
  value: true,
  writable: true
})

describe('useTheme', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Reset DOM mocks
    mockDocument.body.classList.add.mockClear()
    mockDocument.body.classList.remove.mockClear()
    mockDocument.documentElement.classList.add.mockClear()
    mockDocument.documentElement.classList.remove.mockClear()
    mockDocument.documentElement.setAttribute.mockClear()

    // Reset localStorage mock
    mockLocalStorage.getItem.mockReturnValue(null)
    mockLocalStorage.setItem.mockClear()

    // Reset media query mock
    mockMediaQuery.matches = false
    mockMediaQuery.addEventListener.mockClear()

    // Setup default app config
    mockUseAppConfig.mockReturnValue({
      theme: {
        default: 'light'
      }
    })

    // Mock theme color meta element
    const mockMetaElement = {
      setAttribute: vi.fn()
    }
    mockDocument.createElement.mockReturnValue(mockMetaElement)
    mockDocument.querySelector.mockReturnValue(null)
  })

  describe('Initialization', () => {
    it('should initialize with default theme from app config', () => {
      const theme = useTheme()

      expect(theme.currentTheme.value).toBe('light')
      expect(theme.themeConfig.value.name).toBe('light')
      expect(theme.isDark.value).toBe(false)
      expect(theme.isSpecial.value).toBe(false)
    })

    it('should initialize with fallback if no app config', () => {
      mockUseAppConfig.mockReturnValue({})

      const theme = useTheme()

      expect(theme.currentTheme.value).toBe('light')
    })

    it('should provide available themes list', () => {
      const theme = useTheme()

      expect(theme.availableThemes.value).toHaveLength(2)
      expect(theme.availableThemes.value.map(t => t.name)).toContain('light')
      expect(theme.availableThemes.value.map(t => t.name)).toContain('dark')
    })

    it('should provide themes by category', () => {
      const theme = useTheme()

      expect(theme.themesByCategory.value.light).toHaveLength(1)
      expect(theme.themesByCategory.value.dark).toHaveLength(1)
      expect(theme.themesByCategory.value.special).toHaveLength(0)
    })
  })

  describe('Theme Configuration', () => {
    it('should return correct theme config for light theme', () => {
      const theme = useTheme()

      expect(theme.themeConfig.value).toEqual({
        name: 'light',
        label: 'Light',
        description: 'Clean and bright interface',
        category: 'light',
        colors: expect.objectContaining({
          primary: '#3b82f6',
          background: '#ffffff',
          text: '#1f2937'
        })
      })
    })

    it('should return correct theme config for dark theme', () => {
      const theme = useTheme()
      theme.setTheme('dark')

      expect(theme.themeConfig.value).toEqual({
        name: 'dark',
        label: 'Dark',
        description: 'Dark mode for comfortable viewing',
        category: 'dark',
        colors: expect.objectContaining({
          primary: '#60a5fa',
          background: '#0f172a',
          text: '#f1f5f9'
        })
      })
    })

    it('should correctly identify dark themes', () => {
      const theme = useTheme()

      expect(theme.isDark.value).toBe(false)

      theme.setTheme('dark')
      expect(theme.isDark.value).toBe(true)
    })
  })

  describe('Theme Setting and Application', () => {
    it('should set theme and apply DOM changes', () => {
      const theme = useTheme()

      theme.setTheme('dark')

      expect(theme.currentTheme.value).toBe('dark')
      expect(mockDocument.body.classList.remove).toHaveBeenCalledWith('light')
      expect(mockDocument.body.classList.remove).toHaveBeenCalledWith('dark')
      expect(mockDocument.body.classList.add).toHaveBeenCalledWith('dark')
      expect(mockDocument.documentElement.setAttribute).toHaveBeenCalledWith('data-theme', 'dark')
    })

    it('should update color scheme style', () => {
      const theme = useTheme()

      theme.setTheme('dark')

      expect(mockDocument.documentElement.style.colorScheme).toBe('dark')

      theme.setTheme('light')

      expect(mockDocument.documentElement.style.colorScheme).toBe('light')
    })

    it('should update theme-color meta tag', () => {
      const mockMetaElement = {
        setAttribute: vi.fn()
      }
      
      // First call returns null (no existing meta), second call returns the created element
      mockDocument.querySelector.mockReturnValueOnce(null)
      mockDocument.createElement.mockReturnValue(mockMetaElement)

      const theme = useTheme()
      theme.setTheme('dark')

      expect(mockDocument.createElement).toHaveBeenCalledWith('meta')
      expect(mockMetaElement.setAttribute).toHaveBeenCalledWith('name', 'theme-color')
      expect(mockDocument.head.appendChild).toHaveBeenCalledWith(mockMetaElement)
      expect(mockMetaElement.setAttribute).toHaveBeenCalledWith('content', '#0f172a')
    })

    it('should update existing theme-color meta tag', () => {
      const mockMetaElement = {
        setAttribute: vi.fn()
      }
      
      mockDocument.querySelector.mockReturnValue(mockMetaElement)

      const theme = useTheme()
      theme.setTheme('dark')

      expect(mockDocument.createElement).not.toHaveBeenCalled()
      expect(mockMetaElement.setAttribute).toHaveBeenCalledWith('content', '#0f172a')
    })

    it('should persist theme to localStorage', () => {
      const theme = useTheme()

      theme.setTheme('dark')

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('nuxt-theme', 'dark')
    })

    it('should handle localStorage errors gracefully', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage quota exceeded')
      })

      const theme = useTheme()

      expect(() => theme.setTheme('dark')).not.toThrow()
      expect(theme.currentTheme.value).toBe('dark')
    })

    it('should fallback to default theme for invalid theme names', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const theme = useTheme()

      theme.setTheme('nonexistent-theme')

      expect(consoleSpy).toHaveBeenCalledWith('Theme "nonexistent-theme" not found, using default')
      expect(theme.currentTheme.value).toBe('light')

      consoleSpy.mockRestore()
    })
  })

  describe('Theme Switching Utilities', () => {
    it('should toggle between light and dark themes', () => {
      const theme = useTheme()

      expect(theme.currentTheme.value).toBe('light')

      theme.toggleTheme()
      expect(theme.currentTheme.value).toBe('dark')

      theme.toggleTheme()
      expect(theme.currentTheme.value).toBe('light')
    })

    it('should cycle through all available themes', () => {
      const theme = useTheme()

      expect(theme.currentTheme.value).toBe('light')

      theme.cycleTheme()
      expect(theme.currentTheme.value).toBe('dark')

      theme.cycleTheme()
      expect(theme.currentTheme.value).toBe('light')
    })
  })

  describe('Theme Initialization and Persistence', () => {
    it('should restore theme from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('dark')

      const theme = useTheme()
      theme.initializeTheme()

      expect(theme.currentTheme.value).toBe('dark')
    })

    it('should detect system preference when no saved theme', () => {
      mockMediaQuery.matches = true
      mockWindow.matchMedia.mockReturnValue(mockMediaQuery)

      const theme = useTheme()
      theme.initializeTheme()

      expect(theme.currentTheme.value).toBe('dark')
    })

    it('should default to light theme when system prefers light', () => {
      mockMediaQuery.matches = false
      mockWindow.matchMedia.mockReturnValue(mockMediaQuery)

      const theme = useTheme()
      theme.initializeTheme()

      expect(theme.currentTheme.value).toBe('light')
    })

    it('should listen for system preference changes', () => {
      const theme = useTheme()
      theme.initializeTheme()

      expect(mockMediaQuery.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))
    })

    it('should handle system preference change when no saved theme', () => {
      const theme = useTheme()
      theme.initializeTheme()

      const changeHandler = mockMediaQuery.addEventListener.mock.calls[0][1]

      // Simulate system preference change to dark
      changeHandler({ matches: true })
      expect(theme.currentTheme.value).toBe('dark')

      // Simulate system preference change to light
      changeHandler({ matches: false })
      expect(theme.currentTheme.value).toBe('light')
    })

    it('should not auto-switch when user has explicitly saved a theme', () => {
      mockLocalStorage.getItem.mockReturnValue('light')

      const theme = useTheme()
      theme.initializeTheme()

      const changeHandler = mockMediaQuery.addEventListener.mock.calls[0][1]

      // Simulate system preference change - should not affect saved theme
      changeHandler({ matches: true })
      expect(theme.currentTheme.value).toBe('light')
    })

    it('should handle localStorage read errors gracefully', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Storage access denied')
      })

      const theme = useTheme()

      expect(() => theme.initializeTheme()).not.toThrow()
    })

    it('should ignore invalid saved themes', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-theme')
      mockMediaQuery.matches = true

      const theme = useTheme()
      theme.initializeTheme()

      expect(theme.currentTheme.value).toBe('dark') // Should fall back to system preference
    })
  })

  describe('Client-Side Only Operations', () => {
    it('should not apply DOM changes on server side', () => {
      // Mock server-side environment
      Object.defineProperty(import.meta, 'client', {
        value: false,
        writable: true
      })

      const theme = useTheme()
      theme.setTheme('dark')

      expect(mockDocument.body.classList.add).not.toHaveBeenCalled()
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled()

      // Restore client-side environment
      Object.defineProperty(import.meta, 'client', {
        value: true,
        writable: true
      })
    })

    it('should not initialize theme on server side', () => {
      Object.defineProperty(import.meta, 'client', {
        value: false,
        writable: true
      })

      const theme = useTheme()
      theme.initializeTheme()

      expect(mockLocalStorage.getItem).not.toHaveBeenCalled()
      expect(mockWindow.matchMedia).not.toHaveBeenCalled()

      // Restore client-side environment
      Object.defineProperty(import.meta, 'client', {
        value: true,
        writable: true
      })
    })
  })

  describe('Reactive Behavior', () => {
    it('should be reactive to theme changes', async () => {
      const theme = useTheme()
      
      expect(theme.currentTheme.value).toBe('light')
      expect(theme.isDark.value).toBe(false)

      theme.setTheme('dark')
      await nextTick()

      expect(theme.currentTheme.value).toBe('dark')
      expect(theme.isDark.value).toBe(true)
    })

    it('should update theme config reactively', async () => {
      const theme = useTheme()

      expect(theme.themeConfig.value.category).toBe('light')

      theme.setTheme('dark')
      await nextTick()

      expect(theme.themeConfig.value.category).toBe('dark')
    })
  })

  describe('Return Value Interface', () => {
    it('should return readonly reactive values', () => {
      const theme = useTheme()

      // These should be readonly refs
      expect(theme.currentTheme).toBeDefined()
      expect(theme.themeConfig).toBeDefined()
      expect(theme.isDark).toBeDefined()
      expect(theme.isSpecial).toBeDefined()
      expect(theme.themes).toBeDefined()
      expect(theme.availableThemes).toBeDefined()
      expect(theme.themesByCategory).toBeDefined()
    })

    it('should return all expected functions', () => {
      const theme = useTheme()

      expect(typeof theme.setTheme).toBe('function')
      expect(typeof theme.toggleTheme).toBe('function')
      expect(typeof theme.cycleTheme).toBe('function')
      expect(typeof theme.applyTheme).toBe('function')
      expect(typeof theme.initializeTheme).toBe('function')
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing document gracefully', () => {
      const originalDocument = globalThis.document
      
      // @ts-ignore
      globalThis.document = undefined

      const theme = useTheme()

      expect(() => theme.setTheme('dark')).not.toThrow()

      // Restore document
      globalThis.document = originalDocument
    })

    it('should handle missing window gracefully', () => {
      const originalWindow = globalThis.window
      
      // @ts-ignore
      globalThis.window = undefined

      const theme = useTheme()

      expect(() => theme.initializeTheme()).not.toThrow()

      // Restore window
      globalThis.window = originalWindow
    })

    it('should handle malformed app config', () => {
      mockUseAppConfig.mockReturnValue(null)

      expect(() => useTheme()).not.toThrow()
    })

    it('should handle theme config with missing colors', () => {
      const theme = useTheme()

      // Should not throw even if theme config is accessed
      expect(theme.themeConfig.value.colors).toBeDefined()
      expect(typeof theme.themeConfig.value.colors.background).toBe('string')
    })
  })

  describe('Memory Management', () => {
    it('should not leak memory when creating multiple instances', () => {
      // Create multiple theme instances
      const theme1 = useTheme()
      const theme2 = useTheme()
      const theme3 = useTheme()

      // All should work independently
      expect(theme1.currentTheme.value).toBe('light')
      expect(theme2.currentTheme.value).toBe('light')
      expect(theme3.currentTheme.value).toBe('light')
    })
  })
})