<template>
  <div class="space-y-8">
    <!-- Page Hero Section using Nuxt UI -->
    <div class="text-center space-y-4">
      <UButton
        to="/"
        variant="ghost"
        size="xs"
        label="← Back to Home"
        class="mb-4"
      />
      
      <div class="space-y-2">
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
          Improved Layout Demo
        </h1>
        <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          This page demonstrates the improved layout using Nuxt UI components and modern Tailwind CSS patterns.
        </p>
      </div>
    </div>

    <!-- Features Grid using Nuxt UI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UCard
        v-for="feature in features"
        :key="feature.title"
        class="hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
      >
        <template #header>
          <div class="flex items-center space-x-3">
            <UIcon :name="feature.icon" class="w-6 h-6 text-primary" />
            <h3 class="text-lg font-semibold">{{ feature.title }}</h3>
          </div>
        </template>
        
        <p class="text-gray-600 dark:text-gray-300">{{ feature.description }}</p>
        
        <template #footer>
          <UButton
            :to="feature.link"
            variant="soft"
            size="sm"
            :label="feature.action"
            class="w-full"
          />
        </template>
      </UCard>
    </div>

    <!-- Components Showcase -->
    <div class="space-y-6">
      <h2 class="text-2xl font-bold text-center">Nuxt UI Components</h2>
      
      <!-- Buttons Section -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Button Variants</h3>
        </template>
        
        <div class="flex flex-wrap gap-4">
          <UButton label="Primary" />
          <UButton label="Secondary" variant="outline" />
          <UButton label="Soft" variant="soft" />
          <UButton label="Ghost" variant="ghost" />
          <UButton label="Link" variant="link" />
        </div>
      </UCard>

      <!-- Form Elements -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Form Elements</h3>
        </template>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UInput 
            v-model="sampleInput"
            placeholder="Sample input"
            icon="i-heroicons-user"
          />
          
          <USelect
            v-model="sampleSelect"
            :options="selectOptions"
            placeholder="Select an option"
          />
          
          <UTextarea
            v-model="sampleTextarea"
            placeholder="Sample textarea"
            :rows="3"
          />
          
          <USwitch
            v-model="sampleSwitch"
            label="Enable notifications"
          />
        </div>
      </UCard>

      <!-- Notifications Demo -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Notifications</h3>
        </template>
        
        <div class="flex flex-wrap gap-4">
          <UButton 
            @click="showToast('success')"
            label="Success Toast"
            color="green"
          />
          <UButton 
            @click="showToast('error')"
            label="Error Toast"
            color="red"
          />
          <UButton 
            @click="showToast('warning')"
            label="Warning Toast"
            color="yellow"
          />
          <UButton 
            @click="showToast('info')"
            label="Info Toast"
            color="blue"
          />
        </div>
      </UCard>
    </div>

    <!-- Statistics using Nuxt UI -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <UCard
        v-for="stat in stats"
        :key="stat.label"
        class="text-center"
      >
        <div class="space-y-2">
          <div class="text-3xl font-bold text-primary">{{ stat.value }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-300">{{ stat.label }}</div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
// Meta and SEO
definePageMeta({
  title: 'Layout Demo - Improved with Nuxt UI',
  description: 'Demonstration of improved layout using Nuxt UI components'
})

// Reactive data
const sampleInput = ref('')
const sampleSelect = ref(null)
const sampleTextarea = ref('')
const sampleSwitch = ref(false)

// Sample data
const features = [
  {
    title: 'UApp Integration',
    description: 'Global modals, notifications, and drawers managed centrally with UApp component.',
    icon: 'i-heroicons-squares-plus',
    action: 'Learn about UApp',
    link: '#'
  },
  {
    title: 'UContainer',
    description: 'Responsive container with proper max-width and padding management.',
    icon: 'i-heroicons-rectangle-stack',
    action: 'Explore',
    link: '#'
  },
  {
    title: 'Modern Components',
    description: 'Consistent button, form, and navigation components with proper accessibility.',
    icon: 'i-heroicons-puzzle-piece',
    action: 'View Components',
    link: '#'
  },
  {
    title: 'Drawer Navigation',
    description: 'Mobile-first navigation using UDrawer instead of custom overlays.',
    icon: 'i-heroicons-bars-3',
    action: 'Demo',
    link: '#'
  },
  {
    title: 'Toast System',
    description: 'Built-in notification system with UApp, no manual toast containers needed.',
    icon: 'i-heroicons-bell',
    action: 'Try It',
    link: '#'
  },
  {
    title: 'Design Tokens',
    description: 'Consistent spacing, colors, and typography using Tailwind CSS v4.',
    icon: 'i-heroicons-paint-brush',
    action: 'View Tokens',
    link: '#'
  }
]

const selectOptions = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' }
]

const stats = [
  { label: 'Components', value: '50+' },
  { label: 'Performance', value: '100%' },
  { label: 'Accessibility', value: 'WCAG 2.1' },
  { label: 'Bundle Size', value: 'Minimal' }
]

// Toast functionality using Nuxt UI
const toast = useToast()

const showToast = (type: 'success' | 'error' | 'warning' | 'info') => {
  const messages = {
    success: 'Operation completed successfully!',
    error: 'Something went wrong. Please try again.',
    warning: 'Please check your input before proceeding.',
    info: 'Here\'s some helpful information.'
  }

  const colors = {
    success: 'green',
    error: 'red',
    warning: 'yellow',
    info: 'blue'
  }

  toast.add({
    title: type.charAt(0).toUpperCase() + type.slice(1),
    description: messages[type],
    color: colors[type] as any,
  })
}
</script>
