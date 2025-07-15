<template>
  <div class="space-y-8">
    <!-- Profile Card Skeleton -->
    <div class="card-theme">
      <div class="flex items-center space-x-4">
        <USkeleton class="h-16 w-16" :ui="{ rounded: 'rounded-full' }" />
        <div class="space-y-2 flex-1">
          <USkeleton class="h-4 w-3/4" />
          <USkeleton class="h-3 w-1/2" />
        </div>
      </div>
    </div>

    <!-- Content List Skeleton -->
    <div class="space-y-4">
      <div v-for="i in 3" :key="i" class="card-theme">
        <div class="space-y-3">
          <USkeleton class="h-6 w-2/3" />
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-4/5" />
          <div class="flex space-x-2 pt-2">
            <USkeleton class="h-8 w-20" :ui="{ rounded: 'rounded-md' }" />
            <USkeleton class="h-8 w-20" :ui="{ rounded: 'rounded-md' }" />
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Skeleton -->
    <div class="nav-theme p-4">
      <div class="flex justify-between items-center">
        <USkeleton class="h-8 w-32" />
        <div class="hidden md:flex space-x-6">
          <USkeleton v-for="i in 4" :key="i" class="h-6 w-16" />
        </div>
        <div class="flex space-x-2">
          <USkeleton class="h-8 w-8" :ui="{ rounded: 'rounded-md' }" />
          <USkeleton class="h-8 w-8" :ui="{ rounded: 'rounded-md' }" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// This component demonstrates various skeleton loading states
// Can be used throughout the app for consistent loading UX
</script>