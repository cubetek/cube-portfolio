import { navigateTo } from '#app'

export default defineNuxtRouteMiddleware(async (to) => {
  const { $i18n } = useNuxtApp()
  const localePath = useLocalePath()
  
  // Skip middleware for API routes
  if (to.path.startsWith('/api/')) {
    return
  }

  // Get available locales from i18n config
  const availableLocales = $i18n.locales.value.map((locale: any) => locale.code)
  const defaultLocale = $i18n.defaultLocale || 'en'
  
  // Function to detect browser language preference
  const detectBrowserLanguage = (): string => {
    if (process.server) {
      return defaultLocale
    }
    
    const browserLangs = navigator.languages || [navigator.language]
    
    for (const lang of browserLangs) {
      // Check exact match first
      if (availableLocales.includes(lang)) {
        return lang
      }
      
      // Check language without region (e.g., 'en' from 'en-US', 'ar' from 'ar-SA')
      const langCode = lang.split('-')[0]!
      if (availableLocales.includes(langCode)) {
        return langCode
      }
    }
    
    return defaultLocale
  }

  // Function to get stored language preference
  const getStoredLanguage = (): string | null => {
    if (process.server) {
      return null
    }
    
    // Try localStorage first
    try {
      const stored = localStorage.getItem('preferred-language')
      if (stored && availableLocales.includes(stored)) {
        return stored
      }
    } catch (e) {
      // localStorage might not be available
    }
    
    // Fallback to cookie
    const cookie = useCookie('preferred-language', {
      default: () => '',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    })
    
    if (cookie.value && availableLocales.includes(cookie.value)) {
      return cookie.value
    }
    
    return null
  }

  // Function to store language preference
  const storeLanguage = (locale: string): void => {
    if (process.server) {
      return
    }
    
    // Store in localStorage
    try {
      localStorage.setItem('preferred-language', locale)
    } catch (e) {
      // localStorage might not be available
    }
    
    // Store in cookie as fallback
    const cookie = useCookie('preferred-language', {
      default: () => '',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    })
    cookie.value = locale
  }

  // Function to extract locale from URL path
  const getLocaleFromPath = (path: string): string | null => {
    const segments = path.split('/').filter(Boolean)
    const firstSegment = segments[0]
    
    if (firstSegment && availableLocales.includes(firstSegment)) {
      return firstSegment
    }
    
    return null
  }

  // Function to remove locale prefix from path
  const removeLocaleFromPath = (path: string, locale: string): string => {
    const pathWithoutLocale = path.replace(new RegExp(`^/${locale}`), '') || '/'
    return pathWithoutLocale
  }

  // Main language detection logic
  const currentLocale = $i18n.locale.value
  const urlLocale = getLocaleFromPath(to.path)
  
  // Check if URL contains a valid locale
  if (urlLocale) {
    // URL has a locale prefix
    if (urlLocale !== currentLocale) {
      // Update current locale to match URL
      await $i18n.setLocale(urlLocale)
      storeLanguage(urlLocale)
    }
    return // Continue with the request
  }

  // No locale in URL - determine what to do
  let targetLocale = defaultLocale
  
  // Priority order for locale detection:
  // 1. Stored preference (localStorage/cookie)
  // 2. Browser language detection
  // 3. Default locale
  
  const storedLanguage = getStoredLanguage()
  if (storedLanguage) {
    targetLocale = storedLanguage
  } else {
    targetLocale = detectBrowserLanguage()
    storeLanguage(targetLocale)
  }

  // If target locale is the default locale and we're using prefix_except_default strategy
  if (targetLocale === defaultLocale) {
    // For default locale, we might not need to redirect depending on strategy
    if (to.path === '/' || !to.path.startsWith(`/${defaultLocale}`)) {
      // Set the locale but don't redirect for default locale
      if (targetLocale !== currentLocale) {
        await $i18n.setLocale(targetLocale)
      }
      return
    }
  }

  // For non-default locales, redirect to localized path
  if (targetLocale !== defaultLocale) {
    const localizedPath = localePath(to.path as any, targetLocale)
    
    // Only redirect if the localized path is different from current path
    if (localizedPath !== to.path) {
      // Preserve query parameters and hash
      const url = new URL(localizedPath, 'http://localhost')
      if (to.query && Object.keys(to.query).length > 0) {
        Object.entries(to.query).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach(v => url.searchParams.append(key, String(v)))
          } else if (value !== undefined) {
            url.searchParams.set(key, String(value))
          }
        })
      }
      
      let redirectPath = url.pathname + url.search
      if (to.hash) {
        redirectPath += to.hash
      }
      
      return navigateTo(redirectPath, { 
        redirectCode: 302,
        external: false 
      })
    }
  }

  // Update locale if it has changed
  if (targetLocale !== currentLocale) {
    await $i18n.setLocale(targetLocale)
  }
})