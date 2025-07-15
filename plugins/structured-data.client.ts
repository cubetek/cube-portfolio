/**
 * Structured Data Plugin
 * Initializes global structured data for the site
 */

export default defineNuxtPlugin({
  name: 'structured-data',
  enforce: 'post', // Run after other plugins
  setup() {
    // Use app:mounted hook to ensure everything is ready
    const nuxtApp = useNuxtApp()
    
    nuxtApp.hook('app:mounted', () => {
      try {
        const { generateWebSiteSchema, generateOrganizationSchema, injectStructuredData } = useStructuredData()

        // Generate global website schema
        const websiteSchema = generateWebSiteSchema()
        
        // Generate organization schema
        const organizationSchema = generateOrganizationSchema()

        // Inject global schemas
        injectStructuredData([websiteSchema, organizationSchema])
      } catch (error) {
        console.warn('Failed to initialize structured data:', error)
      }
    })
  }
})