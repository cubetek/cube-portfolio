<template>
  <UCard class="card-micro">
    <template #header v-if="showHeader">
      <div class="flex items-center justify-between">
        <USkeleton class="h-5 w-1/3" />
        <USkeleton class="h-4 w-4" :ui="{ rounded: 'rounded' }" />
      </div>
    </template>

    <div class="space-y-3">
      <!-- Image placeholder if needed -->
      <USkeleton 
        v-if="showImage" 
        :class="imageClass"
        :ui="{ rounded: 'rounded-lg' }" 
      />

      <!-- Title -->
      <USkeleton 
        :class="titleClass"
      />

      <!-- Description lines -->
      <div class="space-y-2">
        <USkeleton 
          v-for="i in descriptionLines" 
          :key="i"
          :class="getDescriptionClass(i)"
        />
      </div>

      <!-- Action buttons -->
      <div v-if="showActions" class="flex space-x-2 pt-2">
        <USkeleton 
          v-for="i in actionCount" 
          :key="i"
          class="h-8 w-20" 
          :ui="{ rounded: 'rounded-md' }" 
        />
      </div>
    </div>

    <template #footer v-if="showFooter">
      <div class="flex justify-between items-center">
        <USkeleton class="h-4 w-1/4" />
        <USkeleton class="h-4 w-1/3" />
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  showHeader?: boolean
  showImage?: boolean
  showActions?: boolean
  showFooter?: boolean
  imageClass?: string
  titleClass?: string
  descriptionLines?: number
  actionCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  showHeader: true,
  showImage: false,
  showActions: true,
  showFooter: false,
  imageClass: 'h-48 w-full',
  titleClass: 'h-6 w-3/4',
  descriptionLines: 2,
  actionCount: 2
})

const getDescriptionClass = (lineNumber: number) => {
  // Make last line shorter for natural appearance
  if (lineNumber === props.descriptionLines) {
    return 'h-4 w-2/3'
  }
  return 'h-4 w-full'
}
</script>