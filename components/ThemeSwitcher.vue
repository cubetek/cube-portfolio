<template>
  <div class="relative">
    <UButton
      variant="outline"
      size="sm"
      :aria-label="$t('theme.switch')"
      class="btn-micro"
      @click="cycleTheme"
    >
      <Icon 
        :name="themeIcon" 
        class="h-4 w-4 icon-rotate" 
      />
      <span class="ml-2 hidden sm:inline">{{ themeConfig.label }}</span>
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

// Localized theme switching text
const { t } = useI18n()
</script>