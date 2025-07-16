<template>
  <div>
    <HomepageLayout />
  </div>
</template>

<script setup lang="ts">
// Composables
const { 
  currentLocale, 
  availableLocales, 
  directionAttr 
} = useLanguage()

const { t, locale } = useI18n()
const localePath = useLocalePath()

// Environment check
const isDevelopment = computed(() => process.env.NODE_ENV === 'development')

// Localized text
const langInfoTitle = computed(() => 
  locale.value === 'ar' ? 'معلومات اللغة والاتجاه' : 'Language & Direction Info'
)
const availableLocalesTitle = computed(() => 
  locale.value === 'ar' ? 'اللغات المتاحة' : 'Available Languages'
)

// Enhanced SEO using custom composable
const { generateStructuredData } = useSEO({
  title: t('meta.home.title'),
  description: t('meta.home.description'),
  keywords: t('meta.keywords'),
  author: t('meta.author'),
  type: 'website'
})

// Generate structured data for the website
generateStructuredData('WebSite')

// Define page metadata for typed pages
definePageMeta({
  layout: 'default',
  name: 'home'
})
</script>

