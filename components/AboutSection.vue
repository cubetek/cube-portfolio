<template>
  <div class="about-section">
    <div class="about-container">
      <!-- About Header -->
      <div class="about-header">
        <h2 class="about-title">
          {{ $t('about.title') || 'About Me' }}
        </h2>
        <p class="about-subtitle">
          {{ $t('about.subtitle') || 'Passionate developer crafting digital experiences' }}
        </p>
      </div>

      <!-- Main Content -->
      <div class="about-content">
        <!-- Profile Image -->
        <div class="profile-section">
          <div class="profile-image-container">
            <NuxtImg
              src="/images/profile.jpg"
              alt="Professional headshot"
              class="profile-image"
              loading="lazy"
              format="webp"
            />
            <div class="profile-overlay">
              <div class="status-indicator">
                <span class="status-dot"></span>
                <span class="status-text">
                  {{ $t('about.status') || 'Available for projects' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Contact Links -->
          <div class="contact-links">
            <UButton
              to="mailto:contact@example.com"
              size="sm"
              variant="outline"
              color="primary"
              class="contact-btn"
            >
              <UIcon name="i-heroicons-envelope" />
              {{ $t('about.contact') || 'Get in Touch' }}
            </UButton>
            <UButton
              to="/cv.pdf"
              target="_blank"
              size="sm"
              variant="solid"
              color="primary"
              class="contact-btn"
            >
              <UIcon name="i-heroicons-document-arrow-down" />
              {{ $t('about.downloadCV') || 'Download CV' }}
            </UButton>
          </div>
        </div>

        <!-- Bio Content -->
        <div class="bio-section">
          <div class="bio-content">
            <div class="bio-text">
              <p class="bio-paragraph">
                {{ $t('about.bio.paragraph1') || 'Hello! I\'m a passionate full-stack developer with over 5 years of experience creating innovative digital solutions. I specialize in modern web technologies and have a deep love for clean, efficient code.' }}
              </p>
              <p class="bio-paragraph">
                {{ $t('about.bio.paragraph2') || 'My journey in development started with a curiosity about how things work under the hood. Today, I work with cutting-edge technologies like Vue.js, React, Node.js, and Python to build scalable applications that solve real-world problems.' }}
              </p>
              <p class="bio-paragraph">
                {{ $t('about.bio.paragraph3') || 'When I\'m not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community through writing and speaking.' }}
              </p>
            </div>

            <!-- Key Stats -->
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-number">5+</div>
                <div class="stat-label">
                  {{ $t('about.stats.experience') || 'Years Experience' }}
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-number">50+</div>
                <div class="stat-label">
                  {{ $t('about.stats.projects') || 'Projects Completed' }}
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-number">10+</div>
                <div class="stat-label">
                  {{ $t('about.stats.technologies') || 'Technologies' }}
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-number">100%</div>
                <div class="stat-label">
                  {{ $t('about.stats.satisfaction') || 'Client Satisfaction' }}
                </div>
              </div>
            </div>
          </div>

          <!-- What I Do -->
          <div class="services-section">
            <h3 class="services-title">
              {{ $t('about.services.title') || 'What I Do' }}
            </h3>
            <div class="services-grid">
              <div
                v-for="service in services"
                :key="service.id"
                class="service-card"
              >
                <div class="service-icon">
                  <UIcon :name="service.icon" class="icon" />
                </div>
                <div class="service-content">
                  <h4 class="service-name">
                    {{ $t(`about.services.${service.id}.title`) || service.title }}
                  </h4>
                  <p class="service-description">
                    {{ $t(`about.services.${service.id}.description`) || service.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Social Links -->
      <div class="social-section">
        <h3 class="social-title">
          {{ $t('about.social.title') || 'Connect With Me' }}
        </h3>
        <div class="social-links">
          <UButton
            v-for="social in socialLinks"
            :key="social.id"
            :to="social.url"
            target="_blank"
            size="lg"
            variant="ghost"
            :color="social.color"
            class="social-btn"
          >
            <UIcon :name="social.icon" class="social-icon" />
            <span class="social-label">{{ social.label }}</span>
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Types
interface Service {
  id: string
  title: string
  description: string
  icon: string
}

interface SocialLink {
  id: string
  label: string
  url: string
  icon: string
  color: string
}

// Services data
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

// Social links data
const socialLinks = ref<SocialLink[]>([
  {
    id: 'github',
    label: 'GitHub',
    url: 'https://github.com/username',
    icon: 'i-simple-icons-github',
    color: 'gray'
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    url: 'https://linkedin.com/in/username',
    icon: 'i-simple-icons-linkedin',
    color: 'blue'
  },
  {
    id: 'twitter',
    label: 'Twitter',
    url: 'https://twitter.com/username',
    icon: 'i-simple-icons-twitter',
    color: 'blue'
  },
  {
    id: 'dribbble',
    label: 'Dribbble',
    url: 'https://dribbble.com/username',
    icon: 'i-simple-icons-dribbble',
    color: 'pink'
  },
  {
    id: 'medium',
    label: 'Medium',
    url: 'https://medium.com/@username',
    icon: 'i-simple-icons-medium',
    color: 'gray'
  }
])
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