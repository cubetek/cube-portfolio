#!/usr/bin/env node

/**
 * Environment Validation Script
 * 
 * Validates environment variables and provides detailed reports
 * for security and configuration issues.
 */

import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

// Environment validation rules (simplified for Node.js script)
const validationRules = [
  {
    key: 'NODE_ENV',
    required: true,
    allowedValues: ['development', 'production', 'test'],
    description: 'Node.js environment type'
  },
  {
    key: 'NUXT_ENV_ENVIRONMENT',
    required: false,
    allowedValues: ['development', 'staging', 'production'],
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
    minLength: 3,
    maxLength: 100,
    description: 'Site name for branding and SEO'
  },
  {
    key: 'NUXT_PUBLIC_SITE_DESCRIPTION',
    required: true,
    minLength: 10,
    maxLength: 200,
    description: 'Site description for SEO meta tags'
  },
  {
    key: 'NUXT_PUBLIC_API_BASE',
    required: true,
    description: 'Base path for API endpoints'
  },
  {
    key: 'NUXT_API_SECRET',
    required: true,
    type: 'secret',
    minLength: 32,
    environment: ['staging', 'production'],
    description: 'Secret key for API authentication'
  }
]

function loadEnvironmentFile(filePath) {
  if (!existsSync(filePath)) {
    return {}
  }
  
  const content = readFileSync(filePath, 'utf-8')
  const vars = {}
  
  content.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const equalIndex = trimmed.indexOf('=')
      if (equalIndex > 0) {
        const key = trimmed.substring(0, equalIndex).trim()
        const value = trimmed.substring(equalIndex + 1).trim().replace(/^["']|["']$/g, '')
        vars[key] = value
      }
    }
  })
  
  return vars
}

function validateUrl(value) {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

function validateEmail(value) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

function isInsecureValue(value) {
  const insecureValues = [
    'password', 'secret', 'key', '123456', 'admin', 
    'default', 'changeme', 'test', 'dev',
    'your-secret-api-key-here',
    'dev-secret-key-change-in-production',
    'your-super-secret-jwt-key-minimum-32-characters'
  ]
  
  return insecureValues.some(insecure => 
    value.toLowerCase().includes(insecure.toLowerCase())
  )
}

function validateEnvironment(envVars, environment = 'development') {
  const result = {
    isValid: true,
    errors: [],
    warnings: [],
    missingRequired: [],
    insecureValues: [],
    summary: {
      total: validationRules.length,
      validated: 0,
      failed: 0,
      warnings: 0
    }
  }

  console.log(`🔍 Validating ${environment} environment...\n`)

  for (const rule of validationRules) {
    // Skip environment-specific rules
    if (rule.environment && !rule.environment.includes(environment)) {
      continue
    }

    const value = envVars[rule.key]
    const hasValue = value !== undefined && value !== ''

    // Check required variables
    if (rule.required && !hasValue) {
      result.missingRequired.push(rule.key)
      result.errors.push(
        `❌ Missing required: ${rule.key}${
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
    if (rule.type === 'url' && !validateUrl(value)) {
      result.errors.push(`❌ ${rule.key}: Invalid URL format`)
      result.summary.failed++
    }

    if (rule.type === 'email' && !validateEmail(value)) {
      result.errors.push(`❌ ${rule.key}: Invalid email format`)
      result.summary.failed++
    }

    // Length validation
    if (rule.minLength && value.length < rule.minLength) {
      result.errors.push(
        `❌ ${rule.key}: Too short (minimum ${rule.minLength} characters)`
      )
      result.summary.failed++
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      result.warnings.push(
        `⚠️  ${rule.key}: Too long (maximum ${rule.maxLength} characters)`
      )
      result.summary.warnings++
    }

    // Allowed values validation
    if (rule.allowedValues && !rule.allowedValues.includes(value)) {
      result.errors.push(
        `❌ ${rule.key}: Invalid value. Allowed: ${rule.allowedValues.join(', ')}`
      )
      result.summary.failed++
    }

    // Security validation
    if (rule.type === 'secret') {
      if (isInsecureValue(value)) {
        result.insecureValues.push(rule.key)
        if (environment === 'production') {
          result.errors.push(`❌ ${rule.key}: Insecure default value in production`)
          result.summary.failed++
        } else {
          result.warnings.push(`⚠️  ${rule.key}: Using insecure default value`)
          result.summary.warnings++
        }
      }

      if (rule.minLength && value.length < rule.minLength) {
        result.errors.push(
          `❌ ${rule.key}: Secret too short (minimum ${rule.minLength} characters)`
        )
        result.summary.failed++
      }
    }

    console.log(`✅ ${rule.key}: Valid`)
  }

  // Check for common security issues
  if (environment === 'production') {
    const dangerousPatterns = [
      { key: 'localhost', message: 'Contains localhost reference' },
      { key: 'http://', message: 'Using HTTP instead of HTTPS' },
      { key: 'test', message: 'Contains test values' },
      { key: 'dev', message: 'Contains development values' }
    ]

    for (const [key, value] of Object.entries(envVars)) {
      for (const pattern of dangerousPatterns) {
        if (value.toLowerCase().includes(pattern.key)) {
          result.warnings.push(
            `⚠️  ${key}: ${pattern.message} in production`
          )
          result.summary.warnings++
        }
      }
    }
  }

  result.isValid = result.errors.length === 0

  return result
}

function printReport(result) {
  console.log('\n📊 Validation Report')
  console.log('===================')
  
  console.log(`Total variables checked: ${result.summary.total}`)
  console.log(`Validated successfully: ${result.summary.validated}`)
  console.log(`Failed validation: ${result.summary.failed}`)
  console.log(`Warnings: ${result.summary.warnings}`)
  
  if (result.errors.length > 0) {
    console.log('\n🚨 Errors:')
    result.errors.forEach(error => console.log(`  ${error}`))
  }
  
  if (result.warnings.length > 0) {
    console.log('\n⚠️  Warnings:')
    result.warnings.forEach(warning => console.log(`  ${warning}`))
  }
  
  if (result.missingRequired.length > 0) {
    console.log('\n📋 Missing Required Variables:')
    result.missingRequired.forEach(key => console.log(`  - ${key}`))
    console.log('\nℹ️  Run: npm run setup:env to configure missing variables')
  }
  
  if (result.insecureValues.length > 0) {
    console.log('\n🔒 Security Issues:')
    result.insecureValues.forEach(key => console.log(`  - ${key}: Using insecure default value`))
    console.log('\nℹ️  Generate secure values or configure proper secrets')
  }
  
  console.log(`\n${result.isValid ? '✅' : '❌'} Overall: ${result.isValid ? 'VALID' : 'INVALID'}`)
  
  if (!result.isValid) {
    console.log('\n🔧 Recommendations:')
    console.log('1. Fix all error messages above')
    console.log('2. Review and address warnings')
    console.log('3. Use secure, unique values for secrets')
    console.log('4. Re-run validation after fixes')
  }
}

async function main() {
  const args = process.argv.slice(2)
  const environment = args[0] || process.env.NUXT_ENV_ENVIRONMENT || process.env.NODE_ENV || 'development'
  
  console.log('🛡️  Environment Variable Validation Tool')
  console.log('=========================================\n')
  
  // Load environment files
  const envFiles = [
    '.env',
    '.env.local',
    `.env.${environment}`,
    `.env.${environment}.local`
  ]
  
  const envVars = {}
  
  // Load from process.env first
  Object.assign(envVars, process.env)
  
  // Load from files (later files override earlier ones)
  for (const file of envFiles) {
    const filePath = resolve(process.cwd(), file)
    if (existsSync(filePath)) {
      console.log(`📁 Loading: ${file}`)
      const fileVars = loadEnvironmentFile(filePath)
      Object.assign(envVars, fileVars)
    }
  }
  
  console.log(`🌍 Environment: ${environment}`)
  console.log(`📊 Loaded ${Object.keys(envVars).length} variables\n`)
  
  // Validate
  const result = validateEnvironment(envVars, environment)
  
  // Print report
  printReport(result)
  
  // Exit with error code if validation failed
  if (!result.isValid) {
    process.exit(1)
  }
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  main().catch(error => {
    console.error('Validation failed:', error.message)
    process.exit(1)
  })
}

export { validateEnvironment, loadEnvironmentFile }