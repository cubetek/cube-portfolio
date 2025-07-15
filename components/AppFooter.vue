<template>
  <footer class="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
    <UContainer class="py-8">
      <div class="flex flex-col space-y-6">
        <!-- Social Media Links Section -->
        <div class="flex justify-center">
          <div class="flex items-center space-x-6 rtl:space-x-reverse">
            <!-- Telegram -->
            <UButton
              variant="ghost"
              color="neutral"
              size="lg"
              :to="socialLinks.telegram"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="$t('footer.social.telegram')"
              icon="i-heroicons-chat-bubble-left-ellipsis"
              class="hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 hover:-translate-y-0.5 text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
              square
            />

            <!-- Twitter -->
            <UButton
              variant="ghost"
              color="neutral"
              size="lg"
              :to="socialLinks.twitter"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="$t('footer.social.twitter')"
              icon="i-heroicons-at-symbol"
              class="hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all duration-200 hover:-translate-y-0.5 text-sky-500 hover:text-sky-600 dark:hover:text-sky-400"
              square
            />

            <!-- TikTok -->
            <UButton
              variant="ghost"
              color="neutral"
              size="lg"
              :to="socialLinks.tiktok"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="$t('footer.social.tiktok')"
              icon="i-heroicons-video-camera"
              class="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-200 hover:-translate-y-0.5 text-neutral-800 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white"
              square
            />
          </div>
        </div>

        <!-- Divider -->
        <USeparator />

        <!-- Copyright Section -->
        <div class="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <!-- Brand/Copyright -->
          <div class="text-center sm:text-left">
            <p class="text-sm text-neutral-600 dark:text-neutral-400">
              {{ $t('footer.copyright', { year: currentYear }) }}
            </p>
          </div>

          <!-- Additional Links -->
          <div class="flex items-center space-x-4 rtl:space-x-reverse text-sm">
            <UButton
              variant="link"
              color="neutral"
              size="sm"
              :label="$t('footer.privacy')"
              class="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            />
            
            <USeparator orientation="vertical" class="h-4" />
            
            <UButton
              variant="link"
              color="neutral"
              size="sm"
              :label="$t('footer.terms')"
              class="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            />
          </div>
        </div>

        <!-- Made with love -->
        <div class="text-center">
          <div class="text-xs text-neutral-500 dark:text-neutral-500 flex items-center justify-center space-x-1 rtl:space-x-reverse">
            <span>{{ $t('footer.madeWith') }}</span>
            <UIcon name="i-heroicons-heart-solid" class="w-3 h-3 text-red-500 animate-pulse" />
            <span>{{ $t('footer.using') }}</span>
            <UButton
              variant="link"
              color="success"
              size="xs"
              to="https://nuxt.com"
              target="_blank"
              rel="noopener noreferrer"
              label="Nuxt 3"
              class="font-medium"
            />
          </div>
        </div>
      </div>
    </UContainer>
  </footer>
</template>

<script setup lang="ts">
// Use RTL composable for better direction handling
const { rtlClass } = useRTL()

// Get current year for copyright
const currentYear = new Date().getFullYear()

// Social media links (placeholder URLs as requested)
const socialLinks = {
  telegram: 'https://t.me/username',
  twitter: 'https://twitter.com/username',
  tiktok: 'https://tiktok.com/@username'
}

// SEO and accessibility
useHead({
  meta: [
    {
      name: 'description',
      content: 'Connect with us on social media platforms'
    }
  ]
})
</script>
