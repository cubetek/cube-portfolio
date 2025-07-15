<template>
  <div class="homepage-layout">
    <!-- Skip to content link for accessibility -->
    <a 
      href="#main-content" 
      class="skip-link"
      @click="skipToContent"
    >
      {{ $t('accessibility.skipToContent') || 'Skip to main content' }}
    </a>

    <!-- Hero Section -->
    <section 
      id="hero" 
      class="hero-section"
      :class="{ 'reduce-motion': prefersReducedMotion }"
      aria-labelledby="hero-title"
    >
      <div class="hero-container">
        <div class="hero-content">
          <h1 id="hero-title" class="hero-title">
            <span class="hero-greeting">
              {{ $t('hero.greeting') || 'Hello, I\'m' }}
            </span>
            <span class="hero-name">{{ $t('hero.name') || 'Your Name' }}</span>
          </h1>
          <p class="hero-subtitle">
            {{ $t('hero.subtitle') || 'Full-Stack Developer & UI/UX Designer' }}
          </p>
          <p class="hero-description">
            {{ $t('hero.description') || 'Creating innovative digital experiences with modern technologies' }}
          </p>
          
          <div class="hero-actions">
            <UButton
              to="#projects"
              size="lg"
              variant="solid"
              color="primary"
              class="hero-btn"
              @click="scrollToSection('projects')"
            >
              {{ $t('hero.viewWork') || 'View My Work' }}
            </UButton>
            <UButton
              to="#contact"
              size="lg"
              variant="outline"
              color="primary"
              class="hero-btn"
              @click="scrollToSection('contact')"
            >
              {{ $t('hero.getInTouch') || 'Get In Touch' }}
            </UButton>
          </div>
        </div>
        
        <div class="hero-visual">
          <div class="hero-image-container">
            <NuxtImg
              src="/images/hero-illustration.svg"
              alt="Developer illustration"
              class="hero-image"
              :data-critical="true"
              loading="eager"
              fetchpriority="high"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main id="main-content" class="main-content">
      <!-- About Section -->
      <section 
        id="about" 
        class="content-section"
        aria-labelledby="about-title"
        v-intersection-observer="onSectionIntersection"
      >
        <div class="section-container">
          <LazyAboutSection />
        </div>
      </section>

      <!-- Skills Section -->
      <section 
        id="skills" 
        class="content-section"
        aria-labelledby="skills-title"
        v-intersection-observer="onSectionIntersection"
      >
        <div class="section-container">
          <LazySkillsDisplay />
        </div>
      </section>

      <!-- Projects Section -->
      <section 
        id="projects" 
        class="content-section"
        aria-labelledby="projects-title"
        v-intersection-observer="onSectionIntersection"
      >
        <div class="section-container">
          <LazyProjectsShowcase />
        </div>
      </section>

      <!-- Contact Section -->
      <section 
        id="contact" 
        class="content-section"
        aria-labelledby="contact-title"
        v-intersection-observer="onSectionIntersection"
      >
        <div class="section-container">
          <div class="contact-content">
            <h2 id="contact-title" class="section-title">
              {{ $t('contact.title') || 'Let\'s Work Together' }}
            </h2>
            <p class="section-description">
              {{ $t('contact.description') || 'Ready to bring your ideas to life? Let\'s discuss your next project.' }}
            </p>
            
            <div class="contact-actions">
              <UButton
                to="mailto:contact@example.com"
                size="lg"
                variant="solid"
                color="primary"
                class="contact-btn"
              >
                <UIcon name="i-heroicons-envelope" />
                {{ $t('contact.email') || 'Send Email' }}
              </UButton>
              
              <UButton
                to="https://calendly.com/username"
                target="_blank"
                size="lg"
                variant="outline"
                color="primary"
                class="contact-btn"
              >
                <UIcon name="i-heroicons-calendar" />
                {{ $t('contact.schedule') || 'Schedule Meeting' }}
              </UButton>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Performance metrics display (development only) -->
    <div 
      v-if="isDevelopment" 
      class="performance-metrics"
      aria-label="Performance metrics"
    >
      <details class="metrics-details">
        <summary class="metrics-summary">Performance Metrics</summary>
        <div class="metrics-content">
          <div class="metric-item">
            <span class="metric-label">LCP:</span>
            <span class="metric-value">{{ metrics.lcp || 'N/A' }}ms</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">FCP:</span>
            <span class="metric-value">{{ metrics.fcp || 'N/A' }}ms</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Memory:</span>
            <span class="metric-value">{{ formatBytes(memoryUsage) }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-label">Bundle:</span>
            <span class="metric-value">{{ formatBytes(bundleSize) }}</span>
          </div>
        </div>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue'
import { usePerformanceOptimization } from '~/composables/usePerformance'
import { useAccessibility } from '~/composables/useAccessibility'
import { useIntersectionObserver } from '~/composables/usePerformance'

// Lazy load components
const LazyAboutSection = defineAsyncComponent(() => import('~/components/AboutSection.vue'))
const LazySkillsDisplay = defineAsyncComponent(() => import('~/components/SkillsDisplay.vue'))
const LazyProjectsShowcase = defineAsyncComponent(() => import('~/components/ProjectsShowcase.vue'))

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
const isDevelopment = computed(() => process.env.NODE_ENV === 'development')

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
  title: 'Homepage - Your Name',
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
  await preloadImage('/images/hero-illustration.svg', 'high')
  await preloadImage('/images/profile.jpg', 'high')
  
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
/* Skip link styles */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--color-primary-600);
  color: var(--color-white);
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  z-index: 1000;
  transition: top 0.3s ease;
}

.skip-link:focus {
  top: 6px;
}

/* Homepage layout */
.homepage-layout {
  min-height: 100vh;
  position: relative;
}

/* Hero section */
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-primary-100) 100%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%);
  animation: gradientShift 10s ease-in-out infinite;
}

.hero-section.reduce-motion::before {
  animation: none;
}

@keyframes gradientShift {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.hero-title {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.hero-greeting {
  font-size: 1.5rem;
  color: var(--color-gray-600);
  font-weight: 500;
}

.hero-name {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: var(--color-gray-900);
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-800));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: var(--color-primary-700);
  font-weight: 600;
}

.hero-description {
  font-size: 1.125rem;
  color: var(--color-gray-600);
  line-height: 1.6;
  max-width: 500px;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-btn {
  min-width: 160px;
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-image-container {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.hero-image {
  width: 100%;
  height: auto;
  object-fit: contain;
  animation: float 6s ease-in-out infinite;
}

.hero-section.reduce-motion .hero-image {
  animation: none;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* Main content */
.main-content {
  position: relative;
  z-index: 1;
}

.content-section {
  padding: 4rem 0;
  position: relative;
}

.content-section:nth-child(even) {
  background: var(--color-gray-50);
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Contact section */
.contact-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.section-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: 1rem;
}

.section-description {
  font-size: 1.125rem;
  color: var(--color-gray-600);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.contact-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.contact-btn {
  min-width: 180px;
}

/* Performance metrics (development only) */
.performance-metrics {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: var(--color-white);
  border: 1px solid var(--color-gray-200);
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-width: 250px;
}

.metrics-details {
  margin: 0;
}

.metrics-summary {
  padding: 12px 16px;
  font-weight: 500;
  color: var(--color-gray-700);
  cursor: pointer;
  user-select: none;
}

.metrics-content {
  padding: 0 16px 16px;
  border-top: 1px solid var(--color-gray-200);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.metric-label {
  color: var(--color-gray-600);
  font-weight: 500;
}

.metric-value {
  color: var(--color-gray-900);
  font-weight: 600;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .hero-section {
    background: linear-gradient(135deg, var(--color-gray-900) 0%, var(--color-gray-800) 100%);
  }
  
  .hero-greeting {
    color: var(--color-gray-400);
  }
  
  .hero-name {
    color: var(--color-gray-100);
  }
  
  .hero-subtitle {
    color: var(--color-primary-400);
  }
  
  .hero-description {
    color: var(--color-gray-400);
  }
  
  .section-title {
    color: var(--color-gray-100);
  }
  
  .section-description {
    color: var(--color-gray-400);
  }
  
  .content-section:nth-child(even) {
    background: var(--color-gray-800);
  }
  
  .performance-metrics {
    background: var(--color-gray-800);
    border-color: var(--color-gray-700);
  }
  
  .metrics-summary {
    color: var(--color-gray-300);
  }
  
  .metrics-content {
    border-color: var(--color-gray-700);
  }
  
  .metric-label {
    color: var(--color-gray-400);
  }
  
  .metric-value {
    color: var(--color-gray-100);
  }
}

/* RTL support */
[dir="rtl"] .hero-container {
  grid-template-columns: 1fr 1fr;
}

[dir="rtl"] .hero-content {
  text-align: right;
}

[dir="rtl"] .hero-actions {
  flex-direction: row-reverse;
}

[dir="rtl"] .contact-actions {
  flex-direction: row-reverse;
}

[dir="rtl"] .performance-metrics {
  left: 20px;
  right: auto;
}

/* Responsive design */
@media (max-width: 768px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
  
  .hero-content {
    order: 2;
  }
  
  .hero-visual {
    order: 1;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .contact-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .contact-btn {
    width: 100%;
    max-width: 300px;
  }
  
  .performance-metrics {
    position: relative;
    bottom: auto;
    right: auto;
    margin: 20px;
  }
}

@media (max-width: 480px) {
  .hero-container {
    padding: 0 1rem;
  }
  
  .section-container {
    padding: 0 1rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-btn {
    width: 100%;
    max-width: 300px;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .hero-section {
    background: var(--color-white);
  }
  
  .hero-name {
    background: none;
    -webkit-background-clip: unset;
    -webkit-text-fill-color: unset;
    background-clip: unset;
    color: var(--color-black);
  }
}

/* Print styles */
@media print {
  .hero-section {
    background: none;
    min-height: auto;
    padding: 2rem 0;
  }
  
  .hero-actions,
  .contact-actions,
  .performance-metrics {
    display: none;
  }
  
  .hero-image {
    display: none;
  }
}
</style>