# Vercel Deployment Checklist

Use this checklist to ensure a successful deployment to Vercel.

## Pre-Deployment Checklist

### 📋 Configuration Files

- [ ] `vercel.json` exists and is configured
- [ ] `nuxt.config.ts` has proper Nitro preset
- [ ] `package.json` includes Vercel scripts
- [ ] Environment files (`.env.development`, `.env.staging`, `.env.production`) are created
- [ ] `pnpm-lock.yaml` is committed to repository

### 🔧 Build Configuration

- [ ] Build command is set to `pnpm build`
- [ ] Install command is set to `pnpm install --frozen-lockfile`
- [ ] Output directory is set to `.output/public`
- [ ] Node.js version is 18.x or higher

### 🌐 Routing & i18n

- [ ] Multilingual routes are configured (Arabic default, English `/en`)
- [ ] Redirects are set up for legacy URLs
- [ ] Sitemap and robots.txt routes are configured
- [ ] i18n middleware is working correctly

### 🔒 Security

- [ ] Security headers are configured (CSP, HSTS, X-Frame-Options)
- [ ] Content Security Policy allows necessary external resources
- [ ] X-XSS-Protection and X-Content-Type-Options are set
- [ ] Permissions-Policy is configured appropriately

### ⚡ Performance

- [ ] Caching headers are set for static assets
- [ ] Image optimization is enabled
- [ ] Bundle analysis is available (`pnpm build:analyze`)
- [ ] Lazy loading is implemented
- [ ] Font loading is optimized

## Vercel Project Setup

### 🚀 Initial Setup

- [ ] Repository is connected to Vercel
- [ ] Framework is detected as Nuxt.js
- [ ] Build settings are configured correctly
- [ ] Custom domain is added (if applicable)

### 🔐 Environment Variables

#### Required Variables
- [ ] `NUXT_PUBLIC_SITE_URL` (production domain)
- [ ] `NUXT_API_SECRET` (secure random string)

#### Optional Variables
- [ ] `GOOGLE_ANALYTICS_ID` (if using analytics)
- [ ] `PLAUSIBLE_DOMAIN` (if using Plausible)
- [ ] `GITHUB_TOKEN` (for content management)
- [ ] `TWITTER_API_KEY` (for social features)

#### Environment-Specific Settings
- [ ] Development environment variables
- [ ] Preview/Staging environment variables  
- [ ] Production environment variables

### 🎯 Domain Configuration

- [ ] Custom domain added in Vercel dashboard
- [ ] DNS records configured (A record for root, CNAME for www)
- [ ] SSL certificate is active
- [ ] HTTPS redirect is enabled

## Testing Checklist

### 🧪 Local Testing

- [ ] `pnpm dev` works correctly
- [ ] `pnpm build` completes without errors
- [ ] `pnpm preview` serves the built application
- [ ] All routes work in both languages
- [ ] Environment variables are loaded correctly

### 🌐 Vercel Testing

- [ ] `vercel dev` works locally
- [ ] Preview deployment succeeds
- [ ] All pages load correctly in preview
- [ ] i18n routing works in preview
- [ ] Assets and images load properly

### 📱 Cross-Platform Testing

- [ ] Desktop browsers (Chrome, Firefox, Safari, Edge)
- [ ] Mobile browsers (iOS Safari, Android Chrome)
- [ ] RTL layout works correctly for Arabic
- [ ] LTR layout works correctly for English
- [ ] Touch interactions work on mobile

## Performance Validation

### 📊 Core Web Vitals

- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] First Input Delay (FID) < 100ms
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] First Contentful Paint (FCP) < 1.8s

### 🔍 Lighthouse Audit

- [ ] Performance score > 90
- [ ] Accessibility score > 95
- [ ] Best Practices score > 90
- [ ] SEO score > 95

### 📈 Bundle Analysis

- [ ] Total bundle size is reasonable
- [ ] No duplicate dependencies
- [ ] Code splitting is working
- [ ] Unused code is tree-shaken

## SEO Verification

### 🔍 Meta Tags

- [ ] Page titles are set correctly
- [ ] Meta descriptions are present
- [ ] Open Graph tags are configured
- [ ] Twitter Card meta tags are set
- [ ] Canonical URLs are correct

### 🗺️ Sitemaps & Indexing

- [ ] Sitemap.xml is accessible
- [ ] Robots.txt is configured correctly
- [ ] Google Search Console is set up
- [ ] Both language versions are indexed

### 🌍 Multilingual SEO

- [ ] `hreflang` tags are implemented
- [ ] Language-specific meta tags
- [ ] Proper URL structure for each language
- [ ] Structured data is language-aware

## Monitoring Setup

### 📊 Analytics

- [ ] Vercel Analytics is enabled
- [ ] Google Analytics is configured (if used)
- [ ] Plausible Analytics is set up (if used)
- [ ] Conversion tracking is implemented

### 🚨 Error Monitoring

- [ ] Error tracking is set up (Sentry, etc.)
- [ ] 404 pages are customized
- [ ] Error pages are translated
- [ ] Log monitoring is configured

### 🔔 Alerts

- [ ] Uptime monitoring
- [ ] Performance degradation alerts
- [ ] Error rate monitoring
- [ ] Build failure notifications

## Post-Deployment Tasks

### ✅ Immediate Verification

- [ ] All main pages load correctly
- [ ] Language switching works
- [ ] Contact forms work (if applicable)
- [ ] Search functionality works
- [ ] Blog posts are accessible

### 📈 Performance Monitoring

- [ ] Monitor Core Web Vitals for 24-48 hours
- [ ] Check for any performance regressions
- [ ] Verify caching is working correctly
- [ ] Monitor error rates

### 🔧 Ongoing Maintenance

- [ ] Set up automated dependency updates
- [ ] Plan regular security audits
- [ ] Schedule performance reviews
- [ ] Document deployment process

## Rollback Plan

### 🔄 Rollback Procedures

- [ ] Document current deployment URL
- [ ] Know how to revert to previous deployment
- [ ] Have database backup (if applicable)
- [ ] Test rollback process in staging

### 📞 Emergency Contacts

- [ ] Development team contacts
- [ ] Domain/DNS provider support
- [ ] Vercel support information
- [ ] Client/stakeholder contacts

## Validation Commands

```bash
# Local validation
pnpm build
pnpm preview
node scripts/validate-vercel-config.js

# Vercel deployment
vercel --prebuilt  # Preview
vercel --prod --prebuilt  # Production

# Performance testing
pnpm build:analyze
lighthouse https://yourdomain.com
```

## Common Issues & Solutions

### Build Failures
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Ensure pnpm-lock.yaml is committed

### Routing Issues
- Verify vercel.json routing rules
- Check i18n configuration
- Test locale detection

### Performance Issues
- Analyze bundle size
- Check image optimization
- Review caching headers

### Security Issues
- Validate CSP headers
- Check for mixed content
- Verify HTTPS enforcement

---

**Note**: Complete this checklist before each deployment and keep it updated as your application evolves.