<template>
  <div class="relative">
    <UButton
      variant="outline"
      size="sm"
      :aria-label="$t('theme.switch')"
      @click="cycleTheme"
      class="transition-all duration-200 hover:scale-105"
    >
      <template #leading>
        <UIcon 
          :name="themeIcon" 
          class="h-4 w-4 transition-transform duration-300" 
          :class="{ 'rotate-180': isDark }"
        />
      </template>
      <span class="hidden sm:inline">{{ themeConfig?.label || 'Theme' }}</span>
    </UButton>
  </div>
</template>

<script setup lang="ts">
const { currentTheme, themeConfig, cycleTheme, isDark, isSpecial } = useTheme()

// Icon mapping for different theme types
const themeIcon = computed(() => {
  if (isSpecial.value) {
    switch (currentTheme.value) {
      case 'matrix': return 'heroicons:code-bracket'
      case 'cyberpunk': return 'heroicons:cpu-chip'
      case 'neon': return 'heroicons:bolt'
      case 'retro': return 'heroicons:squares-2x2'
      default: return 'heroicons:sparkles'
    }
  }
  return isDark.value ? 'heroicons:moon' : 'heroicons:sun'
})

// Removed unused t import to fix diagnostic
</script>