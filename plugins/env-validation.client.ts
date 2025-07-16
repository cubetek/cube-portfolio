/**
 * Client-side Environment Validation Plugin
 * 
 * Validates public environment variables on the client side
 * and provides runtime configuration helpers.
 */

import { validateEnvironment, getRuntimeConfig } from '~/utils/env-validation'

export default defineNuxtPlugin(() => {
  // Only validate in development or when explicitly enabled
  const shouldValidate = process.env.NODE_ENV === 'development' || 
                        process.env.ENV_VALIDATION_ENABLED === 'true'

  if (!shouldValidate) {
    return
  }

  try {
    const config = getRuntimeConfig()
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🛡️  Environment validation completed')
      console.log(`Environment: ${config.env}`)
      console.log(`Validation status: ${config.validation.isValid ? '✅' : '❌'}`)
      
      if (config.validation.warnings.length > 0) {
        console.warn('Environment warnings:', config.validation.warnings)
      }
    }
    
    // Store validation result for runtime access
    if (process.client) {
      window.__ENV_VALIDATION__ = config.validation
    }
    
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Environment validation failed:', error)
    }
  }
})