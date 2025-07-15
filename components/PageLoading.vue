<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <div class="text-center space-y-6">
      <!-- Loading animation -->
      <LoadingSpinner 
        :variant="spinnerVariant"
        size="xl" 
        show-text
        :text="loadingText"
      />
      
      <!-- Progressive loading message -->
      <div class="space-y-2">
        <p class="body-base">{{ currentMessage }}</p>
        <div class="w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto overflow-hidden">
          <div 
            class="h-full bg-primary-500 rounded-full transition-all duration-300 ease-out"
            :style="{ width: `${progress}%` }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  messages?: string[]
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  messages: () => ['Loading...', 'Preparing content...', 'Almost ready...'],
  duration: 3000
})

const { t } = useI18n()
const { currentTheme } = useTheme()

// Theme-aware spinner variant
const spinnerVariant = computed(() => {
  switch (currentTheme.value) {
    case 'matrix':
    case 'cyberpunk':
    case 'neon':
      return 'matrix'
    case 'minimal':
      return 'pulse'
    default:
      return 'spinner'
  }
})

// Progressive loading states
const currentMessageIndex = ref(0)
const progress = ref(0)

const currentMessage = computed(() => {
  return props.messages[currentMessageIndex.value] || t('loading')
})

const loadingText = computed(() => {
  return currentTheme.value === 'matrix' ? 'Initializing...' : 
         currentTheme.value === 'cyberpunk' ? 'Connecting...' :
         t('loading')
})

// Simulate loading progress
let progressInterval: NodeJS.Timeout
let messageInterval: NodeJS.Timeout

onMounted(() => {
  // Progress animation
  progressInterval = setInterval(() => {
    if (progress.value < 100) {
      progress.value += Math.random() * 15
      if (progress.value > 100) progress.value = 100
    }
  }, 200)

  // Message cycling
  messageInterval = setInterval(() => {
    if (currentMessageIndex.value < props.messages.length - 1) {
      currentMessageIndex.value++
    }
  }, props.duration / props.messages.length)
})

onUnmounted(() => {
  if (progressInterval) clearInterval(progressInterval)
  if (messageInterval) clearInterval(messageInterval)
})
</script>