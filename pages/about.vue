<template>
  <div class="about-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="hero-pattern"></div>
        <div class="hero-gradient"></div>
      </div>
      
      <UContainer class="hero-content">
        <!-- Breadcrumb Navigation -->
        <UBreadcrumb
          :links="breadcrumbLinks"
          class="breadcrumb-nav"
        />
        
        <!-- Hero Content -->
        <div class="hero-main">
          <div class="hero-text">
            <h1 class="hero-title">
              {{ contentData?.title || $t('about.title') || 'About Me' }}
            </h1>
            <p class="hero-description">
              {{ contentData?.description || $t('about.description') || 'Passionate developer crafting digital experiences' }}
            </p>
            
            <!-- Hero Actions -->
            <div class="hero-actions">
              <UButton
                to="#contact"
                size="lg"
                color="primary"
                variant="solid"
                class="hero-btn hero-btn-primary"
              >
                <UIcon name="i-heroicons-envelope" />
                {{ $t('about.getInTouch') || 'Get in Touch' }}
              </UButton>
              <!-- CV Download temporarily disabled
              <UButton
                to="/cv.pdf"
                target="_blank"
                size="lg"
                variant="outline"
                class="hero-btn hero-btn-secondary"
              >
                <UIcon name="i-heroicons-document-arrow-down" />
                {{ $t('about.downloadCV') || 'Download CV' }}
              </UButton>
              -->
            </div>
          </div>
          
          <!-- Hero Image -->
          <div class="hero-image">
            <div class="image-container">
              <img
                src="/images/profile-hero.jpg"
                alt="Professional headshot"
                class="profile-image"
                loading="eager"
                width="400"
                height="400"
              />
              <div class="image-decorations">
                <div class="decoration decoration-1"></div>
                <div class="decoration decoration-2"></div>
                <div class="decoration decoration-3"></div>
              </div>
            </div>
            
            <!-- Status Indicator -->
            <div class="status-card">
              <div class="status-indicator">
                <span class="status-dot"></span>
                <span class="status-text">
                  {{ $t('about.status') || 'Available for projects' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </UContainer>
    </section>

    <!-- Main Content Sections -->
    <UContainer class="main-content">
      <!-- Story Section -->
      <section class="content-section story-section" id="story">
        <div class="section-content">
          <ContentRenderer 
            v-if="contentData" 
            :value="contentData"
            class="prose-content"
          />
          <div v-else class="loading-state">
            <UIcon name="i-heroicons-arrow-path" class="loading-icon animate-spin" />
            <p class="loading-text">
              {{ $t('loading') || 'Loading content...' }}
            </p>
          </div>
        </div>
      </section>

      <!-- Timeline Section -->
      <section class="content-section timeline-section" id="timeline">
        <div class="section-header">
          <div class="section-badge">
            <UIcon name="i-heroicons-clock" />
            <span>{{ $t('about.sections.timeline') || 'Career Journey' }}</span>
          </div>
          <h2 class="section-title">
            {{ $t('about.timeline.title') || 'My Professional Journey' }}
          </h2>
          <p class="section-description">
            {{ $t('about.timeline.description') || 'Key milestones and experiences that shaped my career' }}
          </p>
        </div>
        
        <div class="section-component">
          <TimelineComponent />
        </div>
      </section>

      <!-- Skills Section -->
      <section class="content-section skills-section" id="skills">
        <div class="section-header">
          <div class="section-badge">
            <UIcon name="i-heroicons-cog-6-tooth" />
            <span>{{ $t('about.sections.skills') || 'Skills & Expertise' }}</span>
          </div>
          <h2 class="section-title">
            {{ $t('about.skills.title') || 'Technical Skills' }}
          </h2>
          <p class="section-description">
            {{ $t('about.skills.description') || 'Technologies and tools I work with, with proficiency levels' }}
          </p>
        </div>
        
        <div class="section-component">
          <InteractiveSkills />
        </div>
      </section>

      <!-- Values Section -->
      <section class="content-section values-section" id="values">
        <div class="values-grid">
          <div class="value-card" v-for="value in values" :key="value.id">
            <div class="value-icon">
              <UIcon :name="value.icon" />
            </div>
            <h3 class="value-title">{{ $t(`about.values.${value.id}.title`) || value.title }}</h3>
            <p class="value-description">{{ $t(`about.values.${value.id}.description`) || value.description }}</p>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
      <section class="content-section contact-section" id="contact">
        <div class="contact-card">
          <div class="contact-content">
            <h2 class="contact-title">
              {{ $t('about.contact.title') || "Let's Work Together" }}
            </h2>
            <p class="contact-description">
              {{ $t('about.contact.description') || 'Ready to bring your ideas to life? Let\'s discuss your next project.' }}
            </p>
            
            <div class="contact-actions">
              <UButton
                to="mailto:contact@example.com"
                size="lg"
                color="primary"
                variant="solid"
                class="contact-btn"
              >
                <UIcon name="i-heroicons-envelope" />
                {{ $t('about.contact.email') || 'Send Email' }}
              </UButton>
              <UButton
                to="https://linkedin.com/in/username"
                target="_blank"
                size="lg"
                color="blue"
                variant="outline"
                class="contact-btn"
              >
                <UIcon name="i-simple-icons-linkedin" />
                {{ $t('about.contact.linkedin') || 'LinkedIn' }}
              </UButton>
            </div>
          </div>
          
          <div class="contact-visual">
            <div class="contact-decoration">
              <div class="decoration-circle"></div>
              <div class="decoration-dots"></div>
            </div>
          </div>
        </div>
      </section>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Types
interface Value {
  id: string
  title: string
  description: string
  icon: string
}

// Composables
const { locale, t } = useI18n()

// Fetch content based on current locale using the new queryCollection API
const { data: contentData } = await useAsyncData(
  `about-${locale.value}`,
  () => queryCollection('pages').path(`/${locale.value}/about`).first(),
  {
    watch: [locale]
  }
)

// Breadcrumb navigation using composable
const { getAboutBreadcrumbs, getBreadcrumbStructuredData } = useBreadcrumbs()
const breadcrumbLinks = computed(() => getAboutBreadcrumbs())

// Values data
const values = ref<Value[]>([
  {
    id: 'quality',
    title: 'Quality First',
    description: 'Committed to delivering high-quality, well-tested, and maintainable code that stands the test of time.',
    icon: 'i-heroicons-shield-check'
  },
  {
    id: 'innovation',
    title: 'Innovation',
    description: 'Always exploring new technologies and approaches to solve problems more effectively and efficiently.',
    icon: 'i-heroicons-light-bulb'
  },
  {
    id: 'collaboration',
    title: 'Collaboration',
    description: 'Believe in the power of teamwork and open communication to achieve exceptional results.',
    icon: 'i-heroicons-users'
  },
  {
    id: 'accessibility',
    title: 'Accessibility',
    description: 'Ensuring digital experiences are inclusive and accessible to everyone, regardless of abilities.',
    icon: 'i-heroicons-heart'
  }
])

// Enhanced SEO using useHead directly (updated for Nuxt Content v3)
useHead({
  title: computed(() => contentData.value?.title || t('meta.about.title')),
  meta: [
    {
      name: 'description',
      content: computed(() => contentData.value?.description || t('meta.about.description'))
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
      content: computed(() => contentData.value?.title || t('meta.about.title'))
    },
    {
      property: 'og:description',
      content: computed(() => contentData.value?.description || t('meta.about.description'))
    },
    {
      property: 'og:type',
      content: 'website'
    },
    {
      property: 'og:image',
      content: '/images/profile-hero.jpg'
    }
  ]
})

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

    // Add Person structured data
    scripts.push({
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Developer Name',
        jobTitle: 'Full-Stack Developer',
        url: 'https://example.com',
        image: '/images/profile-hero.jpg',
        description: contentData.value?.description || 'Passionate developer crafting digital experiences',
        sameAs: [
          'https://linkedin.com/in/username',
          'https://github.com/username',
          'https://twitter.com/username'
        ]
      })
    })

    return scripts
  })
})

// Page metadata
definePageMeta({
  layout: 'default',
  name: 'about'
})
</script>

<style scoped>
/* ===============================
   About Page Styles
   =============================== */

.about-page {
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.1) 0%, transparent 50%);
  background-size: 600px 600px;
  animation: float 20s ease-in-out infinite;
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 50%,
    rgba(255, 255, 255, 0.02) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 1;
  width: 100%;
}

.breadcrumb-nav {
  margin-bottom: 2rem;
  opacity: 0;
  animation: slideUp 0.8s ease-out 0.2s forwards;
}

.hero-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  min-height: 80vh;
}

.hero-text {
  opacity: 0;
  animation: slideUp 0.8s ease-out 0.4s forwards;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  background: linear-gradient(
    135deg,
    var(--color-gray-900) 0%,
    var(--color-primary-600) 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.hero-description {
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--color-gray-600);
  margin-bottom: 2rem;
  max-width: 500px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.hero-btn {
  transition: all 0.3s ease;
}

.hero-btn:hover {
  transform: translateY(-2px);
}

.hero-btn-primary:hover {
  box-shadow: 0 10px 40px rgba(59, 130, 246, 0.3);
}

.hero-btn-secondary:hover {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

/* Hero Image */
.hero-image {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  animation: slideUp 0.8s ease-out 0.6s forwards;
}

.image-container {
  position: relative;
  width: 400px;
  height: 400px;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 6px solid var(--color-white);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.profile-image:hover {
  transform: scale(1.05);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.2);
}

.image-decorations {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.decoration {
  position: absolute;
  background: linear-gradient(135deg, var(--color-primary-500), var(--color-green-500));
  border-radius: 50%;
  opacity: 0.6;
  animation: float 6s ease-in-out infinite;
}

.decoration-1 {
  width: 80px;
  height: 80px;
  top: -40px;
  right: -40px;
  animation-delay: 0s;
}

.decoration-2 {
  width: 60px;
  height: 60px;
  bottom: -30px;
  left: -30px;
  animation-delay: 2s;
}

.decoration-3 {
  width: 40px;
  height: 40px;
  top: 50%;
  right: -60px;
  animation-delay: 4s;
}

.status-card {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  background: var(--color-white);
  padding: 1rem 1.5rem;
  border-radius: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 2px solid var(--color-primary-100);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-dot {
  width: 10px;
  height: 10px;
  background: var(--color-green-500);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-700);
}

/* Main Content */
.main-content {
  padding: 4rem 0;
}

.content-section {
  margin-bottom: 6rem;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--color-primary-100);
  color: var(--color-primary-700);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
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
  max-width: 600px;
  margin: 0 auto;
}

.section-component {
  margin-top: 3rem;
}

/* Story Section */
.story-section {
  background: var(--color-gray-50);
  border-radius: 2rem;
  padding: 4rem;
  margin: 4rem 0;
}

.prose-content {
  max-width: none;
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--color-gray-700);
}

.prose-content :deep(h1),
.prose-content :deep(h2),
.prose-content :deep(h3) {
  color: var(--color-gray-900);
  font-weight: 700;
}

.prose-content :deep(p) {
  margin-bottom: 1.5rem;
}

.prose-content :deep(strong) {
  color: var(--color-gray-900);
  font-weight: 600;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  gap: 1rem;
}

.loading-icon {
  width: 2rem;
  height: 2rem;
  color: var(--color-primary-600);
}

.loading-text {
  color: var(--color-gray-600);
  font-size: 1.125rem;
}

/* Values Section */
.values-section {
  background: linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-green-50) 100%);
  border-radius: 2rem;
  padding: 4rem;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.value-card {
  background: var(--color-white);
  padding: 2rem;
  border-radius: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid var(--color-gray-200);
}

.value-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary-300);
}

.value-icon {
  width: 4rem;
  height: 4rem;
  background: var(--color-primary-100);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 1.5rem;
  color: var(--color-primary-600);
}

.value-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: 1rem;
}

.value-description {
  color: var(--color-gray-600);
  line-height: 1.6;
}

/* Contact Section */
.contact-section {
  background: linear-gradient(135deg, var(--color-gray-900) 0%, var(--color-gray-800) 100%);
  border-radius: 2rem;
  overflow: hidden;
}

.contact-card {
  display: grid;
  grid-template-columns: 2fr 1fr;
  align-items: center;
  min-height: 400px;
}

.contact-content {
  padding: 4rem;
  color: var(--color-white);
}

.contact-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--color-white) 0%, var(--color-gray-300) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.contact-description {
  font-size: 1.125rem;
  color: var(--color-gray-300);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.contact-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.contact-btn {
  transition: all 0.3s ease;
}

.contact-btn:hover {
  transform: translateY(-2px);
}

.contact-visual {
  position: relative;
  height: 100%;
  min-height: 400px;
}

.contact-decoration {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--color-primary-600) 0%, var(--color-green-500) 100%);
  opacity: 0.1;
}

.decoration-circle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border: 2px solid var(--color-white);
  border-radius: 50%;
  opacity: 0.2;
}

.decoration-dots {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, var(--color-white) 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.1;
}

/* Animations */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  .hero-title {
    background: linear-gradient(
      135deg,
      var(--color-gray-100) 0%,
      var(--color-primary-400) 100%
    );
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
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

  .story-section {
    background: var(--color-gray-800);
  }

  .prose-content {
    color: var(--color-gray-300);
  }

  .prose-content :deep(h1),
  .prose-content :deep(h2),
  .prose-content :deep(h3) {
    color: var(--color-gray-100);
  }

  .prose-content :deep(strong) {
    color: var(--color-gray-100);
  }

  .values-section {
    background: linear-gradient(135deg, var(--color-gray-800) 0%, var(--color-gray-700) 100%);
  }

  .value-card {
    background: var(--color-gray-800);
    border-color: var(--color-gray-700);
  }

  .value-title {
    color: var(--color-gray-100);
  }

  .value-description {
    color: var(--color-gray-400);
  }

  .status-card {
    background: var(--color-gray-800);
    border-color: var(--color-gray-700);
  }

  .status-text {
    color: var(--color-gray-300);
  }

  .loading-text {
    color: var(--color-gray-400);
  }
}

/* RTL Support */
[dir="rtl"] .hero-main {
  grid-template-columns: 1fr 1fr;
}

[dir="rtl"] .hero-text {
  text-align: right;
}

[dir="rtl"] .status-card {
  left: 2rem;
  right: auto;
}

[dir="rtl"] .decoration-1 {
  left: -40px;
  right: auto;
}

[dir="rtl"] .decoration-2 {
  right: -30px;
  left: auto;
}

[dir="rtl"] .decoration-3 {
  left: -60px;
  right: auto;
}

[dir="rtl"] .contact-card {
  grid-template-columns: 1fr 2fr;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-main {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }

  .contact-card {
    grid-template-columns: 1fr;
  }

  .contact-visual {
    min-height: 200px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    min-height: auto;
    padding: 4rem 0;
  }

  .hero-main {
    min-height: auto;
    gap: 2rem;
  }

  .image-container {
    width: 280px;
    height: 280px;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-btn {
    width: 100%;
    max-width: 300px;
  }

  .story-section,
  .values-section {
    padding: 2rem;
    margin: 2rem 0;
  }

  .section-header {
    margin-bottom: 2rem;
  }

  .values-grid {
    grid-template-columns: 1fr;
  }

  .contact-content {
    padding: 2rem;
  }

  .contact-title {
    font-size: 2rem;
  }

  .contact-actions {
    flex-direction: column;
  }

  .contact-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .image-container {
    width: 220px;
    height: 220px;
  }

  .decoration-1,
  .decoration-2,
  .decoration-3 {
    display: none;
  }

  .status-card {
    position: static;
    margin-top: 2rem;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .main-content {
    padding: 2rem 0;
  }

  .content-section {
    margin-bottom: 3rem;
  }
}
</style>

