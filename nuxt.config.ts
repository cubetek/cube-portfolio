// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path'
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-13', // Updated to current date for latest features
  devtools: { enabled: true },
  
  // SSR configuration - enable for static generation
  ssr: true,
  
  // App configuration for GitHub Pages
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    buildAssetsDir: '_nuxt/'
  },

  // Modules configuration
  modules: [
    '@nuxt/ui',
    '@nuxt/content',
    '@nuxtjs/mdc',
    '@nuxtjs/i18n',
    [
      '@nuxtjs/google-fonts',
      {
        families: {
          // English text font with proper weights and italics
          Inter: {
            wght: [300, 400, 500, 600, 700],
            ital: [300, 400, 500, 600, 700]
          },
          // Arabic text font with comprehensive weights for enhanced typography
          Tajawal: {
            wght: [200, 300, 400, 500, 600, 700, 800, 900]
          }
        },
        display: 'swap', // Optimal font loading for performance
        preload: true,   // Preload critical fonts
        prefetch: true,  // Prefetch for faster subsequent loads
        preconnect: true, // Early connection to Google Fonts
        useStylesheet: true, // Use stylesheet method for better caching
        download: false,  // Disable download to prevent errors
        inject: true     // Auto-inject CSS into pages
      }
    ],
    '@nuxt/image',
    '@nuxtjs/seo',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots'
  ],

  // TypeScript configuration - temporarily relaxed for development
  typescript: {
    typeCheck: false, // Disabled to allow development with type issues
    strict: false     // Disabled to avoid strict typing issues during development
  },

  // CSS framework integration
  css: [
    '~/assets/css/main.css'
  ],

  // Build configuration for optimal performance
  build: {
    // transpile: ['@nuxt/image']
  },

  // Vite optimization for code splitting and bundle optimization
  vite: {
    plugins: [
      tailwindcss(),
      // Bundle analyzer for development insights
      ...(process.env.ANALYZE === 'true' ? [
        (await import('rollup-plugin-visualizer')).visualizer({
          filename: '.nuxt/stats.html',
          open: true,
          gzipSize: true,
          brotliSize: true,
          template: 'treemap' // 'treemap', 'sunburst', 'network'
        })
      ] : [])
    ],
    build: {
      // Code splitting configuration
      rollupOptions: {
        output: {
          // Manual chunk splitting for better caching
          manualChunks: {
            // Utility chunks
            'utils': [
              './composables/useContent.ts',
              './composables/useLanguage.ts',
              './composables/useSEO.ts'
            ]
          },
          // File naming for better cache management
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
            if (facadeModuleId) {
              if (facadeModuleId.includes('node_modules')) {
                return 'vendor/[name]-[hash].js'
              }
              if (facadeModuleId.includes('pages')) {
                return 'pages/[name]-[hash].js'
              }
              if (facadeModuleId.includes('components')) {
                return 'components/[name]-[hash].js'
              }
            }
            return 'chunks/[name]-[hash].js'
          },
          // Asset naming
          assetFileNames: (assetInfo) => {
            if (!assetInfo.name) return 'assets/[name]-[hash][extname]'
            const info = assetInfo.name.split('.')
            const ext = info[info.length - 1]
            if (/\.(css)$/.test(assetInfo.name)) {
              return 'css/[name]-[hash][extname]'
            }
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
              return 'images/[name]-[hash][extname]'
            }
            return 'assets/[name]-[hash][extname]'
          }
        }
      },
      // Optimization settings
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Remove console logs in production
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.info', 'console.debug']
        }
      },
      // Chunk size warnings
      chunkSizeWarningLimit: 1000, // 1MB warning threshold
      // Source map configuration
      sourcemap: false // Disable source maps in production for performance
    }
  },

  // Nitro configuration for performance optimization
  nitro: {
    preset: process.env.NUXT_PRESET || 'node-server',
    compressPublicAssets: true,
    // Enable compression for all assets
    compression: {
      gzip: true,
      brotli: true
    },
    // Prerender configuration optimized for CI/CD
    prerender: {
      crawlLinks: true,
      failOnError: false,
      routes: ['/'],
      ignore: ['/admin/**', '/api/**']
    },
    // ISR (Incremental Static Regeneration) configuration
    routeRules: {
      // Homepage - prerender for static generation
      '/': { prerender: true },
      '/en': { prerender: true },
      
      // About pages - ISR with 1 hour revalidation
      '/about': { isr: 3600 },
      '/en/about': { isr: 3600 },
      
      // Contact pages - ISR with 6 hours revalidation
      '/contact': { isr: 21600 },
      '/en/contact': { isr: 21600 },
      
      // Blog index pages - ISR with 15 minutes revalidation
      '/blog': { isr: 900 },
      '/en/blog': { isr: 900 },
      
      // Individual blog posts - ISR with 1 hour revalidation
      '/blog/**': { isr: 3600 },
      '/en/blog/**': { isr: 3600 },
      
      // Static pages - cache for 1 day
      '/projects': { isr: 86400 },
      '/en/projects': { isr: 86400 },
      
      // API routes - no caching for dynamic content
      '/api/**': { 
        cors: true,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      },
      
      // Health check - no caching
      '/api/health': { 
        cors: true,
        headers: { 'Cache-Control': 'no-cache' }
      },
      
      // Static assets - aggressive caching
      '/_nuxt/**': { 
        headers: { 
          'Cache-Control': 'public, max-age=31536000, immutable' 
        } 
      },
      '/images/**': { 
        headers: { 
          'Cache-Control': 'public, max-age=31536000, immutable' 
        } 
      },
      '/favicon.ico': { 
        headers: { 
          'Cache-Control': 'public, max-age=86400' 
        } 
      },
      
      // Fonts - cache for 1 year
      '/fonts/**': { 
        headers: { 
          'Cache-Control': 'public, max-age=31536000, immutable' 
        } 
      }
    },
    // Performance optimizations
    minify: true,
    // Enable experimental features for better performance
    experimental: {
      wasm: false // Disable WASM for compatibility
    },
    // Storage configuration for ISR
    storage: {
      redis: {
        driver: 'redis',
        // Redis connection for production ISR caching
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        db: process.env.REDIS_DB || 0
      }
    }
  },

  // Performance optimizations and modern features
  experimental: {
    payloadExtraction: false, // Disabled for SSG/ISR compatibility
    viewTransition: false,    // Disabled to avoid SSR issues
    typedPages: false,        // Disabled to avoid build issues
    asyncContext: false,      // Disabled to avoid SSR issues
    appManifest: false,       // Disabled to avoid SSR issues
    componentIslands: false,  // Disabled to avoid SSR issues
    headNext: false,          // Disabled to avoid SSR issues
    // Enable performance optimizations
    inlineRouteRules: true,   // Inline route rules for better performance
    treeshakeClientOnly: true, // Remove client-only components on server
    emitRouteChunkError: 'automatic' // Handle chunk loading errors gracefully
  },

  // Runtime config with comprehensive environment management
  runtimeConfig: {
    // Private keys (only available on server-side)
    apiSecret: process.env.NUXT_API_SECRET || '',
    jwtSecret: process.env.JWT_SECRET || '',
    sessionSecret: process.env.SESSION_SECRET || '',
    databaseUrl: process.env.DATABASE_URL || '',
    
    // Email configuration
    smtpHost: process.env.SMTP_HOST || '',
    smtpPort: process.env.SMTP_PORT || '587',
    smtpUser: process.env.SMTP_USER || '',
    smtpPass: process.env.SMTP_PASS || '',
    smtpFrom: process.env.SMTP_FROM || '',
    
    // Third-party API keys (server-side)
    sendgridApiKey: process.env.SENDGRID_API_KEY || '',
    resendApiKey: process.env.RESEND_API_KEY || '',
    sentryAuthToken: process.env.SENTRY_AUTH_TOKEN || '',
    
    // Security configuration
    rateLimitMax: process.env.RATE_LIMIT_MAX || '100',
    rateLimitWindow: process.env.RATE_LIMIT_WINDOW || '900000',
    corsOrigin: process.env.CORS_ORIGIN || '',
    
    // Public keys (exposed to client-side)
    public: {
      // Core application
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || process.env.URL || process.env.VERCEL_URL || 'https://your-domain.com',
      siteName: process.env.NUXT_PUBLIC_SITE_NAME || process.env.SITE_NAME || 'Your Personal Website',
      siteDescription: process.env.NUXT_PUBLIC_SITE_DESCRIPTION || 'Personal portfolio and blog website',
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      
      // Environment detection
      environment: process.env.NUXT_ENV_ENVIRONMENT || process.env.NODE_ENV || 'development',
      
      // Platform detection
      isVercel: process.env.VERCEL === '1',
      isNetlify: process.env.NETLIFY === 'true',
      vercelEnv: process.env.VERCEL_ENV || '',
      netlifyContext: process.env.CONTEXT || '',
      
      // Feature flags
      featureBlog: process.env.NUXT_PUBLIC_FEATURE_BLOG === 'true',
      featureProjects: process.env.NUXT_PUBLIC_FEATURE_PROJECTS === 'true',
      featureContactForm: process.env.NUXT_PUBLIC_FEATURE_CONTACT_FORM === 'true',
      featureNewsletter: process.env.NUXT_PUBLIC_FEATURE_NEWSLETTER === 'true',
      featureComments: process.env.NUXT_PUBLIC_FEATURE_COMMENTS === 'true',
      featureSearch: process.env.NUXT_PUBLIC_FEATURE_SEARCH === 'true',
      featureAnalytics: process.env.NUXT_PUBLIC_FEATURE_ANALYTICS === 'true',
      featureErrorTracking: process.env.NUXT_PUBLIC_FEATURE_ERROR_TRACKING === 'true',
      
      // Social media
      githubUrl: process.env.NUXT_PUBLIC_GITHUB_URL || '',
      linkedinUrl: process.env.NUXT_PUBLIC_LINKEDIN_URL || '',
      twitterUrl: process.env.NUXT_PUBLIC_TWITTER_URL || '',
      instagramUrl: process.env.NUXT_PUBLIC_INSTAGRAM_URL || '',
      twitterHandle: process.env.NUXT_PUBLIC_TWITTER_HANDLE || '',
      
      // Analytics
      googleAnalyticsId: process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID || '',
      gtmId: process.env.NUXT_PUBLIC_GTM_ID || '',
      umamiWebsiteId: process.env.NUXT_PUBLIC_UMAMI_WEBSITE_ID || '',
      umamiUrl: process.env.NUXT_PUBLIC_UMAMI_URL || '',
      plausibleDomain: process.env.NUXT_PUBLIC_PLAUSIBLE_DOMAIN || '',
      plausibleApiHost: process.env.NUXT_PUBLIC_PLAUSIBLE_API_HOST || '',
      
      // Error tracking
      sentryDsn: process.env.NUXT_PUBLIC_SENTRY_DSN || '',
      logRocketAppId: process.env.NUXT_PUBLIC_LOGROCKET_APP_ID || '',
      
      // Comments
      giscusRepo: process.env.NUXT_PUBLIC_GISCUS_REPO || '',
      giscusRepoId: process.env.NUXT_PUBLIC_GISCUS_REPO_ID || '',
      giscusCategory: process.env.NUXT_PUBLIC_GISCUS_CATEGORY || '',
      giscusCategoryId: process.env.NUXT_PUBLIC_GISCUS_CATEGORY_ID || '',
      
      // CDN and performance
      cdnUrl: process.env.NUXT_PUBLIC_CDN_URL || '',
      imageDomains: process.env.NUXT_PUBLIC_IMAGE_DOMAINS || '',
      
      // Development features
      devtools: process.env.NUXT_DEVTOOLS_ENABLED === 'true',
      debug: process.env.DEBUG === 'true'
    }
  },

  // App configuration with performance optimizations
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        // Preconnect to critical domains for faster loading
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: 'anonymous'
        },
        // Preconnect to CDN if configured
        ...(process.env.NUXT_PUBLIC_CDN_URL ? [{
          rel: 'preconnect',
          href: process.env.NUXT_PUBLIC_CDN_URL,
          crossorigin: 'anonymous'
        }] : []),
        // Preconnect to analytics domains
        {
          rel: 'preconnect',
          href: 'https://www.googletagmanager.com'
        },
        {
          rel: 'preconnect', 
          href: 'https://www.google-analytics.com'
        },
        // DNS prefetch for social media domains
        {
          rel: 'dns-prefetch',
          href: 'https://github.com'
        },
        {
          rel: 'dns-prefetch',
          href: 'https://linkedin.com'
        },
        {
          rel: 'dns-prefetch',
          href: 'https://twitter.com'
        }
      ],
      // Performance optimization meta tags
      meta: [
        // Core Web Vitals optimization
        { name: 'theme-color', content: '#0f172a' },
        { name: 'msapplication-TileColor', content: '#0f172a' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        // Performance hints
        { 'http-equiv': 'x-dns-prefetch-control', content: 'on' },
        { name: 'format-detection', content: 'telephone=no' },
        // Security headers
        { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' },
        { 'http-equiv': 'X-Frame-Options', content: 'DENY' },
        { 'http-equiv': 'X-XSS-Protection', content: '1; mode=block' }
      ]
    }
  },

  // i18n configuration for multilingual support
  i18n: {
    vueI18n: './i18n.config.ts',
    locales: [
      {
        code: 'en',
        name: 'English',
        language: 'en-US', // Updated from 'iso' to 'language' for v9
        dir: 'ltr',
        file: 'en.json'
      },
      {
        code: 'ar',
        name: 'العربية',
        language: 'ar-SA', // Updated from 'iso' to 'language' for v9
        dir: 'rtl',
        file: 'ar.json'
      }
    ],
    langDir: 'locales/',
    defaultLocale: 'ar',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false, // Disabled - using custom middleware
    compilation: {
      strictMessage: false
    },
    // Disable new directory structure for easier migration
    restructureDir: false,
    bundle: {
      // Disable optimization to avoid warnings
      optimizeTranslationDirective: false
    },
    customRoutes: 'config',
    // Note: 'pages' configuration is no longer needed in v9
    // Dynamic route parameters should use useSetI18nParams() composable instead
  },


  // Content module configuration for v3
  content: {
    // Enable Studio integration
    preview: {
      api: 'https://api.nuxt.studio'
    },

    // Advanced markdown configuration  
    build: {
      markdown: {
        toc: {
          depth: 3,
          searchDepth: 3
        },
        // Enable component rendering within markdown
        // mdc: true, // Removed - not available in this content version
        // Anchor link configuration - removed as not available in this content version
        // anchorLinks: {
        //   depth: 4,
        //   exclude: [1]
        // },
        // Syntax highlighting with Shiki
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark'
          },
          langs: [
            'javascript',
            'typescript',
            'vue',
            'html',
            'css',
            'json',
            'markdown',
            'bash',
            'python',
            'go',
            'rust'
          ]
        }
      }
    },

    // Enable hot reload watcher in development
    watch: {
      enabled: true,
      port: 4000,
      showURL: false
    }
  },

  // UI module configuration
  ui: {
    // colorMode configuration should be in app.config.ts or global CSS
    theme: {
      colors: ['primary', 'secondary', 'accent', 'gray', 'red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'],
      transitions: true
    },
    prefix: 'U',
    fonts: true
  },

  // Image optimization configuration
  image: {
    // Image formats with modern format support
    formats: ['webp', 'avif', 'png', 'jpg', 'jpeg'],

    // Quality settings for different formats
    quality: 80,

    // Default image provider
    provider: 'ipx', // Default provider for local images

    // Responsive image breakpoints
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    },

    // Presets for common image sizes
    presets: {
      avatar: {
        modifiers: {
          format: 'webp',
          width: 50,
          height: 50,
          quality: 80
        }
      },
      card: {
        modifiers: {
          format: 'webp',
          width: 400,
          height: 300,
          quality: 80
        }
      },
      hero: {
        modifiers: {
          format: 'webp',
          width: 1200,
          height: 600,
          quality: 85
        }
      },
      thumbnail: {
        modifiers: {
          format: 'webp',
          width: 150,
          height: 150,
          quality: 75
        }
      }
    },

    // Image domains for external images
    domains: [
      'your-domain.com',
      'images.unsplash.com',
      'via.placeholder.com'
    ],

    // Alias for easier imports
    alias: {
      unsplash: 'https://images.unsplash.com'
    }
  },

  // SEO configuration
  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://your-domain.com',
    name: 'Your Personal Website',
    description: 'Personal portfolio and blog website',
    defaultLocale: 'ar'
  },

  // Robots configuration
  robots: {
    groups: [
      {
        userAgent: ['*'],
        allow: ['/'],
        disallow: [
          '/admin/',
          '/private/',
          '/api/private'
        ]
      }
    ],
    sitemap: [
      '/sitemap.xml'
    ]
  },

  // Sitemap configuration
  sitemap: {
    // Simple configuration compatible with current version
    exclude: [
      '/admin/**',
      '/private/**',
      '/api/**',
      '/_nuxt/**',
      '/font-test',
      '/rtl-test'
    ]
  },

  // Tailwind CSS configuration will be handled by @nuxt/ui
})
