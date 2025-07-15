export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  detectBrowserLanguage: false, // We handle this in middleware
  strategy: 'prefix_except_default'
}))
