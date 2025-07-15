/**
 * Content Management Types and Schemas
 * 
 * This file defines the standardized frontmatter schema and TypeScript interfaces
 * for all content types in the application. These schemas ensure consistent
 * content structure across all pages and enable type-safe content queries.
 */

/**
 * Base meta information for SEO optimization
 */
export interface ContentMeta {
  /** Page title for SEO and social sharing */
  title: string
  /** Meta description for SEO */
  description: string
  /** Keywords for SEO (comma-separated string or array) */
  keywords: string | string[]
  /** Open Graph title */
  ogTitle?: string
  /** Open Graph description */
  ogDescription?: string
  /** Open Graph image URL */
  ogImage?: string
  /** Twitter card type */
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  /** Canonical URL for SEO */
  canonical?: string
  /** Additional meta tags */
  [key: string]: any
}

/**
 * Base frontmatter schema that all content types must implement
 */
export interface BaseFrontmatter {
  /** Content title */
  title: string
  /** Content description */
  description: string
  /** URL slug for routing */
  slug: string
  /** Content category */
  category: ContentCategory
  /** Tags for content organization */
  tags: string[]
  /** Whether content is published */
  published: boolean
  /** Content creation date */
  created: string
  /** Last update date */
  updated: string
  /** SEO and social sharing meta information */
  meta: ContentMeta
}

/**
 * Extended frontmatter for blog posts
 */
export interface BlogFrontmatter extends BaseFrontmatter {
  /** Author name */
  author: string
  /** Whether this is a featured post */
  featured?: boolean
  /** Estimated reading time in minutes */
  readTime?: number
  /** Related post slugs */
  related?: string[]
  /** Content series information */
  series?: {
    name: string
    order: number
  }
}

/**
 * Extended frontmatter for page content
 */
export interface PageFrontmatter extends BaseFrontmatter {
  /** Page priority for sitemap generation */
  priority?: number
  /** Page change frequency for sitemap */
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  /** Whether to show in navigation */
  showInNav?: boolean
  /** Navigation order */
  navOrder?: number
}

/**
 * Content categories
 */
export type ContentCategory = 'page' | 'blog' | 'docs' | 'news' | 'tutorial'

/**
 * Content language codes
 */
export type ContentLanguage = 'en' | 'ar'

/**
 * Parsed content from Nuxt Content
 */
export interface ParsedContent {
  /** Frontmatter data */
  frontmatter: BaseFrontmatter | BlogFrontmatter | PageFrontmatter
  /** Parsed markdown body */
  body: any
  /** File path */
  _path: string
  /** Content type */
  _type: string
  /** Content language */
  _lang: ContentLanguage
  /** Raw content */
  _source?: string
  /** Table of contents */
  toc?: any
}

/**
 * Content query parameters
 */
export interface ContentQueryParams {
  /** Language filter */
  language?: ContentLanguage
  /** Category filter */
  category?: ContentCategory
  /** Tag filter */
  tags?: string | string[]
  /** Publication status filter */
  published?: boolean
  /** Content limit */
  limit?: number
  /** Content offset for pagination */
  skip?: number
  /** Sort field */
  sortBy?: string
  /** Sort direction */
  sortOrder?: 'asc' | 'desc'
  /** Fields to select */
  only?: string[]
  /** Fields to exclude */
  without?: string[]
}

/**
 * Content navigation item
 */
export interface ContentNavItem {
  /** Navigation title */
  title: string
  /** Navigation URL */
  href: string
  /** Child navigation items */
  children?: ContentNavItem[]
  /** Whether item is active */
  active?: boolean
}

/**
 * Content search result
 */
export interface ContentSearchResult {
  /** Content title */
  title: string
  /** Content description */
  description: string
  /** Content URL */
  url: string
  /** Content category */
  category: ContentCategory
  /** Search score/relevance */
  score?: number
  /** Highlighted text excerpts */
  excerpts?: string[]
}

/**
 * Content validation schema
 */
export const ContentValidationSchema = {
  /** Required frontmatter fields */
  required: ['title', 'description', 'slug', 'category', 'published', 'created', 'updated', 'meta'],
  
  /** Field type validation */
  types: {
    title: 'string',
    description: 'string',
    slug: 'string',
    category: 'string',
    tags: 'array',
    published: 'boolean',
    created: 'string',
    updated: 'string',
    meta: 'object'
  },
  
  /** Valid category values */
  categories: ['page', 'blog', 'docs', 'news', 'tutorial'],
  
  /** Valid language codes */
  languages: ['en', 'ar'],
  
  /** Slug validation pattern */
  slugPattern: /^[a-z0-9-]+$/,
  
  /** Date format pattern */
  datePattern: /^\d{4}-\d{2}-\d{2}$/
}

/**
 * Default frontmatter values
 */
export const DefaultFrontmatter: Partial<BaseFrontmatter> = {
  published: false,
  tags: [],
  created: new Date().toISOString().split('T')[0],
  updated: new Date().toISOString().split('T')[0]
}

/**
 * Content naming conventions
 */
export const ContentNamingConventions = {
  /** File naming pattern */
  filePattern: /^[a-z0-9-]+\.md$/,
  
  /** Directory structure */
  structure: {
    pages: 'content/{lang}/',
    blog: 'content/{lang}/blog/',
    docs: 'content/{lang}/docs/'
  },
  
  /** Slug conventions */
  slug: {
    /** Use kebab-case */
    case: 'kebab',
    /** Maximum length */
    maxLength: 100,
    /** Allowed characters */
    allowedChars: 'a-z0-9-'
  }
}