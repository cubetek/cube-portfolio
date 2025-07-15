<template>
  <div 
    class="callout"
    :class="[
      `callout-${type}`,
      `callout-${size}`,
      { 'callout-dismissible': dismissible }
    ]"
    v-if="!dismissed"
  >
    <!-- Icon -->
    <div class="callout-icon">
      <UIcon :name="iconName" class="callout-icon-svg" />
    </div>
    
    <!-- Content -->
    <div class="callout-content">
      <!-- Title -->
      <h4 v-if="title" class="callout-title">
        {{ title }}
      </h4>
      
      <!-- Body -->
      <div class="callout-body">
        <slot />
      </div>
    </div>
    
    <!-- Dismiss Button -->
    <button 
      v-if="dismissible" 
      @click="dismiss"
      class="callout-dismiss"
      aria-label="Dismiss"
    >
      <UIcon name="i-heroicons-x-mark-20-solid" class="w-4 h-4" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Props
interface Props {
  type?: 'info' | 'success' | 'warning' | 'error' | 'tip' | 'note'
  title?: string
  icon?: string
  size?: 'sm' | 'md' | 'lg'
  dismissible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  title: '',
  icon: '',
  size: 'md',
  dismissible: false
})

// State
const dismissed = ref(false)

// Computed
const iconName = computed(() => {
  if (props.icon) return props.icon
  
  const defaultIcons = {
    info: 'i-heroicons-information-circle-20-solid',
    success: 'i-heroicons-check-circle-20-solid',
    warning: 'i-heroicons-exclamation-triangle-20-solid',
    error: 'i-heroicons-x-circle-20-solid',
    tip: 'i-heroicons-light-bulb-20-solid',
    note: 'i-heroicons-pencil-square-20-solid'
  }
  
  return defaultIcons[props.type] || defaultIcons.info
})

// Methods
const dismiss = () => {
  dismissed.value = true
}
</script>

<style scoped>
.callout {
  position: relative;
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;
  border-width: 1px;
}

/* Types */
.callout-info {
  background-color: rgb(239 246 255);
  border-color: rgb(191 219 254);
}

:global(.dark) .callout-info {
  background-color: rgb(30 58 138 / 0.2);
  border-color: rgb(30 64 175);
}

.callout-success {
  background-color: rgb(240 253 244);
  border-color: rgb(187 247 208);
}

:global(.dark) .callout-success {
  background-color: rgb(20 83 45 / 0.2);
  border-color: rgb(22 101 52);
}

.callout-warning {
  background-color: rgb(254 252 232);
  border-color: rgb(254 240 138);
}

:global(.dark) .callout-warning {
  background-color: rgb(133 77 14 / 0.2);
  border-color: rgb(133 77 14);
}

.callout-error {
  background-color: rgb(254 242 242);
  border-color: rgb(252 165 165);
}

:global(.dark) .callout-error {
  background-color: rgb(127 29 29 / 0.2);
  border-color: rgb(153 27 27);
}

.callout-tip {
  background-color: rgb(250 245 255);
  border-color: rgb(221 214 254);
}

:global(.dark) .callout-tip {
  background-color: rgb(88 28 135 / 0.2);
  border-color: rgb(107 33 168);
}

.callout-note {
  background-color: rgb(249 250 251);
  border-color: rgb(229 231 235);
}

:global(.dark) .callout-note {
  background-color: rgb(31 41 55);
  border-color: rgb(55 65 81);
}

/* Sizes */
.callout-sm {
  padding: 0.75rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.callout-md {
  padding: 1rem;
  font-size: 1rem;
  line-height: 1.5rem;
}

.callout-lg {
  padding: 1.25rem;
  font-size: 1.125rem;
  line-height: 1.75rem;
}

/* Icon */
.callout-icon {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.callout-icon-svg {
  width: 1.25rem;
  height: 1.25rem;
}

.callout-info .callout-icon-svg {
  color: rgb(37 99 235);
}

:global(.dark) .callout-info .callout-icon-svg {
  color: rgb(96 165 250);
}

.callout-success .callout-icon-svg {
  color: rgb(22 163 74);
}

:global(.dark) .callout-success .callout-icon-svg {
  color: rgb(74 222 128);
}

.callout-warning .callout-icon-svg {
  color: rgb(202 138 4);
}

:global(.dark) .callout-warning .callout-icon-svg {
  color: rgb(250 204 21);
}

.callout-error .callout-icon-svg {
  color: rgb(220 38 38);
}

:global(.dark) .callout-error .callout-icon-svg {
  color: rgb(248 113 113);
}

.callout-tip .callout-icon-svg {
  color: rgb(147 51 234);
}

:global(.dark) .callout-tip .callout-icon-svg {
  color: rgb(196 181 253);
}

.callout-note .callout-icon-svg {
  color: rgb(75 85 99);
}

:global(.dark) .callout-note .callout-icon-svg {
  color: rgb(156 163 175);
}

/* Content */
.callout-content {
  flex: 1 1 0%;
  min-width: 0;
}

.callout-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: rgb(17 24 39);
}

:global(.dark) .callout-title {
  color: rgb(243 244 246);
}

.callout-body {
  color: rgb(55 65 81);
  line-height: 1.625;
}

:global(.dark) .callout-body {
  color: rgb(209 213 219);
}

.callout-body :deep(p) {
  margin-bottom: 0;
}

.callout-body :deep(p:not(:last-child)) {
  margin-bottom: 0.5rem;
}

.callout-body :deep(ul),
.callout-body :deep(ol) {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.callout-body :deep(li) {
  margin-bottom: 0.25rem;
}

/* Type-specific content colors */
.callout-info .callout-title {
  color: rgb(30 58 138);
}

:global(.dark) .callout-info .callout-title {
  color: rgb(219 234 254);
}

.callout-info .callout-body {
  color: rgb(30 64 175);
}

:global(.dark) .callout-info .callout-body {
  color: rgb(191 219 254);
}

.callout-success .callout-title {
  color: rgb(14 116 144);
}

:global(.dark) .callout-success .callout-title {
  color: rgb(220 252 231);
}

.callout-success .callout-body {
  color: rgb(22 101 52);
}

:global(.dark) .callout-success .callout-body {
  color: rgb(187 247 208);
}

.callout-warning .callout-title {
  color: rgb(146 64 14);
}

:global(.dark) .callout-warning .callout-title {
  color: rgb(254 249 195);
}

.callout-warning .callout-body {
  color: rgb(133 77 14);
}

:global(.dark) .callout-warning .callout-body {
  color: rgb(254 240 138);
}

.callout-error .callout-title {
  color: rgb(127 29 29);
}

:global(.dark) .callout-error .callout-title {
  color: rgb(254 226 226);
}

.callout-error .callout-body {
  color: rgb(153 27 27);
}

:global(.dark) .callout-error .callout-body {
  color: rgb(252 165 165);
}

.callout-tip .callout-title {
  color: rgb(88 28 135);
}

:global(.dark) .callout-tip .callout-title {
  color: rgb(243 232 255);
}

.callout-tip .callout-body {
  color: rgb(107 33 168);
}

:global(.dark) .callout-tip .callout-body {
  color: rgb(221 214 254);
}

/* Dismiss Button */
.callout-dismiss {
  flex-shrink: 0;
  color: rgb(156 163 175);
  margin-top: 0.125rem;
  transition-property: color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.callout-dismiss:hover {
  color: rgb(75 85 99);
}

:global(.dark) .callout-dismiss:hover {
  color: rgb(209 213 219);
}

.callout-dismissible {
  padding-right: 2.5rem;
}

/* RTL Support */
:global([dir="rtl"]) .callout {
  flex-direction: row-reverse;
}

:global([dir="rtl"]) .callout-dismissible {
  padding-right: 1rem;
  padding-left: 2.5rem;
}

/* Responsive */
@media (max-width: 640px) {
  .callout {
    padding: 0.75rem;
  }
  
  .callout-lg {
    padding: 1rem;
    font-size: 1rem;
    line-height: 1.5rem;
  }
}

/* Animation */
.callout {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.callout:hover {
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
</style>