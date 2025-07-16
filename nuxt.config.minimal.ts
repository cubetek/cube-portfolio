// Minimal Nuxt configuration for GitHub Pages deployment
export default defineNuxtConfig({
  // Basic configuration
  ssr: false,
  nitro: {
    preset: 'static'
  },
  
  // Essential modules only
  modules: [
    '@nuxt/ui',
    '@nuxt/content'
  ],
  
  // Basic app configuration
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    buildAssetsDir: '_nuxt/'
  },
  
  // CSS framework
  css: ['~/assets/css/main.css'],
  
  // Basic i18n without complex configuration
  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://cubetek.github.io/cube-portfolio',
      siteName: 'Cube Portfolio',
      siteDescription: 'Personal portfolio website'
    }
  },
  
  // Static generation
  generate: {
    routes: ['/en', '/about', '/en/about', '/projects', '/en/projects', '/contact', '/en/contact']
  }
})
