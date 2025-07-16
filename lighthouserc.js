module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/en',
        'http://localhost:3000/about',
        'http://localhost:3000/en/about',
        'http://localhost:3000/blog',
        'http://localhost:3000/en/blog',
        'http://localhost:3000/contact',
        'http://localhost:3000/en/contact'
      ],
      startServerCommand: 'pnpm run build && pnpm run preview',
      startServerReadyPattern: 'Local:',
      startServerReadyTimeout: 30000,
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        chromeFlags: '--no-sandbox --disable-gpu --disable-dev-shm-usage',
        // Custom audit settings for better Core Web Vitals measurement
        onlyAudits: [
          'first-contentful-paint',
          'largest-contentful-paint',
          'first-meaningful-paint',
          'speed-index',
          'interactive',
          'cumulative-layout-shift',
          'total-blocking-time',
          'max-potential-fid',
          'uses-webp-images',
          'uses-optimized-images',
          'uses-text-compression',
          'unused-css-rules',
          'unused-javascript',
          'modern-image-formats',
          'efficiently-encode-images',
          'offscreen-images',
          'render-blocking-resources',
          'unminified-css',
          'unminified-javascript',
          'critical-request-chains',
          'uses-responsive-images',
          'preload-lcp-image',
          'non-composited-animations',
          'unsized-images',
          'viewport',
          'font-display',
          'metrics'
        ]
      }
    },
    assert: {
      assertions: {
        // Core Web Vitals thresholds
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        
        // Specific performance metrics
        'first-contentful-paint': ['warn', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'speed-index': ['warn', { maxNumericValue: 3000 }],
        'interactive': ['warn', { maxNumericValue: 3800 }],
        
        // Resource optimization
        'uses-webp-images': 'warn',
        'uses-optimized-images': 'warn',
        'uses-text-compression': 'error',
        'unused-css-rules': 'warn',
        'unused-javascript': 'warn',
        'render-blocking-resources': 'warn',
        'unminified-css': 'error',
        'unminified-javascript': 'error',
        
        // Modern standards
        'modern-image-formats': 'warn',
        'uses-responsive-images': 'warn',
        'preload-lcp-image': 'warn'
      }
    },
    upload: {
      target: 'temporary-public-storage',
      githubAppToken: process.env.LHCI_GITHUB_APP_TOKEN,
      // Alternative storage options
      // target: 'filesystem',
      // outputDir: './lighthouse-reports'
    },
    server: {
      port: 9001,
      storage: {
        storageMethod: 'sql',
        sqlDialect: 'sqlite',
        sqlDatabasePath: './lighthouse-ci.db'
      }
    },
    wizard: {
      // Skip wizard in CI environments
      enabled: false
    }
  }
}