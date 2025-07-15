// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'path'
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-13', // Updated to current date for latest features
  devtools: { enabled: true },

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
    transpile: ['@nuxt/image']
  },

  // Vite optimization for code splitting and bundle optimization
  vite: {
    plugins: [
      tailwindcss(),
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

  // Development settings
  nitro: {
    preset: 'node-server',
    compressPublicAssets: true
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

  // Runtime config
  runtimeConfig: {
    // Private keys (only available on server-side)
    apiSecret: process.env.NUXT_API_SECRET || '',
    // Public keys (exposed to client-side)
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://your-domain.com'
    }
  },

  // App configuration
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        // Preconnect to Google Fonts domains for faster loading
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com'
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: 'anonymous'
        }
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
          '/_nuxt/',
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
