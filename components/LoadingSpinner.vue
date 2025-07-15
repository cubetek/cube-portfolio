<template>
  <div 
    :class="[
      'inline-flex items-center justify-center',
      sizeClasses[size]
    ]"
    role="status"
    :aria-label="$t('loading')"
  >
    <!-- Default spinner -->
    <div 
      v-if="variant === 'spinner'"
      :class="[
        'animate-spin rounded-full border-2 border-transparent',
        'border-t-current border-r-current',
        spinnerSizeClasses[size]
      ]"
      :style="{ color: color || 'var(--theme-primary)' }"
    />

    <!-- Dots spinner -->
    <div 
      v-else-if="variant === 'dots'"
      class="flex space-x-1"
    >
      <div 
        v-for="i in 3" 
        :key="i"
        :class="[
          'rounded-full animate-pulse',
          dotSizeClasses[size]
        ]"
        :style="{ 
          backgroundColor: color || 'var(--theme-primary)',
          animationDelay: `${i * 0.2}s`,
          animationDuration: '1s'
        }"
      />
    </div>

    <!-- Pulse ring -->
    <div 
      v-else-if="variant === 'pulse'"
      :class="[
        'rounded-full animate-ping',
        ringSizeClasses[size]
      ]"
      :style="{ backgroundColor: color || 'var(--theme-primary)' }"
    />

    <!-- Matrix/cyberpunk style */
    <div 
      v-else-if="variant === 'matrix'"
      :class="[
        'relative flex items-center justify-center',
        sizeClasses[size]
      ]"
    >
      <div 
        v-for="i in 4" 
        :key="i"
        :class="[
          'absolute border-2 rounded-full animate-spin',
          matrixSizeClasses[size]
        ]"
        :style="{
          borderColor: `rgba(0, 255, 65, ${1 - i * 0.2})`,
          animationDelay: `${i * 0.3}s`,
          animationDuration: '2s',
          transform: `scale(${1 + i * 0.2})`
        }"
      />
    </div>

    <!-- Loading text -->
    <span 
      v-if="showText" 
      :class="[
        'ml-2 text-sm font-medium',
        textClasses[size]
      ]"
      :style="{ color: color || 'var(--theme-text)' }"
    >
      {{ text || $t('loading') }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'spinner' | 'dots' | 'pulse' | 'matrix'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  showText?: boolean
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'spinner',
  size: 'md',
  showText: false
})

const { t } = useI18n()

const sizeClasses = {
  xs: 'w-4 h-4',
  sm: 'w-6 h-6', 
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
}

const spinnerSizeClasses = {
  xs: 'w-4 h-4',
  sm: 'w-6 h-6',
  md: 'w-8 h-8', 
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
}

const dotSizeClasses = {
  xs: 'w-1 h-1',
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4'
}

const ringSizeClasses = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
}

const matrixSizeClasses = {
  xs: 'w-2 h-2',
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8'
}

const textClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl'
}
</script>