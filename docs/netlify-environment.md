# Netlify Environment Configuration Guide

This guide covers how to configure environment variables and secrets for deployment on Netlify.

## Table of Contents

1. [Netlify Environment Overview](#netlify-environment-overview)
2. [Setting Up Environment Variables](#setting-up-environment-variables)
3. [Environment Contexts](#environment-contexts)
4. [Security Configuration](#security-configuration)
5. [Build and Runtime Configuration](#build-and-runtime-configuration)
6. [Functions and Edge Functions](#functions-and-edge-functions)
7. [Monitoring and Debugging](#monitoring-and-debugging)
8. [Best Practices](#best-practices)

## Netlify Environment Overview

### Netlify Environment Contexts

| Context | Description | URL Pattern | Use Case |
|---------|-------------|-------------|----------|
| Production | Live deployment | yourdomain.com | Production traffic |
| Deploy Preview | PR deployments | deploy-preview-123--app.netlify.app | Code review |
| Branch Deploy | Branch deployments | branch-name--app.netlify.app | Feature testing |
| Dev | Local development | localhost:3000 | Local development |

### Automatic Environment Variables

```bash
# Provided by Netlify automatically
NETLIFY="true"                     # Always "true" on Netlify
CONTEXT="production"               # production, deploy-preview, branch-deploy
DEPLOY_PRIME_URL="https://..."     # Primary deploy URL
URL="https://yourdomain.com"       # Site URL
DEPLOY_URL="https://..."           # Current deploy URL
SITE_NAME="your-site-name"         # Site name from Netlify
NETLIFY_SITE_ID="abc123-def456"    # Site ID
BUILD_ID="abc123def456"            # Build ID
DEPLOY_ID="abc123def456"           # Deploy ID
COMMIT_REF="abc123"                # Git commit SHA
HEAD="main"                        # Git branch
BRANCH="main"                      # Git branch
CACHED_COMMIT_REF="abc123"         # Previous commit SHA
PULL_REQUEST="true"                # If deploy is from PR
REVIEW_ID="123"                    # PR number
REPOSITORY_URL="https://github.com/user/repo" # Repository URL
```

## Setting Up Environment Variables

### Method 1: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link your site
netlify link

# Set environment variables
netlify env:set NUXT_API_SECRET "your-secret-value"
netlify env:set DATABASE_URL "your-database-url"
netlify env:set SMTP_PASS "your-smtp-password"

# Import from file
netlify env:import .env.production

# List environment variables
netlify env:list

# Get specific variable
netlify env:get NUXT_API_SECRET
```

### Method 2: Netlify Dashboard

1. Go to your site dashboard: `https://app.netlify.com/sites/your-site`
2. Navigate to **Site settings** > **Environment variables**
3. Add variables for different scopes:

```bash
# Production and Deploy Previews
NUXT_API_SECRET=your-production-secret
DATABASE_URL=your-production-database-url
SMTP_PASS=your-production-smtp-password

# Deploy Previews only (for testing)
NUXT_API_SECRET=your-preview-secret
DATABASE_URL=your-preview-database-url
```

### Method 3: netlify.toml Configuration

```toml
# netlify.toml
[build]
  command = "npm run build"
  functions = "netlify/functions"
  publish = ".output/public"

[build.environment]
  NODE_ENV = "production"
  NUXT_ENV_ENVIRONMENT = "production"
  NUXT_PUBLIC_SITE_URL = "https://yourdomain.com"

# Context-specific environments
[context.production.environment]
  NUXT_ENV_ENVIRONMENT = "production"
  NUXT_PUBLIC_FEATURE_ANALYTICS = "true"

[context.deploy-preview.environment]
  NUXT_ENV_ENVIRONMENT = "staging"
  NUXT_PUBLIC_FEATURE_ANALYTICS = "false"

[context.branch-deploy.environment]
  NUXT_ENV_ENVIRONMENT = "development"
  NUXT_PUBLIC_FEATURE_ANALYTICS = "false"

# Branch-specific settings
[context."staging".environment]
  NUXT_ENV_ENVIRONMENT = "staging"
  DATABASE_URL = "your-staging-database-url"
```

## Environment Contexts

### Production Context

```bash
# Core configuration
NODE_ENV=production
NUXT_ENV_ENVIRONMENT=production
NUXT_PUBLIC_SITE_URL=https://yourdomain.com
CONTEXT=production

# Security
NUXT_API_SECRET=your-secure-production-secret
JWT_SECRET=your-production-jwt-secret
SESSION_SECRET=your-session-secret

# Database
DATABASE_URL=postgresql://user:pass@prod-host/db

# Email service
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
SMTP_FROM=noreply@yourdomain.com

# Analytics
NUXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-PRODUCTION-ID
NUXT_PUBLIC_GTM_ID=GTM-PRODUCTION

# Error tracking
NUXT_PUBLIC_SENTRY_DSN=https://your-production-sentry-dsn
SENTRY_AUTH_TOKEN=your-sentry-token

# Feature flags (production)
NUXT_PUBLIC_FEATURE_BLOG=true
NUXT_PUBLIC_FEATURE_PROJECTS=true
NUXT_PUBLIC_FEATURE_CONTACT_FORM=true
NUXT_PUBLIC_FEATURE_NEWSLETTER=true
NUXT_PUBLIC_FEATURE_ANALYTICS=true
NUXT_PUBLIC_FEATURE_ERROR_TRACKING=true
```

### Deploy Preview Context (Staging)

```bash
# Core configuration
NODE_ENV=production
NUXT_ENV_ENVIRONMENT=staging
CONTEXT=deploy-preview

# Security (separate secrets)
NUXT_API_SECRET=your-secure-preview-secret
JWT_SECRET=your-preview-jwt-secret

# Database (staging)
DATABASE_URL=postgresql://user:pass@staging-host/db

# Email (test environment)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-user
SMTP_PASS=your-mailtrap-pass
SMTP_FROM=staging@yourdomain.com

# Analytics (separate tracking)
NUXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-STAGING-ID

# Feature flags (enable all for testing)
NUXT_PUBLIC_FEATURE_BLOG=true
NUXT_PUBLIC_FEATURE_PROJECTS=true
NUXT_PUBLIC_FEATURE_CONTACT_FORM=true
NUXT_PUBLIC_FEATURE_NEWSLETTER=true
NUXT_PUBLIC_FEATURE_SEARCH=true
NUXT_PUBLIC_FEATURE_ANALYTICS=false
NUXT_PUBLIC_FEATURE_ERROR_TRACKING=true
```

### Branch Deploy Context

```bash
# Core configuration
NODE_ENV=production
NUXT_ENV_ENVIRONMENT=development
CONTEXT=branch-deploy

# Development-like settings
NUXT_API_SECRET=dev-secret-for-branch-testing
DATABASE_URL=file:./branch-test.db

# Disable external services
NUXT_PUBLIC_FEATURE_ANALYTICS=false
NUXT_PUBLIC_FEATURE_ERROR_TRACKING=false
NUXT_PUBLIC_FEATURE_NEWSLETTER=false
```

## Security Configuration

### Secrets Management Best Practices

```bash
# ✅ Secure: Store sensitive data in Netlify environment variables
netlify env:set DATABASE_URL "postgresql://..." --scope production
netlify env:set SMTP_PASS "password" --scope production,deploy-preview

# ❌ Insecure: Don't put secrets in netlify.toml
[build.environment]
  DATABASE_URL = "postgresql://..." # ❌ Visible in repository
```

### Variable Scopes

| Scope | Description | Use Case |
|-------|-------------|----------|
| All | All contexts | Public configuration, feature flags |
| Production | Production only | Production secrets, live API keys |
| Deploy previews | PR previews only | Staging secrets, test API keys |
| Branch deploys | Branch deploys only | Development settings |

### Environment Security Script

```bash
#!/bin/bash
# scripts/netlify-security-check.sh

echo "🔍 Checking Netlify environment security..."

# Check if sensitive variables are properly scoped
if netlify env:list | grep -E "(PASSWORD|SECRET|KEY)" | grep -q "All scopes"; then
  echo "⚠️  Warning: Sensitive variables found in 'All scopes'"
fi

# Validate environment configuration
if ! npm run validate:env production; then
  echo "❌ Environment validation failed"
  exit 1
fi

echo "✅ Security check passed"
```

## Build and Runtime Configuration

### Build Configuration

```toml
# netlify.toml
[build]
  command = "npm run build"
  functions = "netlify/functions"
  edge_functions = "netlify/edge-functions"
  publish = ".output/public"
  
[build.environment]
  NODE_ENV = "production"
  NITRO_PRESET = "netlify"
  NPM_FLAGS = "--prefix=/opt/buildhome/cache/node_modules/.bin/"

# Build processing
[build.processing]
  skip_processing = false

[build.processing.css]
  bundle = true
  minify = true

[build.processing.js]
  bundle = true
  minify = true

[build.processing.html]
  pretty_urls = true

[build.processing.images]
  compress = true
```

### Nuxt Configuration for Netlify

```typescript
// nuxt.config.ts - Netlify-specific configuration
export default defineNuxtConfig({
  nitro: {
    preset: 'netlify',
    netlify: {
      images: {
        remote_images: ['https://images.unsplash.com/*']
      }
    }
  },
  
  // Runtime config with Netlify variables
  runtimeConfig: {
    // Server-side (private)
    apiSecret: process.env.NUXT_API_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    
    // Client-side (public)
    public: {
      siteUrl: process.env.URL || process.env.NUXT_PUBLIC_SITE_URL,
      siteName: process.env.SITE_NAME || process.env.NUXT_PUBLIC_SITE_NAME,
      deployUrl: process.env.DEPLOY_URL,
      context: process.env.CONTEXT,
      netlifyContext: process.env.CONTEXT
    }
  }
})
```

### Context-Aware Configuration

```typescript
// utils/netlify-config.ts
export function getNetlifyConfig() {
  const context = process.env.CONTEXT || 'development'
  const isProduction = context === 'production'
  const isPreview = context === 'deploy-preview'
  const isBranch = context === 'branch-deploy'
  
  return {
    context,
    isProduction,
    isPreview,
    isBranch,
    siteUrl: process.env.URL || process.env.DEPLOY_PRIME_URL,
    deployUrl: process.env.DEPLOY_URL,
    branchName: process.env.HEAD || process.env.BRANCH,
    commitRef: process.env.COMMIT_REF,
    pullRequest: process.env.PULL_REQUEST === 'true',
    reviewId: process.env.REVIEW_ID
  }
}
```

## Functions and Edge Functions

### Netlify Functions Environment

```typescript
// netlify/functions/contact-form.ts
import { Handler } from '@netlify/functions'

export const handler: Handler = async (event, context) => {
  // Access environment variables in functions
  const apiSecret = process.env.NUXT_API_SECRET
  const smtpHost = process.env.SMTP_HOST
  const smtpPass = process.env.SMTP_PASS
  
  // Netlify context information
  const netlifyContext = process.env.CONTEXT
  const siteId = process.env.NETLIFY_SITE_ID
  
  // Function logic here
  return {
    statusCode: 200,
    body: JSON.stringify({ 
      message: 'Success',
      context: netlifyContext 
    })
  }
}
```

### Edge Functions Environment

```typescript
// netlify/edge-functions/i18n-redirect.ts
export default async (request: Request, context: any) => {
  // Access environment variables in edge functions
  const defaultLocale = Deno.env.get('NUXT_PUBLIC_DEFAULT_LOCALE') || 'ar'
  const siteUrl = Deno.env.get('URL')
  
  // Edge function logic here
  return new Response('Redirected', { status: 302 })
}
```

### Function-specific Environment Variables

```toml
# netlify.toml
[[functions]]
  package = "netlify/functions"
  
[functions.environment]
  NODE_ENV = "production"
  FUNCTION_TIMEOUT = "30"

[[edge_functions]]
  function = "i18n-redirect"
  path = "/*"
  
[edge_functions.environment]
  EDGE_TIMEOUT = "10"
```

## Monitoring and Debugging

### Environment Variable Debugging

```typescript
// middleware/debug-netlify.ts
export default defineEventHandler(async (event) => {
  if (process.env.NODE_ENV === 'development' || process.env.CONTEXT !== 'production') {
    console.log('Netlify Environment Variables:')
    console.log('CONTEXT:', process.env.CONTEXT)
    console.log('URL:', process.env.URL)
    console.log('DEPLOY_URL:', process.env.DEPLOY_URL)
    console.log('SITE_NAME:', process.env.SITE_NAME)
    console.log('NETLIFY_SITE_ID:', process.env.NETLIFY_SITE_ID)
    console.log('BRANCH:', process.env.BRANCH)
    console.log('HEAD:', process.env.HEAD)
    console.log('COMMIT_REF:', process.env.COMMIT_REF)
  }
})
```

### Build Logs Analysis

```bash
# View build logs
netlify logs:build

# View function logs
netlify logs:functions

# Live tail logs
netlify logs --live

# Debug local development
netlify dev --debug
```

### Environment Validation Plugin

```typescript
// plugins/netlify-validation.server.ts
export default defineNitroPlugin(async (nitroApp) => {
  if (process.env.NETLIFY === 'true') {
    const context = process.env.CONTEXT
    const requiredVars = [
      'CONTEXT',
      'URL',
      'NETLIFY_SITE_ID'
    ]
    
    // Context-specific validation
    if (context === 'production') {
      requiredVars.push('NUXT_API_SECRET', 'DATABASE_URL')
    }
    
    for (const varName of requiredVars) {
      if (!process.env[varName]) {
        console.error(`Missing required Netlify variable: ${varName}`)
      }
    }
    
    console.log('Netlify Environment:', {
      context,
      url: process.env.URL,
      deployUrl: process.env.DEPLOY_URL,
      branch: process.env.BRANCH,
      commitRef: process.env.COMMIT_REF
    })
  }
})
```

## Best Practices

### 1. Environment Variable Organization

```bash
# Core application
NUXT_PUBLIC_SITE_*
NUXT_API_*
NODE_ENV

# Netlify-specific
CONTEXT
URL
DEPLOY_URL
NETLIFY_SITE_ID

# Third-party services
SENDGRID_*
SENTRY_*
DATABASE_*

# Feature flags
NUXT_PUBLIC_FEATURE_*
```

### 2. Context-Aware Deployment

```toml
# netlify.toml - Context-specific configuration
[context.production]
  command = "npm run build"
  
[context.production.environment]
  NUXT_ENV_ENVIRONMENT = "production"
  NUXT_PUBLIC_FEATURE_ANALYTICS = "true"

[context.deploy-preview]
  command = "npm run build:preview"
  
[context.deploy-preview.environment]
  NUXT_ENV_ENVIRONMENT = "staging"
  NUXT_PUBLIC_FEATURE_ANALYTICS = "false"

[context.branch-deploy]
  command = "npm run build:branch"
  
[context.branch-deploy.environment]
  NUXT_ENV_ENVIRONMENT = "development"
```

### 3. Secure Variable Management

```bash
# Production secrets (restricted scope)
netlify env:set NUXT_API_SECRET "prod-secret" --scope production
netlify env:set DATABASE_URL "prod-db" --scope production

# Preview secrets (for testing)
netlify env:set NUXT_API_SECRET "preview-secret" --scope deploy-preview
netlify env:set DATABASE_URL "staging-db" --scope deploy-preview

# Public configuration (all scopes)
netlify env:set NUXT_PUBLIC_SITE_NAME "My Website"
netlify env:set NUXT_PUBLIC_FEATURE_BLOG "true"
```

### 4. Deployment Automation

```bash
# scripts/netlify-deploy.sh
#!/bin/bash
echo "🚀 Deploying to Netlify..."

# Validate environment
npm run validate:env production

# Build and deploy
netlify build
netlify deploy --prod

# Post-deployment checks
npm run test:e2e:production

echo "✅ Deployment complete"
```

### 5. Environment Synchronization

```bash
# scripts/sync-netlify-env.sh
#!/bin/bash

# Export production environment
netlify env:list --scope production > prod-env.txt

# Backup current environment
netlify env:list > env-backup.txt

# Import to staging (deploy-preview scope)
netlify env:import staging-env.txt --scope deploy-preview
```

### 6. Testing Environment Configuration

```typescript
// tests/environment.test.ts
import { describe, it, expect } from 'vitest'

describe('Environment Configuration', () => {
  it('should have required production variables', () => {
    if (process.env.CONTEXT === 'production') {
      expect(process.env.NUXT_API_SECRET).toBeDefined()
      expect(process.env.DATABASE_URL).toBeDefined()
      expect(process.env.URL).toMatch(/^https:\/\//)
    }
  })
  
  it('should have correct context configuration', () => {
    const context = process.env.CONTEXT
    expect(['production', 'deploy-preview', 'branch-deploy', 'dev'])
      .toContain(context)
  })
})
```

### 7. Common Issues and Solutions

**Issue: Environment variables not available in functions**
```typescript
// Solution: Ensure variables are available in function context
// netlify.toml
[functions.environment]
  NUXT_API_SECRET = "value"  # or reference from site settings
```

**Issue: Different URLs for deploy previews**
```typescript
// Solution: Use DEPLOY_PRIME_URL for consistent URLs
const baseUrl = process.env.DEPLOY_PRIME_URL || process.env.URL
```

**Issue: Build failures due to missing variables**
```toml
# Solution: Set required build variables
[build.environment]
  NODE_ENV = "production"
  REQUIRED_BUILD_VAR = "value"
```

### 8. Security Checklist

- [ ] All secrets are stored in Netlify environment variables
- [ ] Sensitive variables have appropriate scopes
- [ ] No secrets in netlify.toml or code
- [ ] Different secrets for each context
- [ ] Environment validation enabled
- [ ] Function environment variables configured
- [ ] Edge function environment variables configured
- [ ] Regular security audits scheduled

### 9. Monitoring and Alerting

```typescript
// utils/netlify-monitoring.ts
export function setupNetlifyMonitoring() {
  // Monitor environment health
  if (process.env.NETLIFY === 'true') {
    // Log context information
    console.log('Netlify Deploy Info:', {
      context: process.env.CONTEXT,
      deployId: process.env.DEPLOY_ID,
      buildId: process.env.BUILD_ID,
      branch: process.env.BRANCH
    })
    
    // Check for missing critical variables
    const critical = ['CONTEXT', 'URL', 'NETLIFY_SITE_ID']
    const missing = critical.filter(var => !process.env[var])
    
    if (missing.length > 0) {
      console.error('Missing critical Netlify variables:', missing)
    }
  }
}
```

---

**Remember**: Netlify's context-based environment management provides powerful deployment flexibility. Use it wisely to maintain security while enabling efficient development workflows!