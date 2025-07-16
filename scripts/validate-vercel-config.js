#!/usr/bin/env node

/**
 * Vercel Configuration Validator
 * This script validates the vercel.json configuration file
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

const CONFIG_FILE = resolve(process.cwd(), 'vercel.json');

// Color codes for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(type, message) {
  const color = colors[type] || colors.reset;
  console.log(`${color}[${type.toUpperCase()}]${colors.reset} ${message}`);
}

function validateConfig() {
  let config;
  
  try {
    const configContent = readFileSync(CONFIG_FILE, 'utf8');
    config = JSON.parse(configContent);
    log('info', 'vercel.json loaded successfully');
  } catch (error) {
    log('error', `Failed to load vercel.json: ${error.message}`);
    process.exit(1);
  }

  const errors = [];
  const warnings = [];

  // Validate required fields
  if (!config.version) {
    errors.push('Missing required field: version');
  } else if (config.version !== 2) {
    warnings.push('Consider using version 2 for latest features');
  }

  // Validate build configuration
  if (config.buildCommand && !config.buildCommand.includes('pnpm')) {
    warnings.push('Build command should use pnpm for consistency');
  }

  if (config.installCommand && !config.installCommand.includes('frozen-lockfile')) {
    warnings.push('Install command should use --frozen-lockfile for reproducible builds');
  }

  // Validate Node.js version
  if (config.build?.env?.NODE_VERSION) {
    const nodeVersion = config.build.env.NODE_VERSION;
    if (!nodeVersion.startsWith('18') && !nodeVersion.startsWith('20')) {
      warnings.push('Consider using Node.js 18.x or 20.x for better performance');
    }
  }

  // Validate routes for multilingual support
  const routes = config.routes || [];
  const hasEnglishRoute = routes.some(route => 
    route.src && route.src.includes('/en')
  );
  
  if (!hasEnglishRoute) {
    warnings.push('No English route pattern found - check multilingual routing');
  }

  // Validate security headers
  const headers = config.headers || [];
  const globalHeaders = headers.find(h => h.source === '/(.*)')?.headers || [];
  
  const requiredSecurityHeaders = [
    'X-Content-Type-Options',
    'X-Frame-Options',
    'X-XSS-Protection',
    'Content-Security-Policy'
  ];

  requiredSecurityHeaders.forEach(header => {
    const hasHeader = globalHeaders.some(h => h.key === header);
    if (!hasHeader) {
      warnings.push(`Missing security header: ${header}`);
    }
  });

  // Validate caching strategy
  const staticAssetHeaders = headers.find(h => 
    h.source && h.source.includes('\\.(css|js|woff2?')
  );
  
  if (!staticAssetHeaders) {
    warnings.push('No caching strategy found for static assets');
  }

  // Validate redirects for SEO
  const redirects = config.redirects || [];
  const hasIndexRedirect = redirects.some(r => 
    r.source.includes('index.html')
  );
  
  if (!hasIndexRedirect) {
    warnings.push('Consider adding redirects for index.html files');
  }

  // Validate functions configuration
  if (config.functions) {
    Object.entries(config.functions).forEach(([path, funcConfig]) => {
      if (funcConfig.runtime && !funcConfig.runtime.startsWith('nodejs18')) {
        warnings.push(`Function ${path} should use nodejs18.x runtime`);
      }
      
      if (!funcConfig.maxDuration || funcConfig.maxDuration > 30) {
        warnings.push(`Function ${path} should have maxDuration <= 30 seconds`);
      }
    });
  }

  // Report results
  console.log('\n=== Vercel Configuration Validation ===\n');

  if (errors.length === 0) {
    log('green', 'Configuration validation passed!');
  } else {
    log('red', 'Configuration validation failed:');
    errors.forEach(error => log('red', `  • ${error}`));
  }

  if (warnings.length > 0) {
    log('yellow', 'Warnings:');
    warnings.forEach(warning => log('yellow', `  • ${warning}`));
  }

  if (errors.length === 0 && warnings.length === 0) {
    log('green', 'Perfect! No issues found in vercel.json');
  }

  console.log('\n=== Configuration Summary ===');
  console.log(`Build Command: ${config.buildCommand || 'Not specified'}`);
  console.log(`Install Command: ${config.installCommand || 'Not specified'}`);
  console.log(`Output Directory: ${config.outputDirectory || 'Not specified'}`);
  console.log(`Node.js Version: ${config.build?.env?.NODE_VERSION || 'Not specified'}`);
  console.log(`Routes: ${(config.routes || []).length} defined`);
  console.log(`Redirects: ${(config.redirects || []).length} defined`);
  console.log(`Headers: ${(config.headers || []).length} defined`);
  console.log(`Functions: ${Object.keys(config.functions || {}).length} defined`);

  return errors.length === 0;
}

// Additional validation functions
function validateEnvironmentVariables() {
  console.log('\n=== Environment Variables Check ===');
  
  const requiredEnvVars = [
    'NUXT_PUBLIC_SITE_URL',
    'NUXT_API_SECRET'
  ];

  const missingVars = requiredEnvVars.filter(varName => {
    const value = process.env[varName];
    return !value || value.includes('your-') || value.includes('change-me');
  });

  if (missingVars.length > 0) {
    log('yellow', 'Missing or placeholder environment variables:');
    missingVars.forEach(varName => {
      log('yellow', `  • ${varName}`);
    });
    log('info', 'Set these in your Vercel project dashboard');
  } else {
    log('green', 'All required environment variables are configured');
  }
}

function validateNuxtConfig() {
  console.log('\n=== Nuxt Configuration Check ===');
  
  try {
    // Check if nuxt.config.ts exists and has proper Vercel settings
    const nuxtConfigExists = readFileSync(resolve(process.cwd(), 'nuxt.config.ts'), 'utf8');
    
    if (nuxtConfigExists.includes('nitro')) {
      log('green', 'Nitro configuration found in nuxt.config.ts');
    } else {
      log('yellow', 'Consider adding Nitro configuration for Vercel optimization');
    }

    if (nuxtConfigExists.includes('i18n')) {
      log('green', 'i18n configuration found');
    } else {
      log('yellow', 'i18n configuration not found');
    }

  } catch (error) {
    log('red', 'Could not read nuxt.config.ts');
  }
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🔍 Validating Vercel configuration...\n');
  
  const isValid = validateConfig();
  validateEnvironmentVariables();
  validateNuxtConfig();
  
  console.log('\n=== Recommendations ===');
  console.log('• Test your deployment with `vercel --prebuilt` first');
  console.log('• Monitor Core Web Vitals after deployment');
  console.log('• Set up proper environment variables in Vercel dashboard');
  console.log('• Consider enabling Vercel Analytics for insights');
  
  process.exit(isValid ? 0 : 1);
}