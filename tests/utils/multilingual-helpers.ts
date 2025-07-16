/**
 * Multilingual Testing Utilities
 * 
 * This module provides specialized utilities for testing internationalization features:
 * - Language switching
 * - RTL/LTR layout testing
 * - Content localization validation
 * - Font switching verification
 * - URL routing for different locales
 */

import { vi, expect } from 'vitest'
import { ref, nextTick, type Ref } from 'vue'
import { VueWrapper } from '@vue/test-utils'
import { flushPromises, waitForTicks } from './testing-helpers'

// Types
export interface LocaleConfig {
  code: string
  name: string
  dir: 'ltr' | 'rtl'
  language: string
  file?: string
}

export interface MultilingualTestData {
  ar: string
  en: string
  [key: string]: string
}

export interface I18nTestContext {
  currentLocale: Ref<string>
  availableLocales: LocaleConfig[]
  t: (key: string, params?: any) => string
  switchLanguage: (locale: string) => Promise<void>
  getLocalizedText: (text: MultilingualTestData | string) => string
}

export interface RTLTestContext {
  isRTL: Ref<boolean>
  direction: Ref<'ltr' | 'rtl'>
  htmlDir: Ref<string>
  bodyClasses: Ref<string[]>
}

export interface FontTestContext {
  currentFont: Ref<string>
  fontFamily: Ref<string>
  fontDisplay: Ref<string>
}

/**
 * Default test locales configuration
 */
export const DEFAULT_TEST_LOCALES: LocaleConfig[] = [
  {
    code: 'en',
    name: 'English',
    dir: 'ltr',
    language: 'en-US',
    file: 'en.json'
  },
  {
    code: 'ar',
    name: 'العربية',
    dir: 'rtl',
    language: 'ar-SA',
    file: 'ar.json'
  }
]

/**
 * Create Mock I18n Context
 */
export function createMockI18nContext(
  initialLocale: string = 'en',
  locales: LocaleConfig[] = DEFAULT_TEST_LOCALES
): I18nTestContext {
  const currentLocale = ref(initialLocale)
  
  // Mock translation function
  const translations: Record<string, Record<string, string>> = {
    en: {
      'welcome': 'Welcome',
      'hello': 'Hello {name}',
      'about': 'About',
      'contact': 'Contact',
      'home': 'Home',
      'blog': 'Blog',
      'projects': 'Projects',
      'skills': 'Skills',
      'experience': 'Experience',
      'education': 'Education',
      'language': 'Language',
      'theme': 'Theme',
      'loading': 'Loading...',
      'error': 'An error occurred',
      'not_found': 'Page not found',
      'back_to_home': 'Back to Home'
    },
    ar: {
      'welcome': 'مرحباً',
      'hello': 'مرحباً {name}',
      'about': 'عن',
      'contact': 'اتصل',
      'home': 'الرئيسية',
      'blog': 'المدونة',
      'projects': 'المشاريع',
      'skills': 'المهارات',
      'experience': 'الخبرة',
      'education': 'التعليم',
      'language': 'اللغة',
      'theme': 'الموضوع',
      'loading': 'جاري التحميل...',
      'error': 'حدث خطأ',
      'not_found': 'الصفحة غير موجودة',
      'back_to_home': 'العودة للرئيسية'
    }
  }
  
  const t = (key: string, params?: any): string => {
    const locale = currentLocale.value
    let translation = translations[locale]?.[key] || key
    
    // Simple parameter replacement
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{${param}}`, String(value))
      })
    }
    
    return translation
  }
  
  const switchLanguage = async (locale: string): Promise<void> => {
    if (locales.find(l => l.code === locale)) {
      currentLocale.value = locale
      await nextTick()
    }
  }
  
  const getLocalizedText = (text: MultilingualTestData | string): string => {
    if (typeof text === 'string') return text
    return text[currentLocale.value] || text.en || ''
  }
  
  return {
    currentLocale,
    availableLocales: locales,
    t,
    switchLanguage,
    getLocalizedText
  }
}

/**
 * Create Mock RTL Context
 */
export function createMockRTLContext(
  initialLocale: string = 'en'
): RTLTestContext {
  const currentLocale = ref(initialLocale)
  const isRTL = ref(currentLocale.value === 'ar')
  const direction = ref<'ltr' | 'rtl'>(isRTL.value ? 'rtl' : 'ltr')
  const htmlDir = ref(direction.value)
  const bodyClasses = ref<string[]>([
    direction.value,
    `locale-${currentLocale.value}`,
    `font-${currentLocale.value === 'ar' ? 'arabic' : 'latin'}`
  ])
  
  // Watch for locale changes
  const updateRTL = () => {
    isRTL.value = currentLocale.value === 'ar'
    direction.value = isRTL.value ? 'rtl' : 'ltr'
    htmlDir.value = direction.value
    bodyClasses.value = [
      direction.value,
      `locale-${currentLocale.value}`,
      `font-${currentLocale.value === 'ar' ? 'arabic' : 'latin'}`
    ]
  }
  
  // Expose method to change locale for testing
  ;(currentLocale as any).setValue = (value: string) => {
    currentLocale.value = value
    updateRTL()
  }
  
  return {
    isRTL,
    direction,
    htmlDir,
    bodyClasses
  }
}

/**
 * Create Mock Font Context
 */
export function createMockFontContext(
  initialLocale: string = 'en'
): FontTestContext {
  const currentLocale = ref(initialLocale)
  const currentFont = ref(currentLocale.value === 'ar' ? 'Tajawal' : 'Inter')
  const fontFamily = ref(`"${currentFont.value}", sans-serif`)
  const fontDisplay = ref('swap')
  
  // Update font when locale changes
  const updateFont = () => {
    currentFont.value = currentLocale.value === 'ar' ? 'Tajawal' : 'Inter'
    fontFamily.value = `"${currentFont.value}", sans-serif`
  }
  
  // Expose method to change locale for testing
  ;(currentLocale as any).setValue = (value: string) => {
    currentLocale.value = value
    updateFont()
  }
  
  return {
    currentFont,
    fontFamily,
    fontDisplay
  }
}

/**
 * Language Switching Test Utilities
 */

/**
 * Test language switching functionality
 */
export async function testLanguageSwitching(
  wrapper: VueWrapper<any>,
  i18nContext: I18nTestContext,
  locales: string[] = ['en', 'ar']
): Promise<void> {
  for (const locale of locales) {
    await i18nContext.switchLanguage(locale)
    await flushPromises()
    
    // Verify locale is updated
    expect(i18nContext.currentLocale.value).toBe(locale)
    
    // Verify component re-renders with new locale
    await waitForTicks(2)
  }
}

/**
 * Test localized content rendering
 */
export async function testLocalizedContent(
  wrapper: VueWrapper<any>,
  contentSelector: string,
  expectedContent: Record<string, string>,
  i18nContext: I18nTestContext
): Promise<void> {
  for (const [locale, content] of Object.entries(expectedContent)) {
    await i18nContext.switchLanguage(locale)
    await flushPromises()
    
    const element = wrapper.find(contentSelector)
    expect(element.exists()).toBe(true)
    expect(element.text()).toContain(content)
  }
}

/**
 * RTL Layout Testing Utilities
 */

/**
 * Test RTL layout switching
 */
export async function testRTLLayout(
  wrapper: VueWrapper<any>,
  rtlContext: RTLTestContext,
  testCases: Array<{
    locale: string
    expectedDirection: 'ltr' | 'rtl'
    expectedClasses?: string[]
  }>
): Promise<void> {
  for (const testCase of testCases) {
    // Update locale (assuming we have access to the locale setter)
    ;(rtlContext as any).currentLocale?.setValue?.(testCase.locale)
    await flushPromises()
    
    // Test direction
    expect(rtlContext.direction.value).toBe(testCase.expectedDirection)
    expect(rtlContext.isRTL.value).toBe(testCase.expectedDirection === 'rtl')
    
    // Test HTML dir attribute
    expect(rtlContext.htmlDir.value).toBe(testCase.expectedDirection)
    
    // Test body classes if provided
    if (testCase.expectedClasses) {
      testCase.expectedClasses.forEach(className => {
        expect(rtlContext.bodyClasses.value).toContain(className)
      })
    }
    
    await waitForTicks(2)
  }
}

/**
 * Test CSS direction styles
 */
export function testDirectionStyles(
  wrapper: VueWrapper<any>,
  selector: string,
  isRTL: boolean
): void {
  const element = wrapper.find(selector)
  expect(element.exists()).toBe(true)
  
  const computedStyle = window.getComputedStyle(element.element)
  expect(computedStyle.direction).toBe(isRTL ? 'rtl' : 'ltr')
}

/**
 * Font Testing Utilities
 */

/**
 * Test font switching based on locale
 */
export async function testFontSwitching(
  wrapper: VueWrapper<any>,
  fontContext: FontTestContext,
  testCases: Array<{
    locale: string
    expectedFont: string
    expectedFontFamily: string
  }>
): Promise<void> {
  for (const testCase of testCases) {
    // Update locale
    ;(fontContext as any).currentLocale?.setValue?.(testCase.locale)
    await flushPromises()
    
    expect(fontContext.currentFont.value).toBe(testCase.expectedFont)
    expect(fontContext.fontFamily.value).toBe(testCase.expectedFontFamily)
    
    await waitForTicks(2)
  }
}

/**
 * URL and Routing Testing Utilities
 */

/**
 * Mock router for locale-based routing
 */
export function createMockLocaleRouter(
  initialLocale: string = 'ar',
  strategy: 'prefix_except_default' | 'prefix' = 'prefix_except_default'
) {
  const currentRoute = ref({
    path: initialLocale === 'ar' ? '/' : `/en`,
    params: {},
    query: {},
    meta: { locale: initialLocale }
  })
  
  const push = vi.fn(async (to: string | { path: string; locale?: string }) => {
    if (typeof to === 'string') {
      currentRoute.value.path = to
    } else {
      currentRoute.value.path = to.path
      if (to.locale) {
        currentRoute.value.meta.locale = to.locale
      }
    }
  })
  
  const replace = vi.fn(async (to: string | { path: string; locale?: string }) => {
    await push(to)
  })
  
  return {
    currentRoute,
    push,
    replace,
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn()
  }
}

/**
 * Test locale-based URL generation
 */
export function testLocaleUrls(
  basePath: string,
  locale: string,
  strategy: 'prefix_except_default' | 'prefix' = 'prefix_except_default',
  defaultLocale: string = 'ar'
): string {
  if (strategy === 'prefix_except_default' && locale === defaultLocale) {
    return basePath
  }
  return `/${locale}${basePath}`
}

/**
 * Content Validation Utilities
 */

/**
 * Validate multilingual text object structure
 */
export function validateMultilingualText(
  text: any,
  requiredLocales: string[] = ['en', 'ar']
): boolean {
  if (typeof text === 'string') return true
  if (!text || typeof text !== 'object') return false
  
  return requiredLocales.every(locale => 
    text.hasOwnProperty(locale) && typeof text[locale] === 'string'
  )
}

/**
 * Create test data with multilingual support
 */
export function createMultilingualTestData<T extends Record<string, any>>(
  data: T,
  locales: string[] = ['en', 'ar']
): Record<string, T> {
  const result: Record<string, T> = {}
  
  locales.forEach(locale => {
    result[locale] = { ...data }
  })
  
  return result
}

/**
 * Accessibility Testing for Multilingual Content
 */

/**
 * Test lang attributes for different locales
 */
export async function testLangAttributes(
  wrapper: VueWrapper<any>,
  selector: string,
  locale: string,
  expectedLang: string
): Promise<void> {
  const element = wrapper.find(selector)
  expect(element.exists()).toBe(true)
  expect(element.attributes('lang')).toBe(expectedLang)
}

/**
 * Test ARIA labels in different languages
 */
export async function testAriaLabels(
  wrapper: VueWrapper<any>,
  selector: string,
  expectedLabels: Record<string, string>,
  i18nContext: I18nTestContext
): Promise<void> {
  for (const [locale, expectedLabel] of Object.entries(expectedLabels)) {
    await i18nContext.switchLanguage(locale)
    await flushPromises()
    
    const element = wrapper.find(selector)
    expect(element.exists()).toBe(true)
    expect(element.attributes('aria-label')).toBe(expectedLabel)
  }
}

/**
 * Performance Testing for Language Switching
 */

/**
 * Measure language switching performance
 */
export async function measureLanguageSwitchPerformance(
  switchFunction: (locale: string) => Promise<void>,
  locales: string[] = ['en', 'ar'],
  iterations: number = 10
): Promise<{ averageTime: number; times: number[] }> {
  const times: number[] = []
  
  for (let i = 0; i < iterations; i++) {
    for (const locale of locales) {
      const start = performance.now()
      await switchFunction(locale)
      const end = performance.now()
      times.push(end - start)
    }
  }
  
  const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length
  
  return { averageTime, times }
}