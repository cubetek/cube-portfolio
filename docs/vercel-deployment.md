# Vercel Deployment Configuration

This document outlines the complete Vercel deployment configuration for the multilingual Nuxt 3 personal website.

## Overview

The project is configured for deployment on Vercel with:
- **Framework**: Nuxt 3.17.6 with Vue 3 and TypeScript
- **Deployment Modes**: Support for both SSR (Server-Side Rendering) and SSG (Static Site Generation)
- **Languages**: Arabic (default, RTL) and English (LTR with `/en` prefix)
- **Runtime**: Node.js 18.x
- **Package Manager**: pnpm

## Configuration Files

### 1. vercel.json

The main Vercel configuration file contains:

#### Build Configuration
- **Node.js Version**: 18.x for optimal performance
- **Build Command**: `pnpm build`
- **Install Command**: `pnpm install --frozen-lockfile`
- **Output Directory**: `.output/public`
- **Functions Runtime**: Node.js 18.x with 30s max duration

#### Routing & Redirects

**Multilingual Routing:**
- Arabic (default): No URL prefix (e.g., `/`, `/about`, `/blog`)
- English: `/en` prefix (e.g., `/en`, `/en/about`, `/en/blog`)

**Key Routes:**
```json
{
  "src": "^/en/(.*)$",
  "dest": "/en/$1"
}
```

**Redirects:**
- Legacy `/ar/*` routes redirect to root
- HTML extensions removed
- Feed URLs normalized

#### Security Headers

**Content Security Policy (CSP):**
- Restricts script sources to self and Google Fonts
- Allows unsafe-inline for Vue.js requirements
- Blocks object-src and frame-ancestors

**Additional Security:**
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection: enabled
- Referrer-Policy: strict-origin-when-cross-origin

#### Caching Strategy

**Static Assets (1 year):**
- JavaScript, CSS, fonts: `max-age=31536000, immutable`
- Images: `max-age=86400` (24 hours)

**Dynamic Content:**
- Pages: `s-maxage=300, stale-while-revalidate=3600`
- API endpoints: No cache by default

## Environment Variables

### Development (.env.development)
```bash
NUXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
NITRO_PRESET=node-server
NUXT_DEVTOOLS=true
```

### Staging (.env.staging)
```bash
NUXT_PUBLIC_SITE_URL=https://your-staging-domain.vercel.app
NODE_ENV=production
NITRO_PRESET=vercel
VERCEL_ENV=preview
```

### Production (.env.production)
```bash
NUXT_PUBLIC_SITE_URL=https://yourdomain.com
NODE_ENV=production
NITRO_PRESET=vercel
VERCEL_ENV=production
```

## Vercel Project Setup

### 1. Initial Setup

1. **Import Repository:**
   ```bash
   # Connect your GitHub repository to Vercel
   # Framework: Nuxt.js
   # Root Directory: ./cube-blog (if needed)
   ```

2. **Configure Build Settings:**
   - Build Command: `pnpm build`
   - Output Directory: `.output/public`
   - Install Command: `pnpm install --frozen-lockfile`
   - Node.js Version: 18.x

### 2. Environment Variables Configuration

**Required Variables:**
```bash
# Production
NUXT_PUBLIC_SITE_URL=https://yourdomain.com
NUXT_API_SECRET=your-secure-api-secret

# Optional Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
PLAUSIBLE_DOMAIN=yourdomain.com
```

**Security Variables:**
```bash
NUXT_SECURITY_HEADERS=true
NUXT_PUBLIC_ROBOTS_INDEXING=true  # false for staging
```

### 3. Domain Configuration

1. **Custom Domain:**
   - Add your custom domain in Vercel dashboard
   - Configure DNS records:
     - A record: `@` → Vercel IP
     - CNAME record: `www` → `your-domain.vercel.app`

2. **SSL Certificate:**
   - Automatically managed by Vercel
   - Force HTTPS enabled

## Deployment Strategies

### 1. Preview Deployments (Pull Requests)

- **Trigger**: Every pull request
- **Environment**: Staging configuration
- **URL**: `https://your-app-git-branch-username.vercel.app`
- **Features**:
  - Full SSR functionality
  - Staging environment variables
  - No search engine indexing

### 2. Production Deployments (Main Branch)

- **Trigger**: Push to main branch
- **Environment**: Production configuration
- **URL**: Your custom domain
- **Features**:
  - Full SSR/SSG optimization
  - Production environment variables
  - Search engine indexing enabled

## Performance Optimizations

### 1. Build Optimizations

- **Code Splitting**: Automatic by Nuxt
- **Tree Shaking**: Enabled for unused code removal
- **Minification**: Terser with console log removal
- **Bundle Analysis**: Available via `pnpm build:analyze`

### 2. Runtime Optimizations

- **Image Optimization**: Vercel's automatic image optimization
- **Font Loading**: Google Fonts with `font-display: swap`
- **Lazy Loading**: Components and images
- **Caching**: Multi-layer caching strategy

### 3. Network Optimizations

- **CDN**: Global edge network via Vercel
- **Compression**: Gzip/Brotli compression
- **HTTP/2**: Enabled by default
- **Preconnect**: Google Fonts domains

## Monitoring & Analytics

### 1. Vercel Analytics

- **Web Vitals**: Core Web Vitals tracking
- **Speed Insights**: Performance monitoring
- **Audience**: Traffic analytics

### 2. Custom Analytics

- **Google Analytics**: Optional integration
- **Plausible**: Privacy-focused alternative
- **Error Tracking**: Sentry integration ready

## Troubleshooting

### Common Issues

1. **Build Failures:**
   ```bash
   # Check Node.js version
   # Verify pnpm-lock.yaml is committed
   # Check environment variables
   ```

2. **Routing Issues:**
   ```bash
   # Verify vercel.json routing rules
   # Check i18n configuration in nuxt.config.ts
   # Test locale detection
   ```

3. **Performance Issues:**
   ```bash
   # Analyze bundle size: pnpm build:analyze
   # Check image optimization settings
   # Review caching headers
   ```

### Debug Commands

```bash
# Local preview of Vercel build
vercel build
vercel dev

# Check deployment logs
vercel logs [deployment-url]

# Environment variables
vercel env ls
```

## Security Considerations

### 1. Environment Variables

- Never commit `.env` files with secrets
- Use Vercel's environment variable system
- Rotate API keys regularly

### 2. Content Security Policy

- Review and adjust CSP headers as needed
- Test all third-party integrations
- Monitor CSP violations

### 3. Access Control

- Configure appropriate headers
- Implement rate limiting if needed
- Monitor for suspicious activity

## Maintenance

### Regular Tasks

1. **Dependencies**: Update monthly
2. **Node.js**: Follow LTS releases
3. **Vercel**: Monitor usage and limits
4. **SSL**: Automatic renewal (verify)
5. **Performance**: Monthly Web Vitals review

### Backup Strategy

- Source code: Git repository
- Content: Content API exports
- Environment: Document all variables
- Database: If applicable

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Nuxt 3 Deployment](https://nuxt.com/docs/getting-started/deployment)
- [Performance Best Practices](https://web.dev/performance/)
- [Security Headers](https://securityheaders.com/)

---

**Note**: Replace placeholder values with your actual domain, API keys, and configuration values before deployment.