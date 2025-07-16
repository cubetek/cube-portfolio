# GitHub Actions Workflows

This directory contains the CI/CD pipeline configuration for the Nuxt 3 multilingual personal website.

## Main Workflow (`main.yml`)

### Triggers
- **Push**: to `main` and `develop` branches
- **Pull Request**: to `main` and `develop` branches  
- **Release**: when published
- **Manual**: via workflow_dispatch with environment selection

### Jobs Overview

1. **Setup** - Install dependencies and set up caching
2. **Lint** - ESLint and code quality checks
3. **TypeCheck** - TypeScript validation
4. **Test** - Unit tests and validation
5. **Build SSR** - Server-side rendering build test
6. **Build SSG** - Static site generation test
7. **Security** - Dependency audit and security checks
8. **Deploy Staging** - Deploy to staging environment
9. **Deploy Production** - Deploy to production environment
10. **Notify** - Send deployment notifications

### Node.js Version Strategy
- **Development/PR**: Node.js 20.x only (fast feedback)
- **Release**: Node.js 18.x, 20.x, 21.x (comprehensive testing)

### Caching Strategy
- **Dependencies**: pnpm store and node_modules
- **Build artifacts**: .nuxt, .output, dist directories
- **Cache keys**: Based on pnpm-lock.yaml hash

### Environment Configuration

#### Required Secrets (if deploying)
Set these in your GitHub repository settings under **Settings > Secrets and variables > Actions**:

```
# For Vercel deployment
VERCEL_TOKEN=your-vercel-token
VERCEL_SCOPE=your-vercel-scope

# For Netlify deployment  
NETLIFY_AUTH_TOKEN=your-netlify-token
NETLIFY_SITE_ID=your-site-id

# For custom server deployment
SSH_PRIVATE_KEY=your-ssh-key
SERVER_HOST=your-server-host
SERVER_USER=your-server-user
```

#### Environment Setup
1. Go to **Settings > Environments** in your GitHub repository
2. Create environments: `staging` and `production`
3. Configure protection rules and secrets for each environment

### Multilingual Testing
The workflow specifically tests both language versions:
- Arabic (RTL, default): `http://localhost:3000`
- English (LTR): `http://localhost:3000/en`

### Build Modes
Both SSR and SSG builds are tested to ensure compatibility with different deployment strategies:
- **SSR**: Full server-side rendering with `pnpm build`
- **SSG**: Static site generation with `pnpm generate`

### Workflow Features
- ✅ Parallel job execution for faster CI/CD
- ✅ Aggressive caching for dependencies and build artifacts
- ✅ Node.js version matrix testing
- ✅ Environment-specific deployments
- ✅ Security auditing
- ✅ Multilingual validation
- ✅ Both SSR and SSG testing
- ✅ Post-deployment verification
- ✅ Failure notifications

### Manual Deployment
Trigger manual deployments via **Actions** tab:
1. Select "CI/CD Pipeline" workflow
2. Click "Run workflow"
3. Choose target environment (staging/production)
4. Click "Run workflow"

### Customization
To customize for your hosting provider, update the deployment steps in the `deploy-staging` and `deploy-production` jobs with your specific deployment commands.