<template>
  <UApp>
    <div 
      class="min-h-screen flex flex-col bg-background text-foreground"
      :dir="direction"
      data-vaul-drawer-wrapper
    >
      <!-- Skip Link for Accessibility -->
      <UButton
        to="#main-content"
        variant="ghost"
        size="sm"
        class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
        :label="$t('accessibility.skipToMain')"
        tabindex="0"
      />

      <!-- Header -->
      <AppHeader />

      <!-- Main Content Area -->
      <main 
        id="main-content"
        class="flex-1 w-full"
        role="main"
        tabindex="-1"
      >
        <!-- Page Content Container -->
        <UContainer class="py-6 md:py-8 lg:py-12">
          <div class="max-w-none">
            <!-- Slot for page content -->
            <slot />
          </div>
        </UContainer>
      </main>

      <!-- Footer -->
      <AppFooter />

      <!-- Global Loading Overlay -->
      <GlobalLoading />
    </div>
  </UApp>
</template>

<script setup lang="ts">
// Import necessary composables
const { isRTL, direction } = useRTL()
const { locale } = useI18n()

// Enhanced SEO and meta management
useHead({
  htmlAttrs: {
    dir: direction,
    lang: locale
  },
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, viewport-fit=cover'
    },
    {
      name: 'format-detection', 
      content: 'telephone=no'
    }
  ]
})

// Performance optimization: Preload critical resources
onMounted(() => {
  // Preload fonts
  const fontLinks = [
    { href: '/fonts/inter-var.woff2', as: 'font', type: 'font/woff2' },
    { href: '/fonts/amiri-var.woff2', as: 'font', type: 'font/woff2' }
  ]
  
  fontLinks.forEach(font => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = font.href
    link.as = font.as
    link.type = font.type
    link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  })
})

// Handle focus management for accessibility
const handleRouteChange = () => {
  // Focus main content area after navigation
  nextTick(() => {
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.focus()
    }
  })
}

// Watch for route changes
const route = useRoute()
watch(() => route.path, handleRouteChange)
</script>

