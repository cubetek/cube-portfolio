<template>
  <div class="flex items-center gap-2">
    <span class="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
      {{ $t('blog.viewMode') || 'View' }}:
    </span>
    
    <!-- View Mode Buttons -->
    <div class="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      <button
        v-for="mode in viewModes"
        :key="mode.value"
        @click="$emit('change', mode.value)"
        :class="[
          'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
          currentMode === mode.value
            ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700/50'
        ]"
        :title="mode.description"
      >
        <UIcon :name="mode.icon" class="w-4 h-4" />
        <span class="hidden sm:inline">{{ mode.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ViewMode {
  value: 'magazine' | 'card' | 'list' | 'minimal'
  label: string
  description: string
  icon: string
}

interface Props {
  currentMode: 'magazine' | 'card' | 'list' | 'minimal'
}

defineProps<Props>()
defineEmits<{
  change: [mode: 'magazine' | 'card' | 'list' | 'minimal']
}>()

const { t } = useI18n()

const viewModes = computed<ViewMode[]>(() => [
  {
    value: 'magazine',
    label: t('blog.viewModes.magazine') || 'Magazine',
    description: t('blog.viewModes.magazineDesc') || 'Rich magazine-style layout with large featured images',
    icon: 'i-heroicons-squares-2x2-20-solid'
  },
  {
    value: 'card',
    label: t('blog.viewModes.card') || 'Cards',
    description: t('blog.viewModes.cardDesc') || 'Clean card layout with consistent sizing',
    icon: 'i-heroicons-view-columns-20-solid'
  },
  {
    value: 'list',
    label: t('blog.viewModes.list') || 'List',
    description: t('blog.viewModes.listDesc') || 'Compact list view with small thumbnails',
    icon: 'i-heroicons-list-bullet-20-solid'
  },
  {
    value: 'minimal',
    label: t('blog.viewModes.minimal') || 'Minimal',
    description: t('blog.viewModes.minimalDesc') || 'Clean text-focused minimal layout',
    icon: 'i-heroicons-bars-3-20-solid'
  }
])
</script>
