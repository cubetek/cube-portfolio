<template>
  <div class="skills-display">
    <div class="skills-header">
      <h2 class="skills-title">
        {{ $t('skills.title') || 'Skills & Technologies' }}
      </h2>
      <p class="skills-description">
        {{ $t('skills.description') || 'Technologies I work with and expertise levels' }}
      </p>
    </div>

    <!-- Skill Categories -->
    <div class="skills-categories">
      <div
        v-for="category in skillCategories"
        :key="category.id"
        class="skill-category"
      >
        <div class="category-header">
          <div class="category-icon">
            <UIcon :name="category.icon" class="icon" />
          </div>
          <h3 class="category-title">
            {{ $t(`skills.categories.${category.id}`) || category.name }}
          </h3>
        </div>

        <div class="skills-grid">
          <div
            v-for="skill in category.skills"
            :key="skill.id"
            class="skill-card"
            @mouseenter="animateProgress(skill.id)"
          >
            <div class="skill-icon">
              <component
                :is="skill.iconComponent || 'div'"
                :class="skill.iconClass"
              >
                <UIcon v-if="skill.icon" :name="skill.icon" />
              </component>
            </div>
            
            <div class="skill-info">
              <h4 class="skill-name">{{ skill.name }}</h4>
              <p class="skill-description">{{ skill.description }}</p>
              
              <div class="skill-level">
                <div class="level-label">
                  <span class="level-text">
                    {{ $t(`skills.levels.${skill.level}`) || skill.level }}
                  </span>
                  <span class="level-percentage">{{ skill.percentage }}%</span>
                </div>
                <div class="progress-bar">
                  <div
                    :id="`progress-${skill.id}`"
                    class="progress-fill"
                    :style="{ 
                      width: `${animatedProgress[skill.id] || 0}%`,
                      backgroundColor: skill.color || 'var(--color-primary-600)'
                    }"
                  ></div>
                </div>
              </div>

              <div class="skill-tags">
                <span
                  v-for="tag in skill.tags"
                  :key="tag"
                  class="skill-tag"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Technologies Cloud -->
    <div class="tech-cloud">
      <h3 class="cloud-title">
        {{ $t('skills.techCloud') || 'Technologies I Use' }}
      </h3>
      <div class="tech-items">
        <span
          v-for="tech in techCloud"
          :key="tech.name"
          class="tech-item"
          :style="{ 
            fontSize: `${tech.weight}rem`,
            color: tech.color || 'var(--color-gray-600)'
          }"
        >
          {{ tech.name }}
        </span>
      </div>
    </div>

    <!-- Certifications -->
    <div class="certifications">
      <h3 class="cert-title">
        {{ $t('skills.certifications') || 'Certifications' }}
      </h3>
      <div class="cert-grid">
        <div
          v-for="cert in certifications"
          :key="cert.id"
          class="cert-card"
        >
          <div class="cert-logo">
            <NuxtImg
              :src="cert.logo"
              :alt="cert.name"
              class="cert-image"
            />
          </div>
          <div class="cert-info">
            <h4 class="cert-name">{{ cert.name }}</h4>
            <p class="cert-issuer">{{ cert.issuer }}</p>
            <p class="cert-date">{{ formatDate(cert.date) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

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
const animatedProgress = reactive<Record<string, number>>({})

// Skills data
const skillCategories = ref<SkillCategory[]>([
  {
    id: 'frontend',
    name: 'Frontend Development',
    icon: 'i-heroicons-computer-desktop',
    skills: [
      {
        id: 'vue',
        name: 'Vue.js',
        description: 'Progressive JavaScript framework',
        level: 'expert',
        percentage: 95,
        color: '#4FC08D',
        tags: ['Vue 3', 'Composition API', 'Pinia']
      },
      {
        id: 'nuxt',
        name: 'Nuxt 3',
        description: 'Vue-based framework for SSR/SSG',
        level: 'expert',
        percentage: 90,
        color: '#00DC82',
        tags: ['SSR', 'SSG', 'Nitro']
      },
      {
        id: 'react',
        name: 'React',
        description: 'JavaScript library for UI',
        level: 'advanced',
        percentage: 85,
        color: '#61DAFB',
        tags: ['Hooks', 'Context', 'Next.js']
      },
      {
        id: 'typescript',
        name: 'TypeScript',
        description: 'Typed superset of JavaScript',
        level: 'expert',
        percentage: 92,
        color: '#3178C6',
        tags: ['Static Typing', 'Generics', 'Decorators']
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
        description: 'JavaScript runtime environment',
        level: 'expert',
        percentage: 88,
        color: '#339933',
        tags: ['Express', 'Fastify', 'NestJS']
      },
      {
        id: 'python',
        name: 'Python',
        description: 'High-level programming language',
        level: 'advanced',
        percentage: 82,
        color: '#3776AB',
        tags: ['Django', 'FastAPI', 'Flask']
      },
      {
        id: 'graphql',
        name: 'GraphQL',
        description: 'Query language for APIs',
        level: 'advanced',
        percentage: 78,
        color: '#E10098',
        tags: ['Apollo', 'Prisma', 'Relay']
      },
      {
        id: 'postgresql',
        name: 'PostgreSQL',
        description: 'Object-relational database',
        level: 'advanced',
        percentage: 80,
        color: '#336791',
        tags: ['SQL', 'Indexing', 'Optimization']
      }
    ]
  },
  {
    id: 'devops',
    name: 'DevOps & Cloud',
    icon: 'i-heroicons-cloud',
    skills: [
      {
        id: 'docker',
        name: 'Docker',
        description: 'Containerization platform',
        level: 'advanced',
        percentage: 85,
        color: '#2496ED',
        tags: ['Containers', 'Docker Compose', 'Multi-stage']
      },
      {
        id: 'aws',
        name: 'AWS',
        description: 'Amazon Web Services',
        level: 'intermediate',
        percentage: 72,
        color: '#FF9900',
        tags: ['EC2', 'S3', 'Lambda', 'RDS']
      },
      {
        id: 'kubernetes',
        name: 'Kubernetes',
        description: 'Container orchestration',
        level: 'intermediate',
        percentage: 68,
        color: '#326CE5',
        tags: ['Pods', 'Services', 'Deployments']
      },
      {
        id: 'ci-cd',
        name: 'CI/CD',
        description: 'Continuous Integration/Deployment',
        level: 'advanced',
        percentage: 82,
        color: '#0066CC',
        tags: ['GitHub Actions', 'Jenkins', 'GitLab CI']
      }
    ]
  },
  {
    id: 'design',
    name: 'Design & UX',
    icon: 'i-heroicons-paint-brush',
    skills: [
      {
        id: 'figma',
        name: 'Figma',
        description: 'Design and prototyping tool',
        level: 'advanced',
        percentage: 88,
        color: '#F24E1E',
        tags: ['Prototyping', 'Design Systems', 'Collaboration']
      },
      {
        id: 'tailwind',
        name: 'Tailwind CSS',
        description: 'Utility-first CSS framework',
        level: 'expert',
        percentage: 95,
        color: '#06B6D4',
        tags: ['Utility Classes', 'Responsive', 'Dark Mode']
      },
      {
        id: 'ui-ux',
        name: 'UI/UX Design',
        description: 'User interface and experience design',
        level: 'advanced',
        percentage: 80,
        color: '#FF6B6B',
        tags: ['User Research', 'Wireframing', 'Usability']
      }
    ]
  }
])

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
  const skill = skillCategories.value
    .flatMap(cat => cat.skills)
    .find(s => s.id === skillId)
  
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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'short'
  })
}

// Lifecycle
onMounted(() => {
  // Initialize progress animations
  skillCategories.value.forEach(category => {
    category.skills.forEach(skill => {
      animatedProgress[skill.id] = 0
    })
  })
})
</script>

<style scoped>
.skills-display {
  padding: 4rem 0;
  max-width: 1200px;
  margin: 0 auto;
}

.skills-header {
  text-align: center;
  margin-bottom: 4rem;
}

.skills-title {
  font-size: clamp(2rem, 4vw, 3rem);
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

.skills-categories {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  margin-bottom: 4rem;
}

.skill-category {
  background: var(--color-white);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.category-icon {
  width: 3rem;
  height: 3rem;
  background: var(--color-primary-100);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-icon .icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-primary-600);
}

.category-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-gray-900);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.skill-card {
  background: var(--color-gray-50);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.skill-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
}

.skill-icon {
  width: 3rem;
  height: 3rem;
  margin-bottom: 1rem;
}

.skill-info {
  flex: 1;
}

.skill-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 0.5rem;
}

.skill-description {
  color: var(--color-gray-600);
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.skill-level {
  margin-bottom: 1rem;
}

.level-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.level-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-gray-700);
  text-transform: capitalize;
}

.level-percentage {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary-600);
}

.progress-bar {
  height: 0.5rem;
  background: var(--color-gray-200);
  border-radius: 0.25rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary-600);
  border-radius: 0.25rem;
  transition: width 0.3s ease;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  background: var(--color-gray-200);
  color: var(--color-gray-700);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.tech-cloud {
  background: var(--color-gray-50);
  border-radius: 1.5rem;
  padding: 3rem;
  margin-bottom: 4rem;
  text-align: center;
}

.cloud-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 2rem;
}

.tech-items {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  line-height: 1.5;
}

.tech-item {
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
}

.tech-item:hover {
  transform: scale(1.1);
  opacity: 0.8;
}

.certifications {
  background: var(--color-white);
  border-radius: 1.5rem;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.cert-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 2rem;
  text-align: center;
}

.cert-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.cert-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--color-gray-50);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.cert-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
}

.cert-logo {
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
}

.cert-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.cert-info {
  flex: 1;
}

.cert-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 0.25rem;
}

.cert-issuer {
  font-size: 0.875rem;
  color: var(--color-gray-600);
  margin-bottom: 0.25rem;
}

.cert-date {
  font-size: 0.75rem;
  color: var(--color-gray-500);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .skills-title,
  .category-title,
  .cloud-title,
  .cert-title {
    color: var(--color-gray-100);
  }
  
  .skills-description {
    color: var(--color-gray-400);
  }
  
  .skill-category,
  .certifications {
    background: var(--color-gray-800);
  }
  
  .skill-card,
  .cert-card {
    background: var(--color-gray-700);
  }
  
  .skill-name,
  .cert-name {
    color: var(--color-gray-100);
  }
  
  .skill-description,
  .cert-issuer {
    color: var(--color-gray-400);
  }
  
  .tech-cloud {
    background: var(--color-gray-800);
  }
}

/* RTL support */
[dir="rtl"] .category-header {
  flex-direction: row-reverse;
}

[dir="rtl"] .level-label {
  flex-direction: row-reverse;
}

[dir="rtl"] .cert-card {
  flex-direction: row-reverse;
}

/* Responsive design */
@media (max-width: 768px) {
  .skills-display {
    padding: 2rem 1rem;
  }
  
  .skills-grid {
    grid-template-columns: 1fr;
  }
  
  .cert-grid {
    grid-template-columns: 1fr;
  }
  
  .tech-cloud {
    padding: 2rem;
  }
  
  .tech-items {
    gap: 0.5rem;
  }
}
</style>