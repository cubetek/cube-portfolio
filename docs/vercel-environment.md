# Vercel Environment Configuration Guide

This guide covers how to configure environment variables and secrets for deployment on Vercel.

## Table of Contents

1. [Vercel Environment Overview](#vercel-environment-overview)
2. [Setting Up Environment Variables](#setting-up-environment-variables)
3. [Environment Types](#environment-types)
4. [Security Configuration](#security-configuration)
5. [Build and Runtime Configuration](#build-and-runtime-configuration)
6. [Monitoring and Debugging](#monitoring-and-debugging)
7. [Best Practices](#best-practices)

## Vercel Environment Overview

### Vercel Environment Types

| Environment | Description | URL Pattern | Use Case |
|-------------|-------------|-------------|----------|
| Production | Live deployment | yourdomain.com | Production traffic |
| Preview | Branch deployments | branch-name.vercel.app | Testing & review |
| Development | Local development | localhost:3000 | Local development |

### Automatic Environment Variables

```bash
# Provided by Vercel automatically
VERCEL="1"                          # Always "1" on Vercel
VERCEL_ENV="production"             # production, preview, development
VERCEL_URL="app-abc123.vercel.app"  # Deployment URL
VERCEL_REGION="iad1"               # Deployment region
VERCEL_GIT_COMMIT_SHA="abc123"     # Git commit SHA
VERCEL_GIT_COMMIT_MESSAGE="fix: ..." # Git commit message
VERCEL_GIT_COMMIT_AUTHOR_NAME="User" # Git author
VERCEL_GIT_REPO_SLUG="my-repo"     # Repository name
VERCEL_GIT_REPO_OWNER="username"   # Repository owner
```

## Setting Up Environment Variables

### Method 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variables
vercel env add NUXT_API_SECRET production
vercel env add NUXT_API_SECRET preview
vercel env add DATABASE_URL production

# Add from file
vercel env add --from-file .env.production

# List environment variables
vercel env ls

# Pull environment variables to local
vercel env pull .env.local
```

### Method 2: Vercel Dashboard

1. Go to your project dashboard: `https://vercel.com/dashboard`
2. Navigate to **Settings** > **Environment Variables**
3. Add variables for each environment:

```bash
# Production variables
NUXT_API_SECRET=your-production-secret
DATABASE_URL=your-production-database-url
SMTP_PASS=your-production-smtp-password

# Preview variables (staging)
NUXT_API_SECRET=your-preview-secret
DATABASE_URL=your-preview-database-url
SMTP_PASS=your-preview-smtp-password
```

### Method 3: vercel.json Configuration

```json
{
  "env": {
    "NUXT_PUBLIC_SITE_URL": "https://yourdomain.com",
    "NUXT_PUBLIC_SITE_NAME": "Your Personal Website",
    "NODE_ENV": "production"
  },
  "build": {
    "env": {
      "NUXT_ENV_ENVIRONMENT": "production"
    }
  }
}
```

## Environment Types

### Production Environment

```bash
# Core configuration
NODE_ENV=production
NUXT_ENV_ENVIRONMENT=production
NUXT_PUBLIC_SITE_URL=https://yourdomain.com

# Security
NUXT_API_SECRET=your-secure-production-secret
JWT_SECRET=your-production-jwt-secret

# Database
DATABASE_URL=postgresql://user:pass@prod-host/db

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key

# Analytics
NUXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-PRODUCTION-ID
NUXT_PUBLIC_GTM_ID=GTM-PRODUCTION

# Error Tracking
NUXT_PUBLIC_SENTRY_DSN=https://your-production-sentry-dsn
SENTRY_AUTH_TOKEN=your-sentry-token

# Feature Flags (Production)
NUXT_PUBLIC_FEATURE_ANALYTICS=true
NUXT_PUBLIC_FEATURE_ERROR_TRACKING=true
```

### Preview Environment (Staging)

```bash
# Core configuration
NODE_ENV=production
NUXT_ENV_ENVIRONMENT=staging
NUXT_PUBLIC_SITE_URL=https://preview.yourdomain.com

# Security (separate secrets for preview)
NUXT_API_SECRET=your-secure-preview-secret
JWT_SECRET=your-preview-jwt-secret

# Database (staging database)
DATABASE_URL=postgresql://user:pass@staging-host/db

# Email (test environment)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your-mailtrap-user
SMTP_PASS=your-mailtrap-pass

# Analytics (separate tracking)
NUXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-STAGING-ID

# Feature Flags (enable all for testing)
NUXT_PUBLIC_FEATURE_BLOG=true
NUXT_PUBLIC_FEATURE_PROJECTS=true
NUXT_PUBLIC_FEATURE_CONTACT_FORM=true
NUXT_PUBLIC_FEATURE_NEWSLETTER=true
NUXT_PUBLIC_FEATURE_SEARCH=true
```

### Development Environment

```bash
# Use .env.local for local development
NODE_ENV=development
NUXT_ENV_ENVIRONMENT=development
NUXT_PUBLIC_SITE_URL=http://localhost:3000

# Development secrets (insecure defaults OK)
NUXT_API_SECRET=dev-secret-key-not-for-production
JWT_SECRET=dev-jwt-secret-change-in-production

# Local database
DATABASE_URL=file:./dev.db

# Development email (console output)
SMTP_HOST=localhost
SMTP_PORT=1025

# Disable production features
NUXT_PUBLIC_FEATURE_ANALYTICS=false
NUXT_PUBLIC_FEATURE_ERROR_TRACKING=false
```

## Security Configuration

### Secrets Management

```bash
# ✅ Secure: Store sensitive data in Vercel environment variables
vercel env add DATABASE_URL production
vercel env add SMTP_PASS production
vercel env add JWT_SECRET production

# ❌ Insecure: Don't put secrets in vercel.json
{
  "env": {
    "DATABASE_URL": "postgresql://..." // ❌ Visible in repository
  }
}
```

### Environment Variable Security Levels

| Level | Variable Type | Examples | Storage Method |
|-------|--------------|----------|----------------|
| Public | `NUXT_PUBLIC_*` | Site URL, feature flags | vercel.json or dashboard |
| Private | `NUXT_*`, others | API secrets, database URLs | Dashboard/CLI only |
| Build-time | Build configuration | `NODE_ENV` | vercel.json safe |

### Security Validation Script

```bash
#!/bin/bash
# scripts/vercel-security-check.sh

echo "🔍 Checking Vercel environment security..."

# Check if production uses secure secrets
if vercel env ls | grep -q "dev-secret"; then
  echo "❌ Warning: Development secrets found in production"
  exit 1
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

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".output/public",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "framework": "nuxtjs",
  "nodeVersion": "18.x"
}
```

### Environment-specific Builds

```json
{
  "build": {
    "env": {
      "NODE_ENV": "production",
      "NITRO_PRESET": "vercel"
    }
  },
  "functions": {
    "app/server/index.mjs": {
      "maxDuration": 30
    }
  }
}
```

### Runtime Configuration

```typescript
// nuxt.config.ts - Vercel-specific configuration
export default defineNuxtConfig({
  nitro: {
    preset: 'vercel',
    vercel: {
      config: {
        runtime: 'nodejs18.x',
        maxDuration: 30
      }
    }
  },
  
  runtimeConfig: {
    // Server-side (private)
    apiSecret: process.env.NUXT_API_SECRET,
    databaseUrl: process.env.DATABASE_URL,
    
    // Client-side (public)
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
      siteName: process.env.NUXT_PUBLIC_SITE_NAME,
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  }
})
```

## Monitoring and Debugging

### Environment Variable Debugging

```typescript
// middleware/debug-env.ts
export default defineEventHandler(async (event) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Environment Variables:')
    console.log('VERCEL_ENV:', process.env.VERCEL_ENV)
    console.log('VERCEL_URL:', process.env.VERCEL_URL)
    console.log('NODE_ENV:', process.env.NODE_ENV)
    console.log('NUXT_ENV_ENVIRONMENT:', process.env.NUXT_ENV_ENVIRONMENT)
  }
})
```

### Build Logs Analysis

```bash
# Check build logs for environment issues
vercel logs --follow

# Check specific deployment
vercel logs [deployment-url]

# Debug environment loading
vercel dev --debug
```

### Environment Validation in Production

```typescript
// plugins/vercel-validation.server.ts
export default defineNitroPlugin(async (nitroApp) => {
  // Validate Vercel environment
  if (process.env.VERCEL === '1') {
    const requiredVars = [
      'VERCEL_ENV',
      'VERCEL_URL',
      'NUXT_PUBLIC_SITE_URL'
    ]
    
    for (const varName of requiredVars) {
      if (!process.env[varName]) {
        console.error(`Missing required Vercel variable: ${varName}`)
      }
    }
    
    // Log environment info
    console.log('Vercel Environment:', {
      env: process.env.VERCEL_ENV,
      url: process.env.VERCEL_URL,
      region: process.env.VERCEL_REGION
    })
  }
})
```

## Best Practices

### 1. Environment Variable Organization

```bash
# Group related variables
# Core application
NUXT_PUBLIC_SITE_*
NUXT_API_*

# Third-party services
SENDGRID_*
SENTRY_*
GOOGLE_*

# Database
DATABASE_*
REDIS_*

# Feature flags
NUXT_PUBLIC_FEATURE_*
```

### 2. Deployment Workflow

```bash
# 1. Set up environment variables first
vercel env add NUXT_API_SECRET production

# 2. Validate locally
npm run validate:env

# 3. Deploy
vercel --prod

# 4. Verify deployment
curl -f https://yourdomain.com/api/health
```

### 3. Environment Synchronization

```bash
# Keep environments in sync
vercel env pull .env.production.local
npm run sync:env staging production
```

### 4. Backup and Recovery

```bash
# Backup environment variables
vercel env ls > env-backup.txt

# Export environment variables
vercel env export > .env.backup

# Restore from backup
vercel env import .env.backup
```

### 5. Team Collaboration

```bash
# Share environment template
vercel env add --from-file .env.example

# Document required variables
# See .env.example for all required variables

# Use consistent naming
NUXT_PUBLIC_*     # Public variables
NUXT_*           # Private variables
SERVICE_*        # Service-specific variables
```

### 6. Security Checklist

- [ ] All secrets are stored in Vercel dashboard
- [ ] No secrets in vercel.json or code
- [ ] Different secrets for each environment
- [ ] Regular secret rotation schedule
- [ ] Environment validation enabled
- [ ] Security monitoring configured

### 7. Common Issues and Solutions

**Issue: Environment variables not available at build time**
```json
// Solution: Add to build.env in vercel.json
{
  "build": {
    "env": {
      "SOME_BUILD_VAR": "value"
    }
  }
}
```

**Issue: Different URLs for preview deployments**
```typescript
// Solution: Use VERCEL_URL for dynamic URLs
const baseUrl = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}`
  : process.env.NUXT_PUBLIC_SITE_URL
```

**Issue: Environment variables not updating**
```bash
# Solution: Clear build cache
vercel --force

# Or trigger new deployment
vercel redeploy --prod
```

### 8. Automation Scripts

```bash
# scripts/vercel-setup.sh
#!/bin/bash
echo "Setting up Vercel environment..."

# Set production variables
vercel env add NUXT_API_SECRET production
vercel env add DATABASE_URL production
vercel env add SMTP_PASS production

# Set preview variables
vercel env add NUXT_API_SECRET preview
vercel env add DATABASE_URL preview

echo "✅ Vercel environment setup complete"
```

---

**Remember**: Always validate your environment configuration before deploying to production and keep your secrets secure!