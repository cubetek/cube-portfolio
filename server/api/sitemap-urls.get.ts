/**
 * Dynamic sitemap URL generation
 * Handles content-based URLs for sitemap generation using Nuxt Content v3
 */

export default defineEventHandler(async (event) => {
  const urls: any[] = []

  try {
    // Add static pages with high priority
    const staticPages = [
      { url: '/', priority: 1.0, changefreq: 'weekly' },
      { url: '/en/', priority: 1.0, changefreq: 'weekly' },
      { url: '/about', priority: 0.9, changefreq: 'monthly' },
      { url: '/en/about', priority: 0.9, changefreq: 'monthly' },
      { url: '/contact', priority: 0.8, changefreq: 'monthly' },
      { url: '/en/contact', priority: 0.8, changefreq: 'monthly' },
      { url: '/projects', priority: 0.8, changefreq: 'weekly' },
      { url: '/en/projects', priority: 0.8, changefreq: 'weekly' },
      { url: '/blog', priority: 0.7, changefreq: 'daily' },
      { url: '/en/blog', priority: 0.7, changefreq: 'daily' }
    ]

    urls.push(...staticPages.map(page => ({
      ...page,
      lastmod: new Date().toISOString()
    })))

    // Add blog post URLs from content collections
    try {
      // Get all blog posts using Nuxt Content v3 query
      const blogPosts = await queryCollection('blog').all()
      
      // Generate URLs for each blog post
      for (const post of blogPosts) {
        if (post.published !== false && post.slug) {
          // Extract language from path
          const pathParts = post.path.split('/')
          const language = pathParts[1] // e.g., 'en' or 'ar'
          
          let blogUrl = ''
          if (language === 'ar') {
            // Arabic is the default language (no prefix)
            blogUrl = `/blog/${post.slug}`
          } else if (language === 'en') {
            // English has prefix
            blogUrl = `/en/blog/${post.slug}`
          }
          
          if (blogUrl) {
            urls.push({
              url: blogUrl,
              changefreq: 'monthly',
              priority: post.priority || 0.8,
              lastmod: post.updated || post.date || new Date().toISOString(),
              // Add language alternates
              alternateUrls: language === 'ar' ? [
                { href: blogUrl, hreflang: 'ar-SA' },
                { href: `/en/blog/${post.slug}`, hreflang: 'en-US' }
              ] : [
                { href: `/blog/${post.slug}`, hreflang: 'ar-SA' },
                { href: blogUrl, hreflang: 'en-US' }
              ]
            })
          }
        }
      }
    } catch (blogError) {
      console.warn('Error fetching blog posts for sitemap:', blogError)
      // Continue without blog posts if there's an error
    }

    // Add page content URLs
    try {
      // Get all page content using Nuxt Content v3 query
      const pages = await queryCollection('pages').all()
      
      // Generate URLs for each page
      for (const page of pages) {
        if (page.published !== false && page.path) {
          // Extract language from path
          const pathParts = page.path.split('/')
          const language = pathParts[1] // e.g., 'en' or 'ar'
          
          let pageUrl = ''
          if (language === 'ar') {
            // Arabic is the default language (no prefix)
            pageUrl = page.path.replace('/ar', '')
          } else if (language === 'en') {
            // English has prefix
            pageUrl = page.path.replace('/en', '/en')
          }
          
          // Skip index files and already added static pages
          if (pageUrl && !pageUrl.endsWith('/index') && pageUrl !== '/index') {
            const isAlreadyAdded = staticPages.some(sp => sp.url === pageUrl)
            if (!isAlreadyAdded) {
              urls.push({
                url: pageUrl,
                changefreq: 'monthly',
                priority: page.priority || 0.6,
                lastmod: page.updated || page.date || new Date().toISOString(),
                // Add language alternates
                alternateUrls: language === 'ar' ? [
                  { href: pageUrl, hreflang: 'ar-SA' },
                  { href: `/en${pageUrl}`, hreflang: 'en-US' }
                ] : [
                  { href: pageUrl.replace('/en', ''), hreflang: 'ar-SA' },
                  { href: pageUrl, hreflang: 'en-US' }
                ]
              })
            }
          }
        }
      }
    } catch (pageError) {
      console.warn('Error fetching pages for sitemap:', pageError)
      // Continue without pages if there's an error
    }

  } catch (error) {
    console.error('Error generating sitemap URLs:', error)
    
    // Fallback: return at least the basic static pages
    const fallbackPages = [
      { url: '/', priority: 1.0, changefreq: 'weekly', lastmod: new Date().toISOString() },
      { url: '/en/', priority: 1.0, changefreq: 'weekly', lastmod: new Date().toISOString() },
      { url: '/about', priority: 0.9, changefreq: 'monthly', lastmod: new Date().toISOString() },
      { url: '/en/about', priority: 0.9, changefreq: 'monthly', lastmod: new Date().toISOString() },
      { url: '/contact', priority: 0.8, changefreq: 'monthly', lastmod: new Date().toISOString() },
      { url: '/en/contact', priority: 0.8, changefreq: 'monthly', lastmod: new Date().toISOString() },
      { url: '/projects', priority: 0.8, changefreq: 'weekly', lastmod: new Date().toISOString() },
      { url: '/en/projects', priority: 0.8, changefreq: 'weekly', lastmod: new Date().toISOString() },
      { url: '/blog', priority: 0.7, changefreq: 'daily', lastmod: new Date().toISOString() },
      { url: '/en/blog', priority: 0.7, changefreq: 'daily', lastmod: new Date().toISOString() }
    ]
    
    return fallbackPages
  }

  return urls
})
