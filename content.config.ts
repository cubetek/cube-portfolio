import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    // Blog collection for both languages
    blog: defineCollection({
      type: 'page',
      source: '*/blog/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        slug: z.string(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        published: z.boolean().default(true),
        date: z.string().or(z.date()),
        created: z.string().or(z.date()).optional(),
        updated: z.string().or(z.date()).optional(),
        author: z.string().optional(),
        featured: z.boolean().default(false),
        priority: z.number().optional(),
        readTime: z.number().optional(),
        image: z.string().optional(),
        imageAlt: z.string().optional(),
        series: z.string().optional(),
        seriesOrder: z.number().optional(),
        difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
        status: z.enum(['draft', 'published', 'archived']).default('published'),
        excerpt: z.string().optional(),
        related: z.array(z.string()).optional(),
        meta: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          keywords: z.string().optional(),
          ogTitle: z.string().optional(),
          ogDescription: z.string().optional(),
          ogImage: z.string().optional(),
          twitterCard: z.enum(['summary', 'summary_large_image']).default('summary_large_image'),
          canonical: z.string().optional()
        }).optional(),
        seo: z.object({
          noindex: z.boolean().default(false),
          nofollow: z.boolean().default(false),
          structured: z.boolean().default(true)
        }).optional(),
        analytics: z.object({
          views: z.number().default(0),
          likes: z.number().default(0),
          shares: z.number().default(0)
        }).optional()
      })
    }),

    // Pages collection for static content like about, contact, etc.
    pages: defineCollection({
      type: 'page',
      source: {
        include: '**/*.md',
        exclude: ['blog/**/*.md']
      },
      schema: z.object({
        title: z.string(),
        description: z.string(),
        layout: z.string().optional(),
        navigation: z.boolean().default(true),
        meta: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          keywords: z.string().optional(),
          ogTitle: z.string().optional(),
          ogDescription: z.string().optional(),
          ogImage: z.string().optional()
        }).optional()
      })
    })
  }
})
