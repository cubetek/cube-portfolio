<template>
  <div class="py-12 max-w-7xl mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        {{ $t('skills.title') || 'Skills & Technologies' }}
      </h2>
      <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
        {{ $t('skills.description') || 'Technologies I work with and expertise levels' }}
      </p>
    </div>

    <!-- Skill Categories -->
    <div class="space-y-12">
      <div
        v-for="category in skillCategories"
        :key="category.id"
        class="space-y-6"
      >
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
            <UIcon :name="category.icon" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ $t(`skills.categories.${category.id}`) || category.name }}
          </h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UCard
            v-for="skill in category.skills"
            :key="skill.id"
            class="hover:scale-105 transition-transform duration-300 cursor-pointer"
            @mouseenter="animateProgress(skill.id)"
          >
            <template #header>
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 flex items-center justify-center">
                  <div>
                    <UIcon v-if="skill.icon" :name="skill.icon" class="w-6 h-6" />
                  </div>
                </div>
                <h4 class="font-semibold text-gray-900 dark:text-white">{{ skill.name }}</h4>
              </div>
            </template>
            
            <div class="space-y-4">
              <p class="text-sm text-gray-600 dark:text-gray-400">{{ skill.description }}</p>
              
              <div class="space-y-2">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {{ $t(`skills.levels.${skill.level}`) || skill.level }}
                  </span>
                  <span class="text-sm font-semibold text-primary-600 dark:text-primary-400">{{ skill.percentage }}%</span>
                </div>
                
                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    class="h-full bg-gradient-to-r from-primary-500 to-green-500 dark:from-primary-400 dark:to-green-400 rounded-full transition-all duration-1000 ease-out"
                    :style="{ width: animatedSkills[skill.id] ? `${skill.percentage}%` : '0%' }"
                  ></div>
                </div>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { SkillLevel } from '~/types/personal'

// Types
interface Skill {
  id: string
  name: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  percentage: number
  icon?: string
  iconComponent?: string
  iconClass?: string
  color?: string
  tags: string[]
}

interface SkillCategory {
  id: string
  name: string
  icon: string
  skills: Skill[]
}

interface TechItem {
  name: string
  weight: number
  color?: string
}

interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  logo: string
}

// Composables
const { locale } = useI18n()

// State
const animatedSkills = reactive<Record<string, boolean>>({})

// Use centralized personal data
const { skills } = usePersonalData()
const { skill: skillFormatters } = personalDataFormatters

// Transform personal data to component format
const skillCategories = computed(() => {
  return skills.value.map(category => ({
    id: category.name.toLowerCase().replace(/\s+/g, '-'),
    name: category.name,
    icon: category.icon || 'i-heroicons-code-bracket',
    skills: category.skills.map(skill => ({
      id: skill.name.toLowerCase().replace(/\s+/g, '-'),
      name: skill.name,
      description: skill.description || '',
      level: skill.level,
      percentage: skillFormatters.getSkillLevelProgress(skill.level as SkillLevel),
      color: '#4F46E5', // Default color, could be enhanced
      tags: [], // Could be enhanced with skill-specific tags
      icon: skill.icon || 'i-heroicons-code-bracket'
    }))
  }))
})

// Tech cloud data
const techCloud = ref<TechItem[]>([
  { name: 'Vue.js', weight: 1.8, color: '#4FC08D' },
  { name: 'Nuxt 3', weight: 1.6, color: '#00DC82' },
  { name: 'TypeScript', weight: 1.5, color: '#3178C6' },
  { name: 'Node.js', weight: 1.4, color: '#339933' },
  { name: 'React', weight: 1.3, color: '#61DAFB' },
  { name: 'Python', weight: 1.2, color: '#3776AB' },
  { name: 'Docker', weight: 1.1, color: '#2496ED' },
  { name: 'PostgreSQL', weight: 1.0, color: '#336791' },
  { name: 'GraphQL', weight: 0.9, color: '#E10098' },
  { name: 'AWS', weight: 0.8, color: '#FF9900' },
  { name: 'Tailwind CSS', weight: 1.2, color: '#06B6D4' },
  { name: 'Figma', weight: 0.9, color: '#F24E1E' },
  { name: 'MongoDB', weight: 0.8, color: '#47A248' },
  { name: 'Redis', weight: 0.7, color: '#DC382D' },
  { name: 'Elasticsearch', weight: 0.6, color: '#005571' }
])

// Certifications data
const certifications = ref<Certification[]>([
  {
    id: 'aws-solutions-architect',
    name: 'AWS Solutions Architect',
    issuer: 'Amazon Web Services',
    date: '2023-08-15',
    logo: '/images/certs/aws-logo.png'
  },
  {
    id: 'google-cloud-professional',
    name: 'Google Cloud Professional',
    issuer: 'Google Cloud',
    date: '2023-06-20',
    logo: '/images/certs/gcp-logo.png'
  },
  {
    id: 'vue-certification',
    name: 'Vue.js Certification',
    issuer: 'Vue School',
    date: '2023-04-10',
    logo: '/images/certs/vue-logo.png'
  }
])

// Methods
const animateProgress = (skillId: string) => {
  if (!animatedSkills[skillId]) {
    animatedSkills[skillId] = true
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'short'
  })
}

// Lifecycle
onMounted(() => {
  // Initialize animation states
  skillCategories.value.forEach(category => {
    category.skills.forEach(skill => {
      animatedSkills[skill.id] = false
    })
  })
})
</script>

<style scoped>
/* Minimal styles needed for animations and responsiveness */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .transition-transform,
  .transition-all {
    transition: none;
  }
  
  .hover\:scale-105:hover {
    transform: none;
  }
}
</style>