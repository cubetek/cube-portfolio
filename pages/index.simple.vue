<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center">
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          {{ $t('hero.name') || 'Welcome' }}
        </h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 mb-8">
          {{ $t('hero.subtitle') || 'Personal Portfolio Website' }}
        </p>
        <div class="space-y-4">
          <UButton
            to="/about"
            size="lg"
            color="primary"
            variant="solid"
          >
            {{ $t('navigation.about') || 'About' }}
          </UButton>
          <UButton
            to="/contact"
            size="lg"
            color="primary"
            variant="outline"
          >
            {{ $t('navigation.contact') || 'Contact' }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Simple homepage without complex composables
const { t } = useI18n()

// Basic SEO
useHead({
  title: t('meta.home.title') || 'Home',
  meta: [
    {
      name: 'description',
      content: t('meta.home.description') || 'Personal portfolio website'
    }
  ]
})

// Define page metadata
definePageMeta({
  layout: 'default',
  name: 'home'
})
</script>