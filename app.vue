<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage 
        :transition="{
          name: 'page',
          mode: 'out-in',
          duration: 200
        }"
      />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
// Type-safe i18n composable usage
const { locale } = useI18n();

// Use our custom RTL composable for better maintainability
const { direction } = useRTL();

// Enhanced head management with SEO optimization
const { t } = useI18n();

// Global SEO defaults using new composable
const { setMeta } = useSEO({
  title: t('site.title'),
  description: t('meta.description'),
  keywords: t('meta.keywords'),
  author: t('meta.author'),
  type: 'website'
});

// Structured data is handled by the plugin
</script>
