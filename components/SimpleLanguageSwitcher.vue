<template>
  <div class="flex items-center gap-2 p-4 border rounded">
    <div>Current: {{ locale }}</div>
    <button 
      @click="switchTo('en')" 
      :disabled="locale === 'en'"
      class="px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
    >
      EN
    </button>
    <button 
      @click="switchTo('ar')" 
      :disabled="locale === 'ar'"
      class="px-3 py-1 bg-green-500 text-white rounded disabled:opacity-50"
    >
      AR
    </button>
    <div>{{ $t('welcome') }}</div>
  </div>
</template>

<script setup>
const { locale, setLocale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

async function switchTo(newLocale) {
  console.log('Simple switch to:', newLocale)
  try {
    const path = switchLocalePath(newLocale)
    console.log('Path:', path)
    await navigateTo(path)
  } catch (error) {
    console.error('Switch error:', error)
  }
}
</script>
