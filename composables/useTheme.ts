import { ref, computed, watch, onMounted } from 'vue'

export interface ThemeConfig {
  name: string
  label: string
  description?: string
  category: 'light' | 'dark' | 'special'
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    border: string
  }
}

const themes: Record<string, ThemeConfig> = {
  light: {
    name: 'light',
    label: 'Light',
    description: 'Clean and bright interface',
    category: 'light',
    colors: {
      primary: '#3b82f6',
      secondary: '#6b7280',
      accent: '#10b981',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1f2937',
      border: '#e5e7eb'
    }
  },
  dark: {
    name: 'dark',
    label: 'Dark',
    description: 'Dark mode for comfortable viewing',
    category: 'dark',
    colors: {
      primary: '#60a5fa',
      secondary: '#9ca3af',
      accent: '#34d399',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      border: '#334155'
    }
  },

}

const STORAGE_KEY = 'nuxt-theme'

export const useTheme = () => {
  // Get app config for theme settings
  const appConfig = useAppConfig()
  const currentTheme = ref<string>(appConfig.theme?.default || 'light')
  const isClient = import.meta.client

  // Computed properties
  const themeConfig = computed(() => themes[currentTheme.value] || themes.light)
  const isDark = computed(() => themeConfig.value.category === 'dark' || themeConfig.value.category === 'special')
  const isSpecial = computed(() => themeConfig.value.category === 'special')
  
  const availableThemes = computed(() => {
    return Object.values(themes).map(theme => ({
      name: theme.name,
      label: theme.label,
      description: theme.description,
      category: theme.category
    }))
  })

  const themesByCategory = computed(() => {
    return {
      light: availableThemes.value.filter(t => t.category === 'light'),
      dark: availableThemes.value.filter(t => t.category === 'dark'),
      special: availableThemes.value.filter(t => t.category === 'special')
    }
  })

  // Apply theme to document
  const applyTheme = (themeName: string) => {
    if (!isClient) return

    const body = document.body
    const html = document.documentElement

    // Remove all existing theme classes
    Object.keys(themes).forEach(theme => {
      body.classList.remove(theme)
      html.classList.remove(theme)
    })

    // Add new theme class
    body.classList.add(themeName)
    html.classList.add(themeName)

    // Update data attribute for CSS targeting
    html.setAttribute('data-theme', themeName)

    // Update color scheme meta tag
    const colorScheme = isDark.value ? 'dark' : 'light'
    html.style.colorScheme = colorScheme
    
    // Update meta theme-color
    let themeColorMeta = document.querySelector('meta[name="theme-color"]')
    if (!themeColorMeta) {
      themeColorMeta = document.createElement('meta')
      themeColorMeta.setAttribute('name', 'theme-color')
      document.head.appendChild(themeColorMeta)
    }
    themeColorMeta.setAttribute('content', themeConfig.value.colors.background)
  }

  // Set theme function
  const setTheme = (themeName: string) => {
    if (!themes[themeName]) {
      console.warn(`Theme "${themeName}" not found, using default`)
      themeName = appConfig.theme?.default || 'light'
    }

    currentTheme.value = themeName
    applyTheme(themeName)

    // Persist to localStorage
    if (isClient) {
      try {
        localStorage.setItem(STORAGE_KEY, themeName)
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error)
      }
    }
  }

  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = isDark.value ? 'light' : 'dark'
    setTheme(newTheme)
  }

  // Get next theme in cycle
  const cycleTheme = () => {
    const themeNames = Object.keys(themes)
    const currentIndex = themeNames.indexOf(currentTheme.value)
    const nextIndex = (currentIndex + 1) % themeNames.length
    setTheme(themeNames[nextIndex])
  }

  // Initialize theme from localStorage or system preference
  const initializeTheme = () => {
    if (!isClient) return

    let savedTheme: string | null = null

    // Try to get saved theme from localStorage
    try {
      savedTheme = localStorage.getItem(STORAGE_KEY)
    } catch (error) {
      console.warn('Failed to read theme from localStorage:', error)
    }

    // Use saved theme if valid, otherwise detect system preference
    if (savedTheme && themes[savedTheme]) {
      setTheme(savedTheme)
    } else {
      // Detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')

      // Listen for system preference changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        // Only auto-switch if no theme was explicitly saved
        if (!localStorage.getItem(STORAGE_KEY)) {
          setTheme(e.matches ? 'dark' : 'light')
        }
      }
      mediaQuery.addEventListener('change', handleChange)
    }
  }

  // Watch for theme changes and apply them
  watch(currentTheme, (newTheme) => {
    applyTheme(newTheme)
  }, { immediate: false })

  // Initialize on mounted
  onMounted(() => {
    initializeTheme()
  })

  return {
    // State
    currentTheme: readonly(currentTheme),
    themeConfig: readonly(themeConfig),
    isDark: readonly(isDark),
    isSpecial: readonly(isSpecial),
    
    // Available themes
    themes: readonly(ref(themes)),
    availableThemes: readonly(availableThemes),
    themesByCategory: readonly(themesByCategory),
    
    // Actions
    setTheme,
    toggleTheme,
    cycleTheme,
    applyTheme,
    initializeTheme
  }
}