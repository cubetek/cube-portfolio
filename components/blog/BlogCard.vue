<template>
  <component
    :is="layout === 'magazine' ? 'article' : 'div'"
    class="group blog-card"
    :class="cardClasses"
  >
    <!-- Magazine Layout -->
    <template v-if="layout === 'magazine'">
      <div class="relative overflow-hidden">
        <!-- Featured Image -->
        <div 
          class="aspect-video bg-gradient-to-br from-primary-500 to-green-500 relative overflow-hidden group-hover:scale-105 transition-transform duration-500"
          :class="{ 'aspect-square': featured }"
        >
          <div class="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <UIcon 
              name="i-heroicons-document-text-20-solid" 
              class="w-16 h-16 text-white/80"
            />
          </div>
          
          <!-- Overlay badges -->
          <div class="absolute top-4 left-4 flex flex-wrap gap-2">
            <UBadge 
              v-if="featured" 
              color="amber" 
              variant="solid"
              size="sm"
            >
              {{ $t('blog.featured') || 'Featured' }}
            </UBadge>
            <UBadge 
              v-if="post.category" 
              :color="getCategoryColor(post.category)"
              variant="solid"
              size="sm"
              class="capitalize"
            >
              {{ post.category }}
            </UBadge>
          </div>
          
          <!-- Reading time -->
          <div class="absolute bottom-4 right-4">
            <div class="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm flex items-center gap-1">
              <UIcon name="i-heroicons-clock-20-solid" class="w-3 h-3" />
              <span>{{ getReadingTime(post) }} min</span>
            </div>
          </div>
        </div>
        
        <!-- Content overlay for featured -->
        <div 
          v-if="featured"
          class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6"
        >
          <h2 class="text-2xl lg:text-3xl font-bold text-white mb-2 leading-tight">
            <ULink 
              :to="`/blog/${post.slug}`"
              class="no-underline hover:text-primary-300 transition-colors duration-300"
            >
              {{ post.title }}
            </ULink>
          </h2>
          <p class="text-gray-200 mb-4 line-clamp-2">
            {{ post.description }}
          </p>
          <div class="flex items-center justify-between text-sm text-gray-300">
            <time>{{ formatDate(post.date) }}</time>
            <UButton 
              :to="`/blog/${post.slug}`"
              variant="ghost"
              color="gray"
              size="sm"
              trailing-icon="i-heroicons-arrow-right-20-solid"
            >
              {{ $t('blog.readMore') || 'Read More' }}
            </UButton>
          </div>
        </div>
      </div>
      
      <!-- Content below image for non-featured -->
      <div v-if="!featured" class="p-6">
        <div class="flex items-center gap-2 mb-3">
          <time class="text-sm text-gray-500 dark:text-gray-400">
            {{ formatDate(post.date) }}
          </time>
        </div>
        
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
          <ULink 
            :to="`/blog/${post.slug}`"
            class="no-underline"
          >
            {{ post.title }}
          </ULink>
        </h3>
        
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-2">
          {{ post.description }}
        </p>
        
        <div class="flex items-center justify-between">
          <div v-if="post.tags" class="flex gap-1 flex-wrap">
            <UBadge 
              v-for="tag in post.tags?.slice(0, 2)" 
              :key="tag"
              variant="outline"
              color="neutral"
              size="xs"
              class="capitalize"
            >
              {{ tag }}
            </UBadge>
          </div>
          
          <UButton 
            :to="`/blog/${post.slug}`"
            variant="ghost"
            color="primary"
            size="sm"
            trailing-icon="i-heroicons-arrow-right-20-solid"
          >
            {{ $t('blog.readMore') || 'Read' }}
          </UButton>
        </div>
      </div>
    </template>

    <!-- Card Layout -->
    <template v-else-if="layout === 'card'">
      <div class="h-full">
        <!-- Image -->
        <div class="aspect-video bg-gradient-to-br from-primary-500 to-green-500 relative overflow-hidden group-hover:scale-105 transition-transform duration-500 rounded-t-xl">
          <div class="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <UIcon 
              name="i-heroicons-document-text-20-solid" 
              class="w-12 h-12 text-white/80"
            />
          </div>
          
          <!-- Category badge -->
          <div class="absolute top-3 left-3">
            <UBadge 
              v-if="post.category" 
              :color="getCategoryColor(post.category)"
              variant="solid"
              size="sm"
              class="capitalize"
            >
              {{ post.category }}
            </UBadge>
          </div>
        </div>
        
        <!-- Content -->
        <div class="p-5 flex flex-col h-full">
          <div class="flex items-center gap-2 mb-3">
            <time class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(post.date) }}
            </time>
            <span class="text-gray-300 dark:text-gray-600">•</span>
            <div class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <UIcon name="i-heroicons-clock-20-solid" class="w-3 h-3" />
              <span>{{ getReadingTime(post) }} min</span>
            </div>
          </div>
          
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
            <ULink 
              :to="`/blog/${post.slug}`"
              class="no-underline"
            >
              {{ post.title }}
            </ULink>
          </h3>
          
          <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3 flex-grow">
            {{ post.description }}
          </p>
          
          <div class="flex items-center justify-between mt-auto">
            <div v-if="post.tags" class="flex gap-1 flex-wrap">
              <UBadge 
                v-for="tag in post.tags?.slice(0, 2)" 
                :key="tag"
                variant="outline"
                color="neutral"
                size="xs"
                class="capitalize"
              >
                {{ tag }}
              </UBadge>
            </div>
            
            <UButton 
              :to="`/blog/${post.slug}`"
              variant="ghost"
              color="primary"
              size="sm"
              trailing-icon="i-heroicons-arrow-right-20-solid"
            >
              {{ $t('blog.readMore') || 'Read' }}
            </UButton>
          </div>
        </div>
      </div>
    </template>

    <!-- List Layout -->
    <template v-else-if="layout === 'list'">
      <div class="flex gap-4 items-center border-l-4 border-l-primary-500 pl-4">
        <!-- Small image -->
        <div class="w-20 h-20 flex-shrink-0 bg-gradient-to-br from-primary-500 to-green-500 rounded-lg relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
          <div class="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <UIcon 
              name="i-heroicons-document-text-20-solid" 
              class="w-6 h-6 text-white/80"
            />
          </div>
        </div>
        
        <!-- Content -->
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-2">
            <UBadge 
              v-if="post.category" 
              :color="getCategoryColor(post.category)"
              variant="subtle"
              size="sm"
              class="capitalize"
            >
              {{ post.category }}
            </UBadge>
            <time class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatDate(post.date) }}
            </time>
            <div class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <UIcon name="i-heroicons-clock-20-solid" class="w-3 h-3" />
              <span>{{ getReadingTime(post) }} min</span>
            </div>
          </div>
          
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
            <ULink 
              :to="`/blog/${post.slug}`"
              class="no-underline"
            >
              {{ post.title }}
            </ULink>
          </h3>
          
          <p class="text-gray-600 dark:text-gray-300 mb-3 leading-relaxed line-clamp-2">
            {{ post.description }}
          </p>
          
          <div class="flex items-center justify-between">
            <div v-if="post.tags" class="flex gap-1 flex-wrap">
              <UBadge 
                v-for="tag in post.tags?.slice(0, 3)" 
                :key="tag"
                variant="outline"
                color="neutral"
                size="xs"
                class="capitalize"
              >
                {{ tag }}
              </UBadge>
            </div>
            
            <UButton 
              :to="`/blog/${post.slug}`"
              variant="ghost"
              color="primary"
              size="sm"
              trailing-icon="i-heroicons-arrow-right-20-solid"
            >
              {{ $t('blog.readMore') || 'Read More' }}
            </UButton>
          </div>
        </div>
      </div>
    </template>

    <!-- Minimal Layout -->
    <template v-else-if="layout === 'minimal'">
      <div class="py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-2">
              <time class="text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(post.date) }}
              </time>
              <span class="text-gray-300 dark:text-gray-600">•</span>
              <div class="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                <UIcon name="i-heroicons-clock-20-solid" class="w-3 h-3" />
                <span>{{ getReadingTime(post) }} min read</span>
              </div>
              <UBadge 
                v-if="post.category" 
                :color="getCategoryColor(post.category)"
                variant="subtle"
                size="xs"
                class="capitalize ml-2"
              >
                {{ post.category }}
              </UBadge>
            </div>
            
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-300">
              <ULink 
                :to="`/blog/${post.slug}`"
                class="no-underline"
              >
                {{ post.title }}
              </ULink>
            </h3>
            
            <p class="text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
              {{ post.description }}
            </p>
          </div>
          
          <UButton 
            :to="`/blog/${post.slug}`"
            variant="ghost"
            color="primary"
            size="sm"
            trailing-icon="i-heroicons-arrow-right-20-solid"
            class="flex-shrink-0"
          >
            {{ $t('blog.read') || 'Read' }}
          </UButton>
        </div>
      </div>
    </template>
  </component>
</template>

<script setup lang="ts">
interface Props {
  post: any
  layout?: 'magazine' | 'card' | 'list' | 'minimal'
  featured?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'card',
  featured: false
})

const { t } = useI18n()

const cardClasses = computed(() => {
  const baseClasses = 'hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-800 border-0 shadow-lg overflow-hidden cursor-pointer'
  
  switch (props.layout) {
    case 'magazine':
      return `${baseClasses} rounded-xl`
    case 'card':
      return `${baseClasses} rounded-xl h-full`
    case 'list':
      return 'hover:shadow-md transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 p-4 rounded-lg cursor-pointer'
    case 'minimal':
      return 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer'
    default:
      return baseClasses
  }
})

const formatDate = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString(useI18n().locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getCategoryColor = (category: string): 'primary' | 'secondary' | 'neutral' | 'amber' | 'green' | 'blue' | 'red' | 'cyan' | 'purple' => {
  const colors: Record<string, 'primary' | 'secondary' | 'neutral' | 'amber' | 'green' | 'blue' | 'red' | 'cyan' | 'purple'> = {
    technology: 'primary',
    design: 'secondary',
    development: 'green',
    tutorial: 'amber',
    news: 'red',
    tips: 'cyan',
    web: 'primary',
    mobile: 'secondary',
    ai: 'green'
  }
  return colors[category?.toLowerCase()] || 'neutral'
}

const getReadingTime = (post: any): number => {
  if (post.readTime) return post.readTime
  
  const wordsPerMinute = 200
  const content = post.body?.content || post.description || ''
  const text = typeof content === 'string' ? content : JSON.stringify(content)
  const wordCount = text.split(/\s+/).length
  return Math.max(1, Math.round(wordCount / wordsPerMinute))
}
</script>

<style scoped>
.blog-card {
  will-change: transform;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  line-clamp: 3;
  overflow: hidden;
}
</style>
