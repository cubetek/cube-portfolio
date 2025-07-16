<template>
  <div class="min-h-screen">
    <!-- Skip to content link for accessibility -->
    <a 
      href="#main-content" 
      class="fixed top-0 left-2 -translate-y-full bg-primary-600 text-white px-4 py-2 rounded-md font-medium z-50 transition-transform duration-300 focus:translate-y-2"
      @click="skipToContent"
    >
      {{ $t('accessibility.skipToContent') || 'Skip to main content' }}
    </a>

    <!-- Hero Section -->
    <section 
      id="hero" 
      class="min-h-screen flex items-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 relative overflow-hidden"
      :class="{ 'motion-reduce:animate-none': prefersReducedMotion }"
      aria-labelledby="hero-title"
    >
      <!-- Background gradient animation -->
      <div 
        class="absolute inset-0 opacity-100 motion-reduce:opacity-70"
        :class="!prefersReducedMotion ? 'animate-pulse' : ''"
        style="background: radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%)"
      />
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center relative z-10">
        <div class="flex flex-col gap-8 text-center lg:text-start order-2 lg:order-1">
          <div class="space-y-4">
            <h1 id="hero-title" class="space-y-2">
              <span class="block text-xl sm:text-2xl text-gray-600 dark:text-gray-400 font-medium">
                {{ $t('hero.greeting') || 'Hello, I\'m' }}
              </span>
              <span class="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                {{ $t('hero.name') || 'Your Name' }}
              </span>
            </h1>
            <p class="text-xl sm:text-2xl text-primary-700 dark:text-primary-400 font-semibold">
              {{ $t('hero.subtitle') || 'Full-Stack Developer & UI/UX Designer' }}
            </p>
            <p class="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {{ $t('hero.description') || 'Creating innovative digital experiences with modern technologies' }}
            </p>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <UButton
              size="lg"
              color="primary"
              variant="solid"
              class="min-w-40"
              @click="scrollToSection('projects')"
            >
              {{ $t('hero.viewWork') || 'View My Work' }}
            </UButton>
            <UButton
              size="lg"
              color="primary"
              variant="outline"
              class="min-w-40"
              @click="scrollToSection('contact')"
            >
              {{ $t('hero.getInTouch') || 'Get In Touch' }}
            </UButton>
          </div>
        </div>
        
        <div class="flex justify-center items-center order-1 lg:order-2">
          <div class="relative w-full max-w-lg">
            <img
              src="/illustration/team-bro.svg"
              alt="Developer illustration"
              class="w-full h-auto object-contain"
              :class="!prefersReducedMotion ? 'animate-bounce' : ''"
              loading="eager"
              style="animation-duration: 6s;"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main id="main-content" class="relative z-10">
      <!-- About Section -->
      <section 
        id="about" 
        class="py-16 lg:py-24"
        aria-labelledby="about-title"
        v-intersection-observer="onSectionIntersection"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LazyAboutSection />
        </div>
      </section>

      <!-- Skills Section -->
      <section 
        id="skills" 
        class="py-16 lg:py-24 bg-gray-50 dark:bg-gray-800"
        aria-labelledby="skills-title"
        v-intersection-observer="onSectionIntersection"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LazySkillsDisplay />
        </div>
      </section>

      <!-- Projects Section -->
      <section 
        id="projects" 
        class="py-16 lg:py-24"
        aria-labelledby="projects-title"
        v-intersection-observer="onSectionIntersection"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LazyProjectsShowcase />
        </div>
      </section>

      <!-- Contact Section -->
      <section 
        id="contact" 
        class="py-16 lg:py-24 bg-gray-50 dark:bg-gray-800"
        aria-labelledby="contact-title"
        v-intersection-observer="onSectionIntersection"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <UCard class="max-w-4xl mx-auto">
            <template #header>
              <div class="text-center">
                <h2 id="contact-title" class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {{ $t('contact.title') || 'Let\'s Work Together' }}
                </h2>
                <p class="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  {{ $t('contact.description') || 'Ready to bring your ideas to life? Let\'s discuss your next project.' }}
                </p>
              </div>
            </template>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <UButton
                to="mailto:contact@example.com"
                size="lg"
                color="primary"
                variant="solid"
                icon="i-heroicons-envelope"
                class="min-w-48"
              >
                {{ $t('contact.email') || 'Send Email' }}
              </UButton>
              
              <UButton
                to="https://calendly.com/username"
                target="_blank"
                size="lg"
                color="primary"
                variant="outline"
                icon="i-heroicons-calendar"
                class="min-w-48"
              >
                {{ $t('contact.schedule') || 'Schedule Meeting' }}
              </UButton>
            </div>
          </UCard>
        </div>
      </section>
    </main>

    <!-- Performance metrics display (development only) -->
    <UCard 
      v-if="unref(isDevelopment)" 
      class="fixed bottom-5 end-5 max-w-xs z-50"
      aria-label="Performance metrics"
    >
      <template #header>
        <h3 class="text-sm font-medium text-gray-700 dark:text-gray-300">Performance Metrics</h3>
      </template>
      
      <div class="space-y-2">
        <div class="flex justify-between items-center text-sm">
          <span class="text-gray-600 dark:text-gray-400 font-medium">LCP:</span>
          <span class="text-gray-900 dark:text-gray-100 font-semibold">{{ metrics.lcp || 'N/A' }}ms</span>
        </div>
        <div class="flex justify-between items-center text-sm">
          <span class="text-gray-600 dark:text-gray-400 font-medium">FCP:</span>
          <span class="text-gray-900 dark:text-gray-100 font-semibold">{{ metrics.fcp || 'N/A' }}ms</span>
        </div>
        <div class="flex justify-between items-center text-sm">
          <span class="text-gray-600 dark:text-gray-400 font-medium">Memory:</span>
          <span class="text-gray-900 dark:text-gray-100 font-semibold">{{ formatBytes(memoryUsage) }}</span>
        </div>
        <div class="flex justify-between items-center text-sm">
          <span class="text-gray-600 dark:text-gray-400 font-medium">Bundle:</span>
          <span class="text-gray-900 dark:text-gray-100 font-semibold">{{ formatBytes(bundleSize) }}</span>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick, unref } from 'vue'
import { usePerformanceOptimization } from '~/composables/usePerformance'
import { useAccessibility } from '~/composables/useAccessibility'
import { useIntersectionObserver } from '~/composables/usePerformance'

// Lazy load components
const LazyAboutSection = defineAsyncComponent(() => import('~/components/AboutSection.vue'))
const LazySkillsDisplay = defineAsyncComponent(() => import('~/components/SkillsDisplay.vue'))
const LazyProjectsShowcase = defineAsyncComponent(() => import('~/components/ProjectsShowcase.vue'))
const app = computed(() => useAppConfig())
// Composables
const { 
  metrics, 
  bundleSize, 
  memoryUsage, 
  initializeOptimizations,
  getOptimizationReport,
  preloadImage 
} = usePerformanceOptimization()

const { 
  announce, 
  prefersReducedMotion, 
  skipToContent: skipToContentUtil,
  initializeAccessibility,
  getAccessibilityReport 
} = useAccessibility({
  announceChanges: true,
  manageFocus: true,
  enableKeyboardNavigation: true,
  respectReducedMotion: true
})

// Environment check
const isDevelopment = ref(process.env.NODE_ENV === 'development')

// Intersection observer for animations
const visibleSections = ref<Set<string>>(new Set())

const { observe } = useIntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      const sectionId = entry.element.id
      if (entry.isIntersecting) {
        visibleSections.value.add(sectionId)
        
        // Announce section changes for screen readers
        const sectionName = sectionId.charAt(0).toUpperCase() + sectionId.slice(1)
        announce(`${sectionName} section is now visible`)
      } else {
        visibleSections.value.delete(sectionId)
      }
    })
  },
  { threshold: 0.3 }
)

// Custom directive for intersection observer
const vIntersectionObserver = {
  mounted(el: HTMLElement) {
    observe(el)
  }
}

// Navigation helpers
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ 
      behavior: prefersReducedMotion.value ? 'instant' : 'smooth',
      block: 'start'
    })
    
    // Announce navigation for screen readers
    const sectionName = sectionId.charAt(0).toUpperCase() + sectionId.slice(1)
    announce(`Navigated to ${sectionName} section`)
  }
}

const skipToContent = (event: Event) => {
  event.preventDefault()
  skipToContentUtil('main-content')
}

const onSectionIntersection = (entries: IntersectionObserverEntry[]) => {
  // Handle section visibility for animations and analytics
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const sectionId = entry.target.id
      
      // Trigger section-specific optimizations
      if (sectionId === 'projects') {
        // Preload project images
        preloadImage('/images/projects/project1.jpg', 'low')
        preloadImage('/images/projects/project2.jpg', 'low')
      }
    }
  })
}

// Utility functions
const formatBytes = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// SEO and meta
useHead({
  title: `Homepage -${app.value.metadata.author}`,
  meta: [
    {
      name: 'description',
      content: 'Full-Stack Developer & UI/UX Designer creating innovative digital experiences'
    },
    {
      property: 'og:title',
      content: 'Your Name - Full-Stack Developer'
    },
    {
      property: 'og:description',
      content: 'Creating innovative digital experiences with modern technologies'
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ]
})

// Lifecycle
onMounted(async () => {
  // Initialize optimizations
  await initializeOptimizations()
  
  // Initialize accessibility features
  initializeAccessibility()
  
  // Preload critical images
  await preloadImage('/images/profile.png', 'high')
  
  // Report initial metrics
  if (isDevelopment.value) {
    setTimeout(() => {
      console.log('Performance Report:', getOptimizationReport())
      console.log('Accessibility Report:', getAccessibilityReport())
    }, 3000)
  }
})
</script>

<style scoped>
/* Only custom styles that cannot be achieved with Tailwind */

/* RTL support for animations - direction aware */
[dir="rtl"] .hero-container {
  direction: ltr; /* Keep animations consistent */
}

[dir="rtl"] .performance-metrics {
  left: 1.25rem;
  right: auto;
}

/* Print styles */
@media print {
  .hero-section {
    background: none !important;
    min-height: auto !important;
    padding: 2rem 0 !important;
  }
  
  .hero-actions,
  .contact-actions,
  .performance-metrics {
    display: none !important;
  }
  
  .hero-image {
    display: none !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .bg-gradient-to-br {
    background: white !important;
  }
  
  .bg-gradient-to-r {
    background: black !important;
    -webkit-background-clip: unset !important;
    -webkit-text-fill-color: unset !important;
    background-clip: unset !important;
    color: black !important;
  }
  
  .dark .bg-gradient-to-r {
    color: white !important;
  }
}
</style>