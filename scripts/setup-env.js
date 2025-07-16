#!/usr/bin/env node

/**
 * Environment Setup Script
 * 
 * Interactive script to help set up environment variables
 * for different deployment environments.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { createInterface } from 'readline'

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve))

const environments = {
  development: {
    name: 'Development',
    file: '.env.local',
    description: 'Local development environment'
  },
  staging: {
    name: 'Staging',
    file: '.env.staging.local',
    description: 'Staging environment for testing'
  },
  production: {
    name: 'Production',
    file: '.env.production.local',
    description: 'Production environment'
  }
}

const requiredVars = {
  development: [
    'NUXT_PUBLIC_SITE_URL',
    'NUXT_PUBLIC_SITE_NAME',
    'NUXT_PUBLIC_SITE_DESCRIPTION'
  ],
  staging: [
    'NUXT_PUBLIC_SITE_URL',
    'NUXT_PUBLIC_SITE_NAME',
    'NUXT_PUBLIC_SITE_DESCRIPTION',
    'NUXT_API_SECRET'
  ],
  production: [
    'NUXT_PUBLIC_SITE_URL',
    'NUXT_PUBLIC_SITE_NAME',
    'NUXT_PUBLIC_SITE_DESCRIPTION',
    'NUXT_API_SECRET'
  ]
}

const varDescriptions = {
  NUXT_PUBLIC_SITE_URL: 'Your website URL (e.g., https://yourdomain.com)',
  NUXT_PUBLIC_SITE_NAME: 'Your website name',
  NUXT_PUBLIC_SITE_DESCRIPTION: 'Website description for SEO',
  NUXT_API_SECRET: 'Secret key for API authentication (min 32 characters)',
  SMTP_HOST: 'SMTP server hostname (e.g., smtp.gmail.com)',
  SMTP_PORT: 'SMTP server port (usually 587 or 465)',
  SMTP_USER: 'SMTP username/email',
  SMTP_PASS: 'SMTP password or app password',
  SMTP_FROM: 'Default sender email address',
  DATABASE_URL: 'Database connection URL',
  NUXT_PUBLIC_GOOGLE_ANALYTICS_ID: 'Google Analytics Measurement ID (G-XXXXXXXXXX)',
  NUXT_PUBLIC_GTM_ID: 'Google Tag Manager ID (GTM-XXXXXXX)'
}

function generateSecret(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function readExistingEnv(filePath) {
  if (!existsSync(filePath)) {
    return {}
  }
  
  const content = readFileSync(filePath, 'utf-8')
  const vars = {}
  
  content.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      if (key && valueParts.length > 0) {
        vars[key] = valueParts.join('=').replace(/^["']|["']$/g, '')
      }
    }
  })
  
  return vars
}

function writeEnvFile(filePath, vars) {
  const lines = [
    '# Generated environment configuration',
    `# Created: ${new Date().toISOString()}`,
    '# Do not commit this file to version control',
    ''
  ]
  
  Object.entries(vars).forEach(([key, value]) => {
    const needsQuotes = value.includes(' ') || value.includes('#')
    lines.push(`${key}=${needsQuotes ? `"${value}"` : value}`)
  })
  
  writeFileSync(filePath, lines.join('\n') + '\n')
}

async function setupEnvironment() {
  console.log('🚀 Environment Setup Wizard')
  console.log('==============================\n')
  
  // Select environment
  console.log('Available environments:')
  Object.entries(environments).forEach(([key, env], index) => {
    console.log(`${index + 1}. ${env.name} - ${env.description}`)
  })
  
  const envChoice = await question('\nSelect environment (1-3): ')
  const envKeys = Object.keys(environments)
  const selectedEnv = envKeys[parseInt(envChoice) - 1]
  
  if (!selectedEnv) {
    console.error('Invalid selection')
    process.exit(1)
  }
  
  const env = environments[selectedEnv]
  const filePath = resolve(process.cwd(), env.file)
  
  console.log(`\n📝 Setting up ${env.name} environment`)
  console.log(`File: ${env.file}\n`)
  
  // Read existing values
  const existingVars = readExistingEnv(filePath)
  const vars = { ...existingVars }
  
  // Set environment type
  vars.NODE_ENV = selectedEnv === 'development' ? 'development' : 'production'
  vars.NUXT_ENV_ENVIRONMENT = selectedEnv
  
  // Configure required variables
  const required = requiredVars[selectedEnv] || []
  
  for (const varName of required) {
    const current = vars[varName]
    const description = varDescriptions[varName] || varName
    
    console.log(`\n${varName}`)
    console.log(`Description: ${description}`)
    if (current) {
      console.log(`Current value: ${current}`)
    }
    
    let defaultValue = current
    
    // Generate secrets for API keys
    if (varName.includes('SECRET') && !current) {
      defaultValue = generateSecret()
      console.log(`Suggested value: ${defaultValue}`)
    }
    
    const newValue = await question(`Enter value${defaultValue ? ` (${defaultValue})` : ''}: `)
    vars[varName] = newValue || defaultValue || ''
  }
  
  // Optional variables
  const optionalSetup = await question('\nConfigure optional variables? (y/n): ')
  
  if (optionalSetup.toLowerCase() === 'y') {
    const optionalVars = [
      'SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_FROM',
      'DATABASE_URL',
      'NUXT_PUBLIC_GOOGLE_ANALYTICS_ID',
      'NUXT_PUBLIC_GTM_ID'
    ]
    
    for (const varName of optionalVars) {
      const current = vars[varName]
      const description = varDescriptions[varName] || varName
      
      console.log(`\n${varName} (optional)`)
      console.log(`Description: ${description}`)
      if (current) {
        console.log(`Current value: ${current}`)
      }
      
      const newValue = await question(`Enter value${current ? ` (${current})` : ''}: `)
      if (newValue || current) {
        vars[varName] = newValue || current
      }
    }
  }
  
  // Feature flags
  const setupFeatures = await question('\nConfigure feature flags? (y/n): ')
  
  if (setupFeatures.toLowerCase() === 'y') {
    const features = [
      'NUXT_PUBLIC_FEATURE_BLOG',
      'NUXT_PUBLIC_FEATURE_PROJECTS',
      'NUXT_PUBLIC_FEATURE_CONTACT_FORM',
      'NUXT_PUBLIC_FEATURE_NEWSLETTER',
      'NUXT_PUBLIC_FEATURE_ANALYTICS'
    ]
    
    for (const feature of features) {
      const current = vars[feature] || 'true'
      const enabled = await question(`\n${feature} (${current}): `)
      vars[feature] = enabled || current
    }
  }
  
  // Write file
  writeEnvFile(filePath, vars)
  
  console.log(`\n✅ Environment configuration saved to ${env.file}`)
  console.log('\n📋 Next steps:')
  console.log('1. Review the generated configuration file')
  console.log('2. Add any additional variables you need')
  console.log('3. Run: npm run validate:env to validate your configuration')
  
  if (selectedEnv !== 'development') {
    console.log('\n🔒 Security reminders:')
    console.log('- Never commit environment files with secrets to version control')
    console.log('- Use your deployment platform\'s secret management for production')
    console.log('- Regularly rotate API keys and secrets')
  }
  
  rl.close()
}

async function main() {
  try {
    await setupEnvironment()
  } catch (error) {
    console.error('Setup failed:', error.message)
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { setupEnvironment }