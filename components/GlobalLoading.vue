<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isGlobalLoading"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        role="status"
        :aria-label="globalMessage"
      >
        <div class="card-theme p-6 max-w-sm mx-4 text-center space-y-4">
          <!-- Loading spinner -->
          <LoadingSpinner 
            :variant="spinnerVariant"
            size="lg"
            :color="spinnerColor"
          />
          
          <!-- Loading message -->
          <div class="space-y-2">
            <p class="body-base font-medium">{{ globalMessage }}</p>
            
            <!-- Progress bar -->
            <div 
              v-if="globalProgress > 0"
              class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
            >
              <div 
                class="h-full rounded-full transition-all duration-300 ease-out"
                :class="progressBarClass"
                :style="{ width: `${globalProgress}%` }"
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { isGlobalLoading, globalMessage, globalProgress } = useLoading()
const { currentTheme, themeConfig } = useTheme()

// Theme-aware spinner configuration
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

const spinnerColor = computed(() => {
  return themeConfig.value.colors.primary
})

const progressBarClass = computed(() => {
  switch (currentTheme.value) {
    case 'matrix':
      return 'bg-green-500 shadow-[0_0_10px_rgba(0,255,65,0.5)]'
    case 'cyberpunk':
      return 'bg-pink-500 shadow-[0_0_10px_rgba(255,0,128,0.5)]'
    case 'neon':
      return 'bg-cyan-400 shadow-[0_0_10px_rgba(0,212,255,0.5)]'
    default:
      return 'bg-primary-500'
  }
})
</script>