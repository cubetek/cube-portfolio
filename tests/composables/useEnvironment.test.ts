/**
 * Unit Tests for useEnvironment Composable
 * 
 * Tests the environment management composable functionality including:
 * - Environment detection and configuration
 * - Feature flags and toggles
 * - Environment variable access
 * - Analytics and third-party service configuration
 * - Validation and error handling
 * - Helper functions and utilities
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref } from 'vue'
import { useEnvironment } from '~/composables/useEnvironment'

// Mock functions
vi.mock('#app', () => ({
  useNuxtApp: vi.fn(() => ({
    $config: {}
  }))
}))

vi.mock('#imports', () => ({
  useRuntimeConfig: vi.fn(() => ({
    public: {
      siteUrl: 'https://example.com',
      apiBase: '/api'
    }
  }))
}))

vi.mock('~/utils/env-validation', () => ({
  getCurrentEnvironment: vi.fn(() => 'development'),
  isDevelopment: vi.fn(() => true),
  isProduction: vi.fn(() => false)
}))

// Mock window object for client-side validation
const mockWindow = {
  __ENV_VALIDATION__: null
}

Object.defineProperty(globalThis, 'window', {
  value: mockWindow,
  writable: true
})

// Mock process.env
const originalEnv = process.env

describe('useEnvironment', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Reset process.env
    process.env = { ...originalEnv }

    // Reset window validation
    mockWindow.__ENV_VALIDATION__ = null

    // Mock client environment
    Object.defineProperty(process, 'client', {
      value: true,
      writable: true
    })
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('Environment Detection', () => {
    it('should detect development environment', () => {
      const env = useEnvironment()

      expect(env.environment.value).toBe('development')
      expect(env.isDevelopment.value).toBe(true)
      expect(env.isProduction.value).toBe(false)
      expect(env.isStaging.value).toBe(false)
    })

    it('should detect production environment', async () => {
      const envUtils = await import('~/utils/env-validation')
      vi.mocked(envUtils.getCurrentEnvironment).mockReturnValue('production')
      vi.mocked(envUtils.isDevelopment).mockReturnValue(false)
      vi.mocked(envUtils.isProduction).mockReturnValue(true)

      const env = useEnvironment()

      expect(env.environment.value).toBe('production')
      expect(env.isDevelopment.value).toBe(false)
      expect(env.isProduction.value).toBe(true)
      expect(env.isStaging.value).toBe(false)
    })

    it('should detect staging environment', async () => {
      const envUtils = await import('~/utils/env-validation')
      vi.mocked(envUtils.getCurrentEnvironment).mockReturnValue('staging')
      vi.mocked(envUtils.isDevelopment).mockReturnValue(false)
      vi.mocked(envUtils.isProduction).mockReturnValue(false)

      const env = useEnvironment()

      expect(env.environment.value).toBe('staging')
      expect(env.isDevelopment.value).toBe(false)
      expect(env.isProduction.value).toBe(false)
      expect(env.isStaging.value).toBe(true)
    })
  })

  describe('Feature Flags', () => {
    it('should return default feature flags', () => {
      const env = useEnvironment()

      expect(env.features.value).toEqual({
        blog: true,
        projects: true,
        contactForm: true,
        newsletter: true,
        comments: false,
        search: false,
        analytics: false,
        errorTracking: false,
        pwa: false,
        offline: false
      })
    })

    it('should respect environment variable overrides', () => {
      process.env.NUXT_PUBLIC_FEATURE_BLOG = 'false'
      process.env.NUXT_PUBLIC_FEATURE_ANALYTICS = 'true'
      process.env.NUXT_PUBLIC_FEATURE_COMMENTS = '1'

      const env = useEnvironment()

      expect(env.features.value.blog).toBe(false)
      expect(env.features.value.analytics).toBe(true)
      expect(env.features.value.comments).toBe(true)
    })

    it('should provide hasFeature helper', () => {
      process.env.NUXT_PUBLIC_FEATURE_BLOG = 'true'
      process.env.NUXT_PUBLIC_FEATURE_SEARCH = 'false'

      const env = useEnvironment()

      expect(env.hasFeature('blog')).toBe(true)
      expect(env.hasFeature('search')).toBe(false)
      expect(env.hasFeature('newsletter')).toBe(true) // default true
    })
  })

  describe('URLs Configuration', () => {
    it('should return URLs from runtime config', () => {
      const env = useEnvironment()

      expect(env.urls.value).toEqual({
        site: 'https://example.com',
        api: '/api',
        cdn: undefined
      })
    })

    it('should include CDN URL when set', () => {
      process.env.NUXT_PUBLIC_CDN_URL = 'https://cdn.example.com'

      const env = useEnvironment()

      expect(env.urls.value.cdn).toBe('https://cdn.example.com')
    })

    it('should fallback to localhost in development', async () => {
      const runtimeConfig = await import('#imports')
      vi.mocked(runtimeConfig.useRuntimeConfig).mockReturnValue({
        public: {}
      })

      const env = useEnvironment()

      expect(env.urls.value.site).toBe('http://localhost:3000')
      expect(env.urls.value.api).toBe('/api')
    })

    it('should provide individual URL getters', () => {
      const env = useEnvironment()

      expect(env.siteUrl.value).toBe('https://example.com')
      expect(env.apiUrl.value).toBe('/api')
    })
  })

  describe('Social Media Configuration', () => {
    it('should return social media URLs', () => {
      process.env.NUXT_PUBLIC_GITHUB_URL = 'https://github.com/user'
      process.env.NUXT_PUBLIC_LINKEDIN_URL = 'https://linkedin.com/in/user'
      process.env.NUXT_PUBLIC_TWITTER_URL = 'https://twitter.com/user'
      process.env.NUXT_PUBLIC_TWITTER_HANDLE = '@user'

      const env = useEnvironment()

      expect(env.social.value).toEqual({
        github: 'https://github.com/user',
        linkedin: 'https://linkedin.com/in/user',
        twitter: 'https://twitter.com/user',
        instagram: undefined,
        twitterHandle: '@user'
      })
    })

    it('should handle missing social URLs', () => {
      const env = useEnvironment()

      expect(env.social.value).toEqual({
        github: undefined,
        linkedin: undefined,
        twitter: undefined,
        instagram: undefined,
        twitterHandle: undefined
      })
    })
  })

  describe('Analytics Configuration', () => {
    it('should configure Google Analytics', () => {
      process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID = 'GA-123456'

      const env = useEnvironment()

      expect(env.analytics.value.googleAnalytics).toBe('GA-123456')
    })

    it('should configure Google Tag Manager', () => {
      process.env.NUXT_PUBLIC_GTM_ID = 'GTM-123456'

      const env = useEnvironment()

      expect(env.analytics.value.gtm).toBe('GTM-123456')
    })

    it('should configure Umami analytics', () => {
      process.env.NUXT_PUBLIC_UMAMI_WEBSITE_ID = 'umami-123'
      process.env.NUXT_PUBLIC_UMAMI_URL = 'https://analytics.custom.com'

      const env = useEnvironment()

      expect(env.analytics.value.umami).toEqual({
        websiteId: 'umami-123',
        url: 'https://analytics.custom.com'
      })
    })

    it('should use default Umami URL when not specified', () => {
      process.env.NUXT_PUBLIC_UMAMI_WEBSITE_ID = 'umami-123'

      const env = useEnvironment()

      expect(env.analytics.value.umami).toEqual({
        websiteId: 'umami-123',
        url: 'https://analytics.umami.is'
      })
    })

    it('should configure Plausible analytics', () => {
      process.env.NUXT_PUBLIC_PLAUSIBLE_DOMAIN = 'example.com'
      process.env.NUXT_PUBLIC_PLAUSIBLE_API_HOST = 'https://plausible.custom.com'

      const env = useEnvironment()

      expect(env.analytics.value.plausible).toEqual({
        domain: 'example.com',
        apiHost: 'https://plausible.custom.com'
      })
    })

    it('should use default Plausible API host', () => {
      process.env.NUXT_PUBLIC_PLAUSIBLE_DOMAIN = 'example.com'

      const env = useEnvironment()

      expect(env.analytics.value.plausible).toEqual({
        domain: 'example.com',
        apiHost: 'https://plausible.io'
      })
    })
  })

  describe('Third-Party Services', () => {
    it('should configure Sentry', () => {
      process.env.NUXT_PUBLIC_SENTRY_DSN = 'https://sentry.example.com/123'

      const env = useEnvironment()

      expect(env.thirdParty.value.sentry).toEqual({
        dsn: 'https://sentry.example.com/123'
      })
    })

    it('should configure Giscus comments', () => {
      process.env.NUXT_PUBLIC_GISCUS_REPO = 'user/repo'
      process.env.NUXT_PUBLIC_GISCUS_REPO_ID = 'repo-123'
      process.env.NUXT_PUBLIC_GISCUS_CATEGORY = 'Announcements'
      process.env.NUXT_PUBLIC_GISCUS_CATEGORY_ID = 'cat-123'

      const env = useEnvironment()

      expect(env.thirdParty.value.giscus).toEqual({
        repo: 'user/repo',
        repoId: 'repo-123',
        category: 'Announcements',
        categoryId: 'cat-123'
      })
    })

    it('should use default Giscus values', () => {
      process.env.NUXT_PUBLIC_GISCUS_REPO = 'user/repo'

      const env = useEnvironment()

      expect(env.thirdParty.value.giscus).toEqual({
        repo: 'user/repo',
        repoId: '',
        category: 'General',
        categoryId: ''
      })
    })

    it('should configure LogRocket', () => {
      process.env.NUXT_PUBLIC_LOGROCKET_APP_ID = 'logrocket-123'

      const env = useEnvironment()

      expect(env.thirdParty.value.logRocket).toBe('logrocket-123')
    })
  })

  describe('Helper Functions', () => {
    describe('getBooleanEnv', () => {
      it('should parse boolean environment variables', () => {
        const env = useEnvironment()

        expect(env.getBooleanEnv('MISSING_VAR')).toBe(false)
        expect(env.getBooleanEnv('MISSING_VAR', true)).toBe(true)

        process.env.TEST_TRUE = 'true'
        process.env.TEST_ONE = '1'
        process.env.TEST_FALSE = 'false'
        process.env.TEST_ZERO = '0'
        process.env.TEST_OTHER = 'other'

        expect(env.getBooleanEnv('TEST_TRUE')).toBe(true)
        expect(env.getBooleanEnv('TEST_ONE')).toBe(true)
        expect(env.getBooleanEnv('TEST_FALSE')).toBe(false)
        expect(env.getBooleanEnv('TEST_ZERO')).toBe(false)
        expect(env.getBooleanEnv('TEST_OTHER')).toBe(false)
      })
    })

    describe('getStringEnv', () => {
      it('should get string environment variables', () => {
        const env = useEnvironment()

        expect(env.getStringEnv('MISSING_VAR')).toBe('')
        expect(env.getStringEnv('MISSING_VAR', 'default')).toBe('default')

        process.env.TEST_STRING = 'test value'
        expect(env.getStringEnv('TEST_STRING')).toBe('test value')
      })
    })

    describe('getNumberEnv', () => {
      it('should parse number environment variables', () => {
        const env = useEnvironment()

        expect(env.getNumberEnv('MISSING_VAR')).toBe(0)
        expect(env.getNumberEnv('MISSING_VAR', 42)).toBe(42)

        process.env.TEST_NUMBER = '123'
        process.env.TEST_INVALID = 'invalid'

        expect(env.getNumberEnv('TEST_NUMBER')).toBe(123)
        expect(env.getNumberEnv('TEST_INVALID')).toBe(0)
        expect(env.getNumberEnv('TEST_INVALID', 99)).toBe(99)
      })
    })

    describe('requiresHttps', () => {
      it('should require HTTPS in production', () => {
        mockIsProduction.mockReturnValue(true)

        const env = useEnvironment()

        expect(env.requiresHttps()).toBe(true)
      })

      it('should require HTTPS in staging', () => {
        mockGetCurrentEnvironment.mockReturnValue('staging')

        const env = useEnvironment()

        expect(env.requiresHttps()).toBe(true)
      })

      it('should not require HTTPS in development', () => {
        const env = useEnvironment()

        expect(env.requiresHttps()).toBe(false)
      })
    })

    describe('getImageDomains', () => {
      it('should parse image domains from environment', () => {
        process.env.NUXT_PUBLIC_IMAGE_DOMAINS = 'example.com,cdn.example.com, images.example.com'

        const env = useEnvironment()

        expect(env.getImageDomains()).toEqual([
          'example.com',
          'cdn.example.com',
          'images.example.com'
        ])
      })

      it('should return empty array when not set', () => {
        const env = useEnvironment()

        expect(env.getImageDomains()).toEqual([])
      })
    })

    describe('getCorsOrigins', () => {
      it('should parse CORS origins from environment', () => {
        process.env.CORS_ORIGIN = 'https://example.com,https://app.example.com'

        const env = useEnvironment()

        expect(env.getCorsOrigins()).toEqual([
          'https://example.com',
          'https://app.example.com'
        ])
      })

      it('should return empty array when not set', () => {
        const env = useEnvironment()

        expect(env.getCorsOrigins()).toEqual([])
      })
    })

    describe('isAnalyticsEnabled', () => {
      it('should check if analytics is enabled', () => {
        process.env.NUXT_PUBLIC_FEATURE_ANALYTICS = 'true'
        process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID = 'GA-123'

        const env = useEnvironment()

        expect(env.isAnalyticsEnabled()).toBe(true)
      })

      it('should return false when feature is disabled', () => {
        process.env.NUXT_PUBLIC_FEATURE_ANALYTICS = 'false'
        process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID = 'GA-123'

        const env = useEnvironment()

        expect(env.isAnalyticsEnabled()).toBe(false)
      })

      it('should return false when no analytics service configured', () => {
        process.env.NUXT_PUBLIC_FEATURE_ANALYTICS = 'true'

        const env = useEnvironment()

        expect(env.isAnalyticsEnabled()).toBe(false)
      })
    })

    describe('isErrorTrackingEnabled', () => {
      it('should check if error tracking is enabled', () => {
        process.env.NUXT_PUBLIC_FEATURE_ERROR_TRACKING = 'true'
        process.env.NUXT_PUBLIC_SENTRY_DSN = 'https://sentry.example.com'

        const env = useEnvironment()

        expect(env.isErrorTrackingEnabled()).toBe(true)
      })

      it('should return false when feature is disabled', () => {
        process.env.NUXT_PUBLIC_FEATURE_ERROR_TRACKING = 'false'
        process.env.NUXT_PUBLIC_SENTRY_DSN = 'https://sentry.example.com'

        const env = useEnvironment()

        expect(env.isErrorTrackingEnabled()).toBe(false)
      })
    })

    describe('getDebugLevel', () => {
      it('should return debug level for development', () => {
        const env = useEnvironment()

        expect(env.getDebugLevel()).toBe('debug')
      })

      it('should return warn level for staging', () => {
        mockGetCurrentEnvironment.mockReturnValue('staging')
        mockIsDevelopment.mockReturnValue(false)

        const env = useEnvironment()

        expect(env.getDebugLevel()).toBe('warn')
      })

      it('should return error level for production', () => {
        mockGetCurrentEnvironment.mockReturnValue('production')
        mockIsDevelopment.mockReturnValue(false)
        mockIsProduction.mockReturnValue(true)

        const env = useEnvironment()

        expect(env.getDebugLevel()).toBe('error')
      })
    })
  })

  describe('Validation', () => {
    describe('validateConfig', () => {
      it('should validate required configuration', () => {
        const env = useEnvironment()

        expect(env.validateConfig()).toBe(true)
      })

      it('should fail when site URL is missing', () => {
        mockUseRuntimeConfig.mockReturnValue({
          public: {}
        })

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

        const env = useEnvironment()

        expect(env.validateConfig()).toBe(false)
        expect(consoleSpy).toHaveBeenCalledWith('Missing NUXT_PUBLIC_SITE_URL')

        consoleSpy.mockRestore()
      })

      it('should fail when using localhost in production', () => {
        mockIsProduction.mockReturnValue(true)
        mockUseRuntimeConfig.mockReturnValue({
          public: {
            siteUrl: 'http://localhost:3000'
          }
        })

        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

        const env = useEnvironment()

        expect(env.validateConfig()).toBe(false)
        expect(consoleSpy).toHaveBeenCalledWith('Using localhost URL in production')

        consoleSpy.mockRestore()
      })
    })

    describe('logEnvironmentInfo', () => {
      it('should log environment info in development', () => {
        const consoleGroupSpy = vi.spyOn(console, 'group').mockImplementation(() => {})
        const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
        const consoleGroupEndSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {})

        const env = useEnvironment()
        env.logEnvironmentInfo()

        expect(consoleGroupSpy).toHaveBeenCalledWith('🌍 Environment Configuration')
        expect(consoleLogSpy).toHaveBeenCalledWith('Environment:', 'development')
        expect(consoleGroupEndSpy).toHaveBeenCalled()

        consoleGroupSpy.mockRestore()
        consoleLogSpy.mockRestore()
        consoleGroupEndSpy.mockRestore()
      })

      it('should not log in production', () => {
        mockIsDevelopment.mockReturnValue(false)

        const consoleGroupSpy = vi.spyOn(console, 'group').mockImplementation(() => {})

        const env = useEnvironment()
        env.logEnvironmentInfo()

        expect(consoleGroupSpy).not.toHaveBeenCalled()

        consoleGroupSpy.mockRestore()
      })
    })
  })

  describe('Client-Side Validation', () => {
    it('should return validation result from window object', () => {
      const mockValidation = {
        isValid: true,
        errors: []
      }

      mockWindow.__ENV_VALIDATION__ = mockValidation

      const env = useEnvironment()

      expect(env.validation.value).toEqual(mockValidation)
    })

    it('should return null when no validation available', () => {
      mockWindow.__ENV_VALIDATION__ = undefined

      const env = useEnvironment()

      expect(env.validation.value).toBeNull()
    })

    it('should handle server-side environment', () => {
      Object.defineProperty(process, 'client', {
        value: false,
        writable: true
      })

      const env = useEnvironment()

      expect(env.validation.value).toBeNull()

      // Restore client environment
      Object.defineProperty(process, 'client', {
        value: true,
        writable: true
      })
    })
  })

  describe('Site Configuration', () => {
    it('should provide site name and description', () => {
      process.env.NUXT_PUBLIC_SITE_NAME = 'My Website'
      process.env.NUXT_PUBLIC_SITE_DESCRIPTION = 'A great website'

      const env = useEnvironment()

      expect(env.siteName.value).toBe('My Website')
      expect(env.siteDescription.value).toBe('A great website')
    })

    it('should use defaults when not configured', () => {
      const env = useEnvironment()

      expect(env.siteName.value).toBe('Website')
      expect(env.siteDescription.value).toBe('')
    })
  })

  describe('Complete Configuration', () => {
    it('should provide complete environment configuration', () => {
      process.env.NUXT_PUBLIC_FEATURE_BLOG = 'true'
      process.env.NUXT_PUBLIC_GITHUB_URL = 'https://github.com/user'

      const env = useEnvironment()

      expect(env.config.value).toEqual({
        environment: 'development',
        isDevelopment: true,
        isProduction: false,
        isStaging: false,
        features: expect.objectContaining({
          blog: true
        }),
        urls: expect.objectContaining({
          site: 'https://example.com'
        }),
        social: expect.objectContaining({
          github: 'https://github.com/user'
        }),
        analytics: expect.any(Object),
        thirdParty: expect.any(Object)
      })
    })
  })

  describe('Return Value Interface', () => {
    it('should return all expected properties and methods', () => {
      const env = useEnvironment()

      // State
      expect(env.environment).toBeDefined()
      expect(env.config).toBeDefined()
      expect(env.validation).toBeDefined()

      // Environment detection
      expect(env.isDevelopment).toBeDefined()
      expect(env.isProduction).toBeDefined()
      expect(env.isStaging).toBeDefined()

      // Feature flags
      expect(env.features).toBeDefined()
      expect(typeof env.hasFeature).toBe('function')

      // Configuration
      expect(env.urls).toBeDefined()
      expect(env.social).toBeDefined()
      expect(env.analytics).toBeDefined()
      expect(env.thirdParty).toBeDefined()

      // Common getters
      expect(env.siteUrl).toBeDefined()
      expect(env.apiUrl).toBeDefined()
      expect(env.siteName).toBeDefined()
      expect(env.siteDescription).toBeDefined()

      // Helper functions
      expect(typeof env.getBooleanEnv).toBe('function')
      expect(typeof env.getStringEnv).toBe('function')
      expect(typeof env.getNumberEnv).toBe('function')
      expect(typeof env.requiresHttps).toBe('function')
      expect(typeof env.getImageDomains).toBe('function')
      expect(typeof env.getCorsOrigins).toBe('function')
      expect(typeof env.isAnalyticsEnabled).toBe('function')
      expect(typeof env.isErrorTrackingEnabled).toBe('function')
      expect(typeof env.getDebugLevel).toBe('function')

      // Validation
      expect(typeof env.validateConfig).toBe('function')
      expect(typeof env.logEnvironmentInfo).toBe('function')
    })
  })
})