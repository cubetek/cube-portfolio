// TypeScript interfaces for app configuration
import type { PersonalData } from '~/types/personal'

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
  personalData: PersonalData
}

export default defineAppConfig({
  metadata: {
    name: 'Personal Portfolio',
    version: '1.0.0',
    description: 'A multilingual personal website built with Nuxt 3 and Vue 3',
    author: 'i999dev',
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
  },

  // Personal data - centralized source of truth for all personal/professional information
  personalData: {
    profile: {
      name: {
        ar: "أحمد محمد",
        en: "Ahmed Mohammed"
      },
      title: {
        ar: "مطور ويب متكامل",
        en: "Full Stack Developer"
      },
      bio: {
        ar: "مطور ويب متكامل متخصص في تقنيات الويب الحديثة مع خبرة 5 سنوات في تطوير تطبيقات الويب باستخدام Vue.js و Nuxt.js و Node.js. أحب إنشاء تجارب مستخدم استثنائية وحلول تقنية مبتكرة.",
        en: "Full Stack Developer specializing in modern web technologies with 5 years of experience building web applications using Vue.js, Nuxt.js, and Node.js. I love creating exceptional user experiences and innovative technical solutions."
      },
      location: {
        ar: "الرياض، المملكة العربية السعودية",
        en: "Riyadh, Saudi Arabia"
      },
      avatar: "/images/avatar.jpg",
      // resume: {
      //   ar: "/files/resume-ar.pdf",
      //   en: "/files/resume-en.pdf"
      // },
      yearsOfExperience: 5,
      tagline: {
        ar: "بناء المستقبل بالكود",
        en: "Building the future with code"
      },
      availability: {
        ar: "متاح للعمل الحر والمشاريع",
        en: "Available for freelance and projects"
      }
    },

    skills: [
      {
        name: {
          ar: "تطوير الواجهات الأمامية",
          en: "Frontend Development"
        },
        icon: "heroicons:code-bracket-20-solid",
        skills: [
          {
            name: "Vue.js",
            level: "expert",
            years: 4,
            description: {
              ar: "إطار عمل JavaScript متقدم لبناء واجهات المستخدم التفاعلية",
              en: "Progressive JavaScript framework for building interactive user interfaces"
            },
            featured: true
          },
          {
            name: "Nuxt.js",
            level: "expert",
            years: 3,
            description: {
              ar: "إطار عمل Vue.js للتطبيقات الشاملة مع دعم SSR و SSG",
              en: "Vue.js framework for universal applications with SSR and SSG support"
            },
            featured: true
          },
          {
            name: "TypeScript",
            level: "advanced",
            years: 3,
            description: {
              ar: "JavaScript مع أنواع البيانات الثابتة لتطوير أكثر أماناً",
              en: "JavaScript with static typing for safer development"
            },
            featured: true
          },
          {
            name: "Tailwind CSS",
            level: "advanced",
            years: 2,
            description: {
              ar: "إطار عمل CSS مرن لتصميم واجهات سريعة ومتجاوبة",
              en: "Utility-first CSS framework for rapid responsive design"
            }
          }
        ]
      },
      {
        name: {
          ar: "تطوير الخادم",
          en: "Backend Development"
        },
        icon: "heroicons:server-20-solid",
        skills: [
          {
            name: "Node.js",
            level: "advanced",
            years: 4,
            description: {
              ar: "بيئة تشغيل JavaScript للخادم لبناء تطبيقات قابلة للتوسع",
              en: "JavaScript runtime for server-side scalable applications"
            },
            featured: true
          },
          {
            name: "Express.js",
            level: "advanced",
            years: 3,
            description: {
              ar: "إطار عمل ويب سريع ومرن لـ Node.js",
              en: "Fast and flexible web framework for Node.js"
            }
          },
          {
            name: "MongoDB",
            level: "intermediate",
            years: 2,
            description: {
              ar: "قاعدة بيانات NoSQL مرنة وقابلة للتوسع",
              en: "Flexible and scalable NoSQL database"
            }
          }
        ]
      },
      {
        name: {
          ar: "أدوات التطوير",
          en: "Development Tools"
        },
        icon: "heroicons:wrench-screwdriver-20-solid",
        skills: [
          {
            name: "Git",
            level: "advanced",
            years: 5,
            description: {
              ar: "نظام إدارة الإصدارات الموزع",
              en: "Distributed version control system"
            }
          },
          {
            name: "Docker",
            level: "intermediate",
            years: 2,
            description: {
              ar: "منصة الحاويات لتطوير ونشر التطبيقات",
              en: "Containerization platform for application development and deployment"
            }
          },
          {
            name: "AWS",
            level: "intermediate",
            years: 2,
            description: {
              ar: "خدمات الحوسبة السحابية من أمازون",
              en: "Amazon Web Services cloud computing platform"
            }
          }
        ]
      }
    ],

    experience: [
      {
        company: {
          ar: "شركة التقنية المتقدمة",
          en: "Advanced Tech Solutions"
        },
        position: {
          ar: "مطور ويب أول",
          en: "Senior Web Developer"
        },
        description: {
          ar: "قيادة فريق تطوير لإنشاء تطبيقات ويب متقدمة باستخدام Vue.js و Nuxt.js. تطوير وصيانة أكثر من 10 مشاريع ويب مع التركيز على الأداء وتجربة المستخدم.",
          en: "Leading development team to create advanced web applications using Vue.js and Nuxt.js. Developing and maintaining 10+ web projects with focus on performance and user experience."
        },
        startDate: "2022-01",
        endDate: null,
        location: {
          ar: "الرياض، السعودية",
          en: "Riyadh, Saudi Arabia"
        },
        technologies: ["Vue.js", "Nuxt.js", "TypeScript", "Node.js", "MongoDB", "AWS"],
        achievements: [
          {
            ar: "تحسين أداء التطبيقات بنسبة 40% من خلال تحسين الكود وتقنيات التخزين المؤقت",
            en: "Improved application performance by 40% through code optimization and caching techniques"
          },
          {
            ar: "قيادة فريق من 4 مطورين وتوجيههم في أفضل الممارسات",
            en: "Led and mentored a team of 4 developers in best practices"
          },
          {
            ar: "تطوير نظام إدارة محتوى متعدد اللغات يدعم العربية والإنجليزية",
            en: "Developed multilingual CMS supporting Arabic and English"
          }
        ],
        companyUrl: "https://advancedtech.com",
        type: "full-time",
        featured: true
      },
      {
        company: {
          ar: "استوديو الويب الإبداعي",
          en: "Creative Web Studio"
        },
        position: {
          ar: "مطور ويب",
          en: "Web Developer"
        },
        description: {
          ar: "تطوير مواقع ويب متجاوبة وتطبيقات ويب تفاعلية للعملاء في مختلف القطاعات. العمل مع فرق التصميم لتحويل التصاميم إلى كود فعال.",
          en: "Developing responsive websites and interactive web applications for clients across various industries. Collaborating with design teams to transform designs into functional code."
        },
        startDate: "2020-06",
        endDate: "2021-12",
        location: {
          ar: "جدة، السعودية",
          en: "Jeddah, Saudi Arabia"
        },
        technologies: ["JavaScript", "Vue.js", "PHP", "MySQL", "Bootstrap"],
        achievements: [
          {
            ar: "تطوير أكثر من 15 موقع ويب للعملاء مع معدل رضا 95%",
            en: "Delivered 15+ client websites with 95% satisfaction rate"
          },
          {
            ar: "تقليل وقت التحميل للمواقع بنسبة 60% من خلال تحسين الصور والكود",
            en: "Reduced website loading time by 60% through image and code optimization"
          }
        ],
        type: "full-time"
      }
    ],

    projects: [
      {
        name: {
          ar: "موقع شخصي متعدد اللغات",
          en: "Multilingual Personal Website"
        },
        description: {
          ar: "موقع شخصي متطور بدعم كامل للغة العربية والإنجليزية مع نظام إدارة محتوى",
          en: "Advanced personal website with full Arabic and English support and content management system"
        },
        longDescription: {
          ar: "موقع شخصي متكامل مبني باستخدام Nuxt.js مع دعم كامل للغة العربية (RTL) والإنجليزية (LTR). يتضمن نظام إدارة محتوى، مدونة، معرض أعمال، ونظام اتصال. تم تحسينه للأداء وتحسين محركات البحث مع دعم الوضع المظلم والفاتح.",
          en: "Comprehensive personal website built with Nuxt.js featuring full Arabic (RTL) and English (LTR) support. Includes content management system, blog, portfolio showcase, and contact system. Optimized for performance and SEO with dark/light mode support."
        },
        technologies: ["Nuxt.js", "Vue.js", "Tailwind CSS", "TypeScript", "Nuxt Content"],
        url: "https://yourwebsite.com",
        github: "https://github.com/yourusername/personal-website",
        image: "/images/projects/personal-website.jpg",
        featured: true,
        status: "completed",
        startDate: "2024-01",
        endDate: "2024-03",
        highlights: [
          {
            ar: "دعم كامل للغة العربية مع تخطيط RTL",
            en: "Full Arabic language support with RTL layout"
          },
          {
            ar: "نظام إدارة محتوى مبني على Markdown",
            en: "Markdown-based content management system"
          },
          {
            ar: "تحسين للأداء مع نتيجة Lighthouse 95+",
            en: "Performance optimized with Lighthouse score 95+"
          }
        ]
      },
      {
        name: {
          ar: "منصة التجارة الإلكترونية",
          en: "E-commerce Platform"
        },
        description: {
          ar: "منصة تجارة إلكترونية شاملة مع لوحة تحكم إدارية",
          en: "Comprehensive e-commerce platform with admin dashboard"
        },
        technologies: ["Vue.js", "Node.js", "Express.js", "MongoDB", "Stripe"],
        github: "https://github.com/yourusername/ecommerce-platform",
        image: "/images/projects/ecommerce.jpg",
        featured: true,
        status: "completed",
        startDate: "2023-06",
        endDate: "2023-12",
        client: {
          ar: "متجر الإلكترونيات الذكية",
          en: "Smart Electronics Store"
        },
        highlights: [
          {
            ar: "نظام دفع آمن متكامل مع Stripe",
            en: "Secure payment system integrated with Stripe"
          },
          {
            ar: "لوحة تحكم شاملة لإدارة المنتجات والطلبات",
            en: "Comprehensive admin dashboard for product and order management"
          }
        ]
      },
      {
        name: {
          ar: "تطبيق إدارة المهام",
          en: "Task Management App"
        },
        description: {
          ar: "تطبيق ويب لإدارة المهام والمشاريع مع ميزات التعاون",
          en: "Web application for task and project management with collaboration features"
        },
        technologies: ["Nuxt.js", "Supabase", "Tailwind CSS", "TypeScript"],
        url: "https://taskapp.example.com",
        github: "https://github.com/yourusername/task-manager",
        image: "/images/projects/task-manager.jpg",
        featured: false,
        status: "in-progress",
        startDate: "2024-02",
        highlights: [
          {
            ar: "واجهة مستخدم بديهية مع السحب والإفلات",
            en: "Intuitive drag-and-drop user interface"
          },
          {
            ar: "تعاون في الوقت الفعلي بين أعضاء الفريق",
            en: "Real-time collaboration between team members"
          }
        ]
      }
    ],

    education: [
      {
        institution: {
          ar: "جامعة الملك سعود",
          en: "King Saud University"
        },
        degree: {
          ar: "بكالوريوس",
          en: "Bachelor's Degree"
        },
        field: {
          ar: "علوم الحاسب",
          en: "Computer Science"
        },
        startDate: "2015-09",
        endDate: "2019-06",
        location: {
          ar: "الرياض، السعودية",
          en: "Riyadh, Saudi Arabia"
        },
        gpa: "3.8/4.0",
        achievements: [
          {
            ar: "تخرج بمرتبة الشرف",
            en: "Graduated with Honors"
          },
          {
            ar: "عضو في نادي البرمجة الجامعي",
            en: "Member of University Programming Club"
          }
        ],
        coursework: ["Data Structures", "Algorithms", "Database Systems", "Software Engineering", "Web Development"],
        featured: true
      }
    ],

    contact: {
      email: "ahmed.mohammed@example.com",
      phone: "+966501234567",
      location: {
        ar: "الرياض، المملكة العربية السعودية",
        en: "Riyadh, Saudi Arabia"
      },
      availability: {
        ar: "متاح للعمل الحر والمشاريع - وقت الاستجابة خلال 24 ساعة",
        en: "Available for freelance and projects - Response time within 24 hours"
      },
      preferredContact: "email",
      timezone: "Asia/Riyadh",
      languages: [
        {
          ar: "العربية (اللغة الأم)",
          en: "Arabic (Native)"
        },
        {
          ar: "الإنجليزية (متقدم)",
          en: "English (Advanced)"
        }
      ],
      responseTime: {
        ar: "خلال 24 ساعة",
        en: "Within 24 hours"
      }
    },

    social: [
      {
        platform: "GitHub",
        url: "https://github.com/yourusername",
        username: "yourusername",
        icon: "simple-icons:github",
        primary: true,
        displayName: "GitHub Profile"
      },
      {
        platform: "LinkedIn",
        url: "https://linkedin.com/in/yourusername",
        username: "yourusername",
        icon: "simple-icons:linkedin",
        primary: true,
        displayName: "LinkedIn Profile"
      },
      {
        platform: "Twitter",
        url: "https://twitter.com/yourusername",
        username: "@yourusername",
        icon: "simple-icons:twitter",
        primary: false,
        displayName: "Twitter Profile"
      },
      {
        platform: "Email",
        url: "mailto:ahmed.mohammed@example.com",
        username: "ahmed.mohammed@example.com",
        icon: "heroicons:envelope-20-solid",
        primary: true,
        displayName: "Email Contact"
      }
    ]
  }
})