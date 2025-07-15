<template>
  <div class="relative z-50">
    <!-- Progress Bar -->
    <div 
      class="fixed top-0 left-0 right-0 h-1 bg-black/10 dark:bg-white/10 z-50 opacity-0 -translate-y-full transition-all duration-300 ease-in-out"
      :class="{ 'opacity-100 translate-y-0': isVisible }"
    >
      <div 
        class="h-full bg-gradient-to-r from-primary-600 to-green-500 transition-all duration-150 ease-out"
        :style="{ width: `${progress}%` }"
      ></div>
    </div>

    <!-- Floating Progress Indicator -->
    <div 
      v-if="showFloating && isVisible"
      class="fixed bottom-8 right-8 md:bottom-8 md:right-8 z-50 flex flex-col items-center gap-3"
    >
      <div class="relative w-16 h-16 bg-white dark:bg-gray-800 rounded-full shadow-lg border-2 border-gray-100 dark:border-gray-700 flex items-center justify-center">
        <svg class="absolute w-full h-full -rotate-90" viewBox="0 0 36 36">
          <path
            class="fill-none stroke-gray-200 dark:stroke-gray-700 stroke-2"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            class="fill-none stroke-primary-600 dark:stroke-primary-400 stroke-2 stroke-round transition-all duration-150 ease-out"
            :stroke-dasharray="`${progress}, 100`"
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div class="text-xs font-semibold text-gray-700 dark:text-gray-300 relative z-10">
          {{ Math.round(progress) }}%
        </div>
      </div>

      <!-- Estimated Reading Time -->
      <div v-if="estimatedTime" class="flex items-center gap-1.5 bg-white dark:bg-gray-800 px-3 py-2 rounded-2xl shadow-md text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
        <UIcon name="i-heroicons-clock" class="w-3.5 h-3.5" />
        <span>{{ remainingTime }} min left</span>
      </div>
    </div>

    <!-- Table of Contents Toggle -->
    <button
      v-if="showTocToggle && tocItems?.length"
      @click="toggleToc"
      class="fixed bottom-8 left-8 md:bottom-8 md:left-8 z-50 w-12 h-12 md:w-12 md:h-12 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-600 hover:text-primary-600 dark:hover:text-primary-400 hover:scale-105"
      :class="{ 
        'bg-primary-600 dark:bg-primary-600 border-primary-600 dark:border-primary-600 text-white dark:text-white': showToc 
      }"
    >
      <UIcon name="i-heroicons-list-bullet" class="w-5 h-5" />
    </button>

    <!-- Mini TOC -->
    <div 
      v-if="showToc && tocItems?.length"
      class="fixed bottom-20 left-8 md:bottom-20 md:left-8 right-8 md:right-auto z-50 md:w-72 max-h-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300"
    >
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100 m-0">
          {{ $t('blog.contents') || 'Contents' }}
        </h4>
        <button 
          @click="toggleToc" 
          class="w-6 h-6 flex items-center justify-center rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200 transition-all duration-200"
        >
          <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
        </button>
      </div>
      <nav class="max-h-80 overflow-y-auto py-2">
        <a
          v-for="item in tocItems"
          :key="item.id"
          :href="`#${item.id}`"
          @click="onTocClick(item.id)"
          class="block py-2 px-4 text-sm text-gray-600 dark:text-gray-400 no-underline transition-all duration-200 border-l-3 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100"
          :class="{ 
            'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border-l-primary-600 dark:border-l-primary-400 font-medium': activeSection === item.id,
            'pl-8': item.depth === 3,
            'pl-12': item.depth === 4
          }"
        >
          {{ item.text }}
        </a>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Types
interface TocItem {
  id: string
  text: string
  depth: number
}

// Props
interface Props {
  showFloating?: boolean
  showTocToggle?: boolean
  estimatedTime?: number
  tocItems?: TocItem[]
}

const props = withDefaults(defineProps<Props>(), {
  showFloating: true,
  showTocToggle: true,
  estimatedTime: 0,
  tocItems: () => []
})

// State
const progress = ref(0)
const isVisible = ref(false)
const showToc = ref(false)
const activeSection = ref('')
const scrollTimeout = ref<NodeJS.Timeout>()

// Computed
const remainingTime = computed(() => {
  if (!props.estimatedTime) return 0
  const remaining = props.estimatedTime * (1 - progress.value / 100)
  return Math.max(1, Math.ceil(remaining))
})

// Methods
const calculateProgress = () => {
  if (!process.client) return

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
  
  if (scrollHeight <= 0) {
    progress.value = 0
    return
  }

  const calculated = (scrollTop / scrollHeight) * 100
  progress.value = Math.min(100, Math.max(0, calculated))
  
  // Show progress bar after scrolling past 10% of the page
  isVisible.value = progress.value > 10
}

const updateActiveSection = () => {
  if (!process.client || !props.tocItems?.length) return

  const headings = props.tocItems.map(item => {
    const element = document.getElementById(item.id)
    return {
      id: item.id,
      element,
      top: element ? element.getBoundingClientRect().top : Infinity
    }
  })

  // Find the heading closest to the top of the viewport
  const current = headings
    .filter(h => h.top <= 100) // Consider headings within 100px of top
    .sort((a, b) => b.top - a.top)[0] // Get the one closest to top

  if (current) {
    activeSection.value = current.id
  } else if (headings.length > 0 && headings[0] && headings[0].top > 100) {
    // If no heading is in view and first heading is below, clear active
    activeSection.value = ''
  }
}

const onScroll = () => {
  calculateProgress()
  updateActiveSection()
  
  // Clear existing timeout
  if (scrollTimeout.value) {
    clearTimeout(scrollTimeout.value)
  }
  
  // Set timeout to hide floating indicator after scrolling stops
  scrollTimeout.value = setTimeout(() => {
    // Optional: Add fade out animation here
  }, 2000)
}

const toggleToc = () => {
  showToc.value = !showToc.value
}

const onTocClick = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    })
  }
  // Close TOC on mobile after clicking
  if (window.innerWidth < 768) {
    showToc.value = false
  }
}

// Lifecycle
onMounted(() => {
  if (process.client) {
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', calculateProgress, { passive: true })
    calculateProgress()
    updateActiveSection()
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', calculateProgress)
    if (scrollTimeout.value) {
      clearTimeout(scrollTimeout.value)
    }
  }
})
</script>

<style scoped>
/* Custom stroke styling for SVG that can't be achieved with Tailwind utilities */
.stroke-round {
  stroke-linecap: round;
}

/* RTL Support - using CSS custom properties instead of theme() */
[dir="rtl"] .fixed.bottom-8.right-8 {
  left: 2rem;
  right: auto;
}

[dir="rtl"] .fixed.bottom-8.left-8 {
  right: 2rem;
  left: auto;
}

[dir="rtl"] .fixed.bottom-20.left-8 {
  right: 2rem;
  left: auto;
}

[dir="rtl"] .border-l-3 {
  border-right-width: 3px;
  border-left-width: 0;
}

[dir="rtl"] .border-l-primary-600 {
  border-right-color: #2563eb;
  border-left-color: transparent;
}

[dir="rtl"] .pl-8 {
  padding-right: 2rem;
  padding-left: 1rem;
}

[dir="rtl"] .pl-12 {
  padding-right: 3rem;
  padding-left: 1rem;
}

/* Mobile responsive adjustments */
@media (max-width: 768px) {
  [dir="rtl"] .fixed.bottom-8.right-8 {
    left: 1rem;
    right: auto;
  }

  [dir="rtl"] .fixed.bottom-8.left-8 {
    right: 1rem;
    left: auto;
  }

  [dir="rtl"] .fixed.bottom-20.left-8 {
    right: 1rem;
    left: auto;
  }
}
</style>