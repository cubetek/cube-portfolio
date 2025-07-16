/**
 * Environment Validation Utility
 * 
 * Provides comprehensive validation for environment variables
 * with meaningful error messages and security best practices.
 */

export interface EnvValidationRule {
  key: string
  required: boolean
  type: 'string' | 'number' | 'boolean' | 'url' | 'email' | 'secret'
  defaultValue?: string | number | boolean
  description?: string
  pattern?: RegExp
  minLength?: number
  maxLength?: number
  allowedValues?: string[]
  environment?: ('development' | 'staging' | 'production')[]
  security?: {
    isSecret: boolean
    minSecretLength?: number
    shouldBeEncrypted?: boolean
  }
}

export interface EnvValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  missingRequired: string[]
  insecureValues: string[]
  deprecatedValues: string[]
  summary: {
    total: number
    validated: number
    failed: number
    warnings: number
  }
}

export interface EnvConfig {
  strict?: boolean
  logLevel?: 'error' | 'warn' | 'info' | 'debug'
  skipSecurityChecks?: boolean
  environment?: string
}

/**
 * Environment variable validation rules
 */
export const ENV_VALIDATION_RULES: EnvValidationRule[] = [
  // Core Application
  {
    key: 'NODE_ENV',
    required: true,
    type: 'string',
    allowedValues: ['development', 'production', 'test'],
    description: 'Node.js environment type'
  },
  {
    key: 'NUXT_ENV_ENVIRONMENT',
    required: false,
    type: 'string',
    allowedValues: ['development', 'staging', 'production'],
    defaultValue: 'development',
    description: 'Application environment type'
  },
  {
    key: 'NUXT_PUBLIC_SITE_URL',
    required: true,
    type: 'url',
    description: 'Public site URL for SEO and absolute links'
  },
  {
    key: 'NUXT_PUBLIC_SITE_NAME',
    required: true,
    type: 'string',
    minLength: 3,
    maxLength: 100,
    description: 'Site name for branding and SEO'
  },
  {
    key: 'NUXT_PUBLIC_SITE_DESCRIPTION',
    required: true,
    type: 'string',
    minLength: 10,
    maxLength: 200,
    description: 'Site description for SEO meta tags'
  },

  // API Configuration
  {
    key: 'NUXT_PUBLIC_API_BASE',
    required: true,
    type: 'string',
    defaultValue: '/api',
    description: 'Base path for API endpoints'
  },
  {
    key: 'NUXT_API_SECRET',
    required: true,
    type: 'secret',
    security: {
      isSecret: true,
      minSecretLength: 32,
      shouldBeEncrypted: true
    },
    environment: ['staging', 'production'],
    description: 'Secret key for API authentication'
  },

  // Database
  {
    key: 'DATABASE_URL',
    required: false,
    type: 'string',
    security: {
      isSecret: true,
      shouldBeEncrypted: true
    },
    description: 'Database connection URL'
  },

  // Email Configuration
  {
    key: 'SMTP_HOST',
    required: false,
    type: 'string',
    description: 'SMTP server hostname'
  },
  {
    key: 'SMTP_PORT',
    required: false,
    type: 'number',
    description: 'SMTP server port'
  },
  {
    key: 'SMTP_USER',
    required: false,
    type: 'string',
    security: {
      isSecret: true,
      shouldBeEncrypted: true
    },
    description: 'SMTP username'
  },
  {
    key: 'SMTP_PASS',
    required: false,
    type: 'secret',
    security: {
      isSecret: true,
      shouldBeEncrypted: true
    },
    description: 'SMTP password'
  },
  {
    key: 'SMTP_FROM',
    required: false,
    type: 'email',
    description: 'Default from email address'
  },

  // Third-party API Keys
  {
    key: 'SENDGRID_API_KEY',
    required: false,
    type: 'secret',
    pattern: /^SG\./,
    security: {
      isSecret: true,
      shouldBeEncrypted: true
    },
    description: 'SendGrid API key for email services'
  },
  {
    key: 'RESEND_API_KEY',
    required: false,
    type: 'secret',
    pattern: /^re_/,
    security: {
      isSecret: true,
      shouldBeEncrypted: true
    },
    description: 'Resend API key for email services'
  },

  // Analytics
  {
    key: 'NUXT_PUBLIC_GOOGLE_ANALYTICS_ID',
    required: false,
    type: 'string',
    pattern: /^G-[A-Z0-9]+$/,
    description: 'Google Analytics measurement ID'
  },
  {
    key: 'NUXT_PUBLIC_GTM_ID',
    required: false,
    type: 'string',
    pattern: /^GTM-[A-Z0-9]+$/,
    description: 'Google Tag Manager ID'
  },

  // Security
  {
    key: 'JWT_SECRET',
    required: false,
    type: 'secret',
    security: {
      isSecret: true,
      minSecretLength: 32,
      shouldBeEncrypted: true
    },
    description: 'JWT signing secret'
  },
  {
    key: 'SESSION_SECRET',
    required: false,
    type: 'secret',
    security: {
      isSecret: true,
      minSecretLength: 32,
      shouldBeEncrypted: true
    },
    description: 'Session encryption secret'
  },

  // Feature Flags
  {
    key: 'NUXT_PUBLIC_FEATURE_BLOG',
    required: false,
    type: 'boolean',
    defaultValue: true,
    description: 'Enable blog functionality'
  },
  {
    key: 'NUXT_PUBLIC_FEATURE_PROJECTS',
    required: false,
    type: 'boolean',
    defaultValue: true,
    description: 'Enable projects showcase'
  },
  {
    key: 'NUXT_PUBLIC_FEATURE_CONTACT_FORM',
    required: false,
    type: 'boolean',
    defaultValue: true,
    description: 'Enable contact form'
  },
  {
    key: 'NUXT_PUBLIC_FEATURE_ANALYTICS',
    required: false,
    type: 'boolean',
    defaultValue: false,
    description: 'Enable analytics tracking'
  },

  // Error Tracking
  {
    key: 'NUXT_PUBLIC_SENTRY_DSN',
    required: false,
    type: 'url',
    description: 'Sentry DSN for error tracking'
  },
  {
    key: 'SENTRY_AUTH_TOKEN',
    required: false,
    type: 'secret',
    security: {
      isSecret: true,
      shouldBeEncrypted: true
    },
    description: 'Sentry authentication token'
  }
]

/**
 * Validate environment variables against defined rules
 */
export function validateEnvironment(config: EnvConfig = {}): EnvValidationResult {
  const {
    strict = false,
    logLevel = 'warn',
    skipSecurityChecks = false,
    environment = process.env.NUXT_ENV_ENVIRONMENT || 'development'
  } = config

  const result: EnvValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    missingRequired: [],
    insecureValues: [],
    deprecatedValues: [],
    summary: {
      total: ENV_VALIDATION_RULES.length,
      validated: 0,
      failed: 0,
      warnings: 0
    }
  }

  for (const rule of ENV_VALIDATION_RULES) {
    // Skip environment-specific rules
    if (rule.environment && !rule.environment.includes(environment as any)) {
      continue
    }

    const value = process.env[rule.key]
    const hasValue = value !== undefined && value !== ''

    // Check required variables
    if (rule.required && !hasValue) {
      result.missingRequired.push(rule.key)
      result.errors.push(
        `Missing required environment variable: ${rule.key}${
          rule.description ? ` (${rule.description})` : ''
        }`
      )
      result.summary.failed++
      continue
    }

    // Skip validation for missing optional variables
    if (!hasValue) {
      continue
    }

    result.summary.validated++

    // Type validation
    try {
      validateType(rule, value, result)
    } catch (error) {
      result.errors.push(`${rule.key}: ${error}`)
      result.summary.failed++
    }

    // Security validation
    if (!skipSecurityChecks && rule.security) {
      validateSecurity(rule, value, result, environment)
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      result.warnings.push(
        `${rule.key}: Value does not match expected pattern`
      )
      result.summary.warnings++
    }

    // Length validation
    if (rule.minLength && value.length < rule.minLength) {
      result.errors.push(
        `${rule.key}: Value too short (minimum ${rule.minLength} characters)`
      )
      result.summary.failed++
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      result.warnings.push(
        `${rule.key}: Value too long (maximum ${rule.maxLength} characters)`
      )
      result.summary.warnings++
    }

    // Allowed values validation
    if (rule.allowedValues && !rule.allowedValues.includes(value)) {
      result.errors.push(
        `${rule.key}: Invalid value. Allowed: ${rule.allowedValues.join(', ')}`
      )
      result.summary.failed++
    }
  }

  // Check for insecure default values
  if (!skipSecurityChecks) {
    checkInsecureDefaults(result, environment)
  }

  // Determine overall validity
  result.isValid = result.errors.length === 0 && (!strict || result.warnings.length === 0)

  // Log results based on level
  logValidationResults(result, logLevel)

  return result
}

/**
 * Validate environment variable type
 */
function validateType(rule: EnvValidationRule, value: string, result: EnvValidationResult): void {
  switch (rule.type) {
    case 'number':
      if (isNaN(Number(value))) {
        throw new Error('Must be a valid number')
      }
      break

    case 'boolean':
      if (!['true', 'false', '1', '0'].includes(value.toLowerCase())) {
        throw new Error('Must be a boolean value (true/false)')
      }
      break

    case 'url':
      try {
        new URL(value)
      } catch {
        throw new Error('Must be a valid URL')
      }
      break

    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        throw new Error('Must be a valid email address')
      }
      break

    case 'secret':
      if (value.includes(' ')) {
        result.warnings.push(`${rule.key}: Secret contains spaces`)
      }
      break
  }
}

/**
 * Validate security requirements
 */
function validateSecurity(
  rule: EnvValidationRule,
  value: string,
  result: EnvValidationResult,
  environment: string
): void {
  if (!rule.security) return

  const { isSecret, minSecretLength, shouldBeEncrypted } = rule.security

  if (isSecret) {
    // Check for common insecure values
    const insecureValues = [
      'password',
      'secret',
      'key',
      '123456',
      'admin',
      'default',
      'changeme',
      'test',
      'dev'
    ]

    if (insecureValues.some(insecure => value.toLowerCase().includes(insecure))) {
      result.insecureValues.push(rule.key)
      if (environment !== 'development') {
        result.errors.push(`${rule.key}: Using insecure default value in ${environment}`)
      } else {
        result.warnings.push(`${rule.key}: Using insecure default value`)
      }
    }

    // Check minimum length for secrets
    if (minSecretLength && value.length < minSecretLength) {
      result.errors.push(
        `${rule.key}: Secret too short (minimum ${minSecretLength} characters)`
      )
    }

    // Warn about unencrypted secrets in production
    if (shouldBeEncrypted && environment === 'production') {
      result.warnings.push(
        `${rule.key}: Should be encrypted in deployment platform secrets`
      )
    }
  }
}

/**
 * Check for commonly insecure default values
 */
function checkInsecureDefaults(result: EnvValidationResult, environment: string): void {
  const dangerousDefaults = {
    NUXT_API_SECRET: ['dev-secret-key-change-in-production', 'your-secret-api-key-here'],
    JWT_SECRET: ['your-super-secret-jwt-key-minimum-32-characters'],
    SESSION_SECRET: ['your-session-secret-key']
  }

  for (const [key, defaults] of Object.entries(dangerousDefaults)) {
    const value = process.env[key]
    if (value && defaults.includes(value)) {
      if (environment === 'production') {
        result.errors.push(`${key}: Using default value in production`)
      } else {
        result.warnings.push(`${key}: Using default value`)
      }
      result.insecureValues.push(key)
    }
  }
}

/**
 * Log validation results
 */
function logValidationResults(result: EnvValidationResult, logLevel: string): void {
  const shouldLog = (level: string) => {
    const levels = ['error', 'warn', 'info', 'debug']
    return levels.indexOf(level) <= levels.indexOf(logLevel)
  }

  if (shouldLog('error') && result.errors.length > 0) {
    console.error('Environment Validation Errors:')
    result.errors.forEach(error => console.error(`  ❌ ${error}`))
  }

  if (shouldLog('warn') && result.warnings.length > 0) {
    console.warn('Environment Validation Warnings:')
    result.warnings.forEach(warning => console.warn(`  ⚠️  ${warning}`))
  }

  if (shouldLog('info')) {
    console.info(`Environment Validation Summary:`)
    console.info(`  Total variables: ${result.summary.total}`)
    console.info(`  Validated: ${result.summary.validated}`)
    console.info(`  Failed: ${result.summary.failed}`)
    console.info(`  Warnings: ${result.summary.warnings}`)
    console.info(`  Overall: ${result.isValid ? '✅ Valid' : '❌ Invalid'}`)
  }
}

/**
 * Get environment variable with type casting and validation
 */
export function getEnvVar<T = string>(
  key: string,
  defaultValue?: T,
  type: 'string' | 'number' | 'boolean' = 'string'
): T {
  const value = process.env[key]

  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    throw new Error(`Missing required environment variable: ${key}`)
  }

  switch (type) {
    case 'number':
      const num = Number(value)
      if (isNaN(num)) {
        throw new Error(`Environment variable ${key} must be a number`)
      }
      return num as T

    case 'boolean':
      return (['true', '1'].includes(value.toLowerCase())) as T

    default:
      return value as T
  }
}

/**
 * Check if current environment is production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/**
 * Check if current environment is development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

/**
 * Get current environment type
 */
export function getCurrentEnvironment(): string {
  return process.env.NUXT_ENV_ENVIRONMENT || process.env.NODE_ENV || 'development'
}

/**
 * Validate and get runtime configuration
 */
export function getRuntimeConfig() {
  const validation = validateEnvironment({
    strict: isProduction(),
    logLevel: isDevelopment() ? 'info' : 'warn',
    skipSecurityChecks: isDevelopment()
  })

  if (!validation.isValid && isProduction()) {
    throw new Error('Environment validation failed in production')
  }

  return {
    validation,
    env: getCurrentEnvironment(),
    isProduction: isProduction(),
    isDevelopment: isDevelopment()
  }
}