# Environment Security Configuration Guide

This guide covers security best practices for managing environment variables and secrets in your Nuxt 3 multilingual personal website.

## Table of Contents

1. [Security Principles](#security-principles)
2. [Environment Variable Types](#environment-variable-types)
3. [Development Environment Security](#development-environment-security)
4. [Production Environment Security](#production-environment-security)
5. [Deployment Platform Configuration](#deployment-platform-configuration)
6. [Secret Management Best Practices](#secret-management-best-practices)
7. [Security Validation](#security-validation)
8. [Incident Response](#incident-response)

## Security Principles

### Core Security Guidelines

1. **Never commit secrets to version control**
   - Use `.env` files for local development only
   - Add all `.env.*` files (except `.env.example`) to `.gitignore`
   - Use deployment platform secret management for production

2. **Principle of least privilege**
   - Only expose variables that need to be public
   - Use `NUXT_PUBLIC_*` prefix only for client-side variables
   - Keep server-side secrets private

3. **Environment separation**
   - Use different secrets for each environment
   - Rotate secrets regularly
   - Monitor secret usage and access

4. **Defense in depth**
   - Validate environment variables at startup
   - Use secure defaults
   - Implement runtime security checks

## Environment Variable Types

### Build-time vs Runtime Variables

```typescript
// Build-time variables (available during build)
NUXT_PUBLIC_SITE_URL=https://yourdomain.com  // Client-side accessible
NUXT_API_SECRET=server-only-secret           // Server-side only

// Runtime variables (available at request time)
VERCEL_URL=auto-generated-by-platform        // Platform-specific
DATABASE_URL=connection-string               // Runtime configuration
```

### Public vs Private Variables

| Variable Type | Prefix | Accessibility | Security Level |
|---------------|--------|--------------|----------------|
| Public | `NUXT_PUBLIC_*` | Client & Server | Low (publicly visible) |
| Private | `NUXT_*` | Server only | High (encrypted in platform) |
| Platform | Platform-specific | Context-dependent | Varies |

### Variable Classification

```bash
# ✅ Safe for public exposure
NUXT_PUBLIC_SITE_URL=https://yourdomain.com
NUXT_PUBLIC_SITE_NAME="Your Website"
NUXT_PUBLIC_FEATURE_BLOG=true

# 🔒 Must be kept private
NUXT_API_SECRET=your-secret-key
DATABASE_URL=postgresql://user:pass@host/db
SMTP_PASS=email-password
JWT_SECRET=jwt-signing-key

# ⚠️ Context-dependent (check platform documentation)
VERCEL_URL=auto-generated
NETLIFY_SITE_ID=site-identifier
```

## Development Environment Security

### Local Development Setup

1. **Create secure local environment**:
   ```bash
   # Copy example file
   cp .env.example .env.local
   
   # Generate secure secrets
   npm run generate:secrets
   
   # Validate configuration
   npm run validate:env
   ```

2. **Use development-specific services**:
   ```bash
   # Use testing email service
   SMTP_HOST=smtp.ethereal.email
   
   # Use local database
   DATABASE_URL=file:./dev.db
   
   # Disable analytics in development
   NUXT_PUBLIC_FEATURE_ANALYTICS=false
   ```

3. **Development security checklist**:
   - [ ] `.env.local` is in `.gitignore`
   - [ ] Using non-production API keys
   - [ ] Database is local or development instance
   - [ ] Debug mode is enabled only locally

### Secure Development Practices

```bash
# ✅ Good: Use environment-specific files
.env.development     # Safe defaults for development
.env.local          # Your personal overrides (gitignored)

# ❌ Bad: Committing secrets
.env                # Contains real API keys (never commit)
```

## Production Environment Security

### Production Security Requirements

1. **Secret Management**:
   - All secrets must be stored in deployment platform
   - Never use default or example values
   - Implement secret rotation schedule

2. **Network Security**:
   - Use HTTPS only
   - Configure proper CORS headers
   - Implement rate limiting

3. **Monitoring**:
   - Enable error tracking
   - Monitor for security incidents
   - Log security-relevant events

### Production Validation

```typescript
// Automatic validation in production
const validation = validateEnvironment({
  strict: true,
  environment: 'production',
  skipSecurityChecks: false
})

if (!validation.isValid) {
  throw new Error('Production environment validation failed')
}
```

## Deployment Platform Configuration

### Vercel Configuration

1. **Environment Variables Setup**:
   ```bash
   # Via Vercel CLI
   vercel env add NUXT_API_SECRET production
   vercel env add DATABASE_URL production
   
   # Via Dashboard: https://vercel.com/dashboard/settings/environment-variables
   ```

2. **Security Configuration**:
   ```json
   // vercel.json
   {
     "env": {
       "NUXT_PUBLIC_SITE_URL": "https://yourdomain.com"
     },
     "build": {
       "env": {
         "NODE_ENV": "production"
       }
     }
   }
   ```

3. **Vercel-specific Variables**:
   ```bash
   VERCEL_URL          # Auto-generated deployment URL
   VERCEL_ENV          # deployment, preview, production
   VERCEL_REGION       # Deployment region
   ```

### Netlify Configuration

1. **Environment Variables Setup**:
   ```bash
   # Via Netlify CLI
   netlify env:set NUXT_API_SECRET your-secret-value
   
   # Via Dashboard: Site settings > Environment variables
   ```

2. **Security Configuration**:
   ```toml
   # netlify.toml
   [build.environment]
     NODE_ENV = "production"
     NUXT_ENV_ENVIRONMENT = "production"
   
   [context.deploy-preview.environment]
     NUXT_ENV_ENVIRONMENT = "staging"
   ```

3. **Netlify-specific Variables**:
   ```bash
   NETLIFY_SITE_ID     # Site identifier
   CONTEXT             # production, deploy-preview, branch-deploy
   URL                 # Site URL
   DEPLOY_PRIME_URL    # Deploy URL
   ```

### Platform-Specific Security Features

| Platform | Secret Encryption | Environment Isolation | Audit Logging |
|----------|------------------|----------------------|---------------|
| Vercel | ✅ AES-256 | ✅ Per environment | ✅ Access logs |
| Netlify | ✅ Encrypted | ✅ Context-based | ✅ Build logs |

## Secret Management Best Practices

### Secret Generation

```bash
# Generate secure API secret (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate JWT secret (64+ characters)
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"

# Use built-in generator
npm run generate:secrets
```

### Secret Rotation Schedule

| Secret Type | Rotation Frequency | Priority |
|-------------|-------------------|----------|
| API Keys | Every 90 days | High |
| JWT Secrets | Every 30 days | Critical |
| Database Passwords | Every 60 days | High |
| Third-party Tokens | As required by service | Medium |

### Access Control

1. **Limit access to secrets**:
   - Only necessary team members
   - Use role-based access control
   - Regular access reviews

2. **Audit secret usage**:
   - Monitor deployment logs
   - Track secret access
   - Alert on suspicious activity

## Security Validation

### Automated Security Checks

```bash
# Run security validation
npm run validate:env

# Check for insecure defaults
npm run security:audit

# Validate production readiness
npm run security:production-check
```

### Security Test Checklist

- [ ] No secrets in version control
- [ ] All production secrets are unique and secure
- [ ] Environment validation passes
- [ ] HTTPS is enforced in production
- [ ] Rate limiting is configured
- [ ] Error tracking is enabled
- [ ] Security headers are configured

### Continuous Security Monitoring

```typescript
// Security monitoring in production
export function monitorSecurityIncidents() {
  // Rate limiting violations
  if (rateLimitExceeded) {
    logSecurityEvent('rate_limit_exceeded', { ip, userAgent })
  }
  
  // Invalid authentication attempts
  if (authenticationFailed) {
    logSecurityEvent('auth_failure', { ip, timestamp })
  }
  
  // Suspicious environment access
  if (suspiciousAccess) {
    logSecurityEvent('env_access_suspicious', { context })
  }
}
```

## Incident Response

### Security Incident Types

1. **Secret Exposure**:
   - Secret committed to repository
   - Secret visible in logs
   - Unauthorized access to secrets

2. **Environment Compromise**:
   - Unauthorized access to deployment
   - Malicious environment changes
   - Data exfiltration attempts

### Incident Response Steps

1. **Immediate Response**:
   ```bash
   # 1. Rotate compromised secrets
   npm run rotate:secrets
   
   # 2. Revoke access tokens
   npm run revoke:tokens
   
   # 3. Update deployment with new secrets
   npm run deploy:emergency
   ```

2. **Investigation**:
   - Review access logs
   - Identify scope of compromise
   - Document timeline of events

3. **Recovery**:
   - Deploy with new secrets
   - Verify system integrity
   - Monitor for continued threats

4. **Post-Incident**:
   - Update security procedures
   - Improve monitoring
   - Train team on lessons learned

### Emergency Contacts

```bash
# Emergency secret rotation
EMERGENCY_ROTATION_WEBHOOK=https://hooks.slack.com/emergency
SECURITY_TEAM_EMAIL=security@yourdomain.com
INCIDENT_RESPONSE_PHONE=+1-xxx-xxx-xxxx
```

## Security Resources

### Tools and Services

- **Secret Scanning**: GitHub Secret Scanning, GitLab Secret Detection
- **Security Headers**: Security Headers Analyzer
- **SSL/TLS**: SSL Labs Server Test
- **Dependencies**: npm audit, Snyk

### Further Reading

- [OWASP Environment Configuration](https://owasp.org/www-project-cheat-sheets/cheatsheets/Configuration_Cheat_Sheet.html)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)
- [Platform Security Documentation](https://vercel.com/docs/security)

### Security Checklist Template

```markdown
## Pre-Deployment Security Checklist

### Environment Configuration
- [ ] All secrets are unique and secure
- [ ] No default or example values in production
- [ ] Environment validation passes
- [ ] Proper variable classification (public/private)

### Platform Security
- [ ] Secrets are stored in platform secret management
- [ ] Environment isolation is configured
- [ ] Access controls are implemented
- [ ] Audit logging is enabled

### Application Security
- [ ] HTTPS is enforced
- [ ] Security headers are configured
- [ ] Rate limiting is implemented
- [ ] Error tracking is configured

### Monitoring
- [ ] Security monitoring is enabled
- [ ] Incident response plan is documented
- [ ] Emergency contacts are updated
- [ ] Regular security reviews are scheduled
```

---

**Remember**: Security is an ongoing process, not a one-time setup. Regularly review and update your security configuration as your application grows and evolves.