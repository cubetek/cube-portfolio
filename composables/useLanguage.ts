// Types for better type safety
interface LocaleObject {
  code: string
  name: string
  language: string
  dir: 'ltr' | 'rtl'
  file: string
}

export const useLanguage = () => {
  const { locale, locales, setLocale } = useI18n()
  const localePath = useLocalePath()
  const switchLocalePath = useSwitchLocalePath()
  
  /**
   * Get the current locale
   */
  const currentLocale = computed(() => locale.value as string)
  
  /**
   * Get all available locales with proper typing
   */
  const availableLocales = computed(() => locales.value as LocaleObject[])
  
  /**
   * Get the default locale
   */
  const defaultLocale = computed(() => {
    // Extract default locale from Nuxt configuration
    const nuxtApp = useNuxtApp()
    return nuxtApp.$config?.public?.i18n?.defaultLocale || 'ar'
  })
  
  /**
   * Check if current locale is RTL
   */
  const isRTL = computed(() => {
    const locale = availableLocales.value.find(l => l.code === currentLocale.value)
    return locale?.dir === 'rtl'
  })
  
  /**
   * Store language preference in localStorage and cookie
   */
  const storeLanguagePreference = (locale: string) => {
    if (process.client) {
      // Store in localStorage
      try {
        localStorage.setItem('preferred-language', locale)
      } catch (e) {
        console.warn('localStorage not available:', e)
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
  }
  
  /**
   * Get stored language preference
   */
  const getStoredLanguagePreference = (): string | null => {
    if (process.server) {
      return null
    }
    
    // Try localStorage first
    try {
      const stored = localStorage.getItem('preferred-language')
      if (stored && availableLocales.value.some(l => l.code === stored)) {
        return stored
      }
    } catch (e) {
      // localStorage might not be available
    }
    
    // Fallback to cookie
    const cookie = useCookie('preferred-language', {
      default: () => '',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    })
    
    if (cookie.value && availableLocales.value.some(l => l.code === cookie.value)) {
      return cookie.value
    }
    
    return null
  }
  
  /**
   * Switch to a different language with enhanced error handling
   */
  const switchLanguage = async (newLocale: string): Promise<void> => {
    if (newLocale === currentLocale.value) {
      return
    }
    
    // Validate the locale
    const isValidLocale = availableLocales.value.some(l => l.code === newLocale)
    if (!isValidLocale) {
      const error = new Error(`Locale '${newLocale}' is not available`)
      console.warn(error.message)
      throw error
    }
    
    try {
      // Store the preference
      storeLanguagePreference(newLocale)
      
      // Use switchLocalePath which handles the navigation properly
      const localizedPath = switchLocalePath(newLocale as any)
      await navigateTo(localizedPath)
    } catch (error) {
      console.error('Failed to switch language:', error)
      throw error
    }
  }
  
  /**
   * Get localized path for a specific route
   */
  const getLocalizedPath = (path: string, locale?: string) => {
    return localePath(path as any, (locale || currentLocale.value) as any)
  }
  
  /**
   * Get the language direction CSS class
   */
  const directionClass = computed(() => {
    return isRTL.value ? 'rtl' : 'ltr'
  })
  
  /**
   * Get the language direction attribute value
   */
  const directionAttr = computed(() => {
    return isRTL.value ? 'rtl' : 'ltr'
  })
  
  return {
    currentLocale,
    availableLocales,
    defaultLocale,
    isRTL,
    directionClass,
    directionAttr,
    storeLanguagePreference,
    getStoredLanguagePreference,
    switchLanguage,
    getLocalizedPath
  }
}