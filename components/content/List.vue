<template>
  <component 
    :is="ordered ? 'ol' : 'ul'"
    class="enhanced-list"
    :class="[
      `list-${variant}`,
      `list-${size}`,
      { 'list-compact': compact }
    ]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
// Props
interface Props {
  ordered?: boolean
  variant?: 'default' | 'check' | 'bullet' | 'dash' | 'arrow' | 'number'
  size?: 'sm' | 'md' | 'lg'
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  ordered: false,
  variant: 'default',
  size: 'md',
  compact: false
})
</script>

<style scoped>
.enhanced-list {
  margin-top: 1rem;
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.enhanced-list > * + * {
  margin-top: 0.5rem;
}

/* Sizes */
.list-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding-left: 1rem;
}

.list-sm > * + * {
  margin-top: 0.25rem;
}

.list-md {
  font-size: 1rem;
  line-height: 1.5rem;
  padding-left: 1.5rem;
}

.list-md > * + * {
  margin-top: 0.5rem;
}

.list-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
  padding-left: 2rem;
}

.list-lg > * + * {
  margin-top: 0.75rem;
}

/* Compact variant */
.list-compact > * + * {
  margin-top: 0.25rem;
}

/* Default styles */
.list-default.enhanced-list {
  list-style-type: disc;
}

.list-default.enhanced-list[is="ol"] {
  list-style-type: decimal;
}

/* Custom variants */
.list-check {
  list-style-type: none;
}

.list-check :deep(li) {
  position: relative;
  padding-left: 1.5rem;
}

.list-check :deep(li::before) {
  position: absolute;
  left: 0;
  top: 0.125rem;
  color: rgb(34 197 94);
  content: '✓';
  font-weight: bold;
}

.list-bullet {
  list-style-type: none;
}

.list-bullet :deep(li) {
  position: relative;
  padding-left: 1.5rem;
}

.list-bullet :deep(li::before) {
  position: absolute;
  left: 0.25rem;
  top: 0.5rem;
  width: 0.5rem;
  height: 0.5rem;
  background-color: rgb(156 163 175);
  border-radius: 9999px;
  content: '';
}

:global(.dark) .list-bullet :deep(li::before) {
  background-color: rgb(107 114 128);
}

.list-dash {
  list-style-type: none;
}

.list-dash :deep(li) {
  position: relative;
  padding-left: 1.5rem;
}

.list-dash :deep(li::before) {
  position: absolute;
  left: 0;
  top: 0.125rem;
  color: rgb(156 163 175);
  content: '–';
  font-weight: bold;
}

:global(.dark) .list-dash :deep(li::before) {
  color: rgb(107 114 128);
}

.list-arrow {
  list-style-type: none;
}

.list-arrow :deep(li) {
  position: relative;
  padding-left: 1.5rem;
}

.list-arrow :deep(li::before) {
  position: absolute;
  left: 0;
  top: 0.125rem;
  color: var(--color-primary-500);
  content: '→';
  font-weight: bold;
}

.list-number {
  list-style-type: none;
  counter-reset: item;
}

.list-number :deep(li) {
  position: relative;
  padding-left: 2rem;
  counter-increment: item;
}

.list-number :deep(li::before) {
  position: absolute;
  left: 0;
  top: 0;
  color: var(--color-primary-600);
  font-weight: 600;
  content: counter(item) '.';
}

:global(.dark) .list-number :deep(li::before) {
  color: var(--color-primary-400);
}

/* List item styling */
.enhanced-list :deep(li) {
  color: rgb(55 65 81);
  line-height: 1.625;
}

:global(.dark) .enhanced-list :deep(li) {
  color: rgb(209 213 219);
}

.enhanced-list :deep(li p) {
  margin-bottom: 0;
}

.enhanced-list :deep(li p:not(:last-child)) {
  margin-bottom: 0.5rem;
}

/* Nested lists */
.enhanced-list :deep(li ul),
.enhanced-list :deep(li ol) {
  margin-top: 0.5rem;
  margin-bottom: 0;
  margin-left: 1rem;
}

/* RTL Support */
:global([dir="rtl"]) .enhanced-list {
  padding-right: 1.5rem;
  padding-left: 0;
}

:global([dir="rtl"]) .list-sm {
  padding-right: 1rem;
  padding-left: 0;
}

:global([dir="rtl"]) .list-lg {
  padding-right: 2rem;
  padding-left: 0;
}

:global([dir="rtl"]) .list-check :deep(li),
:global([dir="rtl"]) .list-bullet :deep(li),
:global([dir="rtl"]) .list-dash :deep(li),
:global([dir="rtl"]) .list-arrow :deep(li),
:global([dir="rtl"]) .list-number :deep(li) {
  padding-right: 1.5rem;
  padding-left: 0;
}

:global([dir="rtl"]) .list-check :deep(li::before),
:global([dir="rtl"]) .list-bullet :deep(li::before),
:global([dir="rtl"]) .list-dash :deep(li::before),
:global([dir="rtl"]) .list-arrow :deep(li::before),
:global([dir="rtl"]) .list-number :deep(li::before) {
  right: 0;
  left: auto;
}

:global([dir="rtl"]) .list-arrow :deep(li::before) {
  content: '←';
}

:global([dir="rtl"]) .enhanced-list :deep(li ul),
:global([dir="rtl"]) .enhanced-list :deep(li ol) {
  margin-right: 1rem;
  margin-left: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .list-lg {
    font-size: 1rem;
    line-height: 1.5rem;
    padding-left: 1.5rem;
  }
  
  .list-lg > * + * {
    margin-top: 0.5rem;
  }
  
  :global([dir="rtl"]) .list-lg {
    padding-right: 1.5rem;
    padding-left: 0;
  }
}
</style>