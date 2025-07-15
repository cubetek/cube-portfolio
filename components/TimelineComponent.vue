<template>
  <div class="timeline-component">
    <div class="timeline-header">
      <h3 class="timeline-title">
        {{ $t('timeline.title') || 'Career Journey' }}
      </h3>
      <p class="timeline-description">
        {{ $t('timeline.description') || 'Key milestones and experiences that shaped my career' }}
      </p>
    </div>

    <div class="timeline-container">
      <div class="timeline-line" ref="timelineLine"></div>
      
      <div 
        v-for="(milestone, index) in milestones" 
        :key="milestone.id"
        class="timeline-item"
        :class="{ 
          'timeline-item-left': index % 2 === 0, 
          'timeline-item-right': index % 2 === 1,
          'timeline-item-visible': visibleItems.includes(index)
        }"
        :ref="`timeline-item-${index}`"
      >
        <div class="timeline-content">
          <div class="timeline-marker">
            <div class="marker-icon">
              <UIcon :name="milestone.icon" class="icon" />
            </div>
            <div class="marker-pulse" v-if="milestone.current"></div>
          </div>

          <div class="timeline-card">
            <div class="card-header">
              <div class="timeline-date">
                <span class="date-text">{{ formatDate(milestone.date) }}</span>
                <span v-if="milestone.endDate" class="date-separator">-</span>
                <span v-if="milestone.endDate" class="date-text">
                  {{ milestone.current ? $t('timeline.present') || 'Present' : formatDate(milestone.endDate) }}
                </span>
              </div>
              <div v-if="milestone.type" class="timeline-type">
                <span class="type-badge" :class="`type-${milestone.type}`">
                  {{ $t(`timeline.types.${milestone.type}`) || milestone.type }}
                </span>
              </div>
            </div>

            <div class="card-content">
              <h4 class="milestone-title">{{ milestone.title }}</h4>
              <p class="milestone-subtitle" v-if="milestone.subtitle">{{ milestone.subtitle }}</p>
              <p class="milestone-description">{{ milestone.description }}</p>

              <div v-if="milestone.achievements?.length" class="achievements">
                <h5 class="achievements-title">
                  {{ $t('timeline.achievements') || 'Key Achievements' }}
                </h5>
                <ul class="achievements-list">
                  <li 
                    v-for="achievement in milestone.achievements" 
                    :key="achievement"
                    class="achievement-item"
                  >
                    {{ achievement }}
                  </li>
                </ul>
              </div>

              <div v-if="milestone.technologies?.length" class="technologies">
                <span 
                  v-for="tech in milestone.technologies" 
                  :key="tech"
                  class="tech-tag"
                >
                  {{ tech }}
                </span>
              </div>

              <div v-if="milestone.links?.length" class="milestone-links">
                <UButton
                  v-for="link in milestone.links"
                  :key="link.label"
                  :to="link.url"
                  target="_blank"
                  size="sm"
                  variant="outline"
                  class="milestone-link"
                >
                  <UIcon :name="link.icon || 'i-heroicons-arrow-top-right-on-square'" />
                  {{ link.label }}
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'

// Types
interface MilestoneLink {
  label: string
  url: string
  icon?: string
}

interface Milestone {
  id: string
  date: string
  endDate?: string
  current?: boolean
  title: string
  subtitle?: string
  description: string
  type: 'work' | 'education' | 'project' | 'achievement' | 'certification'
  icon: string
  achievements?: string[]
  technologies?: string[]
  links?: MilestoneLink[]
}

// Composables
const { locale } = useI18n()

// State
const timelineLine = ref<HTMLElement>()
const visibleItems = reactive<number[]>([])
const observer = ref<IntersectionObserver>()

// Timeline data
const milestones = ref<Milestone[]>([
  {
    id: 'current-role',
    date: '2023-01-01',
    current: true,
    title: 'Senior Full-Stack Developer',
    subtitle: 'Tech Innovation Company',
    description: 'Leading development of modern web applications with focus on performance, accessibility, and user experience. Architecting scalable solutions using Vue.js, Node.js, and cloud technologies.',
    type: 'work',
    icon: 'i-heroicons-briefcase',
    achievements: [
      'Improved application performance by 40% through optimization',
      'Led a team of 5 developers on critical projects',
      'Implemented comprehensive testing strategy',
      'Established development best practices and code standards'
    ],
    technologies: ['Vue.js', 'Nuxt 3', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
    links: [
      {
        label: 'Company Website',
        url: 'https://company.com',
        icon: 'i-heroicons-globe-alt'
      }
    ]
  },
  {
    id: 'freelance-period',
    date: '2021-06-01',
    endDate: '2022-12-31',
    title: 'Freelance Developer',
    subtitle: 'Independent Contractor',
    description: 'Provided web development services to various clients, specializing in modern JavaScript frameworks and responsive design. Built custom solutions for startups and established businesses.',
    type: 'work',
    icon: 'i-heroicons-computer-desktop',
    achievements: [
      'Completed 25+ successful projects',
      'Achieved 100% client satisfaction rate',
      'Developed expertise in multiple tech stacks',
      'Built long-term client relationships'
    ],
    technologies: ['React', 'Vue.js', 'Next.js', 'Firebase', 'Tailwind CSS', 'Figma'],
    links: [
      {
        label: 'Portfolio',
        url: 'https://portfolio.com',
        icon: 'i-heroicons-eye'
      }
    ]
  },
  {
    id: 'web-developer-role',
    date: '2019-03-01',
    endDate: '2021-05-31',
    title: 'Web Developer',
    subtitle: 'Digital Agency Solutions',
    description: 'Developed and maintained client websites and web applications. Collaborated with design teams to implement pixel-perfect interfaces and optimize user experiences.',
    type: 'work',
    icon: 'i-heroicons-code-bracket',
    achievements: [
      'Delivered 50+ websites on time and budget',
      'Reduced page load times by 60% on average',
      'Mentored junior developers',
      'Introduced modern development practices'
    ],
    technologies: ['JavaScript', 'PHP', 'WordPress', 'SASS', 'jQuery', 'Bootstrap']
  },
  {
    id: 'vue-certification',
    date: '2023-04-15',
    title: 'Vue.js Certification',
    subtitle: 'Vue School',
    description: 'Completed comprehensive Vue.js certification covering advanced concepts, composition API, and ecosystem tools.',
    type: 'certification',
    icon: 'i-heroicons-academic-cap',
    achievements: [
      'Mastered Vue 3 Composition API',
      'Advanced state management with Pinia',
      'Performance optimization techniques'
    ],
    technologies: ['Vue.js', 'Nuxt.js', 'Pinia', 'Vite'],
    links: [
      {
        label: 'View Certificate',
        url: 'https://vueschool.io/certificates/123',
        icon: 'i-heroicons-document-text'
      }
    ]
  },
  {
    id: 'computer-science-degree',
    date: '2015-09-01',
    endDate: '2019-06-30',
    title: 'Bachelor of Computer Science',
    subtitle: 'University of Technology',
    description: 'Graduated with honors, focusing on software engineering, data structures, algorithms, and web technologies. Active in coding clubs and hackathons.',
    type: 'education',
    icon: 'i-heroicons-academic-cap',
    achievements: [
      'Graduated Summa Cum Laude (GPA: 3.9/4.0)',
      'Winner of university hackathon 2019',
      'President of Computer Science Club',
      'Dean\'s List for 6 consecutive semesters'
    ],
    technologies: ['Java', 'Python', 'C++', 'SQL', 'HTML/CSS', 'JavaScript']
  },
  {
    id: 'open-source-project',
    date: '2022-08-01',
    title: 'Open Source Contributor',
    subtitle: 'Vue.js Ecosystem',
    description: 'Active contributor to Vue.js ecosystem projects, including documentation improvements, bug fixes, and feature implementations.',
    type: 'project',
    icon: 'i-simple-icons-github',
    achievements: [
      '100+ contributions across multiple repositories',
      'Maintainer of 3 popular npm packages',
      '5000+ downloads on published packages',
      'Recognized contributor badge from Vue team'
    ],
    technologies: ['Vue.js', 'TypeScript', 'Vite', 'Rollup', 'Jest'],
    links: [
      {
        label: 'GitHub Profile',
        url: 'https://github.com/username',
        icon: 'i-simple-icons-github'
      }
    ]
  }
])

// Methods
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'short'
  })
}

const setupIntersectionObserver = () => {
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const index = parseInt(entry.target.getAttribute('data-index') || '0')
        if (entry.isIntersecting) {
          if (!visibleItems.includes(index)) {
            visibleItems.push(index)
          }
        }
      })
    },
    {
      threshold: 0.3,
      rootMargin: '50px'
    }
  )
}

const observeTimelineItems = () => {
  milestones.value.forEach((_, index) => {
    const element = document.querySelector(`[data-index="${index}"]`)
    if (element && observer.value) {
      observer.value.observe(element)
    }
  })
}

// Lifecycle
onMounted(() => {
  setupIntersectionObserver()
  
  // Add data-index attributes and start observing
  setTimeout(() => {
    const timelineItems = document.querySelectorAll('.timeline-item')
    timelineItems.forEach((item, index) => {
      item.setAttribute('data-index', index.toString())
    })
    observeTimelineItems()
  }, 100)
})

onUnmounted(() => {
  if (observer.value) {
    observer.value.disconnect()
  }
})
</script>

<style scoped>
.timeline-component {
  padding: 4rem 0;
  max-width: 1000px;
  margin: 0 auto;
}

.timeline-header {
  text-align: center;
  margin-bottom: 4rem;
}

.timeline-title {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: 1rem;
}

.timeline-description {
  font-size: 1.125rem;
  color: var(--color-gray-600);
  max-width: 600px;
  margin: 0 auto;
}

.timeline-container {
  position: relative;
  margin: 0 auto;
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(
    to bottom,
    var(--color-primary-300),
    var(--color-primary-600),
    var(--color-primary-300)
  );
  transform: translateX(-50%);
  z-index: 1;
}

.timeline-item {
  position: relative;
  margin-bottom: 4rem;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.timeline-item-visible {
  opacity: 1;
  transform: translateY(0);
}

.timeline-item-left .timeline-content {
  padding-right: calc(50% + 2rem);
  text-align: right;
}

.timeline-item-right .timeline-content {
  padding-left: calc(50% + 2rem);
  text-align: left;
}

.timeline-marker {
  position: absolute;
  left: 50%;
  top: 2rem;
  width: 3.5rem;
  height: 3.5rem;
  transform: translateX(-50%);
  z-index: 2;
}

.marker-icon {
  width: 100%;
  height: 100%;
  background: var(--color-white);
  border: 3px solid var(--color-primary-600);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.marker-icon .icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-primary-600);
}

.marker-pulse {
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border: 2px solid var(--color-primary-400);
  border-radius: 50%;
  animation: pulse-ring 2s infinite;
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

.timeline-card {
  background: var(--color-white);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-gray-200);
  transition: all 0.3s ease;
}

.timeline-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.timeline-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary-600);
}

.date-separator {
  color: var(--color-gray-400);
}

.timeline-type {
  flex-shrink: 0;
}

.type-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.type-work {
  background: var(--color-blue-100);
  color: var(--color-blue-700);
}

.type-education {
  background: var(--color-green-100);
  color: var(--color-green-700);
}

.type-project {
  background: var(--color-purple-100);
  color: var(--color-purple-700);
}

.type-achievement {
  background: var(--color-yellow-100);
  color: var(--color-yellow-700);
}

.type-certification {
  background: var(--color-orange-100);
  color: var(--color-orange-700);
}

.milestone-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: 0.5rem;
}

.milestone-subtitle {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-primary-600);
  margin-bottom: 1rem;
}

.milestone-description {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--color-gray-600);
  margin-bottom: 1.5rem;
}

.achievements {
  margin-bottom: 1.5rem;
}

.achievements-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-700);
  margin-bottom: 0.75rem;
}

.achievements-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.achievement-item {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-gray-600);
  line-height: 1.5;
}

.achievement-item::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--color-primary-600);
  font-weight: bold;
}

.technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tech-tag {
  background: var(--color-gray-100);
  color: var(--color-gray-700);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.milestone-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.milestone-link {
  font-size: 0.875rem;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .timeline-title {
    color: var(--color-gray-100);
  }
  
  .timeline-description {
    color: var(--color-gray-400);
  }
  
  .timeline-card {
    background: var(--color-gray-800);
    border-color: var(--color-gray-700);
  }
  
  .marker-icon {
    background: var(--color-gray-800);
  }
  
  .milestone-title {
    color: var(--color-gray-100);
  }
  
  .milestone-description {
    color: var(--color-gray-400);
  }
  
  .achievement-item {
    color: var(--color-gray-400);
  }
  
  .achievements-title {
    color: var(--color-gray-300);
  }
  
  .tech-tag {
    background: var(--color-gray-700);
    color: var(--color-gray-300);
  }
}

/* RTL support */
[dir="rtl"] .timeline-item-left .timeline-content {
  padding-left: calc(50% + 2rem);
  padding-right: 0;
  text-align: left;
}

[dir="rtl"] .timeline-item-right .timeline-content {
  padding-right: calc(50% + 2rem);
  padding-left: 0;
  text-align: right;
}

[dir="rtl"] .achievement-item {
  padding-right: 1.5rem;
  padding-left: 0;
}

[dir="rtl"] .achievement-item::before {
  right: 0;
  left: auto;
}

[dir="rtl"] .card-header {
  flex-direction: row-reverse;
}

/* Responsive design */
@media (max-width: 768px) {
  .timeline-component {
    padding: 2rem 1rem;
  }
  
  .timeline-line {
    left: 2rem;
  }
  
  .timeline-marker {
    left: 2rem;
    width: 3rem;
    height: 3rem;
  }
  
  .timeline-item-left .timeline-content,
  .timeline-item-right .timeline-content {
    padding-left: 5rem;
    padding-right: 0;
    text-align: left;
  }
  
  .timeline-card {
    padding: 1.5rem;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .milestone-links {
    flex-direction: column;
  }
  
  .milestone-link {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .timeline-card {
    padding: 1rem;
  }
  
  .technologies {
    gap: 0.25rem;
  }
  
  .tech-tag {
    font-size: 0.6875rem;
    padding: 0.125rem 0.5rem;
  }
}
</style>