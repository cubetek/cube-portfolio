<template>
  <header 
    class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    role="banner"
  >
    <UContainer class="flex h-16 items-center justify-between">
      <!-- Logo/Brand -->
      <div class="flex items-center">
        <UButton
          :to="$localePath('/')"
          variant="ghost"
          class="flex items-center space-x-2 text-xl font-bold scale-hover link-focus p-0"
          :aria-label="$t('nav.home')"
          :label="$t('site.title')"
        />
      </div>

      <!-- Desktop Navigation -->
      <nav 
        class="hidden md:flex items-center space-x-6" 
        role="navigation"
        :aria-label="$t('nav.main')"
      >
        <UButton
          v-for="item in navigationItems" 
          :key="item.path"
          :to="$localePath(item.path)"
          variant="ghost"
          size="sm"
          :label="$t(item.label)"
          :class="[
            $route.path === item.path ? 'text-primary' : 'text-muted-foreground'
          ]"
          :aria-current="$route.path === item.path ? 'page' : undefined"
        />
      </nav>

      <!-- Right side: Theme Switcher, Language Switcher & Mobile Menu -->
      <div class="flex items-center space-x-2">
        <!-- Theme Switcher -->
        <ThemeSwitcher />
        
        <!-- Language Switcher -->
        <LanguageSwitcher />

        <!-- Mobile Menu using Drawer -->
        <UDrawer
          v-model="mobileMenuOpen"
          direction="right"
          class="md:hidden"
        >
          <template #default>
            <UButton
              variant="outline"
              size="sm"
              color="gray"
              :icon="mobileMenuOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'"
              :aria-label="mobileMenuOpen ? $t('nav.close') : $t('nav.menu')"
              :aria-expanded="mobileMenuOpen"
              square
            />
          </template>
          
          <template #content>
            <div class="p-4 space-y-4">
              <!-- Header -->
              <div class="flex items-center justify-between pb-4 border-b">
                <h2 class="text-lg font-semibold">{{ $t('nav.menu') }}</h2>
                <UButton
                  @click="mobileMenuOpen = false"
                  variant="ghost"
                  size="sm"
                  icon="i-heroicons-x-mark"
                  square
                />
              </div>

              <!-- Navigation Items -->
              <nav class="space-y-2" role="navigation" :aria-label="$t('nav.mobile')">
                <UButton
                  v-for="item in navigationItems" 
                  :key="item.path"
                  :to="$localePath(item.path)"
                  variant="ghost"
                  size="md"
                  :label="$t(item.label)"
                  class="w-full justify-start"
                  :class="[
                    $route.path === item.path ? 'bg-primary/10 text-primary' : ''
                  ]"
                  @click="mobileMenuOpen = false"
                />
              </nav>
            </div>
          </template>
        </UDrawer>
      </div>
    </UContainer>
  </header>
</template>

<script setup lang="ts">
interface NavigationItem {
  path: string
  label: string
}

// Navigation items
const navigationItems: NavigationItem[] = [
  { path: '/', label: 'nav.home' },
  { path: '/about', label: 'nav.about' },
  { path: '/projects', label: 'nav.projects' },
  { path: '/blog', label: 'nav.blog' },
  { path: '/contact', label: 'nav.contact' }
]

// Mobile menu state
const mobileMenuOpen = ref(false)

// Watch for route changes to close mobile menu
const route = useRoute()
watch(() => route.path, () => {
  mobileMenuOpen.value = false
})

// Close mobile menu on escape key
onMounted(() => {
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      mobileMenuOpen.value = false
    }
  }
  
  document.addEventListener('keydown', handleEscape)
  
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape)
  })
})
</script>

