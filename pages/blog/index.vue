<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
    <!-- Hero Section -->
    <div class="relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-green-500/10"></div>
      <div class="relative container mx-auto px-4 py-16 lg:py-24">
        <div class="max-w-4xl mx-auto text-center">
          <UBadge 
            color="primary" 
            variant="subtle" 
            size="lg"
            class="mb-6"
          >
            {{ $t('blog.featured') || 'Latest Articles' }}
          </UBadge>
          
          <h1 class="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            {{ $t('blog.title') }}
          </h1>
          
          <p class="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {{ $t('blog.description') }}
          </p>
          
          <!-- Stats or CTA -->
          <div class="flex flex-wrap justify-center gap-8 mt-12">
            <div class="text-center">
              <div class="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {{ posts?.length || 0 }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ $t('blog.articlesCount') || 'Articles' }}
              </div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-green-600 dark:text-green-400">
                {{ categories?.length || 0 }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ $t('blog.categoriesCount') || 'Categories' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 pb-20">
      <div class="max-w-7xl mx-auto">
        
        <!-- Enhanced Search and Filter Section -->
        <div class="my-12">
          <BlogSearchFilter
            :posts="posts || []"
            :initial-search="searchQuery"
            @search="handleSearch"
            @filter="handleFilter"
            @sort="handleSort"
            @view-mode="handleViewMode"
          />
        </div>

        <!-- Blog Posts Grid -->
        <div v-if="filteredPosts && filteredPosts.length > 0">
          
          <!-- Featured Post (First Post) - Magazine Layout -->
          <div v-if="filteredPosts[0] && viewMode === 'magazine'" class="mb-16">
            <BlogCard
              :post="filteredPosts[0]"
              layout="magazine"
              :featured="true"
            />
          </div>

          <!-- Posts Grid/List based on view mode -->
          <div 
            v-if="viewMode === 'magazine'"
            class="grid gap-8 lg:gap-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            <BlogCard 
              v-for="(post, index) in filteredPosts.slice(1)" 
              :key="post.slug"
              :post="post"
              layout="magazine"
            />
          </div>
          
          <div 
            v-else-if="viewMode === 'card'"
            class="grid gap-6 lg:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          >
            <BlogCard 
              v-for="post in filteredPosts" 
              :key="post.slug"
              :post="post"
              layout="card"
            />
          </div>
          
          <div 
            v-else-if="viewMode === 'list'"
            class="space-y-6"
          >
            <BlogCard 
              v-for="post in filteredPosts" 
              :key="post.slug"
              :post="post"
              layout="list"
            />
          </div>
          
          <div 
            v-else-if="viewMode === 'minimal'"
            class="space-y-4"
          >
            <BlogCard 
              v-for="post in filteredPosts" 
              :key="post.slug"
              :post="post"
              layout="minimal"
            />
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <UCard class="max-w-md mx-auto border-0 shadow-lg">
            <template #header>
              <div class="text-center p-8">
                <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary-500 to-green-500 rounded-full flex items-center justify-center">
                  <UIcon name="i-heroicons-document-text-20-solid" class="w-10 h-10 text-white" />
                </div>
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {{ $t('blog.noPostsTitle') || 'No Articles Yet' }}
                </h3>
                <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {{ $t('blog.noPostsDescription') || 'Check back soon for new articles and insights.' }}
                </p>
              </div>
            </template>
            
            <template #footer>
              <div class="text-center p-4">
                <UButton 
                  to="/"
                  variant="ghost"
                  color="primary"
                  trailing-icon="i-heroicons-home-20-solid"
                >
                  {{ $t('blog.backHome') || 'Back to Home' }}
                </UButton>
              </div>
            </template>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const { t } = useI18n()

// Set page meta
definePageMeta({
  title: 'Blog',
  description: 'Articles and thoughts on technology and development'
})

// Reactive state for filtering and search
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedTags = ref<string[]>([])
const dateRange = ref('')
const readingTimeFilter = ref('')
const sortBy = ref('date-desc')
const viewMode = ref<'magazine' | 'card' | 'list' | 'minimal'>('card')
const activeFilters = ref<any>({})

// Fetch blog posts from content using v3 API
const locale = useI18n().locale.value || 'en'
console.log('Fetching blog posts for locale:', locale)

const { data: posts } = await useAsyncData('blog-posts', async () => {
  try {
    // Get all blog posts and filter by language
    const allPosts = await queryCollection('blog')
      .where('published', '=', true)
      .order('date', 'DESC')
      .all()
    
    // Filter posts by language based on path
    const filteredPosts = allPosts.filter(post => {
      if (!post.path) return false
      return post.path.startsWith(`/${locale}/blog/`)
    })
    
    return filteredPosts
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
})

// Computed properties
const categories = computed(() => {
  if (!posts.value || !Array.isArray(posts.value)) return ['all']
  const cats = posts.value
    .map((post: any) => post.category)
    .filter(Boolean)
    .filter((cat: any, index: number, arr: any[]) => arr.indexOf(cat) === index)
  return ['all', ...cats]
})

const filteredPosts = computed(() => {
  if (!posts.value || !Array.isArray(posts.value)) return []
  
  let filtered = [...posts.value]
  
  // Filter by category
  if (selectedCategory.value && selectedCategory.value !== 'all') {
    filtered = filtered.filter((post: any) => post.category === selectedCategory.value)
  }
  
  // Filter by tags
  if (selectedTags.value.length > 0) {
    filtered = filtered.filter((post: any) => 
      post.tags?.some((tag: string) => selectedTags.value.includes(tag))
    )
  }
  
  // Filter by date range
  if (dateRange.value) {
    const now = new Date()
    const filterDate = new Date()
    
    switch (dateRange.value) {
      case '7d':
        filterDate.setDate(now.getDate() - 7)
        break
      case '30d':
        filterDate.setDate(now.getDate() - 30)
        break
      case '3m':
        filterDate.setMonth(now.getMonth() - 3)
        break
      case '1y':
        filterDate.setFullYear(now.getFullYear() - 1)
        break
      case 'older':
        filterDate.setFullYear(now.getFullYear() - 1)
        filtered = filtered.filter((post: any) => new Date(post.date) < filterDate)
        break
    }
    
    if (dateRange.value !== 'older') {
      filtered = filtered.filter((post: any) => new Date(post.date) >= filterDate)
    }
  }
  
  // Filter by reading time
  if (readingTimeFilter.value) {
    filtered = filtered.filter((post: any) => {
      const readTime = getReadingTime(post)
      switch (readingTimeFilter.value) {
        case '0-3':
          return readTime <= 3
        case '3-10':
          return readTime > 3 && readTime <= 10
        case '10+':
          return readTime > 10
        default:
          return true
      }
    })
  }
  
  // Filter by search query (fuzzy search would be implemented here)
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((post: any) => 
      post.title?.toLowerCase().includes(query) ||
      post.description?.toLowerCase().includes(query) ||
      post.tags?.some((tag: string) => tag.toLowerCase().includes(query)) ||
      post.author?.toLowerCase().includes(query)
    )
  }
  
  // Apply sorting
  switch (sortBy.value) {
    case 'date-asc':
      return filtered.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
    case 'date-desc':
      return filtered.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    case 'title-asc':
      return filtered.sort((a: any, b: any) => a.title.localeCompare(b.title))
    case 'readtime-asc':
      return filtered.sort((a: any, b: any) => getReadingTime(a) - getReadingTime(b))
    case 'readtime-desc':
      return filtered.sort((a: any, b: any) => getReadingTime(b) - getReadingTime(a))
    case 'relevance':
      // For now, keep date order for relevance
      return filtered.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    default:
      return filtered.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }
})

// Enhanced filtering and search handlers
const handleSearch = (query: string) => {
  searchQuery.value = query
}

const handleFilter = (filters: any) => {
  activeFilters.value = filters
  selectedCategory.value = filters.category || ''
  selectedTags.value = filters.tags || []
  dateRange.value = filters.dateRange || ''
  readingTimeFilter.value = filters.readingTime || ''
}

const handleSort = (sort: string) => {
  sortBy.value = sort
}

const handleViewMode = (mode: 'magazine' | 'card' | 'list' | 'minimal') => {
  viewMode.value = mode
}

// Methods
const formatDate = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString(useI18n().locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const toggleCategory = (category: string) => {
  selectedCategory.value = selectedCategory.value === category ? '' : category
}

const getCategoryColor = (category: string): 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral' => {
  const colors: Record<string, 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'> = {
    technology: 'primary',
    design: 'secondary',
    development: 'success',
    tutorial: 'warning',
    news: 'error',
    tips: 'info',
    web: 'primary',
    mobile: 'secondary',
    ai: 'success'
  }
  return colors[category?.toLowerCase()] || 'neutral'
}

const getReadingTime = (post: any): number => {
  // Use readTime from frontmatter if available
  if (post.readTime) return post.readTime
  
  // Estimate reading time based on content length
  const wordsPerMinute = 200
  const content = post.body?.content || post.description || ''
  const text = typeof content === 'string' ? content : JSON.stringify(content)
  const wordCount = text.split(/\s+/).length
  return Math.max(1, Math.round(wordCount / wordsPerMinute))
}

// Enhanced SEO using custom composable
const { generateStructuredData } = useSEO({
  title: t('meta.blog.title'),
  description: t('meta.blog.description'),
  keywords: t('meta.keywords'),
  author: t('meta.author'),
  type: 'website'
})

// Set up structured data for blog
useHead({
  title: computed(() => `${t('blog.title')} - ${filteredPosts.value?.length || 0} ${t('blog.articles') || 'Articles'}`),
  meta: [
    {
      name: 'description',
      content: computed(() => t('blog.description'))
    },
    {
      property: 'og:title',
      content: computed(() => t('blog.title'))
    },
    {
      property: 'og:description', 
      content: computed(() => t('blog.description'))
    },
    {
      property: 'og:type',
      content: 'website'
    }
  ]
})
</script>
