/**
 * Composable for handling dynamic imports and code splitting
 * This optimizes bundle size by loading components and utilities on demand
 */

import { ref, computed } from 'vue'
import type { Component } from 'vue'

export const useDynamicImports = () => {
  const loadingComponents = ref<Set<string>>(new Set())
  const loadedComponents = ref<Map<string, Component>>(new Map())
  const errors = ref<Map<string, Error>>(new Map())

  /**
   * Dynamically import a component with error handling and caching
   */
  const loadComponent = async (
    componentPath: string,
    componentName?: string
  ): Promise<Component | null> => {
    const key = componentName || componentPath
    
    // Return cached component if available
    if (loadedComponents.value.has(key)) {
      return loadedComponents.value.get(key)!
    }

    // Return null if already loading
    if (loadingComponents.value.has(key)) {
      return null
    }

    try {
      loadingComponents.value.add(key)
      errors.value.delete(key)

      // Dynamic import with proper error handling
      const componentModule = await import(componentPath)
      const component = componentModule.default || componentModule

      // Cache the component
      loadedComponents.value.set(key, component)
      
      return component
    } catch (error) {
      console.error(`Failed to load component: ${componentPath}`, error)
      errors.value.set(key, error as Error)
      return null
    } finally {
      loadingComponents.value.delete(key)
    }
  }

  /**
   * Preload a component without rendering it
   */
  const preloadComponent = (componentPath: string, componentName?: string) => {
    const key = componentName || componentPath
    
    // Skip if already loaded or loading
    if (loadedComponents.value.has(key) || loadingComponents.value.has(key)) {
      return
    }

    // Preload in background
    loadComponent(componentPath, componentName).catch(() => {
      // Silently handle preload errors
    })
  }

  /**
   * Lazy load route-based components
   */
  const loadRouteComponent = (routeName: string) => {
    return loadComponent(`~/pages/${routeName}.vue`, routeName)
  }

  /**
   * Lazy load utility functions
   */
  const loadUtility = async <T>(utilityPath: string): Promise<T | null> => {
    try {
      const utilityModule = await import(utilityPath)
      return utilityModule.default || utilityModule
    } catch (error) {
      console.error(`Failed to load utility: ${utilityPath}`, error)
      return null
    }
  }

  /**
   * Batch preload multiple components
   */
  const preloadComponents = (components: Array<{ path: string; name?: string }>) => {
    components.forEach(({ path, name }) => {
      preloadComponent(path, name)
    })
  }

  /**
   * Critical resource preloading for above-the-fold content
   */
  const preloadCriticalComponents = () => {
    preloadComponents([
      { path: '~/components/AppHeader.vue', name: 'AppHeader' },
      { path: '~/components/AppNavigation.vue', name: 'AppNavigation' },
      { path: '~/components/LanguageSwitcher.vue', name: 'LanguageSwitcher' }
    ])
  }

  /**
   * Lazy load non-critical components
   */
  const preloadNonCriticalComponents = () => {
    // Use requestIdleCallback for better performance
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => {
        preloadComponents([
          { path: '~/components/AppFooter.vue', name: 'AppFooter' },
          { path: '~/components/ThemeSwitcher.vue', name: 'ThemeSwitcher' },
          { path: '~/components/LoadingSpinner.vue', name: 'LoadingSpinner' }
        ])
      })
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => {
        preloadNonCriticalComponents()
      }, 100)
    }
  }

  // Computed states
  const isLoading = computed(() => (key: string) => loadingComponents.value.has(key))
  const hasError = computed(() => (key: string) => errors.value.has(key))
  const getError = computed(() => (key: string) => errors.value.get(key))

  return {
    // Core functions
    loadComponent,
    preloadComponent,
    loadRouteComponent,
    loadUtility,
    
    // Batch operations
    preloadComponents,
    preloadCriticalComponents,
    preloadNonCriticalComponents,
    
    // State
    isLoading,
    hasError,
    getError,
    
    // Raw state for advanced usage
    loadingComponents: readonly(loadingComponents),
    loadedComponents: readonly(loadedComponents),
    errors: readonly(errors)
  }
}
