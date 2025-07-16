<template>
  <div class="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
    <!-- Background with subtle animation -->
    <div class="absolute inset-0">
      <div class="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-green-500/10 dark:from-primary-500/5 dark:to-green-500/5 animate-pulse"></div>
      <div class="absolute inset-0 bg-gradient-to-br from-primary-100/20 via-transparent to-green-100/20 dark:from-primary-900/20 dark:to-green-900/20"></div>
    </div>
    
    <!-- Main hero content -->
    <div class="relative z-10 max-w-4xl mx-auto px-4 text-center">
      <div class="space-y-8">
        <!-- Animated title -->
        <Transition name="hero-title" appear>
          <h1 v-if="isLoaded" class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
            <span class="block text-lg sm:text-xl md:text-2xl font-medium text-primary-600 dark:text-primary-400 mb-2 opacity-90">
              {{ $t('welcome') }}
            </span>
            <span class="block bg-gradient-to-r from-primary-600 to-green-600 dark:from-primary-400 dark:to-green-400 bg-clip-text text-transparent animate-pulse">
              {{ $t('hello_world') }}
            </span>
          </h1>
        </Transition>
        
        <!-- Animated subtitle -->
        <Transition name="hero-subtitle" appear>
          <p v-if="isLoaded" class="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {{ $t('description') }}
          </p>
        </Transition>
        
        <!-- Animated CTA buttons -->
        <Transition name="hero-cta" appear>
          <div v-if="isLoaded" class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <UButton
              :to="localePath('/about')"
              size="lg"
              variant="solid"
              color="primary"
              class="transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-primary-500/25"
              :aria-label="$t('nav.aboutFullDesc')"
            >
              <template #leading>
                <UIcon name="i-heroicons-user" class="w-5 h-5" aria-hidden="true" />
              </template>
              {{ $t('nav.about') }}
            </UButton>
            
            <UButton
              :to="localePath('/contact')"
              size="lg"
              variant="outline"
              color="primary"
              class="transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 hover:bg-primary-50 dark:hover:bg-primary-900/20"
              :aria-label="$t('nav.contactFullDesc')"
            >
              <template #leading>
                <UIcon name="i-heroicons-envelope" class="w-5 h-5" aria-hidden="true" />
              </template>
              {{ $t('nav.contact') }}
            </UButton>
          </div>
        </Transition>
      </div>
      
      <!-- Scroll indicator -->
      <Transition name="hero-scroll" appear>
        <div v-if="isLoaded" class="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-300" @click="scrollToNext">
          <div class="w-8 h-8 border-2 border-primary-600 dark:border-primary-400 rounded-full flex items-center justify-center animate-bounce">
            <UIcon name="i-heroicons-chevron-down" class="w-4 h-4 text-primary-600 dark:text-primary-400" />
          </div>
          <span class="text-sm font-medium text-gray-600 dark:text-gray-400 mt-2">
            {{ $t('scroll_down') || 'Scroll Down' }}
          </span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Composables
const { locale } = useI18n()
const localePath = useLocalePath()

// State
const isLoaded = ref(false)

// Lifecycle
onMounted(() => {
  // Trigger animations after component is mounted
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})

// Methods
const scrollToNext = () => {
  const nextSection = document.querySelector('.hero-section')?.nextElementSibling
  if (nextSection) {
    nextSection.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
/* Transition animations */
.hero-title-enter-active {
  animation: slide-up 0.8s ease-out;
}

.hero-subtitle-enter-active {
  animation: slide-up 0.8s ease-out 0.2s both;
}

.hero-cta-enter-active {
  animation: slide-up 0.8s ease-out 0.4s both;
}

.hero-scroll-enter-active {
  animation: fade-in 0.8s ease-out 0.6s both;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Accessibility - respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .hero-title-enter-active,
  .hero-subtitle-enter-active,
  .hero-cta-enter-active,
  .hero-scroll-enter-active {
    animation: none;
  }
  
  .animate-pulse,
  .animate-bounce {
    animation: none;
  }
}
</style>