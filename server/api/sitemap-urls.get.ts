/**
 * Dynamic sitemap URL generation
 * Handles content-based URLs for sitemap generation
 */

import { readdir, readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const urls: any[] = []

  try {
    // Read content files directly from the filesystem
    const contentDir = join(process.cwd(), 'content')
    
    // Function to recursively read content files
    async function readContentFiles(dir: string, prefix = ''): Promise<any[]> {
      const files: any[] = []
      
      try {
        const entries = await readdir(dir, { withFileTypes: true })
        
        for (const entry of entries) {
          const fullPath = join(dir, entry.name)
          const relativePath = join(prefix, entry.name)
          
          if (entry.isDirectory()) {
            // Recursively read subdirectories
            const subFiles = await readContentFiles(fullPath, relativePath)
            files.push(...subFiles)
          } else if (entry.name.endsWith('.md')) {
            // Read markdown file
            try {
              const content = await readFile(fullPath, 'utf-8')
              const pathWithoutExt = relativePath.replace('.md', '')
              
              // Parse frontmatter if exists (basic implementation)
              let priority = 0.6
              let updatedAt = null
              
              const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/)
              if (frontmatterMatch && frontmatterMatch[1]) {
                const frontmatter = frontmatterMatch[1]
                const priorityMatch = frontmatter.match(/priority:\s*([0-9.]+)/)
                const updatedMatch = frontmatter.match(/updatedAt:\s*(.+)/)
                
                if (priorityMatch && priorityMatch[1]) priority = parseFloat(priorityMatch[1])
                if (updatedMatch && updatedMatch[1]) updatedAt = updatedMatch[1].trim()
              }
              
              files.push({
                _path: '/' + pathWithoutExt.replace(/\\/g, '/'),
                priority,
                updatedAt,
                createdAt: updatedAt
              })
            } catch (fileError) {
              console.warn(`Could not read file: ${fullPath}`, fileError)
            }
          }
        }
      } catch (dirError) {
        console.warn(`Could not read directory: ${dir}`, dirError)
      }
      
      return files
    }
    
    // Read all content files
    const contentFiles = await readContentFiles(contentDir)
    
    // Process each content file
    for (const content of contentFiles) {
      if (content._path) {
        // Determine language from path
        const isArabic = content._path.startsWith('/ar/')
        const isEnglish = content._path.startsWith('/en/')
        
        if (isArabic || isEnglish) {
          // Clean the path
          let path = content._path
          if (isArabic) {
            path = path.replace('/ar', '')
          } else if (isEnglish) {
            path = path.replace('/en', '/en')
          }

          // Skip index files as they're handled by pages
          if (path.endsWith('/index') || path === '/index') {
            continue
          }

          urls.push({
            url: path,
            changefreq: 'monthly',
            priority: content.priority || 0.6,
            lastmod: content.updatedAt || content.createdAt || new Date().toISOString(),
            // Add language alternates
            alternateUrls: isArabic ? [
              { href: path, hreflang: 'ar-SA' },
              { href: `/en${path}`, hreflang: 'en-US' }
            ] : [
              { href: path.replace('/en', ''), hreflang: 'ar-SA' },
              { href: path, hreflang: 'en-US' }
            ]
          })
        }
      }
    }

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
