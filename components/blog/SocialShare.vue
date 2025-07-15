<template>
  <div class="social-share">
    <h3 v-if="showTitle" class="text-lg font-semibold text-gray-900 dark:text-white mb-4">
      {{ title || $t('blog.shareArticle') || 'Share this article' }}
    </h3>
    
    <div class="flex flex-wrap gap-3">
      <!-- Web Share API Button (if supported) -->
      <UButton
        v-if="isWebShareSupported"
        @click="shareNative"
        color="primary"
        variant="solid"
        size="sm"
        leading-icon="i-heroicons-share-20-solid"
        class="share-btn-native"
      >
        {{ $t('blog.share') || 'Share' }}
      </UButton>

      <!-- Twitter/X -->
      <UButton
        @click="shareTwitter"
        :external="true"
        color="primary"
        variant="outline"
        size="sm"
        leading-icon="i-simple-icons-x"
        class="share-btn-twitter"
      >
        Twitter
      </UButton>

      <!-- LinkedIn -->
      <UButton
        @click="shareLinkedIn"
        :external="true"
        color="primary"
        variant="outline"
        size="sm"
        leading-icon="i-simple-icons-linkedin"
        class="share-btn-linkedin"
      >
        LinkedIn
      </UButton>

      <!-- Facebook -->
      <UButton
        @click="shareFacebook"
        :external="true"
        color="primary"
        variant="outline"
        size="sm"
        leading-icon="i-simple-icons-facebook"
        class="share-btn-facebook"
      >
        Facebook
      </UButton>

      <!-- WhatsApp -->
      <UButton
        @click="shareWhatsApp"
        :external="true"
        color="green"
        variant="outline"
        size="sm"
        leading-icon="i-simple-icons-whatsapp"
        class="share-btn-whatsapp"
      >
        WhatsApp
      </UButton>

      <!-- Telegram -->
      <UButton
        @click="shareTelegram"
        :external="true"
        color="primary"
        variant="outline"
        size="sm"
        leading-icon="i-simple-icons-telegram"
        class="share-btn-telegram"
      >
        Telegram
      </UButton>

      <!-- Reddit -->
      <UButton
        @click="shareReddit"
        :external="true"
        color="orange"
        variant="outline"
        size="sm"
        leading-icon="i-simple-icons-reddit"
        class="share-btn-reddit"
      >
        Reddit
      </UButton>

      <!-- Copy Link -->
      <UButton
        @click="copyLink"
        variant="ghost"
        color="neutral"
        size="sm"
        :leading-icon="copied ? 'i-heroicons-check-20-solid' : 'i-heroicons-link-20-solid'"
        class="share-btn-copy"
        :class="{ 'text-green-600': copied }"
      >
        {{ copied ? ($t('blog.copied') || 'Copied!') : ($t('blog.copyLink') || 'Copy Link') }}
      </UButton>
    </div>

    <!-- Share Count (if available) -->
    <div v-if="showShareCount && shareCount > 0" class="mt-4 text-sm text-gray-600 dark:text-gray-400">
      <UIcon name="i-heroicons-share-20-solid" class="w-4 h-4 inline mr-1" />
      {{ shareCount }} {{ $t('blog.shares') || 'shares' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// Types
interface Props {
  title?: string
  description?: string
  url?: string
  image?: string
  hashtags?: string[]
  showTitle?: boolean
  showShareCount?: boolean
  shareCount?: number
  via?: string // Twitter handle without @
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  description: '',
  url: '',
  image: '',
  hashtags: () => [],
  showTitle: true,
  showShareCount: false,
  shareCount: 0,
  via: ''
})

// State
const copied = ref(false)
const isWebShareSupported = ref(false)

// Computed
const currentUrl = computed(() => {
  if (props.url) return props.url
  if (process.client) return window.location.href
  return ''
})

const shareText = computed(() => {
  const text = props.title || document?.title || ''
  const hashtags = props.hashtags.length > 0 ? ' ' + props.hashtags.map(tag => `#${tag}`).join(' ') : ''
  return `${text}${hashtags}`
})

const encodedTitle = computed(() => encodeURIComponent(props.title || ''))
const encodedDescription = computed(() => encodeURIComponent(props.description || ''))
const encodedUrl = computed(() => encodeURIComponent(currentUrl.value))
const encodedShareText = computed(() => encodeURIComponent(shareText.value))

// Methods
const shareNative = async () => {
  if (!navigator.share) return

  try {
    await navigator.share({
      title: props.title,
      text: props.description,
      url: currentUrl.value
    })
    
    // Track share event
    trackShareEvent('native')
  } catch (error) {
    // User cancelled or error occurred
    console.log('Share cancelled or failed:', error)
  }
}

const shareTwitter = () => {
  const via = props.via ? `&via=${props.via}` : ''
  const url = `https://twitter.com/intent/tweet?text=${encodedShareText.value}&url=${encodedUrl.value}${via}`
  openShareWindow(url, 'twitter')
}

const shareLinkedIn = () => {
  const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl.value}&title=${encodedTitle.value}&summary=${encodedDescription.value}`
  openShareWindow(url, 'linkedin')
}

const shareFacebook = () => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl.value}&quote=${encodedShareText.value}`
  openShareWindow(url, 'facebook')
}

const shareWhatsApp = () => {
  const text = `${shareText.value} ${currentUrl.value}`
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`
  openShareWindow(url, 'whatsapp')
}

const shareTelegram = () => {
  const text = `${shareText.value} ${currentUrl.value}`
  const url = `https://t.me/share/url?url=${encodedUrl.value}&text=${encodeURIComponent(text)}`
  openShareWindow(url, 'telegram')
}

const shareReddit = () => {
  const url = `https://reddit.com/submit?url=${encodedUrl.value}&title=${encodedTitle.value}`
  openShareWindow(url, 'reddit')
}

const copyLink = async () => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(currentUrl.value)
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = currentUrl.value
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      document.execCommand('copy')
      textArea.remove()
    }
    
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
    
    trackShareEvent('copy')
  } catch (error) {
    console.error('Failed to copy link:', error)
  }
}

const openShareWindow = (url: string, platform: string) => {
  const width = 600
  const height = 400
  const left = (window.screen.width - width) / 2
  const top = (window.screen.height - height) / 2
  
  window.open(
    url,
    `share-${platform}`,
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
  )
  
  trackShareEvent(platform)
}

const trackShareEvent = (platform: string) => {
  // Track share events (integrate with your analytics)
  if (typeof gtag !== 'undefined') {
    gtag('event', 'share', {
      method: platform,
      content_type: 'article',
      item_id: currentUrl.value
    })
  }
  
  // Custom event for other analytics
  if (process.client) {
    window.dispatchEvent(new CustomEvent('article-shared', {
      detail: { platform, url: currentUrl.value, title: props.title }
    }))
  }
}

// Lifecycle
onMounted(() => {
  // Check for Web Share API support
  isWebShareSupported.value = !!(navigator.share && window.isSecureContext)
})
</script>

<style scoped>
.social-share {
  /* Container styles are handled by parent component */
}

.share-btn-native {
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700));
}

.share-btn-twitter:hover {
  background-color: #1da1f2;
  border-color: #1da1f2;
  color: white;
}

.share-btn-linkedin:hover {
  background-color: #0077b5;
  border-color: #0077b5;
  color: white;
}

.share-btn-facebook:hover {
  background-color: #1877f2;
  border-color: #1877f2;
  color: white;
}

.share-btn-whatsapp:hover {
  background-color: #25d366;
  border-color: #25d366;
  color: white;
}

.share-btn-telegram:hover {
  background-color: #0088cc;
  border-color: #0088cc;
  color: white;
}

.share-btn-reddit:hover {
  background-color: #ff4500;
  border-color: #ff4500;
  color: white;
}

.share-btn-copy:hover {
  background-color: var(--color-gray-100);
  color: var(--color-gray-700);
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .share-btn-copy:hover {
    background-color: var(--color-gray-800);
    color: var(--color-gray-300);
  }
}

/* RTL Support */
[dir="rtl"] .social-share {
  /* Any RTL-specific styles if needed */
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .social-share .flex {
    gap: 0.5rem;
  }
  
  .social-share button {
    font-size: 0.75rem;
  }
}
</style>