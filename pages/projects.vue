<template>
  <div>
    <UContainer class="py-8">
      <!-- Breadcrumb Navigation -->
      <UBreadcrumb
        :links="breadcrumbLinks"
        class="mb-6"
      />
      
      <!-- Page Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {{ $t('projects.title') }}
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {{ $t('projects.description') }}
        </p>
      </div>
      
      <!-- Projects Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <UCard 
          v-for="project in projects" 
          :key="project.id"
          class="hover:scale-[1.02] transition-transform duration-300"
        >
          <template #header>
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-folder" class="w-6 h-6 text-primary-500" />
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                {{ project.title }}
              </h3>
            </div>
          </template>
          
          <div class="space-y-4">
            <p class="text-gray-600 dark:text-gray-400">
              {{ project.description }}
            </p>
            
            <div class="flex gap-2 flex-wrap">
              <UBadge 
                v-for="tech in project.technologies" 
                :key="tech"
                variant="soft"
                color="primary"
                size="sm"
              >
                {{ tech }}
              </UBadge>
            </div>
            
            <div class="flex gap-2 pt-2">
              <UButton
                v-if="project.demoUrl"
                :to="project.demoUrl"
                target="_blank"
                size="sm"
                variant="solid"
                color="primary"
              >
                <template #leading>
                  <UIcon name="i-heroicons-eye" class="w-4 h-4" />
                </template>
                {{ $t('projects.demo') || 'Demo' }}
              </UButton>
              
              <UButton
                v-if="project.githubUrl"
                :to="project.githubUrl"
                target="_blank"
                size="sm"
                variant="outline"
                color="gray"
              >
                <template #leading>
                  <UIcon name="i-heroicons-code-bracket" class="w-4 h-4" />
                </template>
                {{ $t('projects.code') || 'Code' }}
              </UButton>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Coming Soon Section -->
      <div class="text-center mt-16">
        <UCard class="max-w-md mx-auto">
          <div class="text-center p-6">
            <UIcon name="i-heroicons-plus-circle" class="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {{ $t('projects.moreComingSoon') || 'More Projects Coming Soon' }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-sm">
              {{ $t('projects.stayTuned') || 'Stay tuned for more exciting projects!' }}
            </p>
          </div>
        </UCard>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
// Composables
const { locale, t } = useI18n()
const localePath = useLocalePath()

// Breadcrumb navigation using composable
const { getProjectBreadcrumbs } = useBreadcrumbs()
const breadcrumbLinks = computed(() => getProjectBreadcrumbs())

// Enhanced projects data
const projects = ref([
  {
    id: 1,
    title: 'Personal Website',
    description: 'A multilingual personal website with RTL support, dark/light themes, and comprehensive SEO optimization',
    technologies: ['Nuxt 3', 'Vue 3', 'Tailwind CSS', 'TypeScript', 'Nuxt UI'],
    demoUrl: 'https://your-website.com',
    githubUrl: 'https://github.com/yourusername/personal-website',
    status: 'completed',
    featured: true
  },
  {
    id: 2,
    title: 'Task Management System',
    description: 'A comprehensive task management application with real-time collaboration features',
    technologies: ['Vue 3', 'Node.js', 'Socket.io', 'MongoDB', 'Express'],
    demoUrl: 'https://tasks.yoursite.com',
    githubUrl: 'https://github.com/yourusername/task-manager',
    status: 'in-progress',
    featured: false
  },
  {
    id: 3,
    title: 'E-commerce Platform',
    description: 'Modern e-commerce solution with payment integration and inventory management',
    technologies: ['React', 'Next.js', 'Stripe', 'PostgreSQL', 'Prisma'],
    demoUrl: '',
    githubUrl: 'https://github.com/yourusername/ecommerce',
    status: 'completed',
    featured: true
  }
])

// Enhanced SEO using useHead directly
useHead({
  title: computed(() => t('meta.projects.title')),
  meta: [
    {
      name: 'description',
      content: computed(() => t('meta.projects.description'))
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
      content: computed(() => t('meta.projects.title'))
    },
    {
      property: 'og:description',
      content: computed(() => t('meta.projects.description'))
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ]
})

// Generate structured data for projects page
const runtimeConfig = useRuntimeConfig()
const siteUrl = runtimeConfig.public.siteUrl || 'https://your-domain.com'

useSchemaOrg([
  {
    '@type': 'CollectionPage',
    name: computed(() => t('meta.projects.title')),
    url: computed(() => `${siteUrl}${localePath('/projects')}`),
    description: computed(() => t('meta.projects.description')),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: projects.value.map((project, index) => ({
        '@type': 'CreativeWork',
        position: index + 1,
        name: project.title,
        description: project.description,
        programmingLanguage: project.technologies
      }))
    }
  }
])

// Set page meta
definePageMeta({
  layout: 'default',
  name: 'projects',
  title: 'Projects',
  description: 'My portfolio of projects and work'
})
</script>
