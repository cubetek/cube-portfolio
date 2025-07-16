# Environment Setup Guide

This guide provides comprehensive instructions for setting up and managing environment variables for your Nuxt 3 multilingual personal website.

## Quick Start

### 1. Initial Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd cube-blog

# Install dependencies
npm install

# Set up environment variables
npm run env:setup

# Validate configuration
npm run env:validate

# Start development server
npm run dev
```

### 2. Environment Files Overview

```
project/
├── .env.example          # Template with all available variables
├── .env.development      # Development defaults
├── .env.staging         # Staging configuration  
├── .env.production      # Production configuration
├── .env.local           # Your local overrides (gitignored)
├── .env.*.local         # Environment-specific local overrides
```

## Environment Management Scripts

### Available Scripts

```bash
# Interactive environment setup
npm run env:setup

# Validation scripts
npm run env:validate                # Validate current environment
npm run env:validate:dev            # Validate development environment
npm run env:validate:staging        # Validate staging environment
npm run env:validate:prod           # Validate production environment

# Security utilities
npm run env:generate-secrets        # Generate secure random secrets
npm run security:audit             # Run security audit
npm run security:check             # Strict production security check
```

### Environment Setup Wizard

The interactive setup wizard helps you configure environment variables:

```bash
npm run env:setup
```

This script will:
1. Ask you to select an environment (development, staging, production)
2. Guide you through required variables
3. Offer to configure optional variables
4. Set up feature flags
5. Generate secure secrets where needed
6. Create the appropriate `.env` file

### Environment Validation

Validate your environment configuration:

```bash
# Basic validation
npm run env:validate

# Strict validation for production
npm run env:validate:prod

# Environment-specific validation
npm run env:validate:dev
npm run env:validate:staging
```

The validation system checks for:
- Missing required variables
- Incorrect variable formats (URLs, emails, etc.)
- Insecure default values
- Security best practices
- Environment-specific requirements

## Environment Variable Categories

### Core Application Variables

```bash
# Required for all environments
NUXT_PUBLIC_SITE_URL=https://yourdomain.com
NUXT_PUBLIC_SITE_NAME="Your Personal Website"
NUXT_PUBLIC_SITE_DESCRIPTION="Personal portfolio and blog website"
NUXT_PUBLIC_API_BASE=/api

# Required for production/staging
NUXT_API_SECRET=your-secure-secret-key
```

### Feature Flags

Control which features are enabled:

```bash
NUXT_PUBLIC_FEATURE_BLOG=true
NUXT_PUBLIC_FEATURE_PROJECTS=true
NUXT_PUBLIC_FEATURE_CONTACT_FORM=true
NUXT_PUBLIC_FEATURE_NEWSLETTER=true
NUXT_PUBLIC_FEATURE_COMMENTS=false
NUXT_PUBLIC_FEATURE_SEARCH=false
NUXT_PUBLIC_FEATURE_ANALYTICS=true
NUXT_PUBLIC_FEATURE_ERROR_TRACKING=false
```

### Email Service Configuration

Choose one email service provider:

```bash
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com

# Or SendGrid
SENDGRID_API_KEY=SG.your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Or Resend
RESEND_API_KEY=re_your-resend-api-key
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### Analytics & Tracking

```bash
# Google Analytics
NUXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# Google Tag Manager
NUXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Privacy-focused alternatives
NUXT_PUBLIC_UMAMI_WEBSITE_ID=your-umami-id
NUXT_PUBLIC_UMAMI_URL=https://analytics.umami.is

NUXT_PUBLIC_PLAUSIBLE_DOMAIN=yourdomain.com
NUXT_PUBLIC_PLAUSIBLE_API_HOST=https://plausible.io
```

### Error Tracking & Monitoring

```bash
# Sentry
NUXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_AUTH_TOKEN=your-sentry-auth-token

# LogRocket
NUXT_PUBLIC_LOGROCKET_APP_ID=your-app-id
```

### Social Media & Sharing

```bash
NUXT_PUBLIC_GITHUB_URL=https://github.com/yourusername
NUXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/in/yourusername
NUXT_PUBLIC_TWITTER_URL=https://twitter.com/yourusername
NUXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/yourusername
NUXT_PUBLIC_TWITTER_HANDLE=@yourusername
```

## Environment-Specific Configuration

### Development Environment

For local development, create `.env.local`:

```bash
# Copy from example
cp .env.example .env.local

# Or use setup wizard
npm run env:setup
# Select: 1. Development

# Edit .env.local with your preferences
```

Development-specific settings:
- Uses insecure default secrets (OK for development)
- Enables debug features
- Disables analytics and error tracking
- Uses local or test services

### Staging Environment

For staging deployments:

```bash
# Configure staging environment
npm run env:setup
# Select: 2. Staging - Pre-production testing

# Or manually create .env.staging.local
```

Staging-specific settings:
- Uses secure secrets (different from production)
- Enables all features for testing
- Uses staging/test external services
- Enables error tracking for debugging

### Production Environment

For production deployments:

```bash
# Configure production environment  
npm run env:setup
# Select: 3. Production - Live deployment

# Validate production configuration
npm run env:validate:prod
npm run security:check
```

Production-specific settings:
- Uses secure, unique secrets
- Enables all production features
- Uses live external services
- Strict security validation

## Deployment Platform Setup

### Vercel Deployment

1. **Set environment variables in Vercel dashboard**:
   - Go to Project Settings > Environment Variables
   - Add variables for each environment (Production, Preview, Development)

2. **Using Vercel CLI**:
   ```bash
   # Add production variables
   vercel env add NUXT_API_SECRET production
   vercel env add DATABASE_URL production
   
   # Add preview variables
   vercel env add NUXT_API_SECRET preview
   vercel env add DATABASE_URL preview
   ```

3. **Automatic variables**:
   - `VERCEL=1` - Always set on Vercel
   - `VERCEL_ENV` - production, preview, or development
   - `VERCEL_URL` - Deployment URL

See [Vercel Environment Guide](./vercel-environment.md) for detailed instructions.

### Netlify Deployment

1. **Set environment variables in Netlify dashboard**:
   - Go to Site Settings > Environment Variables
   - Configure scopes (All, Production, Deploy previews)

2. **Using Netlify CLI**:
   ```bash
   # Add variables with scopes
   netlify env:set NUXT_API_SECRET "your-secret" --scope production
   netlify env:set DATABASE_URL "your-db-url" --scope production,deploy-preview
   ```

3. **Context-specific configuration in `netlify.toml`**:
   ```toml
   [context.production.environment]
     NUXT_ENV_ENVIRONMENT = "production"
   
   [context.deploy-preview.environment]
     NUXT_ENV_ENVIRONMENT = "staging"
   ```

4. **Automatic variables**:
   - `NETLIFY=true` - Always set on Netlify
   - `CONTEXT` - production, deploy-preview, or branch-deploy
   - `URL` - Site URL

See [Netlify Environment Guide](./netlify-environment.md) for detailed instructions.

## Security Best Practices

### Secret Management

1. **Generate secure secrets**:
   ```bash
   npm run env:generate-secrets
   ```

2. **Use different secrets for each environment**:
   - Development: Can use insecure defaults
   - Staging: Secure but separate from production
   - Production: Unique, strong secrets

3. **Store secrets securely**:
   - ✅ Use deployment platform secret management
   - ✅ Use encrypted environment variables
   - ❌ Never commit secrets to version control
   - ❌ Don't use default/example values in production

### Security Validation

```bash
# Run security checks
npm run security:audit
npm run security:check

# Validate specific environment
npm run env:validate:prod
```

The security system checks for:
- Insecure default values
- Weak secret lengths
- Incorrect variable formats
- Missing required variables
- Inappropriate settings for environment

### Security Checklist

- [ ] All secrets are unique and secure
- [ ] No default/example values in production
- [ ] Secrets are stored in deployment platform
- [ ] Environment validation passes
- [ ] Security audit passes
- [ ] Different secrets per environment
- [ ] Regular secret rotation scheduled

## Troubleshooting

### Common Issues

**Environment variables not loading**:
```bash
# Check file precedence
# Files are loaded in this order (later files override earlier):
# .env
# .env.local
# .env.[environment]
# .env.[environment].local

# Debug environment loading
npm run env:validate:dev
```

**Validation failures**:
```bash
# Get detailed validation output
npm run env:validate:dev 2>&1

# Check specific variable format
node -e "console.log('URL valid:', /^https?:\/\//.test('$NUXT_PUBLIC_SITE_URL'))"
```

**Build failures**:
```bash
# Ensure build-time variables are set
NODE_ENV=production npm run build

# Check runtime config
npm run dev
# Check browser console for config object
```

**Deployment issues**:
```bash
# Validate platform-specific variables
# Vercel
echo $VERCEL_ENV
echo $VERCEL_URL

# Netlify  
echo $CONTEXT
echo $URL
```

### Debug Mode

Enable debug mode to see environment loading:

```bash
# Development
DEBUG=true npm run dev

# Or set in .env.local
DEBUG=true
NUXT_DEBUG=true
```

### Validation Output

The validation system provides detailed output:

```bash
🔍 Validating development environment...

✅ NODE_ENV: Valid
✅ NUXT_PUBLIC_SITE_URL: Valid
❌ Missing required: NUXT_API_SECRET (Secret key for API authentication)
⚠️  SMTP_HOST: Using development value

📊 Validation Report
===================
Total variables checked: 25
Validated successfully: 20
Failed validation: 1
Warnings: 4

❌ Overall: INVALID
```

## Advanced Configuration

### Custom Validation Rules

Extend validation rules in `utils/env-validation.ts`:

```typescript
export const CUSTOM_VALIDATION_RULES: EnvValidationRule[] = [
  {
    key: 'CUSTOM_API_KEY',
    required: true,
    type: 'string',
    pattern: /^ck_/,
    description: 'Custom service API key'
  }
]
```

### Environment-Specific Logic

Use environment detection in your application:

```typescript
// composables/useEnvironment.ts
const { environment, isDevelopment, isProduction } = useEnvironment()

if (isDevelopment) {
  // Development-only code
}

if (isProduction) {
  // Production-only code
}
```

### Feature Flag Management

Control features dynamically:

```vue
<template>
  <div>
    <ContactForm v-if="features.contactForm" />
    <NewsletterSignup v-if="features.newsletter" />
    <Analytics v-if="features.analytics" />
  </div>
</template>

<script setup>
const { features } = useEnvironment()
</script>
```

## Resources

- [Environment Security Guide](./environment-security.md)
- [Vercel Environment Guide](./vercel-environment.md)
- [Netlify Environment Guide](./netlify-environment.md)
- [Nuxt Runtime Config Documentation](https://nuxt.com/docs/guide/going-further/runtime-config)

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Run validation scripts to identify problems
3. Review the security documentation
4. Check platform-specific guides

---

**Remember**: Proper environment management is crucial for security, maintainability, and deployment success. Take time to set it up correctly!