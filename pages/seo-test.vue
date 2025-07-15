<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-6">SEO Configuration Test</h1>
      <p class="text-lg mb-8 text-muted-foreground">
        This page helps validate the SEO implementation and multilingual configuration.
      </p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Canonical URL Info -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">Canonical URL</h2>
          </template>
          <div class="space-y-2">
            <p><strong>Current:</strong> {{ canonicalUrl }}</p>
            <p><strong>Expected Format:</strong> https://domain.com/path</p>
          </div>
        </UCard>

        <!-- Hreflang Alternates -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">Hreflang Alternates</h2>
          </template>
          <div class="space-y-2">
            <div v-for="alt in hreflangAlts" :key="alt.hreflang" class="text-sm">
              <code>{{ alt.hreflang }}: {{ alt.href }}</code>
            </div>
          </div>
        </UCard>

        <!-- Language Configuration -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">Language Configuration</h2>
          </template>
          <div class="space-y-2">
            <p><strong>Current Locale:</strong> {{ locale }}</p>
            <p><strong>HTML Lang:</strong> {{ htmlLang }}</p>
            <p><strong>HTML Dir:</strong> {{ htmlDir }}</p>
            <p><strong>Has Translations:</strong> {{ hasTranslations ? 'Yes' : 'No' }}</p>
          </div>
        </UCard>

        <!-- Translation URLs -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">Available Translations</h2>
          </template>
          <div class="space-y-2">
            <div v-for="trans in translationUrls" :key="trans.locale" class="text-sm">
              <NuxtLink :to="trans.url" class="text-blue-600 hover:underline">
                {{ trans.name }} ({{ trans.locale }})
              </NuxtLink>
            </div>
          </div>
        </UCard>

        <!-- SEO Validation -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">SEO Validation</h2>
          </template>
          <div class="space-y-2">
            <div v-if="seoValidation.isValid" class="text-green-600">
              ✅ SEO configuration is valid
            </div>
            <div v-else class="text-red-600">
              ❌ SEO issues detected:
              <ul class="mt-2 ml-4">
                <li v-for="issue in seoValidation.issues" :key="issue" class="text-sm">
                  • {{ issue }}
                </li>
              </ul>
            </div>
          </div>
        </UCard>

        <!-- Social Media Debug -->
        <UCard>
          <template #header>
            <h2 class="text-xl font-semibold">Social Media Meta</h2>
          </template>
          <div class="space-y-2">
            <button 
              @click="debugSocialMeta" 
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Debug Social Meta (Check Console)
            </button>
            <p class="text-sm text-gray-600">
              Click to log social media meta tags to the browser console.
            </p>
          </div>
        </UCard>
      </div>

      <!-- Raw Meta Data (Development Only) -->
      <UCard class="mt-8" v-if="isDev">
        <template #header>
          <h2 class="text-xl font-semibold">Raw Meta Data (Development)</h2>
        </template>
        <pre class="text-xs overflow-auto bg-gray-100 dark:bg-gray-800 p-4 rounded">{{ JSON.stringify(multilingualHead, null, 2) }}</pre>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()

// Initialize multilingual SEO
const { 
  getCanonicalUrl, 
  getHreflangAlternates, 
  getHtmlLang, 
  getHtmlDir,
  getMultilingualHead,
  hasTranslations,
  getTranslationUrls,
  validateMultilingualSEO
} = useMultilingualSEO()

// Initialize social media composable
const { debugSocialMeta } = useSocialMedia({
  title: 'SEO Test Page',
  description: 'Test page for validating SEO and multilingual configuration',
  type: 'website'
})

// SEO for this page
const { generateStructuredData } = useSEO({
  title: 'SEO Test Page',
  description: 'Test page for validating SEO and multilingual configuration',
  keywords: 'SEO, test, multilingual, hreflang, canonical',
  type: 'website',
  noindex: true // Don't index this test page
})

// Reactive data
const canonicalUrl = ref('')
const hreflangAlts = ref([])
const htmlLang = ref('')
const htmlDir = ref('')
const translationUrls = ref([])
const seoValidation = ref({ isValid: true, issues: [] })
const multilingualHead = ref({})
const isDev = process.dev

// Initialize data
onMounted(() => {
  canonicalUrl.value = getCanonicalUrl()
  hreflangAlts.value = getHreflangAlternates()
  htmlLang.value = getHtmlLang()
  htmlDir.value = getHtmlDir()
  translationUrls.value = getTranslationUrls()
  seoValidation.value = validateMultilingualSEO()
  multilingualHead.value = getMultilingualHead()
})

// Page metadata
definePageMeta({
  title: 'SEO Test',
  description: 'Test page for SEO validation'
})
</script>