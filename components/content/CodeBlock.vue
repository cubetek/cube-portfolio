<template>
  <div class="code-block-wrapper" >
    <!-- Code Block Header -->
    <div v-if="filename || language" class="code-header">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <!-- Language Badge -->
          <UBadge 
            v-if="language" 
            :color="getLanguageColor(language)" 
            variant="subtle" 
            size="sm"
            class="font-mono"
          >
            {{ language.toUpperCase() }}
          </UBadge>
          
          <!-- Filename -->
          <span v-if="filename" class="filename">
            <UIcon name="i-heroicons-document-text-20-solid" class="w-4 h-4" />
            {{ filename }}
          </span>
        </div>
        
        <!-- Actions -->
        <div class="flex items-center gap-2">
          <!-- Copy Button -->
          <UButton
            @click="copyCode"
            variant="ghost"
            size="xs"
            :icon="copied ? 'i-heroicons-check-20-solid' : 'i-heroicons-clipboard-document-20-solid'"
            :label="copied ? 'Copied!' : 'Copy'"
            class="copy-btn"
          />
          
          <!-- Toggle Wrap -->
          <UButton
            v-if="allowWrap"
            @click="toggleWrap"
            variant="ghost"
            size="xs"
            :icon="wordWrap ? 'i-heroicons-arrows-pointing-in-20-solid' : 'i-heroicons-arrows-pointing-out-20-solid'"
            :label="wordWrap ? 'No Wrap' : 'Wrap'"
          />
        </div>
      </div>
    </div>
    
    <!-- Code Content -->
    <div 
      class="code-content"
      :class="{ 
        'word-wrap': wordWrap,
        'with-header': filename || language,
        'with-line-numbers': showLineNumbers
      }"
    >
      <!-- Line Numbers -->
      <div v-if="showLineNumbers" class="line-numbers">
        <div
          v-for="(line, index) in codeLines"
          :key="index"
          class="line-number"
          :class="{ 'highlighted': isLineHighlighted(index + 1) }"
        >
          {{ index + 1 }}
        </div>
      </div>
      
      <!-- Code -->
      <pre 
        ref="codeElement"
        class="code-pre"
        :class="`language-${language}`"
      ><code class="code-element" v-html="highlightedCode"></code></pre>
    </div>
    
    <!-- Code Block Footer (for additional info) -->
    <div v-if="showFooter" class="code-footer">
      <div class="flex items-center justify-between text-xs">
        <span class="text-gray-500 dark:text-gray-400">
          {{ codeLines.length }} lines • {{ codeLength }} characters
        </span>
        <div v-if="executionTime" class="text-gray-500 dark:text-gray-400">
          Execution: {{ executionTime }}ms
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'

// Import common languages
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-vue'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-html'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-docker'
import 'prismjs/components/prism-graphql'


// Props
interface Props {
  code: string
  language?: string
  filename?: string
  highlights?: string // e.g., "1,3,5-8"
  showLineNumbers?: boolean
  allowWrap?: boolean
  showFooter?: boolean
  executionTime?: number
  maxHeight?: string
}

const props = withDefaults(defineProps<Props>(), {
  code: '',
  language: 'text',
  filename: '',
  highlights: '',
  showLineNumbers: true,
  allowWrap: true,
  showFooter: false,
  executionTime: 0,
  maxHeight: '500px'
})

// State
const copied = ref(false)
const wordWrap = ref(false)
const codeElement = ref<HTMLElement>()

// Computed
const codeLines = computed(() => props.code.split('\n'))
const codeLength = computed(() => props.code.length)

const highlightedLines = computed(() => {
  if (!props.highlights) return new Set()
  
  const lines = new Set<number>()
  const parts = props.highlights.split(',')
  
  for (const part of parts) {
    if (part.includes('-')) {
      const rangeParts = part.split('-')
      if (rangeParts.length === 2) {
        const startStr = rangeParts[0]?.trim()
        const endStr = rangeParts[1]?.trim()
        if (startStr && endStr) {
          const start = parseInt(startStr)
          const end = parseInt(endStr)
          if (!isNaN(start) && !isNaN(end)) {
            for (let i = start; i <= end; i++) {
              lines.add(i)
            }
          }
        }
      }
    } else {
      const lineNum = parseInt(part.trim())
      if (!isNaN(lineNum)) {
        lines.add(lineNum)
      }
    }
  }
  
  return lines
})

const highlightedCode = computed(() => {
  try {
    const grammar = Prism.languages[props.language]
    if (grammar) {
      return Prism.highlight(props.code, grammar, props.language)
    }
    return escapeHtml(props.code)
  } catch (error) {
    console.warn('Failed to highlight code:', error)
    return escapeHtml(props.code)
  }
})

// Methods
const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy code:', error)
    // Fallback for older browsers
    fallbackCopyTextToClipboard(props.code)
  }
}

const fallbackCopyTextToClipboard = (text: string) => {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.left = '-999999px'
  textArea.style.top = '-999999px'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()
  
  try {
    document.execCommand('copy')
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    console.error('Fallback copy failed:', error)
  }
  
  textArea.remove()
}

const toggleWrap = () => {
  wordWrap.value = !wordWrap.value
}

const isLineHighlighted = (lineNumber: number): boolean => {
  return highlightedLines.value.has(lineNumber)
}

const getLanguageColor = (lang: string): 'primary' | 'secondary' | 'neutral' | 'accent' | 'gray' | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose' => {
  const colorMap: Record<string, 'primary' | 'secondary' | 'neutral' | 'accent' | 'gray' | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose'> = {
    javascript: 'yellow',
    typescript: 'blue',
    jsx: 'cyan',
    tsx: 'cyan',
    vue: 'green',
    css: 'sky',
    scss: 'sky',
    html: 'red',
    json: 'neutral',
    yaml: 'neutral',
    markdown: 'neutral',
    bash: 'green',
    python: 'yellow',
    java: 'red',
    php: 'purple',
    sql: 'blue',
    docker: 'sky',
    graphql: 'pink'
  }
  
  return colorMap[lang.toLowerCase()] || 'neutral'
}

const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Lifecycle
onMounted(() => {
  // Apply custom styling if needed
  nextTick(() => {
    if (codeElement.value) {
      // Custom post-processing if needed
    }
  })
})
</script>

<style scoped>
.code-block-wrapper {
  margin: 1.5rem 0;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: #ffffff;
}

@media (prefers-color-scheme: dark) {
  .code-block-wrapper {
    border-color: #374151;
    background-color: #111827;
  }
}

.code-header {
  padding: 0.75rem 1rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

@media (prefers-color-scheme: dark) {
  .code-header {
    background-color: #374151;
    border-bottom-color: #4b5563;
  }
}

.filename {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

@media (prefers-color-scheme: dark) {
  .filename {
    color: #d1d5db;
  }
}

.copy-btn {
  transition: background-color 0.2s ease-in-out;
}

.copy-btn:hover {
  background-color: #f3f4f6;
}

@media (prefers-color-scheme: dark) {
  .copy-btn:hover {
    background-color: #374151;
  }
}

.code-content {
  position: relative;
  display: flex;
  background-color: #f9fafb;
  max-height: v-bind(maxHeight);
  overflow: auto;
}

@media (prefers-color-scheme: dark) {
  .code-content {
    background-color: #111827;
  }
}

.code-content.with-header {
  border-top: 0;
}

.line-numbers {
  flex-shrink: 0;
  padding: 1rem 1rem 1rem 1rem;
  background-color: #f3f4f6;
  border-right: 1px solid #e5e7eb;
  text-align: right;
  user-select: none;
}

@media (prefers-color-scheme: dark) {
  .line-numbers {
    background-color: #374151;
    border-right-color: #4b5563;
  }
}

.line-number {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5rem;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', monospace;
  height: 1.5rem;
}

@media (prefers-color-scheme: dark) {
  .line-number {
    color: #9ca3af;
  }
}

.line-number.highlighted {
  background-color: #fef3c7;
  color: #b45309;
  font-weight: 600;
  margin: 0 -1rem;
  padding: 0 1rem;
}

@media (prefers-color-scheme: dark) {
  .line-number.highlighted {
    background-color: rgba(217, 119, 6, 0.2);
    color: #fbbf24;
  }
}

.code-pre {
  flex: 1;
  padding: 1rem;
  font-size: 0.875rem;
  font-family: ui-monospace, SFMono-Regular, 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', monospace;
  line-height: 1.5rem;
  background-color: transparent;
  overflow: auto;
  tab-size: 2;
}

.code-content.word-wrap .code-pre {
  white-space: pre-wrap;
  word-break: break-word;
}

.code-element {
  color: #1f2937;
}

@media (prefers-color-scheme: dark) {
  .code-element {
    color: #e5e7eb;
  }
}

.code-footer {
  padding: 0.5rem 1rem;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

@media (prefers-color-scheme: dark) {
  .code-footer {
    background-color: #374151;
    border-top-color: #4b5563;
  }
}

/* Syntax Highlighting Styles */
:deep(.token.comment),
:deep(.token.prolog),
:deep(.token.doctype),
:deep(.token.cdata) {
  color: #6b7280;
  font-style: italic;
}

@media (prefers-color-scheme: dark) {
  :deep(.token.comment),
  :deep(.token.prolog),
  :deep(.token.doctype),
  :deep(.token.cdata) {
    color: #9ca3af;
  }
}

:deep(.token.punctuation) {
  color: #4b5563;
}

@media (prefers-color-scheme: dark) {
  :deep(.token.punctuation) {
    color: #d1d5db;
  }
}

:deep(.token.property),
:deep(.token.tag),
:deep(.token.constant),
:deep(.token.symbol),
:deep(.token.deleted) {
  color: #dc2626;
}

@media (prefers-color-scheme: dark) {
  :deep(.token.property),
  :deep(.token.tag),
  :deep(.token.constant),
  :deep(.token.symbol),
  :deep(.token.deleted) {
    color: #f87171;
  }
}

:deep(.token.boolean),
:deep(.token.number) {
  color: #7c3aed;
}

@media (prefers-color-scheme: dark) {
  :deep(.token.boolean),
  :deep(.token.number) {
    color: #a78bfa;
  }
}

:deep(.token.selector),
:deep(.token.attr-name),
:deep(.token.string),
:deep(.token.char),
:deep(.token.builtin),
:deep(.token.inserted) {
  color: #059669;
}

@media (prefers-color-scheme: dark) {
  :deep(.token.selector),
  :deep(.token.attr-name),
  :deep(.token.string),
  :deep(.token.char),
  :deep(.token.builtin),
  :deep(.token.inserted) {
    color: #34d399;
  }
}

:deep(.token.operator),
:deep(.token.entity),
:deep(.token.url),
:deep(.language-css .token.string),
:deep(.style .token.string),
:deep(.token.variable) {
  color: #ea580c;
}

@media (prefers-color-scheme: dark) {
  :deep(.token.operator),
  :deep(.token.entity),
  :deep(.token.url),
  :deep(.language-css .token.string),
  :deep(.style .token.string),
  :deep(.token.variable) {
    color: #fb923c;
  }
}

:deep(.token.atrule),
:deep(.token.attr-value),
:deep(.token.function),
:deep(.token.class-name) {
  color: #2563eb;
}

@media (prefers-color-scheme: dark) {
  :deep(.token.atrule),
  :deep(.token.attr-value),
  :deep(.token.function),
  :deep(.token.class-name) {
    color: #60a5fa;
  }
}

:deep(.token.keyword) {
  color: #7c3aed;
  font-weight: 600;
}

@media (prefers-color-scheme: dark) {
  :deep(.token.keyword) {
    color: #a78bfa;
  }
}

:deep(.token.regex),
:deep(.token.important) {
  color: #ea580c;
  font-weight: 600;
}

@media (prefers-color-scheme: dark) {
  :deep(.token.regex),
  :deep(.token.important) {
    color: #fb923c;
  }
}

:deep(.token.important),
:deep(.token.bold) {
  font-weight: 700;
}

:deep(.token.italic) {
  font-style: italic;
}

:deep(.token.entity) {
  cursor: help;
}

/* RTL Support */
[dir="rtl"] .line-numbers {
  border-right: 0;
  border-left: 1px solid #e5e7eb;
  padding-left: 1rem;
  padding-right: 0;
  text-align: left;
}

@media (prefers-color-scheme: dark) {
  [dir="rtl"] .line-numbers {
    border-left-color: #4b5563;
  }
}

[dir="rtl"] .code-pre {
  text-align: right;
  direction: ltr; /* Keep code LTR even in RTL layout */
}

/* Responsive */
@media (max-width: 640px) {
  .code-header {
    padding: 0.5rem 0.75rem;
  }
  
  .code-content {
    max-height: 300px;
  }
  
  .line-numbers {
    padding: 0.75rem 0.5rem;
  }
  
  .code-pre {
    padding: 0.75rem;
  }
}
</style>