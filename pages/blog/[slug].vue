<template>
  <div class="min-h-screen bg-white dark:bg-gray-900">
    <!-- Loading State -->
    <div v-if="pending" class="container mx-auto px-4 py-16">
      <div class="max-w-4xl mx-auto">
        <div class="animate-pulse">
          <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 w-3/4"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-1/2"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-8 w-1/3"></div>
          <div class="space-y-3">
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4 py-16">
      <div class="max-w-4xl mx-auto text-center">
        <UCard class="p-12">
          <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
            <UIcon name="i-heroicons-exclamation-triangle-20-solid" class="w-10 h-10 text-white" />
          </div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {{ $t('blog.notFound') || 'Article Not Found' }}
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mb-8">
            {{ $t('blog.notFoundDescription') || 'The article you are looking for does not exist or has been moved.' }}
          </p>
          <div class="flex gap-4 justify-center">
            <UButton 
              to="/blog"
              color="primary"
              size="lg"
              leading-icon="i-heroicons-arrow-left-20-solid"
            >
              {{ $t('blog.backToBlog') || 'Back to Blog' }}
            </UButton>
            <UButton 
              to="/"
              variant="ghost"
              color="primary"
              size="lg"
              leading-icon="i-heroicons-home-20-solid"
            >
              {{ $t('blog.backHome') || 'Back to Home' }}
            </UButton>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Reading Progress Component -->
    <BlogReadingProgress
      v-if="post"
      :show-floating="true"
      :show-toc-toggle="true"
      :estimated-time="readingTime"
      :toc-items="tocItems"
    />

    <!-- Article Content -->
    <article v-if="post" class="pb-20">
      <!-- Hero Section -->
      <div class="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div class="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-green-500/10"></div>
        <div class="relative container mx-auto px-4 py-16 lg:py-24">
          <div class="max-w-4xl mx-auto">
            <!-- Breadcrumb -->
            <nav class="mb-8" aria-label="Breadcrumb">
              <ol class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <li>
                  <ULink to="/" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 font-medium underline-offset-4 hover:underline">
                    {{ $t('navigation.home') || 'Home' }}
                  </ULink>
                </li>
                <li class="flex items-center">
                  <UIcon name="i-heroicons-chevron-right-20-solid" class="w-4 h-4 mx-2 text-gray-400 dark:text-gray-500" />
                  <ULink to="/blog" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 font-medium underline-offset-4 hover:underline">
                    {{ $t('navigation.blog') || 'Blog' }}
                  </ULink>
                </li>
                <li class="flex items-center">
                  <UIcon name="i-heroicons-chevron-right-20-solid" class="w-4 h-4 mx-2 text-gray-400 dark:text-gray-500" />
                  <span class="text-gray-900 dark:text-white font-semibold line-clamp-1">{{ post?.title || 'Loading...' }}</span>
                </li>
              </ol>
            </nav>

            <!-- Article Meta -->
            <div class="flex flex-wrap items-center gap-4 mb-6">
              <UBadge 
                v-if="post?.category" 
                :color="getCategoryColor(post.category)"
                variant="subtle"
                size="lg"
                class="capitalize font-semibold px-4 py-2 text-sm bg-opacity-10 border border-opacity-20 hover:bg-opacity-20 transition-all duration-200"
              >
                {{ post.category }}
              </UBadge>
              
              <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 font-medium">
                <time class="flex items-center gap-1 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200">
                  <UIcon name="i-heroicons-calendar-days-20-solid" class="w-4 h-4 text-primary-500" />
                  {{ formatDate(post?.date || new Date()) }}
                </time>
                
                <div class="flex items-center gap-1 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200">
                  <UIcon name="i-heroicons-clock-20-solid" class="w-4 h-4 text-green-500" />
                  <span>{{ readingTime }} min read</span>
                </div>
                
                <div v-if="post?.author" class="flex items-center gap-1 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200">
                  <UIcon name="i-heroicons-user-20-solid" class="w-4 h-4 text-blue-500" />
                  <span>{{ post.author }}</span>
                </div>
              </div>
            </div>

            <!-- Title -->
            <h1 class="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
              {{ post?.title || 'Loading...' }}
            </h1>

            <!-- Description -->
            <p class="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl font-light">
              {{ post?.description || '' }}
            </p>

              <!-- Tags -->
              <div v-if="post?.tags && post.tags.length > 0" class="flex flex-wrap gap-2 mt-8">
                <UBadge 
                  v-for="tag in post.tags" 
                  :key="tag"
                  variant="outline"
                  color="neutral"
                  size="sm"
                  class="capitalize cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 px-3 py-1 text-xs font-medium rounded-full"
                >
                  #{{ tag }}
                </UBadge>
              </div>
          </div>
        </div>
      </div>

      <!-- Featured Image Placeholder -->
      <div class="relative -mt-16 mb-16">
        <div class="container mx-auto px-4">
          <div class="max-w-4xl mx-auto">
            <div class="aspect-video w-full bg-gradient-to-br from-primary-500 to-green-500 rounded-2xl shadow-2xl overflow-hidden relative group hover:shadow-3xl transition-shadow duration-300">
              <div class="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <UIcon 
                  name="i-heroicons-photo-20-solid" 
                  class="w-20 h-20 text-white/80 group-hover:text-white/90 transition-colors duration-300 drop-shadow-lg"
                />
              </div>
              <!-- Image overlay text -->
              <div class="absolute bottom-4 left-4 right-4">
                <div class="bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <p class="text-white/90 text-sm font-medium">
                    {{ $t('blog.featuredImage') || 'Featured image for this article' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="lg:flex lg:gap-12">
            <!-- Article Content -->
            <main class="lg:flex-1 min-w-0">
              <!-- Enhanced Content Renderer -->
              <div class="prose prose-lg dark:prose-invert max-w-none leading-relaxed">
                <ContentRenderer v-if="post" :value="post">
                  <!-- Custom component mappings for enhanced rendering -->
                  <template #empty>
                    <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                      <UIcon name="i-heroicons-document-text-20-solid" class="w-12 h-12 mx-auto mb-4" />
                      <p>{{ $t('blog.noContent') || 'No content available' }}</p>
                    </div>
                  </template>
                </ContentRenderer>
              </div>

              <!-- Article Footer -->
              <div class="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
                <!-- Enhanced Social Share -->
                <div class="mb-8">
                  <BlogSocialShare
                    :title="post?.title || ''"
                    :description="post?.description || ''"
                    :url="currentUrl"
                    :hashtags="post?.tags || []"
                    :show-title="true"
                    :show-share-count="false"
                    via="yourhandle"
                  />
                </div>

                <!-- Navigation -->
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <UButton 
                    to="/blog"
                    variant="ghost"
                    color="primary"
                    leading-icon="i-heroicons-arrow-left-20-solid"
                    size="lg"
                    class="font-semibold hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 group"
                  >
                    <span class="group-hover:translate-x-[-2px] transition-transform duration-200">
                      {{ $t('blog.backToBlog') || 'Back to Blog' }}
                    </span>
                  </UButton>

                  <!-- Edit on GitHub (if available) -->
                  <UButton
                    v-if="editUrl"
                    :to="editUrl"
                    target="_blank"
                    variant="ghost"
                    color="neutral"
                    trailing-icon="i-heroicons-pencil-square-20-solid"
                    size="sm"
                    class="font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 group"
                  >
                    <span class="group-hover:translate-x-[2px] transition-transform duration-200">
                      {{ $t('blog.editOnGitHub') || 'Edit on GitHub' }}
                    </span>
                  </UButton>
                </div>
              </div>
            </main>

     
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()

// Get the slug from the route params
const slug = computed(() => route.params.slug as string)

// Fetch the blog post
const { data: post, pending, error } = await useAsyncData(`blog-post-${slug.value}`, async () => {
  try {
    const locale = useI18n().locale.value
    const targetPath = `/${locale}/blog/${slug.value}`
    
    // Get all blog posts and find the matching one
    const allPosts = await queryCollection('blog').all()
    const matchedPost = allPosts.find(post => 
      post.path === targetPath || 
      (post.slug === slug.value && post.path.startsWith(`/${locale}/blog/`))
    )
    
    return matchedPost || null
  } catch (error) {
    console.error('Error fetching blog post:', error)
    return null
  }
})

// Fetch related posts
const { data: relatedPosts } = await useAsyncData(`related-posts-${slug.value}`, async () => {
  try {
    if (!post.value) return []
    
    const locale = useI18n().locale.value
    
    // Get all blog posts and filter by language
    const allPosts = await queryCollection('blog').all()
    const languagePosts = allPosts.filter(p => 
      p.path && p.path.startsWith(`/${locale}/blog/`)
    )
    
    // Find posts with similar category or tags, excluding current post
    const related = languagePosts
      .filter(p => 
        p.path !== post.value?.path && 
        (p.category === post.value?.category || 
        (post.value?.tags && p.tags?.some((tag: string) => post.value?.tags?.includes(tag))))
      )
      .slice(0, 3)
    
    return related
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return []
  }
})

// Computed properties
const readingTime = computed(() => {
  if (!post.value) return 0
  // Use readTime from frontmatter if available, otherwise calculate
  if (post.value.readTime) return post.value.readTime
  
  // Calculate reading time based on content length
  const wordsPerMinute = 200
  const content = post.value.body || post.value.description || ''
  const text = typeof content === 'string' ? content : JSON.stringify(content)
  const wordCount = text.split(' ').length
  return Math.max(1, Math.round(wordCount / wordsPerMinute))
})

const tocItems = computed(() => {
  if (!post.value?.body?.toc?.links) return []
  
  return post.value.body.toc.links.map((link: any) => ({
    id: link.id,
    text: link.text,
    depth: link.depth || 2
  }))
})

const currentUrl = computed(() => {
  if (process.client) {
    return window.location.href
  }
  return `https://yoursite.com/blog/${slug.value}`
})

const editUrl = computed(() => {
  if (!post.value) return null
  // Construct GitHub edit URL (adjust for your repository)
  const locale = useI18n().locale.value
  return `https://github.com/i99dev/personal/edit/main/personal-website/content/${locale}/blog/${slug.value}.md`
})

// Methods
const formatDate = (date: string | Date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString(useI18n().locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getCategoryColor = (category: string): 'primary' | 'secondary' | 'neutral' | 'accent' | 'gray' | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose' => {
  const colors: Record<string, 'primary' | 'secondary' | 'neutral' | 'accent' | 'gray' | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose'> = {
    technology: 'primary',
    design: 'secondary',
    development: 'green',
    tutorial: 'amber',
    news: 'red',
    tips: 'blue',
    web: 'primary',
    mobile: 'secondary',
    ai: 'green'
  }
  return colors[category?.toLowerCase()] || 'neutral'
}

// Set page meta
definePageMeta({
  layout: 'default'
})

// Dynamic SEO
useHead({
  title: computed(() => post.value?.title || t('blog.loading')),
  meta: [
    {
      name: 'description',
      content: computed(() => post.value?.description || '')
    },
    {
      property: 'og:title',
      content: computed(() => post.value?.title || '')
    },
    {
      property: 'og:description',
      content: computed(() => post.value?.description || '')
    },
    {
      property: 'og:type',
      content: 'article'
    },
    {
      property: 'article:author',
      content: computed(() => post.value?.author || '')
    },
    {
      property: 'article:published_time',
      content: computed(() => post.value?.date || '')
    },
    {
      property: 'article:tag',
      content: computed(() => post.value?.tags?.join(', ') || '')
    }
  ]
})

// Handle 404
if (error.value) {
  throw createError({
    statusCode: 404,
    statusMessage: t('blog.notFound') || 'Blog post not found'
  })
}
</script>

<style scoped>
/* Custom utilities that can't be fully replaced with Tailwind */
.text-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* RTL Support for prose content */
[dir="rtl"] .prose :deep(blockquote) {
  border-left: 0;
  border-right: 4px solid primary-500;
  padding-right: 1.5rem;
  padding-left: 0;
  border-radius: 0.5rem 0 0 0.5rem;
}

[dir="rtl"] .prose :deep(ul),
[dir="rtl"] .prose :deep(ol) {
  margin-right: 1.5rem;
  margin-left: 0;
}

[dir="rtl"] .prose :deep(table th),
[dir="rtl"] .prose :deep(table td) {
  text-align: right;
}
</style>

