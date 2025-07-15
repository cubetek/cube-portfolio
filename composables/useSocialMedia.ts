/**
 * Social Media Optimization Composable
 * Handles OpenGraph, Twitter Cards, and social media image generation
 */

export interface SocialMediaConfig {
  title?: string
  description?: string
  image?: string
  imageAlt?: string
  type?: 'website' | 'article' | 'profile'
  author?: string
  siteName?: string
  twitterHandle?: string
  facebookAppId?: string
}

export const useSocialMedia = (config: SocialMediaConfig = {}) => {
  const { locale, t } = useI18n()
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig()

  // Site configuration
  const siteUrl = runtimeConfig.public?.siteUrl || 'https://your-domain.com'
  const siteName = config.siteName || 'Your Personal Website'
  const twitterHandle = config.twitterHandle || '@yourhandle'
  const facebookAppId = config.facebookAppId || ''

  // Default values
  const defaultTitle = config.title || t('site.title')
  const defaultDescription = config.description || t('meta.description')
  const defaultImage = config.image || `${siteUrl}/og-image.jpg`
  const defaultImageAlt = config.imageAlt || `${siteName} - ${defaultTitle}`

  // Generate social media image URL based on page content
  const generateSocialImage = (title?: string, subtitle?: string) => {
    if (config.image) return config.image

    // For dynamic image generation, you could use a service like:
    // - Cloudinary
    // - ImageKit
    // - Custom image generation API
    // Example: return `${siteUrl}/api/og-image?title=${encodeURIComponent(title || defaultTitle)}&subtitle=${encodeURIComponent(subtitle || '')}`
    
    return defaultImage
  }

  // OpenGraph meta tags
  const getOpenGraphMeta = () => {
    const currentUrl = `${siteUrl}${route.path}`
    const image = generateSocialImage(config.title)

    return {
      // Basic OpenGraph tags
      ogTitle: config.title || defaultTitle,
      ogDescription: config.description || defaultDescription,
      ogImage: image,
      ogImageAlt: config.imageAlt || defaultImageAlt,
      ogUrl: currentUrl,
      ogType: config.type || 'website',
      ogSiteName: siteName,
      ogLocale: locale.value === 'ar' ? 'ar_SA' : 'en_US',
      
      // Additional OpenGraph tags
      ...(config.type === 'article' && {
        ogArticleAuthor: config.author || t('meta.author'),
        ogArticleSection: 'Technology',
        ogArticleTag: ['Web Development', 'Programming', 'Technology']
      }),

      // Facebook specific
      ...(facebookAppId && {
        fbAppId: facebookAppId
      })
    }
  }

  // Twitter Card meta tags
  const getTwitterCardMeta = () => {
    const image = generateSocialImage(config.title)

    return {
      twitterCard: 'summary_large_image',
      twitterSite: twitterHandle,
      twitterCreator: twitterHandle,
      twitterTitle: config.title || defaultTitle,
      twitterDescription: config.description || defaultDescription,
      twitterImage: image,
      twitterImageAlt: config.imageAlt || defaultImageAlt
    }
  }

  // Generate complete social media meta
  const getSocialMeta = () => {
    return {
      ...getOpenGraphMeta(),
      ...getTwitterCardMeta()
    }
  }

  // Validate social media image
  const validateSocialImage = (imageUrl: string) => {
    // Image should be at least 1200x630 for optimal display
    // This is a placeholder - you'd need actual image validation
    return {
      isValid: true,
      recommendedSize: '1200x630',
      minSize: '600x315',
      aspectRatio: '1.91:1'
    }
  }

  // Generate schema for social media profiles
  const getSocialProfileSchema = (profiles: Array<{ platform: string; url: string }>) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: config.author || t('meta.author'),
      url: siteUrl,
      sameAs: profiles.map(profile => profile.url)
    }
  }

  // Platform-specific image sizes
  const getImageSizes = () => {
    return {
      facebook: {
        recommended: '1200x630',
        minimum: '600x315',
        aspectRatio: 1.91
      },
      twitter: {
        recommended: '1200x675',
        minimum: '300x157',
        aspectRatio: 1.78
      },
      linkedin: {
        recommended: '1200x627',
        minimum: '520x272',
        aspectRatio: 1.91
      },
      whatsapp: {
        recommended: '1200x630',
        minimum: '300x200',
        aspectRatio: 1.9
      }
    }
  }

  // Debug social media meta
  const debugSocialMeta = () => {
    const meta = getSocialMeta()
    console.group('Social Media Meta Debug')
    console.log('OpenGraph:', getOpenGraphMeta())
    console.log('Twitter:', getTwitterCardMeta())
    console.log('Combined:', meta)
    console.log('Image Validation:', validateSocialImage(meta.ogImage))
    console.groupEnd()
    
    return meta
  }

  return {
    getSocialMeta,
    getOpenGraphMeta,
    getTwitterCardMeta,
    generateSocialImage,
    validateSocialImage,
    getSocialProfileSchema,
    getImageSizes,
    debugSocialMeta
  }
}