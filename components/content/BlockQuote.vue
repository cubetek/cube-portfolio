<template>
  <blockquote 
    class="enhanced-blockquote"
    :class="[
      `quote-${variant}`,
      `quote-${size}`,
      { 'quote-with-author': author }
    ]"
  >
    <!-- Quote Icon -->
    <div class="quote-icon" v-if="showIcon">
      <UIcon :name="getIconName()" class="quote-icon-svg" />
    </div>
    
    <!-- Quote Content -->
    <div class="quote-content">
      <div class="quote-text">
        <slot />
      </div>
      
      <!-- Author and Source -->
      <footer v-if="author || source" class="quote-footer">
        <cite class="quote-cite">
          <span v-if="author" class="quote-author">{{ author }}</span>
          <span v-if="source" class="quote-source">
            <span v-if="author"> — </span>
            <em>{{ source }}</em>
          </span>
        </cite>
      </footer>
    </div>
  </blockquote>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Props
interface Props {
  author?: string
  source?: string
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  author: '',
  source: '',
  variant: 'default',
  size: 'md',
  showIcon: true
})

// Methods
const getIconName = () => {
  const icons = {
    default: 'i-heroicons-chat-bubble-left-right-20-solid',
    success: 'i-heroicons-check-circle-20-solid',
    warning: 'i-heroicons-exclamation-triangle-20-solid',
    error: 'i-heroicons-x-circle-20-solid',
    info: 'i-heroicons-information-circle-20-solid'
  }
  
  return icons[props.variant] || icons.default
}
</script>

<style scoped>
.enhanced-blockquote {
  position: relative;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  padding-left: 1.5rem;
  padding-right: 1rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  border-radius: 0.5rem;
  border-left-width: 4px;
}

/* Variants */
.quote-default {
  border-left-color: rgb(156 163 175);
  background-color: rgb(249 250 251);
}

:global(.dark) .quote-default {
  background-color: rgb(31 41 55);
}

.quote-success {
  border-left-color: rgb(34 197 94);
  background-color: rgb(240 253 244);
}

:global(.dark) .quote-success {
  background-color: rgb(20 83 45 / 0.2);
}

.quote-warning {
  border-left-color: rgb(234 179 8);
  background-color: rgb(254 252 232);
}

:global(.dark) .quote-warning {
  background-color: rgb(133 77 14 / 0.2);
}

.quote-error {
  border-left-color: rgb(239 68 68);
  background-color: rgb(254 242 242);
}

:global(.dark) .quote-error {
  background-color: rgb(127 29 29 / 0.2);
}

.quote-info {
  border-left-color: rgb(59 130 246);
  background-color: rgb(239 246 255);
}

:global(.dark) .quote-info {
  background-color: rgb(30 58 138 / 0.2);
}

/* Sizes */
.quote-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: 1rem;
}

.quote-md {
  font-size: 1rem;
  line-height: 1.5rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-left: 1.5rem;
}

.quote-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
  padding-top: 1.25rem;
  padding-bottom: 1.25rem;
  padding-left: 2rem;
}

/* Icon */
.quote-icon {
  position: absolute;
  top: 1rem;
  left: 0.5rem;
}

.quote-icon-svg {
  width: 1.25rem;
  height: 1.25rem;
}

.quote-default .quote-icon-svg {
  color: rgb(156 163 175);
}

:global(.dark) .quote-default .quote-icon-svg {
  color: rgb(107 114 128);
}

.quote-success .quote-icon-svg {
  color: rgb(34 197 94);
}

.quote-warning .quote-icon-svg {
  color: rgb(234 179 8);
}

.quote-error .quote-icon-svg {
  color: rgb(239 68 68);
}

.quote-info .quote-icon-svg {
  color: rgb(59 130 246);
}

/* Content */
.quote-content > * + * {
  margin-top: 0.75rem;
}

.quote-text {
  color: rgb(55 65 81);
  line-height: 1.625;
}

:global(.dark) .quote-text {
  color: rgb(209 213 219);
}

.quote-text :deep(p) {
  margin-bottom: 0;
}

.quote-text :deep(p:not(:last-child)) {
  margin-bottom: 0.5rem;
}

.quote-footer {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.quote-cite {
  font-style: normal;
}

.quote-author {
  font-weight: 600;
  color: rgb(17 24 39);
}

:global(.dark) .quote-author {
  color: rgb(243 244 246);
}

.quote-source {
  color: rgb(75 85 99);
}

:global(.dark) .quote-source {
  color: rgb(156 163 175);
}

/* Variant-specific text colors */
.quote-success .quote-text {
  color: rgb(22 101 52);
}

:global(.dark) .quote-success .quote-text {
  color: rgb(187 247 208);
}

.quote-warning .quote-text {
  color: rgb(133 77 14);
}

:global(.dark) .quote-warning .quote-text {
  color: rgb(254 240 138);
}

.quote-error .quote-text {
  color: rgb(153 27 27);
}

:global(.dark) .quote-error .quote-text {
  color: rgb(252 165 165);
}

.quote-info .quote-text {
  color: rgb(30 64 175);
}

:global(.dark) .quote-info .quote-text {
  color: rgb(191 219 254);
}

/* RTL Support */
:global([dir="rtl"]) .enhanced-blockquote {
  border-left-width: 0;
  border-right-width: 4px;
  padding-right: 1.5rem;
  padding-left: 1rem;
}

:global([dir="rtl"]) .quote-icon {
  left: auto;
  right: 0.5rem;
}

/* Responsive */
@media (max-width: 640px) {
  .enhanced-blockquote {
    padding-left: 1rem;
    padding-right: 1rem;
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }
  
  .quote-sm {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  
  .quote-lg {
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
    font-size: 1rem;
    line-height: 1.5rem;
  }
}
</style>