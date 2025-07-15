// TypeScript interfaces for app configuration
export interface AppMetadata {
  name: string
  version: string
  description: string
  author: string
  keywords: string[]
  repository?: string
  homepage?: string
}

export interface FeatureFlags {
  themeSystem: boolean
  i18n: boolean
  analytics: boolean
  pwa: boolean
  performance: {
    lazyLoading: boolean
    imageOptimization: boolean
    caching: boolean
  }
  accessibility: {
    screenReader: boolean
    keyboardNav: boolean
    highContrast: boolean
    reducedMotion: boolean
  }
  development: {
    debugMode: boolean
    hotReload: boolean
    sourceMap: boolean
  }
}

export interface UIConfiguration {
  primary: string
  gray: string
  icons: Record<string, string>
  components: {
    defaultVariant: string
    size: 'sm' | 'md' | 'lg'
    rounded: boolean
  }
}

export interface ThemeConfiguration {
  default: string
  themes: string[]
  rtl: {
    enabled: boolean
    defaultDirection: 'ltr' | 'rtl'
    languages: Record<string, 'ltr' | 'rtl'>
  }
  fonts: {
    en: string
    ar: string
    mono: string
  }
  animations: {
    duration: number
    easing: string
    disabled: boolean
  }
  accessibility: {
    reducedMotion: boolean
    highContrast: boolean
    focusVisible: boolean
  }
}

export interface ContentConfiguration {
  supportedLanguages: string[]
  defaultLanguage: string
  contentPath: string
  blogPath: string
  projectsPath: string
  fallbackContent: boolean
}

export interface SEOConfiguration {
  siteName: string
  siteUrl: string
  defaultTitle: string
  titleTemplate: string
  description: string
  keywords: string[]
  ogImage: string
  twitterCard: 'summary' | 'summary_large_image'
  structuredData: {
    enabled: boolean
    type: 'Person' | 'Organization' | 'Website'
  }
}

export interface PerformanceConfiguration {
  lazyLoading: boolean
  imageOptimization: boolean
  caching: {
    enabled: boolean
    maxAge: number
    staleWhileRevalidate: boolean
  }
  bundleAnalysis: boolean
  criticalCSS: boolean
}

export interface EnvironmentConfiguration {
  apiUrl: string
  debugMode: boolean
  enableAnalytics: boolean
  enableErrorReporting: boolean
  logLevel: 'error' | 'warn' | 'info' | 'debug'
}

export interface ThirdPartyConfiguration {
  analytics: {
    google: {
      enabled: boolean
      trackingId?: string
    }
    plausible: {
      enabled: boolean
      domain?: string
    }
  }
  socialMedia: {
    twitter?: string
    github?: string
    linkedin?: string
    email?: string
  }
  cdn: {
    images?: string
    fonts?: string
  }
}

export interface AppConfiguration {
  metadata: AppMetadata
  features: FeatureFlags
  ui: UIConfiguration
  theme: ThemeConfiguration
  content: ContentConfiguration
  seo: SEOConfiguration
  performance: PerformanceConfiguration
  environment: EnvironmentConfiguration
  thirdParty: ThirdPartyConfiguration
}

export default defineAppConfig({
  metadata: {
    name: 'Personal Portfolio',
    version: '1.0.0',
    description: 'A multilingual personal website built with Nuxt 3 and Vue 3',
    author: 'Your Name',
    keywords: ['portfolio', 'nuxt', 'vue', 'typescript', 'i18n', 'rtl'],
    repository: 'https://github.com/yourusername/personal-website',
    homepage: 'https://yourwebsite.com'
  },

  features: {
    themeSystem: true,
    i18n: true,
    analytics: true,
    pwa: false,
    performance: {
      lazyLoading: true,
      imageOptimization: true,
      caching: true
    },
    accessibility: {
      screenReader: true,
      keyboardNav: true,
      highContrast: true,
      reducedMotion: true
    },
    development: {
      debugMode: true,
      hotReload: true,
      sourceMap: true
    }
  },

  ui: {
    // Primary color configuration - matches existing theme
    primary: 'blue',
    gray: 'slate',

    // Icon configuration using Heroicons
    icons: {
      loading: 'heroicons:arrow-path-20-solid',
      search: 'heroicons:magnifying-glass-20-solid',
      external: 'heroicons:arrow-top-right-on-square-20-solid',
      chevronDown: 'heroicons:chevron-down-20-solid',
      check: 'heroicons:check-20-solid',
      close: 'heroicons:x-mark-20-solid',
      chevronLeft: 'heroicons:chevron-left-20-solid',
      chevronRight: 'heroicons:chevron-right-20-solid'
    },

    components: {
      defaultVariant: 'default',
      size: 'md',
      rounded: true
    }
  },

  // App-specific configuration that works with the existing theme system
  theme: {
    // Default theme (maps to CSS theme classes)
    default: 'light',
    
    // Available themes matching CSS classes
    themes: [
      'light',
      'dark', 
      'modern',
      'minimal',
      'ocean',
      'forest',
      'matrix',
      'cyberpunk',
      'neon',
      'retro'
    ],

    // RTL support configuration
    rtl: {
      enabled: true,
      defaultDirection: 'ltr',
      languages: {
        ar: 'rtl',
        en: 'ltr'
      }
    },

    // Typography configuration
    fonts: {
      en: 'Inter, system-ui, sans-serif',
      ar: 'Tajawal, "Noto Sans Arabic", system-ui, sans-serif',
      mono: '"Fira Code", "Courier New", monospace'
    },

    // Animation preferences
    animations: {
      duration: 200,
      easing: 'ease-out',
      disabled: false
    },

    // Accessibility features
    accessibility: {
      reducedMotion: false,
      highContrast: false,
      focusVisible: true
    }
  },

  content: {
    supportedLanguages: ['en', 'ar'],
    defaultLanguage: 'ar',
    contentPath: '/content',
    blogPath: '/blog',
    projectsPath: '/projects',
    fallbackContent: true
  },

  seo: {
    siteName: 'Personal Portfolio',
    siteUrl: 'https://yourwebsite.com',
    defaultTitle: 'Personal Portfolio - Full Stack Developer',
    titleTemplate: '%s | Personal Portfolio',
    description: 'A multilingual personal portfolio showcasing full-stack development skills with modern web technologies',
    keywords: ['developer', 'portfolio', 'nuxt', 'vue', 'typescript', 'full-stack'],
    ogImage: '/og-image.jpg',
    twitterCard: 'summary_large_image',
    structuredData: {
      enabled: true,
      type: 'Person'
    }
  },

  performance: {
    lazyLoading: true,
    imageOptimization: true,
    caching: {
      enabled: true,
      maxAge: 3600,
      staleWhileRevalidate: true
    },
    bundleAnalysis: false,
    criticalCSS: true
  },

  environment: {
    apiUrl: '/api',
    debugMode: true,
    enableAnalytics: false,
    enableErrorReporting: false,
    logLevel: 'debug'
  },

  thirdParty: {
    analytics: {
      google: {
        enabled: false,
        trackingId: undefined
      },
      plausible: {
        enabled: false,
        domain: undefined
      }
    },
    socialMedia: {
      twitter: undefined,
      github: undefined,
      linkedin: undefined,
      email: undefined
    },
    cdn: {
      images: undefined,
      fonts: undefined
    }
  }
})