<template>
  <div class="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex flex-col gap-16">
      <!-- About Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {{ $t('about.title') || 'About Me' }}
        </h2>
        <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {{ $t('about.subtitle') || 'Passionate developer crafting digital experiences' }}
        </p>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-16 items-start">
        <!-- Profile Image -->
        <div class="flex flex-col gap-8 lg:col-span-1">
          <div class="relative w-72 h-72 mx-auto">
            <img
              :src="profile.avatar"
              :alt="profile.name"
              class="w-full h-full object-cover rounded-full border-4 border-primary-600 shadow-xl"
              loading="lazy"
            />
            <div class="absolute bottom-4 end-4 bg-white dark:bg-gray-800 px-3 py-2 rounded-full shadow-lg border-2 border-primary-600">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ profile.availability || $t('about.status') || 'Available for projects' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Contact Links -->
          <div class="flex flex-col gap-4">
            <UButton
              :to="`mailto:${contact.email}`"
              size="sm"
              variant="outline"
              color="primary"
              icon="i-heroicons-envelope"
              class="w-full justify-center"
            >
              {{ $t('about.contact') || 'Get in Touch' }}
            </UButton>
            <UButton
              v-if="profile.resume"
              :to="profile.resume"
              target="_blank"
              size="sm"
              variant="solid"
              color="primary"
              icon="i-heroicons-document-arrow-down"
              class="w-full justify-center"
            >
              {{ $t('about.downloadCV') || 'Download CV' }}
            </UButton>
          </div>
        </div>

        <!-- Bio Content -->
        <div class="lg:col-span-2 flex flex-col gap-12">
          <div class="flex flex-col gap-8">
            <div class="space-y-6">
              <p class="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                {{ profile.bio || $t('about.bio.paragraph1') || 'Hello! I\'m a passionate full-stack developer with over 5 years of experience creating innovative digital solutions. I specialize in modern web technologies and have a deep love for clean, efficient code.' }}
              </p>
              <p class="text-lg leading-relaxed text-gray-600 dark:text-gray-400" v-if="profile.tagline">
                {{ profile.tagline }}
              </p>
              <p class="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                {{ $t('about.bio.paragraph2') || 'My journey in development started with a curiosity about how things work under the hood. Today, I work with cutting-edge technologies like Vue.js, React, Node.js, and Python to build scalable applications that solve real-world problems.' }}
              </p>
              <p class="text-lg leading-relaxed text-gray-600 dark:text-gray-400">
                {{ $t('about.bio.paragraph3') || 'When I\'m not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community through writing and speaking.' }}
              </p>
            </div>

            <!-- Key Stats -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <UCard class="text-center p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div class="text-3xl font-bold text-primary-600 mb-2">{{ stats.experience }}+</div>
                <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {{ $t('about.stats.experience') || 'Years Experience' }}
                </div>
              </UCard>
              <UCard class="text-center p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div class="text-3xl font-bold text-primary-600 mb-2">{{ stats.projects }}+</div>
                <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {{ $t('about.stats.projects') || 'Projects Completed' }}
                </div>
              </UCard>
              <UCard class="text-center p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div class="text-3xl font-bold text-primary-600 mb-2">{{ stats.technologies }}+</div>
                <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {{ $t('about.stats.technologies') || 'Technologies' }}
                </div>
              </UCard>
              <UCard class="text-center p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div class="text-3xl font-bold text-primary-600 mb-2">{{ stats.satisfaction }}%</div>
                <div class="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {{ $t('about.stats.satisfaction') || 'Client Satisfaction' }}
                </div>
              </UCard>
            </div>
          </div>

          <!-- What I Do -->
          <div class="mt-8">
            <h3 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-8">
              {{ $t('about.services.title') || 'What I Do' }}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <UCard
                v-for="service in services"
                :key="service.id"
                class="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border hover:border-primary-300 dark:hover:border-primary-600"
              >
                <div class="flex gap-4">
                  <div class="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center flex-shrink-0">
                    <UIcon :name="service.icon" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {{ $t(`about.services.${service.id}.title`) || service.title }}
                    </h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {{ $t(`about.services.${service.id}.description`) || service.description }}
                    </p>
                  </div>
                </div>
              </UCard>
            </div>
          </div>
        </div>
      </div>

      <!-- Social Links -->
      <div class="text-center">
        <h3 class="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-8">
          {{ $t('about.social.title') || 'Connect With Me' }}
        </h3>
        <div class="flex justify-center flex-wrap gap-4">
          <UButton
            v-for="social in socialLinks"
            :key="social.id"
            :to="social.url"
            target="_blank"
            size="lg"
            variant="ghost"
            color="neutral"
            class="flex items-center gap-2 px-6 py-3 hover:-translate-y-1 transition-all duration-300"
          >
            <UIcon :name="social.icon" class="w-5 h-5" />
            <span class="font-medium">{{ social.label }}</span>
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Use centralized personal data
const { profile, skills, projects, social, contact, getFeaturedProjects } = usePersonalData()

// Types
interface Service {
  id: string
  title: string
  description: string
  icon: string
}

// Services data - this could be moved to personal data later if needed
const services = ref<Service[]>([
  {
    id: 'frontend',
    title: 'Frontend Development',
    description: 'Creating responsive, interactive user interfaces with modern frameworks like Vue.js and React.',
    icon: 'i-heroicons-computer-desktop'
  },
  {
    id: 'backend',
    title: 'Backend Development',
    description: 'Building robust server-side applications and APIs with Node.js, Python, and cloud technologies.',
    icon: 'i-heroicons-server'
  },
  {
    id: 'mobile',
    title: 'Mobile Applications',
    description: 'Developing cross-platform mobile apps with React Native and native technologies.',
    icon: 'i-heroicons-device-phone-mobile'
  },
  {
    id: 'devops',
    title: 'DevOps & Deployment',
    description: 'Implementing CI/CD pipelines, containerization, and cloud deployment strategies.',
    icon: 'i-heroicons-cloud'
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Design',
    description: 'Designing intuitive user experiences and modern interfaces with Figma and design systems.',
    icon: 'i-heroicons-paint-brush'
  },
  {
    id: 'consulting',
    title: 'Technical Consulting',
    description: 'Providing technical guidance, architecture reviews, and development strategy consulting.',
    icon: 'i-heroicons-light-bulb'
  }
])

// Get social links from centralized data
const socialLinks = computed(() => {
  return social.value.map(s => ({
    id: s.platform.toLowerCase(),
    label: s.displayName || s.platform,
    url: s.url,
    icon: s.icon
  }))
})

// Calculate stats from centralized data
const stats = computed(() => ({
  experience: profile.value.yearsOfExperience,
  projects: projects.value.length,
  technologies: skills.value.reduce((total, category) => total + category.skills.length, 0),
  satisfaction: 100 // This could be made dynamic later
}))
</script>

<style scoped>
.about-section {
  padding: 4rem 0;
  max-width: 1200px;
  margin: 0 auto;
}

.about-container {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.about-header {
  text-align: center;
  margin-bottom: 2rem;
}

.about-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: 1rem;
}

.about-subtitle {
  font-size: 1.25rem;
  color: var(--color-gray-600);
  max-width: 600px;
  margin: 0 auto;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 4rem;
  align-items: start;
}

.profile-section {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.profile-image-container {
  position: relative;
  width: 280px;
  height: 280px;
  margin: 0 auto;
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid var(--color-primary-600);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.profile-overlay {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: var(--color-white);
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid var(--color-primary-600);
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: var(--color-green-500);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-gray-700);
}

.contact-links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-btn {
  width: 100%;
  justify-content: center;
}

.bio-section {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.bio-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.bio-text {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.bio-paragraph {
  font-size: 1.125rem;
  line-height: 1.7;
  color: var(--color-gray-600);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.stat-item {
  text-align: center;
  padding: 1.5rem;
  background: var(--color-gray-50);
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary-600);
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-gray-600);
}

.services-section {
  margin-top: 2rem;
}

.services-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 2rem;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.service-card {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--color-white);
  border-radius: 1rem;
  border: 1px solid var(--color-gray-200);
  transition: all 0.3s ease;
}

.service-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary-300);
}

.service-icon {
  width: 3rem;
  height: 3rem;
  background: var(--color-primary-100);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.service-icon .icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-primary-600);
}

.service-content {
  flex: 1;
}

.service-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 0.5rem;
}

.service-description {
  font-size: 0.875rem;
  color: var(--color-gray-600);
  line-height: 1.5;
}

.social-section {
  text-align: center;
}

.social-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 2rem;
}

.social-links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.social-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  transition: all 0.3s ease;
}

.social-btn:hover {
  transform: translateY(-2px);
}

.social-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.social-label {
  font-weight: 500;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .about-title,
  .services-title,
  .social-title {
    color: var(--color-gray-100);
  }
  
  .about-subtitle {
    color: var(--color-gray-400);
  }
  
  .bio-paragraph {
    color: var(--color-gray-400);
  }
  
  .service-card {
    background: var(--color-gray-800);
    border-color: var(--color-gray-700);
  }
  
  .service-name {
    color: var(--color-gray-100);
  }
  
  .service-description {
    color: var(--color-gray-400);
  }
  
  .stat-item {
    background: var(--color-gray-800);
  }
  
  .stat-label {
    color: var(--color-gray-400);
  }
  
  .profile-overlay {
    background: var(--color-gray-800);
  }
  
  .status-text {
    color: var(--color-gray-300);
  }
}

/* RTL support */
[dir="rtl"] .about-content {
  grid-template-columns: 2fr 1fr;
}

[dir="rtl"] .service-card {
  flex-direction: row-reverse;
}

[dir="rtl"] .status-indicator {
  flex-direction: row-reverse;
}

[dir="rtl"] .social-btn {
  flex-direction: row-reverse;
}

[dir="rtl"] .profile-overlay {
  left: 1rem;
  right: auto;
}

/* Responsive design */
@media (max-width: 768px) {
  .about-section {
    padding: 2rem 1rem;
  }
  
  .about-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .profile-image-container {
    width: 200px;
    height: 200px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .services-grid {
    grid-template-columns: 1fr;
  }
  
  .social-links {
    flex-direction: column;
    align-items: center;
  }
  
  .social-btn {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-item {
    padding: 1rem;
  }
}
</style>