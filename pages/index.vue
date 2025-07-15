<template>
  <div>
    <!-- Enhanced Homepage Layout with all Task 2 implementations -->
    <HomepageLayout />
    
    <!-- Development Language Switcher (hidden in production) -->
    <div v-if="isDevelopment" class="dev-tools">
      <UContainer class="py-8">
        <div class="max-w-4xl mx-auto text-center">
          <div class="mb-8">
            <SimpleLanguageSwitcher />
          </div>
          
          <!-- Language & Tech Info Card -->
          <UCard class="max-w-2xl mx-auto">
            <template #header>
              <div class="flex items-center justify-center gap-2">
                <UIcon name="i-heroicons-globe-alt" class="w-5 h-5" />
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                  {{ langInfoTitle }}
                </h3>
              </div>
            </template>
            
            <div class="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <div class="flex justify-between">
                <span><strong>{{ $t('current_language') }}:</strong></span>
                <span>{{ currentLocale }}</span>
              </div>
              <div class="flex justify-between">
                <span><strong>{{ $t('footer.direction') }}:</strong></span>
                <span>{{ directionAttr }}</span>
              </div>
              <div class="text-center pt-2">
                <span><strong>{{ availableLocalesTitle }}:</strong></span>
                <div class="mt-1">
                  <span v-for="(locale, index) in availableLocales" :key="locale.code">
                    {{ locale.name }}
                    <span v-if="index < availableLocales.length - 1">, </span>
                  </span>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </UContainer>
    </div>
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

