<template>
  <div>
    <!-- Main Content -->
    <UContainer>
      <!-- Breadcrumb Navigation -->
      <UBreadcrumb
        :links="breadcrumbLinks"
        class="mb-6"
      />
      
      <!-- Page Header -->


      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Content Column -->
        <div class="lg:col-span-2 space-y-8">

          <!-- Contact Form -->
          <ContactForm />
        </div>

        <!-- Contact Methods Sidebar -->
        <div class="space-y-6">
          <!-- Social Media Links -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-share" class="w-5 h-5" />
                <h3 class="text-lg font-semibold">
                  {{ $t('footer.connect') }}
                </h3>
              </div>
            </template>
            
            <div class="space-y-3">
              <UButton
                v-for="social in socialLinks"
                :key="social.name"
                :to="social.url"
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                block
                :ui="{ 
                  base: 'justify-start',
          
                }"
                @click="trackSocialClick(social.name)"
              >
                <template #leading>
                  <UIcon :name="social.icon" class="w-5 h-5" />
                </template>
                {{ social.label }}
              </UButton>
            </div>
          </UCard>

          <!-- Email Contact -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-envelope" class="w-5 h-5" />
                <h3 class="text-lg font-semibold">
                  {{ $t('footer.email') }}
                </h3>
              </div>
            </template>
            
            <div class="space-y-3">
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {{ emailDescription }}
              </p>
              <UButton
                :to="emailLink"
                variant="outline"
                block
                :ui="{ 
                  base: 'justify-start'
                }"
              >
                <template #leading>
                  <UIcon name="i-heroicons-paper-airplane" class="w-5 h-5" />
                </template>
                {{ $t('footer.email') }}
              </UButton>
            </div>
          </UCard>

          <!-- Professional Links -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-briefcase" class="w-5 h-5" />
                <h3 class="text-lg font-semibold">
                  {{ professionalTitle }}
                </h3>
              </div>
            </template>
            
            <div class="space-y-3">
              <UButton
                v-for="professional in professionalLinks"
                :key="professional.name"
                :to="professional.url"
                target="_blank"
                rel="noopener noreferrer"
                variant="outline"
                block
                :ui="{ 
                  base: 'justify-start'
                }"
                @click="trackProfessionalClick(professional.name)"
              >
                <template #leading>
                  <UIcon :name="professional.icon" class="w-5 h-5" />
                </template>
                {{ professional.label }}
              </UButton>
            </div>
          </UCard>

          <!-- Response Time Info -->
          <UCard>
            <template #header>
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-clock" class="w-5 h-5" />
                <h3 class="text-lg font-semibold">
                  {{ responseTimeTitle }}
                </h3>
              </div>
            </template>
            
            <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div class="flex justify-between">
                <span>{{ $t('footer.social.telegram') }}:</span>
                <span>{{ responseTimeQuick }}</span>
              </div>
              <div class="flex justify-between">
                <span>{{ $t('footer.email') }}:</span>
                <span>{{ responseTimeEmail }}</span>
              </div>
              <div class="flex justify-between">
                <span>GitHub:</span>
                <span>{{ responseTimeGithub }}</span>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
// Composables
const { locale, t } = useI18n()
const localePath = useLocalePath()

// Fetch content based on current locale using the new queryCollection API
const { data: contentData } = await useAsyncData(
  `contact-${locale.value}`,
  () => queryCollection('pages').path(`/${locale.value}/contact`).first(),
  {
    watch: [locale]
  }
)

// Breadcrumb navigation using composable
const { getContactBreadcrumbs, getBreadcrumbStructuredData } = useBreadcrumbs()
const breadcrumbLinks = computed(() => getContactBreadcrumbs())

// Social media links configuration
const socialLinks = computed(() => [
  {
    name: 'telegram',
    label: 'Telegram',
    url: 'https://t.me/yourusername',
    icon: 'i-simple-icons-telegram',
    iconClasses: 'text-blue-500'
  },
  {
    name: 'twitter',
    label: 'Twitter / X',
    url: 'https://twitter.com/yourusername',
    icon: 'i-simple-icons-twitter',
    iconClasses: 'text-blue-400'
  },
  {
    name: 'tiktok',
    label: 'TikTok',
    url: 'https://tiktok.com/@yourusername',
    icon: 'i-simple-icons-tiktok',
    iconClasses: 'text-black dark:text-white'
  }
])

// Professional links configuration
const professionalLinks = computed(() => [
  {
    name: 'github',
    label: 'GitHub',
    url: 'https://github.com/yourusername',
    icon: 'i-simple-icons-github'
  },
  {
    name: 'linkedin',
    label: 'LinkedIn',
    url: 'https://linkedin.com/in/yourusername',
    icon: 'i-simple-icons-linkedin'
  }
])

// Email configuration
const emailLink = computed(() => 'mailto:hello@yoursite.com?subject=Contact from Website')
const emailDescription = computed(() => 
  locale.value === 'ar' 
    ? 'للاستفسارات الرسمية والمراسلات المفصلة'
    : 'For formal inquiries and detailed correspondence'
)

// Localized text
const professionalTitle = computed(() => 
  locale.value === 'ar' ? 'الشبكات المهنية' : 'Professional Networks'
)
const responseTimeTitle = computed(() => 
  locale.value === 'ar' ? 'وقت الاستجابة' : 'Response Time'
)
const responseTimeQuick = computed(() => 
  locale.value === 'ar' ? 'بضع ساعات' : 'Few hours'
)
const responseTimeEmail = computed(() => 
  locale.value === 'ar' ? '٢٤-٤٨ ساعة' : '24-48 hours'
)
const responseTimeGithub = computed(() => 
  locale.value === 'ar' ? 'متغير' : 'Variable'
)

// Analytics tracking functions
const trackSocialClick = (platform: string) => {
  // Add analytics tracking here
  console.log(`Social click: ${platform}`)
}

const trackProfessionalClick = (platform: string) => {
  // Add analytics tracking here
  console.log(`Professional click: ${platform}`)
}

// Enhanced SEO using useHead directly (updated for Nuxt Content v3)
useHead({
  title: computed(() => contentData.value?.title || t('meta.contact.title')),
  meta: [
    {
      name: 'description',
      content: computed(() => contentData.value?.description || t('meta.contact.description'))
    },
    {
      name: 'keywords',
      content: t('meta.keywords')
    },
    {
      name: 'author',
      content: t('meta.author')
    },
    {
      property: 'og:title',
      content: computed(() => contentData.value?.title || t('meta.contact.title'))
    },
    {
      property: 'og:description',
      content: computed(() => contentData.value?.description || t('meta.contact.description'))
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ]
})

// Generate structured data for contact page
const runtimeConfig = useRuntimeConfig()
const siteUrl = runtimeConfig.public.siteUrl || 'https://your-domain.com'

useSchemaOrg([
  {
    '@type': 'ContactPage',
    name: computed(() => contentData.value?.title || t('meta.contact.title')),
    url: computed(() => `${siteUrl}${localePath('/contact')}`),
    description: computed(() => contentData.value?.description || t('meta.contact.description')),
    mainEntity: {
      '@type': 'Person',
      name: t('meta.author'),
      sameAs: [
        'https://github.com/yourusername',
        'https://linkedin.com/in/yourusername',
        'https://twitter.com/yourusername',
        'https://t.me/yourusername',
        'https://tiktok.com/@yourusername'
      ]
    }
  }
])

// Structured data for breadcrumbs
const breadcrumbStructuredData = computed(() => getBreadcrumbStructuredData(breadcrumbLinks.value))

useHead({
  script: computed(() => {
    const scripts = []
    // Add breadcrumb structured data if available
    if (breadcrumbStructuredData.value) {
      scripts.push({
        type: 'application/ld+json',
        innerHTML: JSON.stringify(breadcrumbStructuredData.value)
      })
    }
    return scripts
  })
})

// Page metadata
definePageMeta({
  layout: 'default',
  name: 'contact'
})
</script>

