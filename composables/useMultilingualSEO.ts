/**
 * Multilingual SEO Composable
 * Handles canonical URLs, hreflang tags, and language-specific SEO optimization
 */

export interface LanguageAlternate {
  locale: string
  code: string
  href: string
  hreflang: string
}

export const useMultilingualSEO = () => {
  const { locale, locales } = useI18n()
  const route = useRoute()
  const localePath = useLocalePath()
  const runtimeConfig = useRuntimeConfig()

  // Site configuration
  const siteUrl = runtimeConfig.public?.siteUrl || 'https://your-domain.com'
  const defaultLocale = 'ar'

  // Generate canonical URL for current page
  const getCanonicalUrl = () => {
    const path = route.path
    let canonicalPath = path

    // For default locale (Arabic), remove locale prefix from canonical
    if (locale.value === defaultLocale) {
      canonicalPath = path.replace(/^\/ar/, '')
    } else {
      // For other locales, remove the locale prefix for canonical
      canonicalPath = path.replace(new RegExp(`^/${locale.value}`), '')
    }

    // Ensure canonical always starts with /
    if (!canonicalPath.startsWith('/')) {
      canonicalPath = '/' + canonicalPath
    }

    // For default locale, canonical URL should not have locale prefix
    if (locale.value === defaultLocale) {
      return `${siteUrl}${canonicalPath}`
    } else {
      // For non-default locales, canonical points to the default locale version
      return `${siteUrl}${canonicalPath}`
    }
  }

  // Generate hreflang alternates for current page
  const getHreflangAlternates = (): LanguageAlternate[] => {
    const alternates: LanguageAlternate[] = []
    const availableLocales = Array.isArray(locales.value) ? locales.value : []

    // Get base path without locale prefix
    const path = route.path
    const basePath = path.replace(/^\/[a-z]{2}/, '') || '/'

    // Generate alternates for each available locale
    availableLocales.forEach((loc: any) => {
      const localeCode = typeof loc === 'string' ? loc : loc.code
      const languageCode = typeof loc === 'string' ? loc : loc.language || `${localeCode}-${localeCode.toUpperCase()}`
      
      let href: string
      
      if (localeCode === defaultLocale) {
        // Default locale doesn't have prefix
        href = `${siteUrl}${basePath}`
      } else {
        // Non-default locales have prefix
        href = `${siteUrl}/${localeCode}${basePath}`
      }

      alternates.push({
        locale: localeCode,
        code: localeCode,
        href,
        hreflang: languageCode
      })
    })

    // Add x-default pointing to default locale
    alternates.push({
      locale: 'x-default',
      code: 'x-default',
      href: `${siteUrl}${basePath}`,
      hreflang: 'x-default'
    })

    return alternates
  }

  // Generate HTML lang attribute for current locale
  const getHtmlLang = () => {
    const localeConfig = Array.isArray(locales.value) 
      ? locales.value.find((l: any) => (typeof l === 'string' ? l : l.code) === locale.value)
      : null

    if (typeof localeConfig === 'object' && localeConfig?.language) {
      return localeConfig.language
    }

    // Fallback to locale code with region
    return locale.value === 'ar' ? 'ar-SA' : 'en-US'
  }

  // Generate HTML dir attribute for current locale
  const getHtmlDir = () => {
    const localeConfig = Array.isArray(locales.value) 
      ? locales.value.find((l: any) => (typeof l === 'string' ? l : l.code) === locale.value)
      : null

    if (typeof localeConfig === 'object' && localeConfig?.dir) {
      return localeConfig.dir
    }

    // Default direction based on locale
    return locale.value === 'ar' ? 'rtl' : 'ltr'
  }

  // Get language-specific meta properties
  const getLanguageSpecificMeta = () => {
    return {
      htmlAttrs: {
        lang: getHtmlLang(),
        dir: getHtmlDir()
      },
      meta: [
        {
          'http-equiv': 'content-language',
          content: locale.value
        },
        {
          name: 'language',
          content: getHtmlLang()
        }
      ]
    }
  }

  // Generate complete multilingual head configuration
  const getMultilingualHead = () => {
    const canonical = getCanonicalUrl()
    const alternates = getHreflangAlternates()
    const langMeta = getLanguageSpecificMeta()

    return {
      ...langMeta,
      link: [
        // Canonical URL
        {
          rel: 'canonical',
          href: canonical
        },
        // Hreflang alternates
        ...alternates.map(alt => ({
          rel: 'alternate',
          hreflang: alt.hreflang,
          href: alt.href
        }))
      ]
    }
  }

  // Check if current page has translations
  const hasTranslations = () => {
    const alternates = getHreflangAlternates()
    return alternates.length > 2 // More than just current locale and x-default
  }

  // Get translation URLs for current page
  const getTranslationUrls = () => {
    const alternates = getHreflangAlternates()
    return alternates
      .filter(alt => alt.locale !== 'x-default' && alt.locale !== locale.value)
      .map(alt => ({
        locale: alt.locale,
        url: alt.href,
        name: getLocaleName(alt.locale)
      }))
  }

  // Get localized name for a locale code
  const getLocaleName = (localeCode: string) => {
    const localeConfig = Array.isArray(locales.value) 
      ? locales.value.find((l: any) => (typeof l === 'string' ? l : l.code) === localeCode)
      : null

    if (typeof localeConfig === 'object' && localeConfig?.name) {
      return localeConfig.name
    }

    // Fallback names
    const names: Record<string, string> = {
      'ar': 'العربية',
      'en': 'English',
      'fr': 'Français',
      'es': 'Español',
      'de': 'Deutsch'
    }

    return names[localeCode] || localeCode
  }

  // Validate multilingual SEO setup
  const validateMultilingualSEO = () => {
    const issues = []
    const alternates = getHreflangAlternates()
    const canonical = getCanonicalUrl()

    // Check if canonical URL is valid
    if (!canonical.startsWith('http')) {
      issues.push('Canonical URL should be absolute')
    }

    // Check if hreflang alternates are properly configured
    if (alternates.length < 2) {
      issues.push('Should have at least one language alternate')
    }

    // Check if x-default is present
    const hasXDefault = alternates.some(alt => alt.hreflang === 'x-default')
    if (!hasXDefault) {
      issues.push('Missing x-default hreflang')
    }

    // Check for duplicate hreflang values
    const hreflangs = alternates.map(alt => alt.hreflang)
    const uniqueHreflangs = [...new Set(hreflangs)]
    if (hreflangs.length !== uniqueHreflangs.length) {
      issues.push('Duplicate hreflang values detected')
    }

    return {
      isValid: issues.length === 0,
      issues,
      alternates,
      canonical
    }
  }

  return {
    getCanonicalUrl,
    getHreflangAlternates,
    getHtmlLang,
    getHtmlDir,
    getLanguageSpecificMeta,
    getMultilingualHead,
    hasTranslations,
    getTranslationUrls,
    getLocaleName,
    validateMultilingualSEO
  }
}