/**
 * Mock Factories for Common Testing Scenarios
 * 
 * This module provides factory functions to create mock data and objects
 * for common testing scenarios including:
 * - Personal data structures
 * - Nuxt/Vue ecosystem mocks
 * - API responses
 * - Content data
 * - Theme configurations
 */

import { vi, type Mock } from 'vitest'
import { ref, reactive, computed } from 'vue'
import type { 
  PersonalData, 
  Profile, 
  Skill, 
  SkillCategory, 
  Experience, 
  Project, 
  Education, 
  Contact, 
  SocialMedia 
} from '~/types/personal'

// Types for mock factories
export interface MockOptions {
  locale?: string
  overrides?: Record<string, any>
  count?: number
}

export interface MockApiResponse<T = any> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
}

export interface MockNuxtContext {
  $config: any
  $route: any
  $router: any
  $i18n: any
  $content: any
}

/**
 * Personal Data Mock Factories
 */

/**
 * Create mock profile data
 */
export function createMockProfile(options: MockOptions = {}): Profile {
  const { locale = 'en', overrides = {} } = options
  
  const baseProfile: Profile = {
    name: locale === 'ar' ? 'أحمد محمد علي' : 'Ahmed Mohammed Ali',
    title: locale === 'ar' ? 'مطور ويب متقدم' : 'Senior Web Developer',
    bio: locale === 'ar' 
      ? 'مطور ويب متخصص في بناء التطبيقات الحديثة باستخدام Vue.js و Nuxt.js'
      : 'Specialized web developer building modern applications with Vue.js and Nuxt.js',
    location: locale === 'ar' ? 'الرياض، السعودية' : 'Riyadh, Saudi Arabia',
    avatar: '/images/profile.jpg',
    resume: locale === 'ar' ? '/resume-ar.pdf' : '/resume-en.pdf',
    yearsOfExperience: 5,
    tagline: locale === 'ar' ? 'بناء المستقبل الرقمي' : 'Building the digital future',
    availability: locale === 'ar' ? 'متاح للعمل' : 'Available for work'
  }
  
  return { ...baseProfile, ...overrides }
}

/**
 * Create mock skill data
 */
export function createMockSkill(options: MockOptions = {}): Skill {
  const { locale = 'en', overrides = {} } = options
  
  const baseSkill: Skill = {
    name: 'Vue.js',
    level: 'expert',
    years: 3,
    description: locale === 'ar' 
      ? 'إطار عمل JavaScript متقدم لبناء واجهات المستخدم'
      : 'Progressive JavaScript framework for building user interfaces',
    featured: true
  }
  
  return { ...baseSkill, ...overrides }
}

/**
 * Create mock skill category
 */
export function createMockSkillCategory(options: MockOptions = {}): SkillCategory {
  const { locale = 'en', overrides = {}, count = 3 } = options
  
  const baseCategory: SkillCategory = {
    name: locale === 'ar' ? 'تطوير الواجهات الأمامية' : 'Frontend Development',
    icon: 'i-heroicons-code-bracket',
    skills: Array.from({ length: count }, (_, i) => createMockSkill({
      locale,
      overrides: { name: `Skill ${i + 1}` }
    }))
  }
  
  return { ...baseCategory, ...overrides }
}

/**
 * Create mock experience data
 */
export function createMockExperience(options: MockOptions = {}): Experience {
  const { locale = 'en', overrides = {} } = options
  
  const baseExperience: Experience = {
    company: locale === 'ar' ? 'شركة التقنية المتقدمة' : 'Advanced Tech Solutions',
    position: locale === 'ar' ? 'مطور أول' : 'Senior Developer',
    description: locale === 'ar'
      ? 'تطوير وصيانة تطبيقات الويب المعقدة باستخدام أحدث التقنيات'
      : 'Developing and maintaining complex web applications using cutting-edge technologies',
    startDate: '2022-01',
    endDate: null,
    location: locale === 'ar' ? 'الرياض، السعودية' : 'Riyadh, Saudi Arabia',
    technologies: ['Vue.js', 'Nuxt.js', 'TypeScript', 'Node.js'],
    achievements: [
      locale === 'ar' ? 'تحسين أداء التطبيق بنسبة 40%' : 'Improved application performance by 40%',
      locale === 'ar' ? 'قيادة فريق من 5 مطورين' : 'Led a team of 5 developers',
      locale === 'ar' ? 'تطوير 15 ميزة جديدة' : 'Developed 15 new features'
    ],
    featured: true
  }
  
  return { ...baseExperience, ...overrides }
}

/**
 * Create mock project data
 */
export function createMockProject(options: MockOptions = {}): Project {
  const { locale = 'en', overrides = {} } = options
  
  const baseProject: Project = {
    name: locale === 'ar' ? 'منصة التجارة الإلكترونية' : 'E-commerce Platform',
    description: locale === 'ar'
      ? 'منصة تجارة إلكترونية شاملة مع دعم متعدد اللغات والعملات'
      : 'Comprehensive e-commerce platform with multi-language and currency support',
    technologies: ['Nuxt.js', 'Vue.js', 'TypeScript', 'Tailwind CSS', 'Prisma'],
    url: 'https://demo-ecommerce.example.com',
    github: 'https://github.com/username/ecommerce-platform',
    featured: true,
    status: 'completed',
    startDate: '2024-01',
    endDate: '2024-06',
    image: '/images/projects/ecommerce.jpg'
  }
  
  return { ...baseProject, ...overrides }
}

/**
 * Create mock education data
 */
export function createMockEducation(options: MockOptions = {}): Education {
  const { locale = 'en', overrides = {} } = options
  
  const baseEducation: Education = {
    institution: locale === 'ar' ? 'جامعة الملك سعود' : 'King Saud University',
    degree: locale === 'ar' ? 'بكالوريوس' : 'Bachelor of Science',
    field: locale === 'ar' ? 'علوم الحاسب الآلي' : 'Computer Science',
    startDate: '2015-09',
    endDate: '2019-06',
    location: locale === 'ar' ? 'الرياض، السعودية' : 'Riyadh, Saudi Arabia',
    gpa: '3.8/4.0',
    featured: true
  }
  
  return { ...baseEducation, ...overrides }
}

/**
 * Create mock contact data
 */
export function createMockContact(options: MockOptions = {}): Contact {
  const { locale = 'en', overrides = {} } = options
  
  const baseContact: Contact = {
    email: 'ahmed@example.com',
    phone: '+966501234567',
    location: locale === 'ar' ? 'الرياض، السعودية' : 'Riyadh, Saudi Arabia',
    availability: locale === 'ar' ? 'متاح للعمل' : 'Available for work',
    preferredContact: 'email',
    languages: [
      locale === 'ar' ? 'العربية (أصلي)' : 'Arabic (Native)',
      locale === 'ar' ? 'الإنجليزية (متقدم)' : 'English (Advanced)'
    ]
  }
  
  return { ...baseContact, ...overrides }
}

/**
 * Create mock social media data
 */
export function createMockSocialMedia(options: MockOptions = {}): SocialMedia {
  const { overrides = {} } = options
  
  const baseSocial: SocialMedia = {
    platform: 'GitHub',
    url: 'https://github.com/ahmed-dev',
    username: 'ahmed-dev',
    icon: 'i-simple-icons-github',
    primary: true
  }
  
  return { ...baseSocial, ...overrides }
}

/**
 * Create complete mock personal data
 */
export function createMockPersonalData(options: MockOptions = {}): PersonalData {
  const { locale = 'en', overrides = {} } = options
  
  const baseData: PersonalData = {
    profile: createMockProfile({ locale }),
    skills: [
      createMockSkillCategory({ locale, overrides: { name: locale === 'ar' ? 'تطوير الواجهات' : 'Frontend' } }),
      createMockSkillCategory({ locale, overrides: { name: locale === 'ar' ? 'تطوير الخادم' : 'Backend' } })
    ],
    experience: [
      createMockExperience({ locale }),
      createMockExperience({ 
        locale, 
        overrides: { 
          company: locale === 'ar' ? 'الشركة الناشئة' : 'Startup Inc',
          endDate: '2021-12',
          featured: false 
        } 
      })
    ],
    projects: [
      createMockProject({ locale }),
      createMockProject({ 
        locale, 
        overrides: { 
          name: locale === 'ar' ? 'موقع شخصي' : 'Personal Website',
          featured: false 
        } 
      })
    ],
    education: [
      createMockEducation({ locale })
    ],
    contact: createMockContact({ locale }),
    social: [
      createMockSocialMedia({ overrides: { platform: 'GitHub' } }),
      createMockSocialMedia({ overrides: { platform: 'LinkedIn', icon: 'i-simple-icons-linkedin' } }),
      createMockSocialMedia({ overrides: { platform: 'Twitter', icon: 'i-simple-icons-twitter', primary: false } })
    ]
  }
  
  return { ...baseData, ...overrides }
}

/**
 * Nuxt/Vue Ecosystem Mock Factories
 */

/**
 * Create mock Nuxt app config
 */
export function createMockAppConfig(options: MockOptions = {}) {
  const { locale = 'en', overrides = {} } = options
  
  const baseConfig = {
    personalData: createMockPersonalData({ locale }),
    theme: {
      default: 'light',
      modes: ['light', 'dark', 'system']
    },
    i18n: {
      defaultLocale: 'ar',
      locales: ['ar', 'en']
    },
    seo: {
      siteName: locale === 'ar' ? 'الموقع الشخصي' : 'Personal Website',
      siteDescription: locale === 'ar' 
        ? 'موقع شخصي متعدد اللغات' 
        : 'Multilingual personal website'
    }
  }
  
  return { ...baseConfig, ...overrides }
}

/**
 * Create mock Nuxt route
 */
export function createMockRoute(options: MockOptions = {}) {
  const { locale = 'en', overrides = {} } = options
  
  const basePath = '/about'
  const path = locale === 'ar' ? basePath : `/en${basePath}`
  
  const baseRoute = {
    path,
    name: `about___${locale}`,
    params: {},
    query: {},
    meta: {
      layout: 'default',
      locale
    },
    fullPath: path,
    matched: [],
    redirectedFrom: undefined
  }
  
  return { ...baseRoute, ...overrides }
}

/**
 * Create mock Nuxt router
 */
export function createMockRouter() {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    getRoutes: vi.fn(() => []),
    resolve: vi.fn(),
    addRoute: vi.fn(),
    removeRoute: vi.fn(),
    hasRoute: vi.fn(() => true),
    currentRoute: ref(createMockRoute()),
    options: {}
  }
}

/**
 * Create mock i18n instance
 */
export function createMockI18n(options: MockOptions = {}) {
  const { locale = 'en' } = options
  
  const locales = ['en', 'ar']
  const currentLocale = ref(locale)
  
  return {
    locale: currentLocale,
    locales,
    defaultLocale: 'ar',
    t: vi.fn((key: string) => key),
    tm: vi.fn((key: string) => key),
    rt: vi.fn((key: string) => key),
    d: vi.fn((date: Date) => date.toLocaleDateString()),
    n: vi.fn((number: number) => number.toString()),
    setLocale: vi.fn(async (newLocale: string) => {
      currentLocale.value = newLocale
    }),
    getLocale: vi.fn(() => currentLocale.value),
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false
  }
}

/**
 * Create mock content query
 */
export function createMockContentQuery(data: any[] = []) {
  return {
    find: vi.fn().mockResolvedValue(data),
    findOne: vi.fn().mockResolvedValue(data[0] || null),
    where: vi.fn().mockReturnThis(),
    only: vi.fn().mockReturnThis(),
    without: vi.fn().mockReturnThis(),
    sort: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    skip: vi.fn().mockReturnThis(),
    surround: vi.fn().mockResolvedValue([null, null])
  }
}

/**
 * API Response Mock Factories
 */

/**
 * Create mock API success response
 */
export function createMockApiResponse<T>(
  data: T,
  status: number = 200,
  headers: Record<string, string> = {}
): MockApiResponse<T> {
  return {
    data,
    status,
    statusText: 'OK',
    headers: {
      'content-type': 'application/json',
      ...headers
    }
  }
}

/**
 * Create mock API error response
 */
export function createMockApiError(
  message: string = 'API Error',
  status: number = 400,
  code?: string
): MockApiResponse<any> {
  return {
    data: {
      error: {
        message,
        code,
        status
      }
    },
    status,
    statusText: 'Error',
    headers: {
      'content-type': 'application/json'
    }
  }
}

/**
 * Create mock fetch response
 */
export function createMockFetchResponse<T>(
  data: T,
  status: number = 200,
  headers: Record<string, string> = {}
): Response {
  return new Response(JSON.stringify(data), {
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: {
      'content-type': 'application/json',
      ...headers
    }
  })
}

/**
 * Theme and UI Mock Factories
 */

/**
 * Create mock theme configuration
 */
export function createMockTheme(options: MockOptions = {}) {
  const { overrides = {} } = options
  
  const baseTheme = {
    name: 'light',
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      success: '#28a745',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8',
      light: '#f8f9fa',
      dark: '#343a40'
    },
    fonts: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      arabic: ['Tajawal', 'system-ui', 'sans-serif']
    },
    spacing: {
      xs: '0.25rem',
      sm: '0.5rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem'
    }
  }
  
  return { ...baseTheme, ...overrides }
}

/**
 * Browser and Device Mock Factories
 */

/**
 * Create mock device information
 */
export function createMockDevice(options: MockOptions = {}) {
  const { overrides = {} } = options
  
  const baseDevice = {
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isTouch: false,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    platform: 'desktop',
    screenWidth: 1920,
    screenHeight: 1080
  }
  
  return { ...baseDevice, ...overrides }
}

/**
 * Create mock performance metrics
 */
export function createMockPerformanceMetrics(options: MockOptions = {}) {
  const { overrides = {} } = options
  
  const baseMetrics = {
    loadTime: 1200,
    renderTime: 45,
    memoryUsage: 25.6,
    cacheHitRatio: 0.85,
    bundleSize: 145.2,
    imageOptimization: 0.92
  }
  
  return { ...baseMetrics, ...overrides }
}

/**
 * Utility Functions
 */

/**
 * Create array of mock data
 */
export function createMockArray<T>(
  factory: (options?: MockOptions) => T,
  count: number = 3,
  options: MockOptions = {}
): T[] {
  return Array.from({ length: count }, (_, index) => 
    factory({ ...options, overrides: { id: index + 1, ...options.overrides } })
  )
}

/**
 * Create mock with reactive state
 */
export function createMockReactiveState<T extends Record<string, any>>(
  initialState: T
): T {
  return reactive({ ...initialState })
}

/**
 * Create mock composable
 */
export function createMockComposable<T>(returnValue: T) {
  return vi.fn(() => returnValue)
}