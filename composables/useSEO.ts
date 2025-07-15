/**
 * SEO Composable for dynamic meta tag management
 * Handles multilingual SEO meta tags, OpenGraph, Twitter Cards, and structured data
 */

export interface SEOData {
  title?: string
  description?: string
  keywords?: string
  image?: string
  author?: string
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
  canonical?: string
  noindex?: boolean
}

export const useSEO = (data: SEOData = {}) => {
  const { locale, t } = useI18n()
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig()

  // Get site configuration
  const siteUrl = runtimeConfig.public?.siteUrl || process.env.NUXT_PUBLIC_SITE_URL || 'https://your-domain.com'
  const siteName = 'Your Personal Website'
  const defaultDescription = t('meta.description')
  const defaultImage = `${siteUrl}/og-image.jpg`

  // Build dynamic title
  const buildTitle = (pageTitle?: string) => {
    if (!pageTitle) return siteName
    return `${pageTitle} - ${siteName}`
  }

  // Build canonical URL
  const buildCanonical = (customCanonical?: string) => {
    if (customCanonical) return customCanonical
    
    // Remove locale prefix for canonical URL generation
    const path = route.path
    const cleanPath = locale.value === 'ar' ? path : path.replace(`/${locale.value}`, '')
    return `${siteUrl}${cleanPath === '/' ? '' : cleanPath}`
  }

  // Use enhanced multilingual SEO
  const { getMultilingualHead, getCanonicalUrl, getHreflangAlternates } = useMultilingualSEO()

  // Set meta tags
  const setMeta = () => {
    const title = buildTitle(data.title)
    const description = data.description || defaultDescription
    const canonical = getCanonicalUrl()
    const multilingualHead = getMultilingualHead()

    // Use social media composable for enhanced social meta
    const { getSocialMeta } = useSocialMedia({
      title,
      description,
      image: data.image || defaultImage,
      type: data.type || 'website',
      author: data.author || 'Your Name',
      siteName,
      twitterHandle: '@yourhandle'
    })

    const socialMeta = getSocialMeta()

    // Basic meta tags
    const metaData: any = {
      title,
      description,
      keywords: data.keywords,
      author: data.author || 'Your Name',
      robots: data.noindex ? 'noindex,nofollow' : 'index,follow',
      
      // Enhanced social media meta
      ...socialMeta,
      
      // Article specific (if type is article)
      ...(data.type === 'article' && {
        articleAuthor: data.author || 'Your Name',
        articlePublishedTime: data.publishedTime,
        articleModifiedTime: data.modifiedTime,
        articleSection: data.section,
        articleTag: data.tags
      })
    }

    useSeoMeta(metaData)

    // Use enhanced multilingual head configuration
    useHead({
      ...multilingualHead,
      meta: [
        // Existing multilingual meta
        ...(multilingualHead.meta || []),
        // Additional meta tags
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1'
        },
        {
          name: 'theme-color',
          content: '#0ea5e9'
        }
      ]
    })
  }

  // Generate JSON-LD structured data
  const generateStructuredData = (type: 'Person' | 'Article' | 'WebSite' = 'WebSite') => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': type,
      url: buildCanonical(),
      name: data.title || siteName,
      description: data.description || defaultDescription
    }

    let structuredData: any = baseData

    switch (type) {
      case 'Person':
        structuredData = {
          ...baseData,
          '@type': 'Person',
          name: 'Your Name',
          jobTitle: 'Your Job Title',
          url: siteUrl,
          sameAs: [
            'https://linkedin.com/in/yourprofile',
            'https://github.com/yourusername',
            'https://twitter.com/yourhandle'
          ]
        }
        break

      case 'Article':
        structuredData = {
          ...baseData,
          '@type': 'Article',
          headline: data.title,
          image: data.image || defaultImage,
          author: {
            '@type': 'Person',
            name: data.author || 'Your Name'
          },
          publisher: {
            '@type': 'Organization',
            name: siteName,
            logo: {
              '@type': 'ImageObject',
              url: `${siteUrl}/logo.png`
            }
          },
          datePublished: data.publishedTime,
          dateModified: data.modifiedTime || data.publishedTime
        }
        break

      case 'WebSite':
        structuredData = {
          ...baseData,
          '@type': 'WebSite',
          name: siteName,
          alternateName: 'Your Name - Personal Website',
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${siteUrl}/search?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
          }
        }
        break
    }

    useSchemaOrg([structuredData])
  }

  // Initialize SEO
  setMeta()

  return {
    setMeta,
    generateStructuredData,
    buildTitle,
    buildCanonical: data.canonical ? () => buildCanonical(data.canonical) : getCanonicalUrl,
    getHreflangAlternates,
    getMultilingualHead
  }
}