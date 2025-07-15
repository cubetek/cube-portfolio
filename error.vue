<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-primary mb-4">
        {{ error?.statusCode || '500' }}
      </h1>
      <h2 class="text-2xl font-semibold mb-4">
        {{ error?.statusMessage || 'Internal Server Error' }}
      </h2>
      <p class="text-muted-foreground mb-8">
        {{ error?.message || 'Something went wrong. Please try again later.' }}
      </p>
      <button 
        @click="handleError"
        class="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
      >
        Go back home
      </button>
    </div>
  </div>
</template>
