<template>
  <div class="blog-search-filter">
    <!-- Search Input with Advanced Options -->
    <div class="relative mb-6">
      <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <!-- Main Search Input -->
        <div class="relative flex-1">
          <UInput
            v-model="searchQuery"
            icon="i-heroicons-magnifying-glass-20-solid"
            size="lg"
            :placeholder="$t('blog.searchPlaceholder') || 'Search articles...'"
            class="w-full search-input"
            @input="onSearchInput"
            @keydown.escape="clearSearch"
          >
            <template #trailing>
              <div class="flex items-center gap-2">
                <UKbd v-if="!searchQuery" size="sm">⌘K</UKbd>
                <UButton
                  v-else
                  @click="clearSearch"
                  variant="ghost"
                  size="xs"
                  icon="i-heroicons-x-mark-20-solid"
                  class="hover:bg-gray-100 dark:hover:bg-gray-700"
                />
              </div>
            </template>
          </UInput>
          
          <!-- Search Suggestions Dropdown -->
          <div
            v-if="showSuggestions && suggestions.length > 0"
            class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
          >
            <div class="p-2">
              <div class="text-xs text-gray-500 dark:text-gray-400 px-2 py-1">
                {{ $t('blog.suggestions') || 'Suggestions' }}
              </div>
              <button
                v-for="(suggestion, index) in suggestions"
                :key="index"
                @click="applySuggestion(suggestion)"
                class="w-full text-left px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-sm flex items-center gap-2"
              >
                <UIcon :name="suggestion.icon" class="w-4 h-4 text-gray-400" />
                <span>{{ suggestion.text }}</span>
                <span class="text-xs text-gray-400 ml-auto">{{ suggestion.count }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Search Mode Toggle -->
        <div class="flex items-center gap-2">
          <USwitch
            v-model="advancedMode"
            :label="$t('blog.advancedSearch') || 'Advanced'"
            size="sm"
          />
          <UButton
            @click="toggleAdvanced"
            variant="ghost"
            size="sm"
            :icon="advancedMode ? 'i-heroicons-chevron-up-20-solid' : 'i-heroicons-chevron-down-20-solid'"
          />
        </div>
      </div>

      <!-- Advanced Search Panel -->
      <div
        v-if="advancedMode"
        class="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Category Filter -->
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              {{ $t('blog.category') || 'Category' }}
            </label>
            <USelectMenu
              v-model="selectedCategory"
              :items="categoryOptions"
              :value-key="'value'"
              :placeholder="$t('blog.allCategories') || 'All Categories'"
              size="sm"
            />
          </div>

          <!-- Tag Filter -->
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              {{ $t('blog.tags') || 'Tags' }}
            </label>
            <USelectMenu
              v-model="selectedTags"
              :items="tagOptions"
              value-key="value"
              multiple
              :placeholder="$t('blog.selectTags') || 'Select tags...'"
              size="sm"
            />
          </div>

          <!-- Date Range -->
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              {{ $t('blog.dateRange') || 'Date Range' }}
            </label>
            <USelectMenu
              v-model="dateRange"
              :items="dateRangeOptions"
              value-key="value"
              :placeholder="$t('blog.anyTime') || 'Any time'"
              size="sm"
            />
          </div>

          <!-- Reading Time -->
          <div>
            <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              {{ $t('blog.readingTime') || 'Reading Time' }}
            </label>
            <USelectMenu
              v-model="readingTimeFilter"
              :items="readingTimeOptions"
              value-key="value"
              :placeholder="$t('blog.anyDuration') || 'Any duration'"
              size="sm"
            />
          </div>
        </div>

        <!-- Advanced Search Actions -->
        <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ $t('blog.resultsFound',filteredCount) || 'results found' }}
          </div>
          <div class="flex gap-2">
            <UButton
              @click="clearAllFilters"
              variant="ghost"
              size="sm"
              color="neutral"
            >
              {{ $t('blog.clearAll') || 'Clear All' }}
            </UButton>
            <UButton
              @click="saveSearch"
              variant="outline"
              size="sm"
              color="primary"
              v-if="hasActiveFilters"
            >
              {{ $t('blog.saveSearch') || 'Save Search' }}
            </UButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Filters Display -->
    <div v-if="activeFilters.length > 0" class="flex flex-wrap gap-2 mb-6">
      <UBadge
        v-for="filter in activeFilters"
        :key="filter.key"
        variant="outline"
        color="primary"
        size="sm"
        class="filter-badge"
      >
        <span>{{ filter.label }}: {{ filter.value }}</span>
        <UButton
          @click="removeFilter(filter.key)"
          variant="ghost"
          size="xs"
          icon="i-heroicons-x-mark-20-solid"
          class="ml-1 -mr-1"
        />
      </UBadge>
    </div>

    <!-- Sort Options -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div class="flex items-center gap-4">
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ $t('blog.sortBy') || 'Sort by:' }}
        </span>
        <USelectMenu
          v-model="sortBy"
          :items="sortOptions"
          value-key="value"
          :placeholder="$t('blog.selectSort') || 'Select sort option...'"
          size="sm"
          class="min-w-40"
        />
      </div>

      <!-- View Mode Toggle -->
      <BlogViewModeSwitcher
        :current-mode="viewMode"
        @change="handleViewModeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import Fuse from 'fuse.js'

// Types
interface Post {
  title: string
  description: string
  slug: string
  category?: string
  tags?: string[]
  date: string | Date
  readTime?: number
  author?: string
  featured?: boolean
}

interface FilterOption {
  label: string
  value: string
  count?: number
}

interface SearchSuggestion {
  text: string
  icon: string
  count: number
  type: 'tag' | 'category' | 'author'
}

interface ActiveFilter {
  key: string
  label: string
  value: string
}

// Props
interface Props {
  posts: Post[]
  initialSearch?: string
}

const props = withDefaults(defineProps<Props>(), {
  posts: () => [],
  initialSearch: ''
})

// Emits
const emit = defineEmits<{
  search: [query: string]
  filter: [filters: any]
  sort: [sortBy: string]
  viewMode: [mode: 'magazine' | 'card' | 'list' | 'minimal']
}>()

// State
const searchQuery = ref(props.initialSearch)
const advancedMode = ref(false)
const selectedCategory = ref('')
const selectedTags = ref<string[]>([])
const dateRange = ref('')
const readingTimeFilter = ref('')
const sortBy = ref('date-desc')
const viewMode = ref<'magazine' | 'card' | 'list' | 'minimal'>('card')
const showSuggestions = ref(false)

// Fuse.js setup for fuzzy search
let fuse: Fuse<Post> | null = null

// Computed
const categoryOptions = computed((): FilterOption[] => {
  const categories = new Map<string, number>()
  props.posts.forEach(post => {
    if (post.category) {
      categories.set(post.category, (categories.get(post.category) || 0) + 1)
    }
  })
  
  return Array.from(categories.entries()).map(([category, count]) => ({
    label: category,
    value: category,
    count
  }))
})

const tagOptions = computed((): FilterOption[] => {
  const tags = new Map<string, number>()
  props.posts.forEach(post => {
    post.tags?.forEach(tag => {
      tags.set(tag, (tags.get(tag) || 0) + 1)
    })
  })
  
  return Array.from(tags.entries()).map(([tag, count]) => ({
    label: tag,
    value: tag,
    count
  }))
})

const dateRangeOptions = computed(() => [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'Last 3 months', value: '3m' },
  { label: 'Last year', value: '1y' },
  { label: 'Older', value: 'older' }
])

const readingTimeOptions = computed(() => [
  { label: 'Quick read (< 3 min)', value: '0-3' },
  { label: 'Medium read (3-10 min)', value: '3-10' },
  { label: 'Long read (> 10 min)', value: '10+' }
])

const sortOptions = computed(() => [
  { label: 'Newest first', value: 'date-desc' },
  { label: 'Oldest first', value: 'date-asc' },
  { label: 'Most relevant', value: 'relevance' },
  { label: 'Reading time (short)', value: 'readtime-asc' },
  { label: 'Reading time (long)', value: 'readtime-desc' },
  { label: 'Alphabetical', value: 'title-asc' }
])

const suggestions = computed((): SearchSuggestion[] => {
  if (!searchQuery.value || searchQuery.value.length < 2) return []
  
  const query = searchQuery.value.toLowerCase()
  const suggestions: SearchSuggestion[] = []
  
  // Tag suggestions
  tagOptions.value
    .filter(tag => tag.label.toLowerCase().includes(query))
    .slice(0, 3)
    .forEach(tag => {
      suggestions.push({
        text: `Tag: ${tag.label}`,
        icon: 'i-heroicons-hashtag',
        count: tag.count || 0,
        type: 'tag'
      })
    })
  
  // Category suggestions
  categoryOptions.value
    .filter(cat => cat.label.toLowerCase().includes(query))
    .slice(0, 2)
    .forEach(cat => {
      suggestions.push({
        text: `Category: ${cat.label}`,
        icon: 'i-heroicons-folder',
        count: cat.count || 0,
        type: 'category'
      })
    })
  
  return suggestions.slice(0, 5)
})

const activeFilters = computed((): ActiveFilter[] => {
  const filters: ActiveFilter[] = []
  
  if (selectedCategory.value) {
    filters.push({
      key: 'category',
      label: 'Category',
      value: selectedCategory.value
    })
  }
  
  if (selectedTags.value.length > 0) {
    filters.push({
      key: 'tags',
      label: 'Tags',
      value: selectedTags.value.join(', ')
    })
  }
  
  if (dateRange.value) {
    const option = dateRangeOptions.value.find(opt => opt.value === dateRange.value)
    if (option) {
      filters.push({
        key: 'dateRange',
        label: 'Date',
        value: option.label
      })
    }
  }
  
  if (readingTimeFilter.value) {
    const option = readingTimeOptions.value.find(opt => opt.value === readingTimeFilter.value)
    if (option) {
      filters.push({
        key: 'readingTime',
        label: 'Reading Time',
        value: option.label
      })
    }
  }
  
  return filters
})

const hasActiveFilters = computed(() => {
  return !!(searchQuery.value || selectedCategory.value || selectedTags.value.length > 0 || 
           dateRange.value || readingTimeFilter.value)
})

const filteredCount = computed(() => {
  // This would be provided by parent component
  return props.posts.length
})

// Methods
const onSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  searchQuery.value = target.value
  showSuggestions.value = target.value.length > 1
  
  // Debounced search
  debounce(() => {
    emit('search', searchQuery.value)
  }, 300)()
}

const clearSearch = () => {
  searchQuery.value = ''
  showSuggestions.value = false
  emit('search', '')
}

const applySuggestion = (suggestion: SearchSuggestion) => {
  if (suggestion.type === 'tag') {
    const tagName = suggestion.text.replace('Tag: ', '')
    if (!selectedTags.value.includes(tagName)) {
      selectedTags.value.push(tagName)
    }
  } else if (suggestion.type === 'category') {
    selectedCategory.value = suggestion.text.replace('Category: ', '')
  }
  
  showSuggestions.value = false
  searchQuery.value = ''
}

const toggleAdvanced = () => {
  advancedMode.value = !advancedMode.value
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = ''
  selectedTags.value = []
  dateRange.value = ''
  readingTimeFilter.value = ''
  emit('search', '')
  emit('filter', {})
}

const removeFilter = (key: string) => {
  switch (key) {
    case 'category':
      selectedCategory.value = ''
      break
    case 'tags':
      selectedTags.value = []
      break
    case 'dateRange':
      dateRange.value = ''
      break
    case 'readingTime':
      readingTimeFilter.value = ''
      break
  }
}

const saveSearch = () => {
  // Implement save search functionality
  const searchState = {
    query: searchQuery.value,
    category: selectedCategory.value,
    tags: selectedTags.value,
    dateRange: dateRange.value,
    readingTime: readingTimeFilter.value,
    sort: sortBy.value
  }
  
  localStorage.setItem('savedBlogSearch', JSON.stringify(searchState))
  // You could also emit an event or show a toast notification
}

const handleViewModeChange = (mode: 'magazine' | 'card' | 'list' | 'minimal') => {
  viewMode.value = mode
}

// Utility function for debouncing
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(null, args), wait)
  }
}

// Watchers
watch([selectedCategory, selectedTags, dateRange, readingTimeFilter], () => {
  const filters = {
    category: selectedCategory.value,
    tags: selectedTags.value,
    dateRange: dateRange.value,
    readingTime: readingTimeFilter.value
  }
  emit('filter', filters)
}, { deep: true })

watch(sortBy, (newSort) => {
  emit('sort', newSort)
})

watch(viewMode, (newMode) => {
  emit('viewMode', newMode)
})

// Click outside to close suggestions
onMounted(() => {
  // Initialize Fuse.js for fuzzy search
  fuse = new Fuse(props.posts, {
    keys: ['title', 'description', 'tags', 'category', 'author'],
    threshold: 0.3,
    includeScore: true
  })
  
  // Load saved search if available
  const savedSearch = localStorage.getItem('savedBlogSearch')
  if (savedSearch) {
    try {
      const parsed = JSON.parse(savedSearch)
      // You could optionally restore the saved search state
    } catch (e) {
      // Ignore invalid saved search
    }
  }
  
  // Handle keyboard shortcuts
  const handleKeydown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      // Focus search input
      const searchInput = document.querySelector('.search-input input') as HTMLInputElement
      searchInput?.focus()
    }
  }
  
  document.addEventListener('keydown', handleKeydown)
  
  // Cleanup
  return () => {
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<style scoped>
.blog-search-filter {
  position: relative;
}

.search-input {
  position: relative;
}

.filter-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

/* Loading states */
.search-input.loading::after {
  content: '';
  position: absolute;
  right: 3rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  border: 2px solid var(--color-primary-200);
  border-top: 2px solid var(--color-primary-600);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: translateY(-50%) rotate(0deg); }
  100% { transform: translateY(-50%) rotate(360deg); }
}

/* RTL Support */
[dir="rtl"] .search-input input {
  text-align: right;
}

[dir="rtl"] .filter-badge {
  flex-direction: row-reverse;
}
</style>