/**
 * Environment Management Composable
 * 
 * Provides reactive access to environment variables,
 * feature flags, and environment detection utilities.
 */

import { computed, ref } from 'vue'
import { getCurrentEnvironment, isDevelopment, isProduction } from '~/utils/env-validation'

export interface EnvironmentConfig {
  environment: string
  isDevelopment: boolean
  isProduction: boolean
  isStaging: boolean
  features: Record<string, boolean>
  urls: {
    site: string
    api: string
    cdn?: string
  }
  social: {
    github?: string
    linkedin?: string
    twitter?: string
    instagram?: string
  }
  analytics: {
    googleAnalytics?: string
    gtm?: string
    umami?: {
      websiteId: string
      url: string
    }
    plausible?: {
      domain: string
      apiHost: string
    }
  }
  thirdParty: {
    sentry?: {
      dsn: string
    }
    giscus?: {
      repo: string
      repoId: string
      category: string
      categoryId: string
    }
  }
}

export const useEnvironment = () => {
  const { $config } = useNuxtApp()
  const runtimeConfig = useRuntimeConfig()
  
  // Reactive environment state
  const environment = ref(getCurrentEnvironment())
  const validation = ref(null)
  
  // Environment detection
  const isDev = computed(() => isDevelopment())
  const isProd = computed(() => isProduction())
  const isStaging = computed(() => environment.value === 'staging')
  
  // Feature flags
  const features = computed(() => ({
    blog: getBooleanEnv('NUXT_PUBLIC_FEATURE_BLOG', true),
    projects: getBooleanEnv('NUXT_PUBLIC_FEATURE_PROJECTS', true),
    contactForm: getBooleanEnv('NUXT_PUBLIC_FEATURE_CONTACT_FORM', true),
    newsletter: getBooleanEnv('NUXT_PUBLIC_FEATURE_NEWSLETTER', true),
    comments: getBooleanEnv('NUXT_PUBLIC_FEATURE_COMMENTS', false),
    search: getBooleanEnv('NUXT_PUBLIC_FEATURE_SEARCH', false),
    analytics: getBooleanEnv('NUXT_PUBLIC_FEATURE_ANALYTICS', false),
    errorTracking: getBooleanEnv('NUXT_PUBLIC_FEATURE_ERROR_TRACKING', false),
    pwa: getBooleanEnv('NUXT_PUBLIC_EXPERIMENTAL_PWA', false),
    offline: getBooleanEnv('NUXT_PUBLIC_EXPERIMENTAL_OFFLINE', false)
  }))
  
  // URLs configuration
  const urls = computed(() => ({
    site: runtimeConfig.public.siteUrl || 'http://localhost:3000',
    api: runtimeConfig.public.apiBase || '/api',
    cdn: process.env.NUXT_PUBLIC_CDN_URL
  }))
  
  // Social media URLs
  const social = computed(() => ({
    github: process.env.NUXT_PUBLIC_GITHUB_URL,
    linkedin: process.env.NUXT_PUBLIC_LINKEDIN_URL,
    twitter: process.env.NUXT_PUBLIC_TWITTER_URL,
    instagram: process.env.NUXT_PUBLIC_INSTAGRAM_URL,
    twitterHandle: process.env.NUXT_PUBLIC_TWITTER_HANDLE
  }))
  
  // Analytics configuration
  const analytics = computed(() => ({
    googleAnalytics: process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID,
    gtm: process.env.NUXT_PUBLIC_GTM_ID,
    umami: process.env.NUXT_PUBLIC_UMAMI_WEBSITE_ID ? {
      websiteId: process.env.NUXT_PUBLIC_UMAMI_WEBSITE_ID,
      url: process.env.NUXT_PUBLIC_UMAMI_URL || 'https://analytics.umami.is'
    } : undefined,
    plausible: process.env.NUXT_PUBLIC_PLAUSIBLE_DOMAIN ? {
      domain: process.env.NUXT_PUBLIC_PLAUSIBLE_DOMAIN,
      apiHost: process.env.NUXT_PUBLIC_PLAUSIBLE_API_HOST || 'https://plausible.io'
    } : undefined
  }))
  
  // Third-party services
  const thirdParty = computed(() => ({
    sentry: process.env.NUXT_PUBLIC_SENTRY_DSN ? {
      dsn: process.env.NUXT_PUBLIC_SENTRY_DSN
    } : undefined,
    giscus: process.env.NUXT_PUBLIC_GISCUS_REPO ? {
      repo: process.env.NUXT_PUBLIC_GISCUS_REPO,
      repoId: process.env.NUXT_PUBLIC_GISCUS_REPO_ID || '',
      category: process.env.NUXT_PUBLIC_GISCUS_CATEGORY || 'General',
      categoryId: process.env.NUXT_PUBLIC_GISCUS_CATEGORY_ID || ''
    } : undefined,
    logRocket: process.env.NUXT_PUBLIC_LOGROCKET_APP_ID
  }))
  
  // Complete environment configuration
  const config = computed((): EnvironmentConfig => ({
    environment: environment.value,
    isDevelopment: isDev.value,
    isProduction: isProd.value,
    isStaging: isStaging.value,
    features: features.value,
    urls: urls.value,
    social: social.value,
    analytics: analytics.value,
    thirdParty: thirdParty.value
  }))
  
  // Validation result (from client-side plugin)
  const validationResult = computed(() => {
    if (process.client && window.__ENV_VALIDATION__) {
      return window.__ENV_VALIDATION__
    }
    return null
  })
  
  // Helper functions
  function getBooleanEnv(key: string, defaultValue: boolean = false): boolean {
    const value = process.env[key]
    if (!value) return defaultValue
    return ['true', '1'].includes(value.toLowerCase())
  }
  
  function getStringEnv(key: string, defaultValue: string = ''): string {
    return process.env[key] || defaultValue
  }
  
  function getNumberEnv(key: string, defaultValue: number = 0): number {
    const value = process.env[key]
    if (!value) return defaultValue
    const num = Number(value)
    return isNaN(num) ? defaultValue : num
  }
  
  function hasFeature(feature: keyof typeof features.value): boolean {
    return features.value[feature] || false
  }
  
  function requiresHttps(): boolean {
    return isProd.value || isStaging.value
  }
  
  function getImageDomains(): string[] {
    const domains = process.env.NUXT_PUBLIC_IMAGE_DOMAINS
    return domains ? domains.split(',').map(d => d.trim()) : []
  }
  
  function getCorsOrigins(): string[] {
    const origins = process.env.CORS_ORIGIN
    return origins ? origins.split(',').map(o => o.trim()) : []
  }
  
  function isAnalyticsEnabled(): boolean {
    return hasFeature('analytics') && (
      !!analytics.value.googleAnalytics ||
      !!analytics.value.gtm ||
      !!analytics.value.umami ||
      !!analytics.value.plausible
    )
  }
  
  function isErrorTrackingEnabled(): boolean {
    return hasFeature('errorTracking') && !!thirdParty.value.sentry
  }
  
  function getDebugLevel(): string {
    if (isDev.value) return 'debug'
    if (isStaging.value) return 'warn'
    return 'error'
  }
  
  // Environment validation helpers
  function validateConfig(): boolean {
    if (!urls.value.site) {
      console.error('Missing NUXT_PUBLIC_SITE_URL')
      return false
    }
    
    if (isProd.value && urls.value.site.includes('localhost')) {
      console.error('Using localhost URL in production')
      return false
    }
    
    return true
  }
  
  function logEnvironmentInfo(): void {
    if (!isDev.value) return
    
    console.group('🌍 Environment Configuration')
    console.log('Environment:', environment.value)
    console.log('Features:', features.value)
    console.log('URLs:', urls.value)
    console.log('Analytics enabled:', isAnalyticsEnabled())
    console.log('Error tracking enabled:', isErrorTrackingEnabled())
    console.groupEnd()
  }
  
  // Reactive getters for common use cases
  const siteUrl = computed(() => urls.value.site)
  const apiUrl = computed(() => urls.value.api)
  const siteName = computed(() => getStringEnv('NUXT_PUBLIC_SITE_NAME', 'Website'))
  const siteDescription = computed(() => getStringEnv('NUXT_PUBLIC_SITE_DESCRIPTION', ''))
  
  return {
    // State
    environment: readonly(environment),
    config: readonly(config),
    validation: readonly(validationResult),
    
    // Environment detection
    isDevelopment: readonly(isDev),
    isProduction: readonly(isProd),
    isStaging: readonly(isStaging),
    
    // Feature flags
    features: readonly(features),
    hasFeature,
    
    // Configuration
    urls: readonly(urls),
    social: readonly(social),
    analytics: readonly(analytics),
    thirdParty: readonly(thirdParty),
    
    // Common getters
    siteUrl: readonly(siteUrl),
    apiUrl: readonly(apiUrl),
    siteName: readonly(siteName),
    siteDescription: readonly(siteDescription),
    
    // Helper functions
    getBooleanEnv,
    getStringEnv,
    getNumberEnv,
    requiresHttps,
    getImageDomains,
    getCorsOrigins,
    isAnalyticsEnabled,
    isErrorTrackingEnabled,
    getDebugLevel,
    
    // Validation
    validateConfig,
    logEnvironmentInfo
  }
}

// Global type augmentation for window
declare global {
  interface Window {
    __ENV_VALIDATION__?: any
  }
}

export type { EnvironmentConfig }