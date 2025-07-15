<template>
  <nav 
    :aria-label="$t('main_navigation')"
    class="w-full"
  >
    <!-- Desktop Navigation -->
    <div class="hidden lg:block">
      <UNav
        :links="navigationLinks"
        class="flex items-center space-x-1 rtl:space-x-reverse lg:space-x-2"
        orientation="horizontal"
      />
    </div>

    <!-- Mobile Navigation Slideout -->
    <USlideover 
      v-model="mobileMenuOpen" 
      side="right"
      class="lg:hidden"
    >
      <div class="p-4 flex flex-col space-y-4">
        <!-- Mobile Menu Header -->
        <div class="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ $t('main_navigation') }}
          </h2>
          <UButton
            icon="i-heroicons-x-mark"
            variant="ghost"
            color="gray"
            size="sm"
            :aria-label="$t('menu.close')"
            @click="closeMobileMenu"
          />
        </div>

        <!-- Mobile Navigation Links -->
        <div class="flex flex-col space-y-2">
          <UButton
            v-for="link in navigationLinks"
            :key="link.to"
            :to="link.to"
            :label="link.label"
            :icon="link.icon"
            variant="ghost"
            color="gray"
            size="lg"
            :class="[
              'justify-start w-full',
              isActiveRoute(link.to) ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : ''
            ]"
            @click="handleMobileNavClick(link.to)"
          />
        </div>
      </div>
    </USlideover>
  </nav>
</template>

<script setup lang="ts">
// Internationalization
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

// Mobile menu state from parent (AppHeader)
const mobileMenuOpen = inject('mobileMenuOpen', ref(false))
const toggleMobileMenu = inject('toggleMobileMenu', () => {})

// Navigation links with i18n
const navigationLinks = computed(() => [
  {
    label: t('home'),
    to: localePath('/'),
    icon: 'i-heroicons-home',
    exact: true
  },
  {
    label: t('about'),
    to: localePath('/about'),
    icon: 'i-heroicons-user'
  },
  {
    label: t('contact'),
    to: localePath('/contact'),
    icon: 'i-heroicons-envelope'
  }
])

// Active route detection
const isActiveRoute = (path: string) => {
  if (path === localePath('/')) {
    return route.path === localePath('/')
  }
  return route.path.startsWith(path)
}

// Mobile menu handlers
const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}

const handleMobileNavClick = (path: string) => {
  // Close mobile menu when navigating
  closeMobileMenu()
  
  // Navigate to the route
  navigateTo(path)
}

// Keyboard navigation support
const handleKeyDown = (event: KeyboardEvent, path: string) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    navigateTo(path)
  }
}

// Accessibility: Close mobile menu on escape key
onMounted(() => {
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && mobileMenuOpen.value) {
      closeMobileMenu()
    }
  }
  
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})

// Watch for route changes and close mobile menu
watch(() => route.path, () => {
  closeMobileMenu()
})
</script>

