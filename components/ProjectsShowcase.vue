<template>
  <div class="projects-showcase">
    <div class="projects-header">
      <h2 class="projects-title">
        {{ $t('projects.title') || 'Featured Projects' }}
      </h2>
      <p class="projects-description">
        {{ $t('projects.description') || 'Explore my latest work and technical achievements' }}
      </p>
    </div>

    <!-- Project Filters -->
    <div class="projects-filters">
      <div class="filter-buttons">
        <button
          v-for="filter in filters"
          :key="filter.id"
          :class="[
            'filter-btn',
            { 'filter-btn--active': activeFilter === filter.id }
          ]"
          @click="setActiveFilter(filter.id)"
        >
          <UIcon :name="filter.icon" class="filter-icon" />
          {{ $t(`projects.filters.${filter.id}`) || filter.label }}
        </button>
      </div>
    </div>

    <!-- Projects Grid -->
    <div class="projects-grid">
      <TransitionGroup name="project-card" tag="div" class="grid-container">
        <div
          v-for="project in filteredProjects"
          :key="project.id"
          class="project-card"
        >
          <div class="project-image">
            <NuxtImg
              :src="project.image"
              :alt="project.title"
              class="project-img"
              loading="lazy"
              format="webp"
            />
            <div class="project-overlay">
              <div class="project-actions">
                <UButton
                  :to="project.demoUrl"
                  target="_blank"
                  size="sm"
                  variant="solid"
                  color="primary"
                  class="action-btn"
                >
                  <UIcon name="i-heroicons-eye" />
                  {{ $t('projects.demo') || 'Live Demo' }}
                </UButton>
                <UButton
                  :to="project.githubUrl"
                  target="_blank"
                  size="sm"
                  variant="outline"
                  color="primary"
                  class="action-btn"
                >
                  <UIcon name="i-heroicons-code-bracket" />
                  {{ $t('projects.code') || 'Code' }}
                </UButton>
              </div>
            </div>
          </div>

          <div class="project-content">
            <h3 class="project-title">{{ project.title }}</h3>
            <p class="project-description">{{ project.description }}</p>
            
            <div class="project-tech">
              <span
                v-for="tech in project.technologies"
                :key="tech"
                class="tech-badge"
              >
                {{ tech }}
              </span>
            </div>

            <div class="project-meta">
              <span class="project-date">
                {{ formatDate(project.date) }}
              </span>
              <span class="project-status" :class="`status-${project.status}`">
                {{ $t(`projects.status.${project.status}`) || project.status }}
              </span>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Load More Button -->
    <div v-if="hasMore" class="projects-load-more">
      <UButton
        @click="loadMore"
        size="lg"
        variant="outline"
        color="primary"
        :loading="loading"
        class="load-more-btn"
      >
        {{ $t('projects.loadMore') || 'Load More Projects' }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Types
interface Project {
  id: string
  title: string
  description: string
  image: string
  demoUrl: string
  githubUrl: string
  technologies: string[]
  category: string
  date: string
  status: 'completed' | 'in-progress' | 'archived'
  featured: boolean
}

interface Filter {
  id: string
  label: string
  icon: string
}

// Composables
const { locale } = useI18n()

// State
const activeFilter = ref('all')
const loading = ref(false)
const displayCount = ref(6)

// Filters configuration
const filters: Filter[] = [
  { id: 'all', label: 'All Projects', icon: 'i-heroicons-squares-2x2' },
  { id: 'web', label: 'Web Development', icon: 'i-heroicons-globe-alt' },
  { id: 'mobile', label: 'Mobile Apps', icon: 'i-heroicons-device-phone-mobile' },
  { id: 'api', label: 'API & Backend', icon: 'i-heroicons-server' },
  { id: 'ui', label: 'UI/UX Design', icon: 'i-heroicons-paint-brush' },
  { id: 'tools', label: 'Tools & Utilities', icon: 'i-heroicons-wrench-screwdriver' }
]

// Mock projects data (would come from content/API)
const allProjects = ref<Project[]>([
  {
    id: '1',
    title: 'E-commerce Platform',
    description: 'Full-stack e-commerce solution with Vue 3, Nuxt 3, and Stripe integration',
    image: '/images/projects/ecommerce.jpg',
    demoUrl: 'https://demo.example.com',
    githubUrl: 'https://github.com/user/project',
    technologies: ['Vue 3', 'Nuxt 3', 'TypeScript', 'Stripe', 'PostgreSQL'],
    category: 'web',
    date: '2024-01-15',
    status: 'completed',
    featured: true
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'Collaborative task management application with real-time updates',
    image: '/images/projects/task-app.jpg',
    demoUrl: 'https://tasks.example.com',
    githubUrl: 'https://github.com/user/task-app',
    technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
    category: 'web',
    date: '2023-12-10',
    status: 'completed',
    featured: true
  },
  {
    id: '3',
    title: 'Weather Mobile App',
    description: 'Cross-platform weather application with location-based forecasts',
    image: '/images/projects/weather-app.jpg',
    demoUrl: 'https://weather.example.com',
    githubUrl: 'https://github.com/user/weather-app',
    technologies: ['React Native', 'Expo', 'Weather API', 'Redux'],
    category: 'mobile',
    date: '2023-11-20',
    status: 'completed',
    featured: false
  },
  {
    id: '4',
    title: 'GraphQL API Gateway',
    description: 'Scalable GraphQL API gateway with microservices architecture',
    image: '/images/projects/graphql-api.jpg',
    demoUrl: 'https://api.example.com',
    githubUrl: 'https://github.com/user/graphql-gateway',
    technologies: ['GraphQL', 'Node.js', 'Docker', 'Kubernetes', 'Redis'],
    category: 'api',
    date: '2023-10-05',
    status: 'in-progress',
    featured: true
  },
  {
    id: '5',
    title: 'Design System',
    description: 'Comprehensive design system with reusable components',
    image: '/images/projects/design-system.jpg',
    demoUrl: 'https://design.example.com',
    githubUrl: 'https://github.com/user/design-system',
    technologies: ['Storybook', 'Figma', 'Tailwind CSS', 'Vue 3'],
    category: 'ui',
    date: '2023-09-15',
    status: 'completed',
    featured: true
  },
  {
    id: '6',
    title: 'Development Tools CLI',
    description: 'Command-line interface for streamlining development workflows',
    image: '/images/projects/cli-tools.jpg',
    demoUrl: 'https://cli.example.com',
    githubUrl: 'https://github.com/user/dev-cli',
    technologies: ['Node.js', 'Commander.js', 'TypeScript', 'Jest'],
    category: 'tools',
    date: '2023-08-30',
    status: 'completed',
    featured: false
  }
])

// Computed properties
const filteredProjects = computed(() => {
  let filtered = allProjects.value
  
  if (activeFilter.value !== 'all') {
    filtered = filtered.filter(project => project.category === activeFilter.value)
  }
  
  return filtered.slice(0, displayCount.value)
})

const hasMore = computed(() => {
  const totalFiltered = activeFilter.value === 'all' 
    ? allProjects.value.length 
    : allProjects.value.filter(p => p.category === activeFilter.value).length
  
  return displayCount.value < totalFiltered
})

// Methods
const setActiveFilter = (filterId: string) => {
  activeFilter.value = filterId
  displayCount.value = 6 // Reset display count when filter changes
}

const loadMore = async () => {
  loading.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500))
  
  displayCount.value += 6
  loading.value = false
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Lifecycle
onMounted(() => {
  // Could fetch projects from API here
  console.log('Projects showcase mounted')
})
</script>

<style scoped>
.projects-showcase {
  padding: 4rem 0;
  max-width: 1200px;
  margin: 0 auto;
}

.projects-header {
  text-align: center;
  margin-bottom: 3rem;
}

.projects-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: 1rem;
}

.projects-description {
  font-size: 1.125rem;
  color: var(--color-gray-600);
  max-width: 600px;
  margin: 0 auto;
}

.projects-filters {
  margin-bottom: 3rem;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--color-gray-200);
  border-radius: 2rem;
  background: var(--color-white);
  color: var(--color-gray-700);
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.filter-btn:hover {
  border-color: var(--color-primary-300);
  background: var(--color-primary-50);
  color: var(--color-primary-700);
}

.filter-btn--active {
  border-color: var(--color-primary-600);
  background: var(--color-primary-600);
  color: var(--color-white);
}

.filter-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.projects-grid {
  margin-bottom: 3rem;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.project-card {
  background: var(--color-white);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.project-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.project-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.project-card:hover .project-img {
  transform: scale(1.05);
}

.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.project-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  font-size: 0.875rem;
}

.project-content {
  padding: 1.5rem;
}

.project-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 0.5rem;
}

.project-description {
  color: var(--color-gray-600);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tech-badge {
  background: var(--color-primary-100);
  color: var(--color-primary-800);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}

.project-date {
  color: var(--color-gray-500);
}

.project-status {
  padding: 0.25rem 0.75rem;
  border-radius: 0.5rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-completed {
  background: var(--color-green-100);
  color: var(--color-green-800);
}

.status-in-progress {
  background: var(--color-yellow-100);
  color: var(--color-yellow-800);
}

.status-archived {
  background: var(--color-gray-100);
  color: var(--color-gray-800);
}

.projects-load-more {
  text-align: center;
}

.load-more-btn {
  min-width: 200px;
}

/* Transition animations */
.project-card-enter-active,
.project-card-leave-active {
  transition: all 0.3s ease;
}

.project-card-enter-from,
.project-card-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.project-card-move {
  transition: transform 0.3s ease;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .projects-title {
    color: var(--color-gray-100);
  }
  
  .projects-description {
    color: var(--color-gray-400);
  }
  
  .filter-btn {
    background: var(--color-gray-800);
    color: var(--color-gray-300);
    border-color: var(--color-gray-700);
  }
  
  .filter-btn:hover {
    background: var(--color-gray-700);
    color: var(--color-gray-100);
  }
  
  .project-card {
    background: var(--color-gray-800);
  }
  
  .project-title {
    color: var(--color-gray-100);
  }
  
  .project-description {
    color: var(--color-gray-400);
  }
}

/* RTL support */
[dir="rtl"] .filter-btn {
  flex-direction: row-reverse;
}

[dir="rtl"] .project-actions {
  flex-direction: row-reverse;
}

[dir="rtl"] .project-meta {
  flex-direction: row-reverse;
}

/* Responsive design */
@media (max-width: 768px) {
  .projects-showcase {
    padding: 2rem 1rem;
  }
  
  .grid-container {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .filter-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .filter-btn {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }
  
  .project-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>