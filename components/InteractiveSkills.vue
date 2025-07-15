<template>
  <div class="interactive-skills">
    <div class="skills-header">
      <h3 class="skills-title">
        {{ $t('skills.title') || 'Skills & Expertise' }}
      </h3>
      <p class="skills-description">
        {{ $t('skills.description') || 'Technologies and tools I work with, with proficiency levels and experience' }}
      </p>
    </div>

    <!-- Filter Controls -->
    <div class="filter-controls">
      <div class="filter-buttons">
        <button
          v-for="category in skillCategories"
          :key="category.id"
          @click="setActiveFilter(category.id)"
          :class="[
            'filter-btn',
            { 'filter-btn-active': activeFilter === category.id }
          ]"
        >
          <UIcon :name="category.icon" class="filter-icon" />
          <span>{{ $t(`skills.categories.${category.id}`) || category.name }}</span>
        </button>
        <button
          @click="setActiveFilter('all')"
          :class="[
            'filter-btn',
            { 'filter-btn-active': activeFilter === 'all' }
          ]"
        >
          <UIcon name="i-heroicons-squares-2x2" class="filter-icon" />
          <span>{{ $t('skills.all') || 'All Skills' }}</span>
        </button>
      </div>
    </div>

    <!-- Skills Grid -->
    <div class="skills-container">
      <transition-group name="skill-card" tag="div" class="skills-grid">
        <div
          v-for="skill in filteredSkills"
          :key="skill.id"
          class="skill-card"
          @mouseenter="animateSkill(skill.id)"
          @click="selectSkill(skill.id)"
          :class="{ 'skill-card-selected': selectedSkill === skill.id }"
        >
          <div class="skill-header">
            <div class="skill-icon-container">
              <div class="skill-icon" :style="{ backgroundColor: skill.color + '20' }">
                <component
                  :is="skill.iconComponent || 'div'"
                  :class="skill.iconClass"
                  :style="{ color: skill.color }"
                >
                  <UIcon v-if="skill.icon" :name="skill.icon" />
                </component>
              </div>
              <div class="skill-level-indicator">
                <div class="level-ring">
                  <svg class="ring-progress" width="24" height="24" viewBox="0 0 24 24">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-opacity="0.1"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      :stroke="skill.color || 'var(--color-primary-600)'"
                      stroke-width="2"
                      stroke-linecap="round"
                      :stroke-dasharray="circumference"
                      :stroke-dashoffset="getStrokeDashoffset(skill.percentage)"
                      class="progress-circle"
                      :style="{ 
                        animationDelay: `${skill.animationDelay || 0}ms`,
                        transition: 'stroke-dashoffset 1.5s ease-in-out'
                      }"
                    />
                  </svg>
                  <span class="level-percentage">{{ skill.percentage }}%</span>
                </div>
              </div>
            </div>
            
            <div class="skill-meta">
              <h4 class="skill-name">{{ skill.name }}</h4>
              <p class="skill-category-label">
                {{ $t(`skills.categories.${skill.categoryId}`) || skill.categoryName }}
              </p>
            </div>
          </div>

          <div class="skill-content">
            <p class="skill-description">{{ skill.description }}</p>
            
            <div class="skill-stats">
              <div class="stat-item">
                <span class="stat-label">{{ $t('skills.experience') || 'Experience' }}</span>
                <span class="stat-value">{{ skill.experience || 'N/A' }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">{{ $t('skills.level') || 'Level' }}</span>
                <span class="stat-value level-badge" :class="`level-${skill.level}`">
                  {{ $t(`skills.levels.${skill.level}`) || skill.level }}
                </span>
              </div>
            </div>

            <div class="skill-progress">
              <div class="progress-label">
                <span class="progress-text">{{ $t('skills.proficiency') || 'Proficiency' }}</span>
                <span class="progress-percentage">{{ animatedProgress[skill.id] || 0 }}%</span>
              </div>
              <div class="progress-track">
                <div
                  class="progress-fill"
                  :style="{ 
                    width: `${animatedProgress[skill.id] || 0}%`,
                    backgroundColor: skill.color || 'var(--color-primary-600)'
                  }"
                ></div>
              </div>
            </div>

            <div v-if="skill.projects" class="skill-projects">
              <span class="projects-label">{{ $t('skills.projects') || 'Projects' }}</span>
              <span class="projects-count">{{ skill.projects }}</span>
            </div>

            <div v-if="skill.tags?.length" class="skill-tags">
              <span
                v-for="tag in skill.tags"
                :key="tag"
                class="skill-tag"
                :style="{ borderColor: skill.color + '40', color: skill.color }"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Hover Overlay -->
          <div class="skill-overlay">
            <div class="overlay-content">
              <p class="overlay-text">{{ $t('skills.clickToLearnMore') || 'Click to learn more' }}</p>
              <UIcon name="i-heroicons-arrow-top-right-on-square" class="overlay-icon" />
            </div>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- Skill Detail Modal -->
    <UModal v-model="showSkillModal" :ui="{ width: 'max-w-2xl' }">
      <div v-if="selectedSkillData" class="skill-modal">
        <div class="modal-header">
          <div class="modal-skill-icon" :style="{ backgroundColor: selectedSkillData.color + '20' }">
            <UIcon :name="selectedSkillData.icon" :style="{ color: selectedSkillData.color }" />
          </div>
          <div class="modal-title-section">
            <h3 class="modal-title">{{ selectedSkillData.name }}</h3>
            <p class="modal-subtitle">{{ selectedSkillData.description }}</p>
          </div>
        </div>

        <div class="modal-content">
          <div class="modal-stats">
            <div class="modal-stat">
              <span class="modal-stat-label">{{ $t('skills.proficiency') || 'Proficiency' }}</span>
              <div class="modal-progress">
                <div class="modal-progress-track">
                  <div 
                    class="modal-progress-fill"
                    :style="{ 
                      width: `${selectedSkillData.percentage}%`,
                      backgroundColor: selectedSkillData.color 
                    }"
                  ></div>
                </div>
                <span class="modal-progress-text">{{ selectedSkillData.percentage }}%</span>
              </div>
            </div>
            
            <div class="modal-stat">
              <span class="modal-stat-label">{{ $t('skills.experience') || 'Experience' }}</span>
              <span class="modal-stat-value">{{ selectedSkillData.experience || 'N/A' }}</span>
            </div>
            
            <div class="modal-stat">
              <span class="modal-stat-label">{{ $t('skills.projects') || 'Projects' }}</span>
              <span class="modal-stat-value">{{ selectedSkillData.projects || 'N/A' }}</span>
            </div>
          </div>

          <div v-if="selectedSkillData.tags?.length" class="modal-tags">
            <h4 class="modal-section-title">{{ $t('skills.relatedTechnologies') || 'Related Technologies' }}</h4>
            <div class="modal-tags-list">
              <span
                v-for="tag in selectedSkillData.tags"
                :key="tag"
                class="modal-tag"
                :style="{ 
                  backgroundColor: selectedSkillData.color + '10',
                  borderColor: selectedSkillData.color + '30',
                  color: selectedSkillData.color 
                }"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <div v-if="selectedSkillData.achievements?.length" class="modal-achievements">
            <h4 class="modal-section-title">{{ $t('skills.achievements') || 'Key Achievements' }}</h4>
            <ul class="modal-achievements-list">
              <li 
                v-for="achievement in selectedSkillData.achievements"
                :key="achievement"
                class="modal-achievement-item"
              >
                {{ achievement }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'

// Types
interface Skill {
  id: string
  name: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  percentage: number
  experience?: string
  projects?: number
  icon?: string
  iconComponent?: string
  iconClass?: string
  color?: string
  categoryId: string
  categoryName: string
  tags: string[]
  achievements?: string[]
  animationDelay?: number
}

interface SkillCategory {
  id: string
  name: string
  icon: string
  skills: Skill[]
}

// State
const activeFilter = ref<string>('all')
const selectedSkill = ref<string | null>(null)
const showSkillModal = ref(false)
const animatedProgress = reactive<Record<string, number>>({})
const circumference = 2 * Math.PI * 10 // radius = 10

// Skill categories data
const skillCategories = ref<SkillCategory[]>([
  {
    id: 'frontend',
    name: 'Frontend Development',
    icon: 'i-heroicons-computer-desktop',
    skills: [
      {
        id: 'vue',
        name: 'Vue.js',
        description: 'Progressive JavaScript framework for building user interfaces',
        level: 'expert',
        percentage: 95,
        experience: '3+ years',
        projects: 15,
        color: '#4FC08D',
        categoryId: 'frontend',
        categoryName: 'Frontend Development',
        tags: ['Vue 3', 'Composition API', 'Pinia', 'Router', 'SSR'],
        achievements: [
          'Built 15+ production applications',
          'Contributed to Vue.js ecosystem',
          'Vue.js certified developer',
          'Created reusable component libraries'
        ],
        icon: 'i-simple-icons-vuedotjs'
      },
      {
        id: 'nuxt',
        name: 'Nuxt 3',
        description: 'Full-stack Vue framework with server-side rendering',
        level: 'expert',
        percentage: 90,
        experience: '2+ years',
        projects: 8,
        color: '#00DC82',
        categoryId: 'frontend',
        categoryName: 'Frontend Development',
        tags: ['SSR', 'SSG', 'Nitro', 'Auto-imports', 'File-based routing'],
        achievements: [
          'Early adopter of Nuxt 3',
          'Performance optimized applications',
          'SEO-focused implementations',
          'Multilingual site architecture'
        ],
        icon: 'i-simple-icons-nuxtdotjs'
      },
      {
        id: 'react',
        name: 'React',
        description: 'JavaScript library for building user interfaces',
        level: 'advanced',
        percentage: 85,
        experience: '2+ years',
        projects: 12,
        color: '#61DAFB',
        categoryId: 'frontend',
        categoryName: 'Frontend Development',
        tags: ['Hooks', 'Context', 'Next.js', 'Redux', 'Testing Library'],
        achievements: [
          'Built scalable React applications',
          'Implemented complex state management',
          'Created custom hooks library',
          'Migration from class to functional components'
        ],
        icon: 'i-simple-icons-react'
      },
      {
        id: 'typescript',
        name: 'TypeScript',
        description: 'Typed superset of JavaScript for large-scale applications',
        level: 'expert',
        percentage: 92,
        experience: '3+ years',
        projects: 20,
        color: '#3178C6',
        categoryId: 'frontend',
        categoryName: 'Frontend Development',
        tags: ['Static Typing', 'Generics', 'Interfaces', 'Decorators', 'Advanced Types'],
        achievements: [
          'Migrated multiple projects to TypeScript',
          'Created type-safe API clients',
          'Advanced generic programming',
          'Type-driven development advocate'
        ],
        icon: 'i-simple-icons-typescript'
      }
    ]
  },
  {
    id: 'backend',
    name: 'Backend Development',
    icon: 'i-heroicons-server',
    skills: [
      {
        id: 'nodejs',
        name: 'Node.js',
        description: 'JavaScript runtime for server-side development',
        level: 'expert',
        percentage: 88,
        experience: '3+ years',
        projects: 18,
        color: '#339933',
        categoryId: 'backend',
        categoryName: 'Backend Development',
        tags: ['Express', 'Fastify', 'NestJS', 'Microservices', 'Event-driven'],
        achievements: [
          'Built scalable REST APIs',
          'Implemented microservices architecture',
          'Real-time applications with WebSockets',
          'Performance optimization expertise'
        ],
        icon: 'i-simple-icons-nodedotjs'
      },
      {
        id: 'python',
        name: 'Python',
        description: 'High-level programming language for web development',
        level: 'advanced',
        percentage: 82,
        experience: '2+ years',
        projects: 10,
        color: '#3776AB',
        categoryId: 'backend',
        categoryName: 'Backend Development',
        tags: ['Django', 'FastAPI', 'Flask', 'SQLAlchemy', 'Pandas'],
        achievements: [
          'Data processing pipelines',
          'Machine learning integrations',
          'API development with FastAPI',
          'Automation scripts and tools'
        ],
        icon: 'i-simple-icons-python'
      }
    ]
  },
  {
    id: 'tools',
    name: 'Tools & DevOps',
    icon: 'i-heroicons-wrench-screwdriver',
    skills: [
      {
        id: 'docker',
        name: 'Docker',
        description: 'Containerization platform for application deployment',
        level: 'advanced',
        percentage: 85,
        experience: '2+ years',
        projects: 15,
        color: '#2496ED',
        categoryId: 'tools',
        categoryName: 'Tools & DevOps',
        tags: ['Containers', 'Docker Compose', 'Multi-stage', 'Dockerfile', 'Registry'],
        achievements: [
          'Containerized 15+ applications',
          'Multi-stage build optimizations',
          'Docker Compose orchestration',
          'CI/CD pipeline integrations'
        ],
        icon: 'i-simple-icons-docker'
      },
      {
        id: 'git',
        name: 'Git',
        description: 'Version control system for tracking code changes',
        level: 'expert',
        percentage: 95,
        experience: '4+ years',
        projects: 50,
        color: '#F05032',
        categoryId: 'tools',
        categoryName: 'Tools & DevOps',
        tags: ['GitHub', 'GitLab', 'Branching', 'Merging', 'Workflows'],
        achievements: [
          'Managed 50+ repositories',
          'Git workflow optimization',
          'Code review processes',
          'Branch strategy implementations'
        ],
        icon: 'i-simple-icons-git'
      }
    ]
  }
])

// Computed
const allSkills = computed(() => {
  return skillCategories.value.flatMap(category => 
    category.skills.map((skill, index) => ({
      ...skill,
      animationDelay: index * 100
    }))
  )
})

const filteredSkills = computed(() => {
  if (activeFilter.value === 'all') {
    return allSkills.value
  }
  return skillCategories.value
    .find(cat => cat.id === activeFilter.value)?.skills
    .map((skill, index) => ({
      ...skill,
      animationDelay: index * 100
    })) || []
})

const selectedSkillData = computed(() => {
  if (!selectedSkill.value) return null
  return allSkills.value.find(skill => skill.id === selectedSkill.value)
})

// Methods
const setActiveFilter = (filter: string) => {
  activeFilter.value = filter
}

const animateSkill = (skillId: string) => {
  const skill = allSkills.value.find(s => s.id === skillId)
  if (!skill) return

  const targetPercentage = skill.percentage
  const duration = 1000
  const steps = 60
  const increment = targetPercentage / steps

  let currentStep = 0
  const interval = setInterval(() => {
    currentStep++
    animatedProgress[skillId] = Math.min(increment * currentStep, targetPercentage)

    if (currentStep >= steps) {
      clearInterval(interval)
    }
  }, duration / steps)
}

const selectSkill = (skillId: string) => {
  selectedSkill.value = skillId
  showSkillModal.value = true
}

const getStrokeDashoffset = (percentage: number) => {
  return circumference - (percentage / 100) * circumference
}

// Lifecycle
onMounted(() => {
  // Initialize progress animations
  allSkills.value.forEach(skill => {
    animatedProgress[skill.id] = 0
  })

  // Animate skills on load with staggered delays
  setTimeout(() => {
    allSkills.value.forEach((skill, index) => {
      setTimeout(() => {
        animateSkill(skill.id)
      }, index * 150)
    })
  }, 500)
})
</script>

<style scoped>
.interactive-skills {
  padding: 4rem 0;
  max-width: 1400px;
  margin: 0 auto;
}

.skills-header {
  text-align: center;
  margin-bottom: 3rem;
}

.skills-title {
  font-size: clamp(1.75rem, 3vw, 2.5rem);
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: 1rem;
}

.skills-description {
  font-size: 1.125rem;
  color: var(--color-gray-600);
  max-width: 600px;
  margin: 0 auto;
}

.filter-controls {
  margin-bottom: 3rem;
}

.filter-buttons {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--color-white);
  border: 2px solid var(--color-gray-200);
  border-radius: 2rem;
  font-weight: 500;
  color: var(--color-gray-700);
  transition: all 0.3s ease;
  cursor: pointer;
}

.filter-btn:hover {
  border-color: var(--color-primary-300);
  background: var(--color-primary-50);
  transform: translateY(-2px);
}

.filter-btn-active {
  background: var(--color-primary-600);
  border-color: var(--color-primary-600);
  color: var(--color-white);
}

.filter-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.skills-container {
  position: relative;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.skill-card {
  position: relative;
  background: var(--color-white);
  border-radius: 1.5rem;
  padding: 2rem;
  border: 1px solid var(--color-gray-200);
  transition: all 0.4s ease;
  cursor: pointer;
  overflow: hidden;
}

.skill-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary-300);
}

.skill-card-selected {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 2px var(--color-primary-200);
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.skill-icon-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.skill-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.skill-level-indicator {
  position: relative;
}

.level-ring {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring-progress {
  transform: rotate(-90deg);
}

.level-percentage {
  position: absolute;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-gray-700);
}

.skill-meta {
  flex: 1;
  margin-left: 1rem;
}

.skill-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: 0.25rem;
}

.skill-category-label {
  font-size: 0.875rem;
  color: var(--color-gray-500);
  font-weight: 500;
}

.skill-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skill-description {
  color: var(--color-gray-600);
  line-height: 1.5;
  font-size: 0.9rem;
}

.skill-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-gray-500);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.stat-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-700);
}

.level-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  text-transform: capitalize;
}

.level-beginner {
  background: var(--color-red-100);
  color: var(--color-red-700);
}

.level-intermediate {
  background: var(--color-yellow-100);
  color: var(--color-yellow-700);
}

.level-advanced {
  background: var(--color-blue-100);
  color: var(--color-blue-700);
}

.level-expert {
  background: var(--color-green-100);
  color: var(--color-green-700);
}

.skill-progress {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-gray-700);
}

.progress-percentage {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary-600);
}

.progress-track {
  height: 0.5rem;
  background: var(--color-gray-200);
  border-radius: 0.25rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 0.25rem;
  transition: width 1s ease-out;
}

.skill-projects {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--color-gray-50);
  border-radius: 0.75rem;
}

.projects-label {
  font-size: 0.875rem;
  color: var(--color-gray-600);
}

.projects-count {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-primary-600);
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  padding: 0.25rem 0.75rem;
  border: 1px solid;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  background: var(--color-white);
}

.skill-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 1.5rem;
}

.skill-card:hover .skill-overlay {
  opacity: 1;
}

.overlay-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-white);
}

.overlay-text {
  font-size: 0.875rem;
  font-weight: 500;
}

.overlay-icon {
  width: 1.5rem;
  height: 1.5rem;
}

/* Modal Styles */
.skill-modal {
  padding: 2rem;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.modal-skill-icon {
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: 0.5rem;
}

.modal-subtitle {
  color: var(--color-gray-600);
  line-height: 1.5;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.modal-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.modal-stat {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.modal-stat-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-gray-600);
}

.modal-stat-value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-gray-900);
}

.modal-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.modal-progress-track {
  flex: 1;
  height: 0.75rem;
  background: var(--color-gray-200);
  border-radius: 0.375rem;
  overflow: hidden;
}

.modal-progress-fill {
  height: 100%;
  border-radius: 0.375rem;
  transition: width 1s ease-out;
}

.modal-progress-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-700);
  min-width: 3rem;
}

.modal-section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 1rem;
}

.modal-tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.modal-tag {
  padding: 0.5rem 1rem;
  border: 1px solid;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.modal-achievements-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.modal-achievement-item {
  position: relative;
  padding-left: 1.5rem;
  color: var(--color-gray-600);
  line-height: 1.5;
}

.modal-achievement-item::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--color-green-600);
  font-weight: bold;
}

/* Transition animations */
.skill-card-enter-active,
.skill-card-leave-active {
  transition: all 0.4s ease;
}

.skill-card-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}

.skill-card-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.9);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .skills-title {
    color: var(--color-gray-100);
  }
  
  .skills-description {
    color: var(--color-gray-400);
  }
  
  .filter-btn {
    background: var(--color-gray-800);
    border-color: var(--color-gray-700);
    color: var(--color-gray-300);
  }
  
  .filter-btn:hover {
    background: var(--color-primary-900);
    border-color: var(--color-primary-600);
  }
  
  .skill-card {
    background: var(--color-gray-800);
    border-color: var(--color-gray-700);
  }
  
  .skill-name {
    color: var(--color-gray-100);
  }
  
  .skill-description {
    color: var(--color-gray-400);
  }
  
  .skill-projects {
    background: var(--color-gray-700);
  }
  
  .modal-title {
    color: var(--color-gray-100);
  }
  
  .modal-subtitle {
    color: var(--color-gray-400);
  }
  
  .modal-stat-value {
    color: var(--color-gray-100);
  }
}

/* RTL support */
[dir="rtl"] .skill-header {
  flex-direction: row-reverse;
}

[dir="rtl"] .skill-meta {
  margin-right: 1rem;
  margin-left: 0;
}

[dir="rtl"] .modal-header {
  flex-direction: row-reverse;
}

[dir="rtl"] .modal-achievement-item {
  padding-right: 1.5rem;
  padding-left: 0;
}

[dir="rtl"] .modal-achievement-item::before {
  right: 0;
  left: auto;
}

/* Responsive design */
@media (max-width: 768px) {
  .interactive-skills {
    padding: 2rem 1rem;
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
  
  .skills-grid {
    grid-template-columns: 1fr;
  }
  
  .skill-stats {
    grid-template-columns: 1fr;
  }
  
  .modal-stats {
    grid-template-columns: 1fr;
  }
  
  .skill-modal {
    padding: 1.5rem;
  }
}
</style>