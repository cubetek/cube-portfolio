<template>
  <figure 
    class="content-image"
    :class="[
      `image-${size}`,
      `image-${alignment}`,
      { 'image-rounded': rounded },
      { 'image-shadow': shadow },
      { 'image-bordered': bordered }
    ]"
  >
    <!-- Image Container -->
    <div class="image-container" :class="{ 'image-zoomable': zoomable }" @click="handleImageClick">
      <!-- Loading State -->
      <div v-if="isLoading" class="image-loading">
        <div class="loading-skeleton"></div>
        <div class="loading-spinner">
          <UIcon name="i-heroicons-photo-20-solid" class="w-8 h-8 text-gray-400 animate-pulse" />
        </div>
      </div>
      
      <!-- Image -->
      <img
        v-show="!isLoading && !hasError"
        :src="src"
        :alt="alt"
        :width="width"
        :height="height"
        :loading="lazy ? 'lazy' : 'eager'"
        @load="onLoad"
        @error="onError"
        class="image-element"
        :class="{ 'image-zoom': zoomable }"
      />
      
      <!-- Error State -->
      <div v-if="hasError" class="image-error">
        <UIcon name="i-heroicons-photo-20-solid" class="w-12 h-12 text-gray-400" />
        <p class="error-text">{{ $t('image.failedToLoad') || 'Failed to load image' }}</p>
      </div>
      
      <!-- Zoom Indicator -->
      <div v-if="zoomable && !isLoading && !hasError" class="zoom-indicator">
        <UIcon name="i-heroicons-magnifying-glass-plus-20-solid" class="w-5 h-5" />
      </div>
    </div>
    
    <!-- Caption -->
    <figcaption v-if="caption || $slots.caption" class="image-caption">
      <slot name="caption">
        {{ caption }}
      </slot>
    </figcaption>
    
    <!-- Lightbox Modal -->
    <UModal v-model="showLightbox" :ui="{ wrapper: 'max-w-7xl' }">
      <div class="lightbox-container">
        <div class="lightbox-header">
          <h3 v-if="alt" class="lightbox-title">{{ alt }}</h3>
          <UButton
            @click="closeLightbox"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            size="sm"
          />
        </div>
        <div class="lightbox-content">
          <img
            :src="src"
            :alt="alt"
            class="lightbox-image"
          />
        </div>
        <div v-if="caption" class="lightbox-caption">
          {{ caption }}
        </div>
      </div>
    </UModal>
  </figure>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Props
interface Props {
  src: string
  alt: string
  caption?: string
  width?: string | number
  height?: string | number
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  alignment?: 'left' | 'center' | 'right'
  rounded?: boolean
  shadow?: boolean
  bordered?: boolean
  zoomable?: boolean
  lazy?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  src: '',
  alt: '',
  caption: '',
  width: 'auto',
  height: 'auto',
  size: 'md',
  alignment: 'center',
  rounded: true,
  shadow: true,
  bordered: false,
  zoomable: true,
  lazy: true
})

// State
const isLoading = ref(true)
const hasError = ref(false)
const showLightbox = ref(false)

// Methods
const onLoad = () => {
  isLoading.value = false
  hasError.value = false
}

const onError = () => {
  isLoading.value = false
  hasError.value = true
}

const handleImageClick = () => {
  if (props.zoomable && !isLoading.value && !hasError.value) {
    showLightbox.value = true
  }
}

const closeLightbox = () => {
  showLightbox.value = false
}

// Handle keyboard events for lightbox
const handleKeydown = (e: KeyboardEvent) => {
  if (showLightbox.value && e.key === 'Escape') {
    closeLightbox()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  return () => {
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<style scoped>
.content-image {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

/* Sizes */
.image-sm {
  max-width: 24rem;
}

.image-md {
  max-width: 42rem;
}

.image-lg {
  max-width: 56rem;
}

.image-xl {
  max-width: 72rem;
}

.image-full {
  width: 100%;
}

/* Alignment */
.image-left {
  margin-right: auto;
}

.image-center {
  margin-left: auto;
  margin-right: auto;
}

.image-right {
  margin-left: auto;
}

/* Styling variants */
.image-rounded .image-element {
  border-radius: 0.5rem;
}

.image-shadow .image-container {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  transition-property: box-shadow;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.image-shadow .image-container:hover {
  box-shadow: 0 25px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
}

.image-bordered .image-container {
  border-width: 1px;
  border-color: rgb(229 231 235);
}

:global(.dark) .image-bordered .image-container {
  border-color: rgb(55 65 81);
}

/* Image Container */
.image-container {
  position: relative;
  overflow: hidden;
  background-color: rgb(243 244 246);
}

:global(.dark) .image-container {
  background-color: rgb(31 41 55);
}

.image-zoomable {
  cursor: zoom-in;
}

.image-element {
  width: 100%;
  height: auto;
  transition-property: transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.image-zoom:hover {
  transform: scale(1.05);
}

/* Loading State */
.image-loading {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 12rem;
  background-color: rgb(243 244 246);
}

:global(.dark) .image-loading {
  background-color: rgb(31 41 55);
}

.loading-skeleton {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgb(229 231 235), rgb(209 213 219), rgb(229 231 235));
  animation: shimmer 2s infinite;
}

:global(.dark) .loading-skeleton {
  background: linear-gradient(90deg, rgb(55 65 81), rgb(75 85 99), rgb(55 65 81));
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.loading-spinner {
  position: relative;
  z-index: 10;
}

/* Error State */
.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 12rem;
  background-color: rgb(243 244 246);
  text-align: center;
  padding: 2rem;
}

:global(.dark) .image-error {
  background-color: rgb(31 41 55);
}

.error-text {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(107 114 128);
}

:global(.dark) .error-text {
  color: rgb(156 163 175);
}

/* Zoom Indicator */
.zoom-indicator {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: rgb(0 0 0 / 0.5);
  color: white;
  border-radius: 9999px;
  padding: 0.5rem;
  opacity: 0;
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.image-zoomable:hover .zoom-indicator {
  opacity: 1;
}

/* Caption */
.image-caption {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(75 85 99);
  text-align: center;
  line-height: 1.625;
}

:global(.dark) .image-caption {
  color: rgb(156 163 175);
}

.image-caption :deep(a) {
  color: var(--color-primary-600);
  text-decoration: none;
}

.image-caption :deep(a):hover {
  text-decoration: underline;
}

:global(.dark) .image-caption :deep(a) {
  color: var(--color-primary-400);
}

/* Lightbox */
.lightbox-container {
  background-color: white;
}

:global(.dark) .lightbox-container {
  background-color: rgb(17 24 39);
}

.lightbox-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom-width: 1px;
  border-bottom-color: rgb(229 231 235);
}

:global(.dark) .lightbox-header {
  border-bottom-color: rgb(55 65 81);
}

.lightbox-title {
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 600;
  color: rgb(17 24 39);
}

:global(.dark) .lightbox-title {
  color: white;
}

.lightbox-content {
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: 80vh;
}

.lightbox-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.lightbox-caption {
  padding: 1rem;
  padding-top: 0;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(75 85 99);
  text-align: center;
}

:global(.dark) .lightbox-caption {
  color: rgb(156 163 175);
}

/* RTL Support */
:global([dir="rtl"]) .image-left {
  margin-left: auto;
  margin-right: 0;
}

:global([dir="rtl"]) .image-right {
  margin-right: auto;
  margin-left: 0;
}

:global([dir="rtl"]) .zoom-indicator {
  right: auto;
  left: 0.5rem;
}

/* Responsive */
@media (max-width: 640px) {
  .image-lg,
  .image-xl {
    max-width: 100%;
  }
  
  .image-container {
    margin-left: auto;
    margin-right: auto;
  }
  
  .image-caption {
    font-size: 0.75rem;
    line-height: 1rem;
  }
  
  .lightbox-content {
    padding: 0.5rem;
    max-height: 70vh;
  }
}

/* Print styles */
@media print {
  .zoom-indicator {
    display: none;
  }
  
  .image-zoomable {
    cursor: default;
  }
}
</style>