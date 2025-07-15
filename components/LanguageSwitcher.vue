<template>
  <USelectMenu
    v-model="selectedLocale"
    :items="availableLocales"
    label-key="name"
    :loading="switchingTo !== null"
    :disabled="switchingTo !== null"
    value-attribute="code"
    option-attribute="name"
    placeholder="Select language"
    :selected-icon="'i-heroicons-language'"
    :content="{
      align: 'end',
      side: 'bottom',
      sideOffset: 8
    }"
    :class="[
      'min-w-[120px]',
      rtlClass('flex-row-reverse', 'flex-row')
    ]"
    :aria-label="$t('switch_language')"
    @change="handleLanguageChange"
  >
    <template #label="{ modelValue }">
      <div class="flex items-center gap-2">
        <span class="text-lg">{{ getLocaleFlag(modelValue?.code || currentLocale) }}</span>
        <span class="font-medium">{{ modelValue?.name || getCurrentLocaleName() }}</span>
      </div>
    </template>

    <template #option="{ option, selected }">
      <div class="flex items-center gap-2 w-full">
        <span class="text-lg">{{ getLocaleFlag(option.code) }}</span>
        <span class="flex-1">{{ option.name }}</span>
        <UIcon 
          v-if="selected" 
          name="i-heroicons-check" 
          class="w-4 h-4 text-primary-500" 
        />
      </div>
    </template>
  </USelectMenu>
</template>

<script setup lang="ts">
// Props with TypeScript support
interface Props {
  showDebugInfo?: boolean
  useButtonStyle?: boolean // Toggle between dropdown and button style
}

const props = withDefaults(defineProps<Props>(), {
  showDebugInfo: true, // Enable debug for testing
  useButtonStyle: true // Enable button style for easier testing
})

// Use Nuxt i18n composables directly
const { locale: currentLocale, locales, setLocale } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const localePath = useLocalePath()
const route = useRoute()

// Use RTL composable for better direction handling
const { rtlClass, direction } = useRTL()

// Loading state for better UX
const switchingTo = ref<string | null>(null)

// Computed available locales (excluding current)
const availableLocales = computed(() => {
  return (locales.value as any[]).filter(l => typeof l !== 'string')
})

// Selected locale for USelectMenu
const selectedLocale = computed({
  get: () => availableLocales.value.find(l => l.code === currentLocale.value),
  set: (locale: any) => {
    if (locale?.code) {
      switchLanguage(locale.code)
    }
  }
})

// Handle language change from USelectMenu
const handleLanguageChange = (locale: any) => {
  if (locale?.code) {
    switchLanguage(locale.code)
  }
}

// Flag mappings for locales (using emoji flags as primary)
const localeFlags = {
  en: '🇬🇧', // Using GB flag for English
  ar: '🇸🇦'  // Using Saudi Arabia flag for Arabic
}

// Heroicon fallbacks for accessibility
const localeFallbackIcons = {
  en: 'i-heroicons-language-20-solid',
  ar: 'i-heroicons-language-20-solid'
}

// Short names for compact button display
const localeShortNames = {
  en: 'EN',
  ar: 'ع'  // Arabic letter for Arabic
}

// Enhanced switch language function with loading state
async function switchLanguage(newLocale: string) {
  console.log('=== LanguageSwitcher DEBUG ===')
  console.log('Switch request - From:', currentLocale.value, 'To:', newLocale)
  console.log('Current route:', route.path)
  console.log('Switching state:', switchingTo.value)
  console.log('Available composables:', {
    switchLocalePath: !!switchLocalePath,
    navigateTo: !!navigateTo,
    localePath: !!localePath
  })
  
  if (switchingTo.value || currentLocale.value === newLocale) {
    console.log('Switch cancelled: already switching or same locale')
    return
  }
  
  try {
    switchingTo.value = newLocale
    console.log('Setting switching state to:', newLocale)
    
    // Store preference in localStorage
    if (process.client) {
      localStorage.setItem('preferred-language', newLocale)
      console.log('Stored preference in localStorage:', newLocale)
    }
    
    // Use the switchLocalePath from Nuxt i18n which handles navigation properly
    const localizedPath = switchLocalePath(newLocale as any)
    console.log('Generated localized path:', localizedPath)
    console.log('About to navigate...')
    
    await navigateTo(localizedPath)
    console.log('Navigation completed successfully')
    
  } catch (error) {
    console.error('Failed to switch language:', error)
    // You could add a toast notification here using UNotifications
  } finally {
    switchingTo.value = null
  }
}

// Get flag for a locale (emoji or fallback icon)
function getLocaleFlag(localeCode: string) {
  return localeFlags[localeCode as keyof typeof localeFlags] || '🌐'
}

// Get fallback icon for a locale
function getLocaleFallbackIcon(localeCode: string) {
  return localeFallbackIcons[localeCode as keyof typeof localeFallbackIcons] || 'i-heroicons-language-20-solid'
}

// Get short name for a locale
function getLocaleShortName(localeCode: string) {
  return localeShortNames[localeCode as keyof typeof localeShortNames] || localeCode.toUpperCase()
}

// Get current locale flag
function getCurrentLocaleFlag() {
  return getLocaleFlag(currentLocale.value)
}

// Get current locale name
function getCurrentLocaleName() {
  const current = availableLocales.value.find(l => l.code === currentLocale.value)
  return current?.name || currentLocale.value
}

// Dropdown items for UDropdown
const dropdownItems = computed(() => [
  availableLocales.value.map(locale => ({
    label: `${getLocaleFlag(locale.code)} ${locale.name}`,
    disabled: locale.code === currentLocale.value || switchingTo.value !== null,
    loading: switchingTo.value === locale.code,
    click: () => switchLanguage(locale.code),
    shortcut: locale.code.toUpperCase(),
    class: locale.code === currentLocale.value ? 'bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400' : ''
  }))
])

// Keyboard navigation support
function onKeydown(event: KeyboardEvent, localeCode: string) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    switchLanguage(localeCode)
  }
}
</script>


