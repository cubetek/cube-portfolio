<template>
  <div class="data-table-wrapper">
    <!-- Table Header (if title or caption) -->
    <div v-if="title || caption" class="table-header">
      <h3 v-if="title" class="table-title">{{ title }}</h3>
      <p v-if="caption" class="table-caption">{{ caption }}</p>
    </div>
    
    <!-- Table Container -->
    <div 
      class="table-container"
      :class="[
        `table-${variant}`,
        { 'table-striped': striped },
        { 'table-bordered': bordered },
        { 'table-hover': hoverable },
        { 'table-compact': compact },
        { 'table-responsive': responsive }
      ]"
    >
      <table class="data-table">
        <!-- Table Head -->
        <thead v-if="$slots.head || headers.length > 0" class="table-head">
          <tr>
            <!-- Use slot if provided, otherwise use headers prop -->
            <slot name="head">
              <th 
                v-for="(header, index) in headers" 
                :key="index"
                class="table-header-cell"
                :class="header.class"
                :style="header.style"
              >
                {{ header.text }}
              </th>
            </slot>
          </tr>
        </thead>
        
        <!-- Table Body -->
        <tbody class="table-body">
          <slot />
        </tbody>
        
        <!-- Table Footer -->
        <tfoot v-if="$slots.foot" class="table-foot">
          <slot name="foot" />
        </tfoot>
      </table>
    </div>
    
    <!-- Table Footer Info -->
    <div v-if="showFooter && (rowCount || footerText)" class="table-footer-info">
      <p class="footer-text">
        {{ footerText || `${rowCount} rows` }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Types
interface TableHeader {
  text: string
  value?: string
  class?: string
  style?: string
}

// Props
interface Props {
  title?: string
  caption?: string
  headers?: TableHeader[]
  variant?: 'default' | 'minimal' | 'bordered' | 'dark'
  striped?: boolean
  bordered?: boolean
  hoverable?: boolean
  compact?: boolean
  responsive?: boolean
  showFooter?: boolean
  rowCount?: number
  footerText?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  caption: '',
  headers: () => [],
  variant: 'default',
  striped: true,
  bordered: false,
  hoverable: true,
  compact: false,
  responsive: true,
  showFooter: false,
  rowCount: 0,
  footerText: ''
})
</script>

<style scoped>
.data-table-wrapper {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}

/* Table Header */
.table-header {
  margin-bottom: 1rem;
}

.table-title {
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 600;
  color: rgb(17 24 39);
  margin-bottom: 0.5rem;
}

:global(.dark) .table-title {
  color: white;
}

.table-caption {
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(75 85 99);
  line-height: 1.625;
}

:global(.dark) .table-caption {
  color: rgb(156 163 175);
}

/* Table Container */
.table-container {
  width: 100%;
}

.table-responsive {
  overflow-x: auto;
}

/* Table Base */
.data-table {
  width: 100%;
  font-size: 0.875rem;
  line-height: 1.25rem;
  text-align: left;
}

/* Variants */
.table-default .data-table {
  background-color: white;
  color: rgb(17 24 39);
}

:global(.dark) .table-default .data-table {
  background-color: rgb(31 41 55);
  color: rgb(243 244 246);
}

.table-minimal .data-table {
  background-color: transparent;
  color: rgb(17 24 39);
}

:global(.dark) .table-minimal .data-table {
  color: rgb(243 244 246);
}

.table-bordered .data-table {
  border-width: 1px;
  border-color: rgb(229 231 235);
  border-radius: 0.5rem;
  overflow: hidden;
}

:global(.dark) .table-bordered .data-table {
  border-color: rgb(55 65 81);
}

.table-dark .data-table {
  background-color: rgb(31 41 55);
  color: rgb(243 244 246);
}

/* Table Head */
.table-head {
  background-color: rgb(249 250 251);
}

:global(.dark) .table-head {
  background-color: rgb(55 65 81);
}

.table-minimal .table-head {
  background-color: transparent;
  border-bottom-width: 2px;
  border-bottom-color: rgb(229 231 235);
}

:global(.dark) .table-minimal .table-head {
  border-bottom-color: rgb(55 65 81);
}

.table-dark .table-head {
  background-color: rgb(17 24 39);
}

.table-header-cell {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  font-weight: 600;
  color: rgb(55 65 81);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

:global(.dark) .table-header-cell {
  color: rgb(209 213 219);
}

.table-compact .table-header-cell {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 0.75rem;
  line-height: 1rem;
}

/* Table Body */
.table-body {
  border-top: 1px solid rgb(229 231 235);
}

.table-body > :deep(tr) {
  border-bottom: 1px solid rgb(229 231 235);
}

:global(.dark) .table-body > :deep(tr) {
  border-bottom-color: rgb(55 65 81);
}

.table-body :deep(tr) {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.table-hover .table-body :deep(tr:hover) {
  background-color: rgb(249 250 251);
}

:global(.dark) .table-hover .table-body :deep(tr:hover) {
  background-color: rgb(55 65 81);
}

.table-striped .table-body :deep(tr:nth-child(even)) {
  background-color: rgb(249 250 251);
}

:global(.dark) .table-striped .table-body :deep(tr:nth-child(even)) {
  background-color: rgb(31 41 55);
}

.table-body :deep(td) {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  color: rgb(17 24 39);
}

:global(.dark) .table-body :deep(td) {
  color: rgb(243 244 246);
}

.table-compact .table-body :deep(td) {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

/* Bordered variant */
.table-bordered .table-header-cell,
.table-bordered .table-body :deep(td) {
  border-right-width: 1px;
  border-right-color: rgb(229 231 235);
}

:global(.dark) .table-bordered .table-header-cell,
:global(.dark) .table-bordered .table-body :deep(td) {
  border-right-color: rgb(55 65 81);
}

.table-bordered .table-header-cell:last-child,
.table-bordered .table-body :deep(td:last-child) {
  border-right-width: 0;
}

/* Table Footer */
.table-foot {
  background-color: rgb(249 250 251);
  border-top-width: 1px;
  border-top-color: rgb(229 231 235);
}

:global(.dark) .table-foot {
  background-color: rgb(55 65 81);
  border-top-color: rgb(55 65 81);
}

.table-foot :deep(td),
.table-foot :deep(th) {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  font-weight: 500;
  color: rgb(55 65 81);
}

:global(.dark) .table-foot :deep(td),
:global(.dark) .table-foot :deep(th) {
  color: rgb(209 213 219);
}

/* Footer Info */
.table-footer-info {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-text {
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: rgb(75 85 99);
}

:global(.dark) .footer-text {
  color: rgb(156 163 175);
}

/* Cell content styling */
.table-body :deep(td a) {
  color: var(--color-primary-600);
  text-decoration: none;
}

.table-body :deep(td a):hover {
  text-decoration: underline;
}

:global(.dark) .table-body :deep(td a) {
  color: var(--color-primary-400);
}

.table-body :deep(td code) {
  background-color: rgb(243 244 246);
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
}

:global(.dark) .table-body :deep(td code) {
  background-color: rgb(55 65 81);
}

.table-body :deep(td strong) {
  font-weight: 600;
  color: rgb(17 24 39);
}

:global(.dark) .table-body :deep(td strong) {
  color: white;
}

.table-body :deep(td em) {
  font-style: italic;
}

/* RTL Support */
:global([dir="rtl"]) .data-table {
  text-align: right;
}

:global([dir="rtl"]) .table-header-cell {
  text-align: right;
}

:global([dir="rtl"]) .table-body :deep(td) {
  text-align: right;
}

/* Responsive */
@media (max-width: 640px) {
  .table-container {
    margin-left: -1rem;
    margin-right: -1rem;
  }
  
  .table-responsive {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .table-header-cell,
  .table-body :deep(td) {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    font-size: 0.75rem;
    line-height: 1rem;
  }
  
  .table-title {
    font-size: 1rem;
    line-height: 1.5rem;
  }
  
  .table-caption {
    font-size: 0.75rem;
    line-height: 1rem;
  }
}

/* Print styles */
@media print {
  .table-container {
    overflow: visible;
  }
  
  .data-table {
    color: black;
    background-color: white;
  }
  
  .table-head {
    background-color: rgb(243 244 246);
  }
  
  .table-body :deep(tr:nth-child(even)) {
    background-color: rgb(249 250 251);
  }
}

/* Focus styles for accessibility */
.data-table :deep(td:focus),
.data-table :deep(th:focus) {
  outline-width: 2px;
  outline-color: var(--color-primary-500);
  outline-offset: 2px;
}

/* Loading state (if needed) */
.table-loading {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.table-loading .table-header-cell,
.table-loading .table-body :deep(td) {
  background-color: rgb(229 231 235);
  color: transparent;
}

:global(.dark) .table-loading .table-header-cell,
:global(.dark) .table-loading .table-body :deep(td) {
  background-color: rgb(55 65 81);
}

/* Empty state */
.table-empty {
  text-align: center;
  padding-top: 2rem;
  padding-bottom: 2rem;
  color: rgb(107 114 128);
}

:global(.dark) .table-empty {
  color: rgb(156 163 175);
}

@keyframes pulse {
  50% {
    opacity: .5;
  }
}
</style>