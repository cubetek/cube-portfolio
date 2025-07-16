# Netlify Deployment Guide

This comprehensive guide covers deploying your Nuxt 3 multilingual personal website to Netlify with full SSR support, edge functions, form handling, and optimization features.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Configuration Overview](#configuration-overview)
4. [Deployment Methods](#deployment-methods)
5. [Form Handling](#form-handling)
6. [Edge Functions](#edge-functions)
7. [Multilingual Routing](#multilingual-routing)
8. [Performance Optimization](#performance-optimization)
9. [Environment Variables](#environment-variables)
10. [Troubleshooting](#troubleshooting)

## Prerequisites

- Node.js 18+ installed
- pnpm package manager
- Netlify account
- Netlify CLI (optional for local development)
- Git repository connected to Netlify

### Install Netlify CLI (Optional)

```bash
npm install -g netlify-cli
```

## Initial Setup

### 1. Site Configuration

The site is configured via `netlify.toml` in the project root with the following key settings:

- **Build Command**: `pnpm run build`
- **Publish Directory**: `.output/public`
- **Functions Directory**: `.output/server`
- **Edge Functions**: `netlify/edge-functions`

### 2. Connect Repository

1. Log in to your Netlify dashboard
2. Click "New site from Git"
3. Connect your GitHub/GitLab repository
4. Choose the repository containing your project
5. Configure build settings (or use the pre-configured `netlify.toml`)

### 3. Environment Variables

Set these environment variables in Netlify dashboard (Site settings > Environment variables):

```bash
# Required
NODE_VERSION=18
PNPM_VERSION=8
NUXT_PUBLIC_SITE_URL=https://your-domain.netlify.app

# Optional - for enhanced features
NUXT_API_SECRET=your-api-secret-key
CONTACT_EMAIL=your-email@domain.com
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
```

## Configuration Overview

### netlify.toml Features

Our `netlify.toml` configuration includes:

- **Build optimization** with custom Node.js settings
- **Multilingual redirect rules** for Arabic (default) and English (/en)
- **Form handling** with spam protection
- **Security headers** including CSP, HSTS, and frame protection
- **Performance caching** for static assets
- **Edge functions** for SSR and i18n routing
- **Branch deployments** for staging environments
- **Split testing** capabilities

### Key Configuration Sections

#### Build Settings
```toml
[build]
  command = "pnpm run build"
  publish = ".output/public"
  functions = ".output/server"
  edge_functions = "netlify/edge-functions"
```

#### Environment-Specific Settings
- **Production**: Optimized for performance
- **Develop branch**: Staging environment
- **Deploy previews**: For pull request previews

## Deployment Methods

### Method 1: Git-based Deployment (Recommended)

1. **Push to main branch** for production deployment
2. **Push to develop branch** for staging deployment
3. **Create pull request** for deploy preview

```bash
# Deploy to production
git add .
git commit -m "feat: add new feature"
git push origin main

# Deploy to staging
git checkout develop
git merge main
git push origin develop
```

### Method 2: CLI Deployment

```bash
# Build locally
pnpm run netlify:build

# Deploy to preview
pnpm run netlify:deploy

# Deploy to production
pnpm run netlify:deploy:prod
```

### Method 3: Manual Upload

1. Build locally: `pnpm run build`
2. Zip the `.output` directory
3. Upload via Netlify dashboard

## Form Handling

### Contact Form Setup

The site includes a fully functional contact form with:

- **Spam protection** via honeypot fields
- **Email validation** with regex patterns
- **Rate limiting** and abuse prevention
- **Multilingual support** for error messages
- **reCAPTCHA integration** (configurable)

### Form Configuration

Forms are defined in `netlify.toml`:

```toml
[[forms]]
  name = "contact"
  action = "/contact/success"
  
  [forms.settings]
    honeypot = "bot-field"
    recaptcha = true
```

### Using the Contact Form

The `ContactForm.vue` component handles:

1. **Form validation** with real-time feedback
2. **Submission** to Netlify Functions
3. **Success/error handling** with user feedback
4. **Analytics tracking** for form events

### Custom Form Processing

Forms are processed by `netlify/functions/contact-form.ts` which:

- Validates input data
- Checks for spam patterns
- Sends email notifications
- Returns appropriate responses

## Edge Functions

### SSR Edge Function

Located at `netlify/edge-functions/ssr.ts`, this function:

- **Handles SSR** for dynamic content
- **Adds performance headers** with edge location info
- **Manages 404 redirects** with language detection
- **Applies security headers** for enhanced protection

### i18n Redirect Function

Located at `netlify/edge-functions/i18n-redirect.ts`, this function:

- **Detects user language** from headers and geolocation
- **Redirects to appropriate language** version
- **Sets language preference cookies** for future visits
- **Handles Arabic (default)** and English (/en) routing

### Edge Function Benefits

- **Faster response times** via edge computing
- **Reduced origin load** with intelligent caching
- **Enhanced user experience** with automatic language detection
- **Better SEO** with proper language routing

## Multilingual Routing

### URL Structure

- **Arabic (Default)**: `https://site.com/` (no prefix)
- **English**: `https://site.com/en/`

### Redirect Rules

The configuration includes comprehensive redirects:

```toml
# Force HTTPS
[[redirects]]
  from = "http://your-domain.netlify.app/*"
  to = "https://your-domain.netlify.app/:splat"
  status = 301

# Arabic language redirects
[[redirects]]
  from = "/ar/*"
  to = "/:splat"
  status = 301

# Legacy URL support
[[redirects]]
  from = "/posts/*"
  to = "/blog/:splat"
  status = 301
```

### Language Detection

The i18n edge function uses multiple factors:

1. **Cookie preferences** (highest priority)
2. **Accept-Language header** parsing
3. **Geolocation** based on country
4. **Default fallback** to Arabic

## Performance Optimization

### Build Plugins

The configuration includes several optimization plugins:

```toml
[[plugins]]
  package = "netlify-plugin-lighthouse"
  
[[plugins]]
  package = "netlify-plugin-cache"
  
[[plugins]]
  package = "netlify-plugin-sitemap"
```

### Caching Strategy

- **Static assets**: 1 year cache with immutable flag
- **API responses**: No cache for dynamic content
- **Fonts**: 1 year cache with CORS headers
- **HTML pages**: Browser cache with revalidation

### Security Headers

Comprehensive security headers are applied:

- **CSP**: Content Security Policy with strict rules
- **HSTS**: HTTP Strict Transport Security
- **Frame Options**: Prevent clickjacking
- **Content Type**: Prevent MIME sniffing
- **XSS Protection**: Cross-site scripting prevention

## Environment Variables

### Required Variables

```bash
NODE_VERSION=18
PNPM_VERSION=8
NUXT_PUBLIC_SITE_URL=https://your-domain.netlify.app
```

### Optional Variables

```bash
# API Configuration
NUXT_API_SECRET=your-secret-key

# Email Service (for contact forms)
CONTACT_EMAIL=your-email@domain.com
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-username
SMTP_PASS=your-password

# Analytics
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID

# External Services
RECAPTCHA_SITE_KEY=your-recaptcha-site-key
RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
```

### Setting Environment Variables

#### Via Netlify Dashboard:
1. Go to Site settings > Environment variables
2. Add each variable with appropriate scope
3. Deploy to apply changes

#### Via Netlify CLI:
```bash
netlify env:set VARIABLE_NAME "value"
```

## Branch Deployments

### Staging Environment

The `develop` branch automatically deploys to:
```
https://develop--your-site.netlify.app
```

### Feature Branches

Any branch can be configured for deployment:

1. **Create branch**: `git checkout -b feature/new-feature`
2. **Push branch**: `git push origin feature/new-feature`
3. **Configure in Netlify**: Enable branch deployments
4. **Access deployment**: `https://feature-new-feature--your-site.netlify.app`

### Deploy Previews

Pull requests automatically generate deploy previews:
```
https://deploy-preview-123--your-site.netlify.app
```

## Split Testing

### Configuration

Split testing is configured in `netlify.toml`:

```toml
[[split_tests]]
  id = "homepage-hero"
  path = "/"
  branches = [
    { branch = "main", percentage = 90 },
    { branch = "hero-variant", percentage = 10 }
  ]
```

### Setting Up Split Tests

1. **Create variant branch**: `git checkout -b hero-variant`
2. **Make changes**: Modify components or content
3. **Configure split test**: Update `netlify.toml`
4. **Deploy**: Push both branches
5. **Monitor results**: Use Netlify Analytics

## Available Scripts

The following npm scripts are available for Netlify deployment:

```bash
# Local development with Netlify CLI
pnpm run netlify:dev

# Build for Netlify
pnpm run netlify:build

# Deploy to preview (draft)
pnpm run netlify:deploy

# Deploy to production
pnpm run netlify:deploy:prod

# Serve functions locally
pnpm run netlify:functions:serve
```

## Troubleshooting

### Common Issues

#### 1. Build Failures

**Problem**: Build fails with Node.js version errors
**Solution**: Ensure `NODE_VERSION=18` is set in environment variables

**Problem**: pnpm not found during build
**Solution**: Set `PNPM_VERSION=8` in environment variables

#### 2. Form Submission Issues

**Problem**: Contact form returns 404
**Solution**: Check that functions are deployed and configured correctly

**Problem**: Spam protection too aggressive
**Solution**: Adjust spam detection patterns in `contact-form.ts`

#### 3. Redirect Issues

**Problem**: Language redirects not working
**Solution**: Check edge function deployment and configuration

**Problem**: Legacy URLs not redirecting
**Solution**: Verify redirect rules order in `netlify.toml`

#### 4. Performance Issues

**Problem**: Slow page loads
**Solution**: Enable compression and check caching headers

**Problem**: Large bundle sizes
**Solution**: Analyze bundle and implement code splitting

### Debug Mode

Enable debug mode for troubleshooting:

```bash
# Environment variable
DEBUG=netlify:*

# Local development
netlify dev --debug

# Function logs
netlify functions:invoke contact-form --payload='{"test": true}'
```

### Support Resources

- **Netlify Documentation**: https://docs.netlify.com/
- **Nuxt 3 Deployment**: https://nuxt.com/docs/getting-started/deployment
- **Community Forum**: https://community.netlify.com/
- **Status Page**: https://www.netlifystatus.com/

## Advanced Configuration

### Custom Domains

1. **Add domain** in Netlify dashboard
2. **Configure DNS** records
3. **Enable HTTPS** with automatic certificates
4. **Update environment variables** with new domain

### Analytics Integration

```javascript
// Add to nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      script: [
        {
          src: 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID',
          async: true
        }
      ]
    }
  }
})
```

### Monitoring

Set up monitoring for:

- **Performance metrics** via Lighthouse
- **Error tracking** with Sentry
- **Uptime monitoring** with external services
- **User analytics** with Google Analytics

This comprehensive setup provides a robust, scalable, and high-performance deployment on Netlify with full multilingual support and modern web best practices.