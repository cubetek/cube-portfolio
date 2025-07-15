<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold mb-6">{{ $t('projects.title') }}</h1>
      <p class="text-lg mb-8 text-muted-foreground">{{ $t('projects.description') }}</p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="project in projects" 
          :key="project.id"
          class="bg-card rounded-lg border shadow-sm hover:shadow-lg transition-shadow p-6"
        >
          <div class="mb-4">
            <h3 class="text-xl font-semibold">{{ project.title }}</h3>
          </div>
          
          <p class="text-muted-foreground mb-4">{{ project.description }}</p>
          
          <div class="flex gap-2 flex-wrap">
            <span 
              v-for="tech in project.technologies" 
              :key="tech"
              class="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
            >
              {{ tech }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

// Set page meta
definePageMeta({
  title: 'Projects',
  description: 'My portfolio of projects and work'
})

// Sample projects data
const projects = ref([
  {
    id: 1,
    title: 'Personal Website',
    description: 'A multilingual personal website with RTL support',
    technologies: ['Nuxt.js', 'Vue.js', 'Tailwind CSS', 'TypeScript']
  },
  {
    id: 2,
    title: 'Coming Soon',
    description: 'More projects will be added here',
    technologies: ['TBD']
  }
])

// Enhanced SEO using custom composable
const { generateStructuredData } = useSEO({
  title: t('meta.projects.title'),
  description: t('meta.projects.description'),
  keywords: t('meta.keywords'),
  author: t('meta.author'),
  type: 'website'
})
</script>
