/**
 * Structured Data Composable for JSON-LD Schema.org implementation
 * Provides comprehensive schema markup for SEO optimization
 */

export interface PersonSchema {
  name: string
  jobTitle?: string
  description?: string
  url?: string
  sameAs?: string[]
  knowsAbout?: string[]
  worksFor?: OrganizationSchema
  address?: AddressSchema
}

export interface OrganizationSchema {
  '@type': 'Organization'
  name: string
  url?: string
  logo?: string
  sameAs?: string[]
}

export interface AddressSchema {
  '@type': 'PostalAddress'
  addressCountry: string
  addressRegion?: string
  addressLocality?: string
}

export interface ArticleSchema {
  headline: string
  description?: string
  author: PersonSchema | string
  publisher?: OrganizationSchema
  datePublished?: string
  dateModified?: string
  image?: string
  url?: string
  keywords?: string[]
}

export interface WebSiteSchema {
  name: string
  description?: string
  url: string
  author?: PersonSchema
  publisher?: OrganizationSchema
  inLanguage?: string[]
  potentialAction?: {
    '@type': 'SearchAction'
    target: {
      '@type': 'EntryPoint'
      urlTemplate: string
    }
    'query-input': string
  }
}

export const useStructuredData = () => {
  // Helper to get common data that composables need
  const getCommonData = () => {
    const { t } = useI18n()
    const route = useRoute()
    const runtimeConfig = useRuntimeConfig()
    const localePath = useLocalePath()
    
    const siteUrl = runtimeConfig.public?.siteUrl || 'https://your-domain.com'
    const siteName = 'Your Personal Website'
    
    return { t, route, runtimeConfig, localePath, siteUrl, siteName }
  }

  // Generate Person schema
  const generatePersonSchema = (data: Partial<PersonSchema> = {}): any => {
    const { t, siteUrl } = getCommonData()
    
    const defaultPerson: PersonSchema = {
      name: t('meta.author'),
      jobTitle: 'Full Stack Developer',
      description: t('meta.description'),
      url: siteUrl,
      sameAs: [
        'https://github.com/yourusername',
        'https://linkedin.com/in/yourusername',
        'https://twitter.com/yourusername'
      ],
      knowsAbout: [
        'Web Development',
        'Vue.js',
        'Nuxt.js',
        'JavaScript',
        'TypeScript',
        'Frontend Development',
        'Backend Development'
      ]
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      ...defaultPerson,
      ...data
    }
  }

  // Generate Organization schema
  const generateOrganizationSchema = (data: Partial<OrganizationSchema> = {}): any => {
    const { siteUrl, siteName } = getCommonData()
    
    const defaultOrg: OrganizationSchema = {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      sameAs: [
        'https://github.com/yourusername',
        'https://linkedin.com/in/yourusername',
        'https://twitter.com/yourusername'
      ]
    }

    return {
      '@context': 'https://schema.org',
      ...defaultOrg,
      ...data
    }
  }

  // Generate WebSite schema
  const generateWebSiteSchema = (data: Partial<WebSiteSchema> = {}): any => {
    const { t, siteUrl, siteName } = getCommonData()
    
    const defaultWebSite: WebSiteSchema = {
      name: siteName,
      description: t('meta.description'),
      url: siteUrl,
      author: {
        name: t('meta.author'),
        jobTitle: 'Full Stack Developer'
      },
      inLanguage: ['ar-SA', 'en-US'],
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${siteUrl}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      ...defaultWebSite,
      ...data
    }
  }

  // Generate Article schema
  const generateArticleSchema = (data: Partial<ArticleSchema>): any => {
    const { route, siteUrl } = getCommonData()
    
    const defaultArticle = {
      author: generatePersonSchema(),
      publisher: generateOrganizationSchema(),
      dateModified: data.dateModified || data.datePublished,
      image: data.image || `${siteUrl}/og-image.jpg`,
      url: data.url || `${siteUrl}${route.path}`
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      ...defaultArticle,
      ...data
    }
  }

  // Generate BreadcrumbList schema
  const generateBreadcrumbSchema = (breadcrumbs: Array<{ label: string; to?: string }>) => {
    const { siteUrl } = getCommonData()
    
    const itemListElement = breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.label,
      item: breadcrumb.to ? `${siteUrl}${breadcrumb.to}` : undefined
    }))

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement
    }
  }

  // Generate ContactPage schema
  const generateContactPageSchema = () => {
    const { t, siteUrl, localePath } = getCommonData()
    
    return {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: t('meta.contact.title'),
      url: `${siteUrl}${localePath('/contact')}`,
      description: t('meta.contact.description'),
      mainEntity: generatePersonSchema()
    }
  }

  // Generate LocalBusiness schema (if applicable)
  const generateLocalBusinessSchema = (data: any = {}) => {
    const { t, siteUrl, siteName } = getCommonData()
    
    return {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: siteName,
      url: siteUrl,
      description: t('meta.description'),
      owner: generatePersonSchema(),
      ...data
    }
  }

  // Generate FAQ schema
  const generateFAQSchema = (faqs: Array<{ question: string; answer: string }>) => {
    const mainEntity = faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity
    }
  }

  // Generate SoftwareApplication schema
  const generateSoftwareApplicationSchema = (data: any) => {
    const { siteUrl } = getCommonData()
    
    return {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: data.name,
      description: data.description,
      author: generatePersonSchema(),
      applicationCategory: 'WebApplication',
      operatingSystem: 'Web Browser',
      url: data.url || siteUrl,
      ...data
    }
  }

  // Inject structured data into page head
  const injectStructuredData = (schemas: any[]) => {
    const scripts = schemas.map(schema => ({
      type: 'application/ld+json',
      innerHTML: JSON.stringify(schema)
    }))

    useHead({
      script: scripts
    })
  }

  // Helper to inject multiple schemas at once
  const useSchemas = (schemas: any[]) => {
    injectStructuredData(schemas)
  }

  return {
    generatePersonSchema,
    generateOrganizationSchema,
    generateWebSiteSchema,
    generateArticleSchema,
    generateBreadcrumbSchema,
    generateContactPageSchema,
    generateLocalBusinessSchema,
    generateFAQSchema,
    generateSoftwareApplicationSchema,
    injectStructuredData,
    useSchemas
  }
}