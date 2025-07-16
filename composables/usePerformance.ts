/**
 * Performance optimization composable for homepage components
 * Provides utilities for lazy loading, intersection observer, and performance monitoring
 */

import { ref, onMounted, onUnmounted, nextTick } from 'vue'

export interface PerformanceMetrics {
  lcp: number | null
  fid: number | null
  cls: number | null
  ttfb: number | null
  fcp: number | null
}

export interface LazyLoadOptions {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
  enablePlaceholder?: boolean
}

export interface IntersectionObserverEntry {
  element: Element
  isIntersecting: boolean
  intersectionRatio: number
}

/**
 * Intersection Observer composable for lazy loading
 */
export function useIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: LazyLoadOptions = {}
) {
  const observer = ref<IntersectionObserver | null>(null)
  const isSupported = ref(false)

  const {
    root = null,
    rootMargin = '50px',
    threshold = 0.1
  } = options

  onMounted(() => {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      isSupported.value = true
      
      observer.value = new IntersectionObserver(
        (entries) => {
          const mappedEntries = entries.map(entry => ({
            element: entry.target,
            isIntersecting: entry.isIntersecting,
            intersectionRatio: entry.intersectionRatio
          }))
          callback(mappedEntries)
        },
        {
          root,
          rootMargin,
          threshold
        }
      )
    }
  })

  onUnmounted(() => {
    if (observer.value) {
      observer.value.disconnect()
    }
  })

  const observe = (element: Element) => {
    if (observer.value && element) {
      observer.value.observe(element)
    }
  }

  const unobserve = (element: Element) => {
    if (observer.value && element) {
      observer.value.unobserve(element)
    }
  }

  const disconnect = () => {
    if (observer.value) {
      observer.value.disconnect()
    }
  }

  return {
    observer,
    isSupported,
    observe,
    unobserve,
    disconnect
  }
}

/**
 * Lazy loading composable for images and components
 */
export function useLazyLoad(options: LazyLoadOptions = {}) {
  const isLoaded = ref(false)
  const isInView = ref(false)
  const error = ref<string | null>(null)
  const loading = ref(false)

  const { observe, unobserve } = useIntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isLoaded.value) {
          isInView.value = true
          loadContent()
        }
      })
    },
    options
  )

  const loadContent = async () => {
    if (loading.value || isLoaded.value) return

    loading.value = true
    error.value = null

    try {
      // Simulate loading delay for better UX
      await new Promise(resolve => setTimeout(resolve, 100))
      isLoaded.value = true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load content'
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    isLoaded.value = false
    isInView.value = false
    error.value = null
    loading.value = false
  }

  return {
    isLoaded,
    isInView,
    error,
    loading,
    observe,
    unobserve,
    loadContent,
    reset
  }
}

/**
 * Performance metrics monitoring
 */
export function usePerformanceMetrics() {
  const metrics = ref<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    fcp: null
  })

  const collectMetrics = () => {
    if (typeof window === 'undefined') return

    // Collect Core Web Vitals
    if ('web-vitals' in window) {
      // Web Vitals library integration would go here
      // For now, we'll use basic Performance API
    }

    // Collect basic timing metrics
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    
    if (navigation) {
      metrics.value.ttfb = navigation.responseStart - navigation.requestStart
      metrics.value.fcp = navigation.domContentLoadedEventStart - navigation.fetchStart
    }

    // Collect paint metrics
    const paintEntries = performance.getEntriesByType('paint')
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint')
    
    if (fcpEntry) {
      metrics.value.fcp = fcpEntry.startTime
    }
  }

  const reportMetrics = () => {
    if (typeof window === 'undefined') return

    // Report metrics to analytics service
    console.log('Performance Metrics:', metrics.value)
    
    // Example: Send to Google Analytics
    // gtag('event', 'performance', {
    //   event_category: 'Web Vitals',
    //   event_label: 'Homepage',
    //   value: metrics.value.lcp
    // })
  }

  onMounted(() => {
    // Collect metrics after page load
    if (document.readyState === 'complete') {
      collectMetrics()
    } else {
      window.addEventListener('load', collectMetrics)
    }

    // Report metrics after a delay
    setTimeout(reportMetrics, 2000)
  })

  return {
    metrics,
    collectMetrics,
    reportMetrics
  }
}

/**
 * Resource preloading utilities
 */
export function useResourcePreloader() {
  const preloadedResources = ref<Set<string>>(new Set())

  const preloadImage = (src: string, priority: 'high' | 'low' = 'low') => {
    if (preloadedResources.value.has(src)) return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = src
    link.fetchPriority = priority
    
    document.head.appendChild(link)
    preloadedResources.value.add(src)

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = resolve
      img.onerror = reject
      img.src = src
    })
  }

  const preloadFont = (href: string, family: string) => {
    if (preloadedResources.value.has(href)) return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'font'
    link.type = 'font/woff2'
    link.href = href
    link.crossOrigin = 'anonymous'
    
    document.head.appendChild(link)
    preloadedResources.value.add(href)
  }

  const preloadScript = (src: string) => {
    if (preloadedResources.value.has(src)) return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'script'
    link.href = src
    
    document.head.appendChild(link)
    preloadedResources.value.add(src)
  }

  return {
    preloadedResources,
    preloadImage,
    preloadFont,
    preloadScript
  }
}

/**
 * Critical resource optimization
 */
export function useCriticalResourceOptimization() {
  const isResourceCritical = ref(false)
  const optimizedResources = ref<string[]>([])

  const optimizeAboveTheFold = async () => {
    if (typeof window === 'undefined') return

    // Mark above-the-fold resources as critical
    const criticalImages = document.querySelectorAll('img[data-critical="true"]')
    const criticalFonts = document.querySelectorAll('link[rel="preload"][as="font"]')

    // Optimize critical images
    criticalImages.forEach(img => {
      const imgElement = img as HTMLImageElement
      imgElement.loading = 'eager'
      imgElement.fetchPriority = 'high'
    })

    // Ensure critical fonts are loaded
    await Promise.all(
      Array.from(criticalFonts).map(font => {
        return new Promise(resolve => {
          const link = font as HTMLLinkElement
          if (link.href) {
            const fontFace = new FontFace(
              link.dataset.family || 'Unknown',
              `url(${link.href})`
            )
            fontFace.load().then(resolve).catch(resolve)
          } else {
            resolve(null)
          }
        })
      })
    )

    isResourceCritical.value = true
  }

  const deferNonCriticalResources = () => {
    if (typeof window === 'undefined') return

    // Defer non-critical CSS
    const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"][data-critical="false"]')
    nonCriticalCSS.forEach(link => {
      const linkElement = link as HTMLLinkElement
      linkElement.media = 'print'
      linkElement.onload = () => {
        linkElement.media = 'all'
      }
    })

    // Defer non-critical JavaScript
    const nonCriticalJS = document.querySelectorAll('script[data-critical="false"]')
    nonCriticalJS.forEach(script => {
      const scriptElement = script as HTMLScriptElement
      scriptElement.defer = true
    })
  }

  onMounted(() => {
    optimizeAboveTheFold()
    
    // Defer non-critical resources after initial paint
    requestIdleCallback(() => {
      deferNonCriticalResources()
    })
  })

  return {
    isResourceCritical,
    optimizedResources,
    optimizeAboveTheFold,
    deferNonCriticalResources
  }
}

/**
 * Bundle size optimization utilities
 */
export function useBundleOptimization() {
  const bundleSize = ref(0)
  const chunkSizes = ref<Record<string, number>>({})

  const analyzeBundle = () => {
    if (typeof window === 'undefined') return

    // Analyze loaded chunks
    const scripts = document.querySelectorAll('script[src]')
    scripts.forEach(script => {
      const src = (script as HTMLScriptElement).src
      if (src) {
        const filename = src.split('/').pop() || 'unknown'
        // Note: Actual size would need to be determined by build tools
        chunkSizes.value[filename] = 0
      }
    })

    // Calculate total bundle size
    bundleSize.value = Object.values(chunkSizes.value).reduce((sum, size) => sum + size, 0)
  }

  const optimizeChunks = () => {
    // This would typically be handled by build tools
    // Here we can implement runtime optimizations
    
    // Example: Lazy load non-critical chunks
    const nonCriticalChunks = Object.keys(chunkSizes.value).filter(
      chunk => !chunk.includes('critical') && !chunk.includes('main')
    )

    nonCriticalChunks.forEach(chunk => {
      // Implement lazy loading strategy
      console.log(`Optimizing chunk: ${chunk}`)
    })
  }

  onMounted(() => {
    analyzeBundle()
    optimizeChunks()
  })

  return {
    bundleSize,
    chunkSizes,
    analyzeBundle,
    optimizeChunks
  }
}

/**
 * Memory usage optimization
 */
export function useMemoryOptimization() {
  const memoryUsage = ref(0)
  const cleanupTasks = ref<Array<() => void>>([])

  const trackMemoryUsage = () => {
    if (typeof window === 'undefined' || !('performance' in window)) return

    const memory = (performance as any).memory
    if (memory) {
      memoryUsage.value = memory.usedJSHeapSize
    }
  }

  const addCleanupTask = (task: () => void) => {
    cleanupTasks.value.push(task)
  }

  const cleanup = () => {
    cleanupTasks.value.forEach(task => {
      try {
        task()
      } catch (error) {
        console.warn('Cleanup task failed:', error)
      }
    })
    cleanupTasks.value = []
  }

  const optimizeMemory = () => {
    // Force garbage collection (if available)
    if (typeof window !== 'undefined' && 'gc' in window) {
      (window as any).gc()
    }

    // Clear unused cached data
    cleanup()

    // Track memory after optimization
    trackMemoryUsage()
  }

  onMounted(() => {
    trackMemoryUsage()
    
    // Monitor memory usage periodically
    const interval = setInterval(trackMemoryUsage, 10000)
    addCleanupTask(() => clearInterval(interval))
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    memoryUsage,
    addCleanupTask,
    cleanup,
    optimizeMemory,
    trackMemoryUsage
  }
}

/**
 * Main performance optimization hook
 */
export function usePerformanceOptimization() {
  const { metrics, collectMetrics, reportMetrics } = usePerformanceMetrics()
  const { preloadImage, preloadFont, preloadScript } = useResourcePreloader()
  const { optimizeAboveTheFold, deferNonCriticalResources } = useCriticalResourceOptimization()
  const { bundleSize, analyzeBundle, optimizeChunks } = useBundleOptimization()
  const { memoryUsage, optimizeMemory, addCleanupTask } = useMemoryOptimization()

  const initializeOptimizations = async () => {
    await optimizeAboveTheFold()
    
    // Defer non-critical optimizations
    requestIdleCallback(() => {
      deferNonCriticalResources()
      analyzeBundle()
      optimizeChunks()
    })

    // Google Fonts module handles font preloading automatically
    // No manual preloading needed
  }

  const getOptimizationReport = () => {
    return {
      metrics: metrics.value,
      bundleSize: bundleSize.value,
      memoryUsage: memoryUsage.value,
      timestamp: new Date().toISOString()
    }
  }

  return {
    metrics,
    bundleSize,
    memoryUsage,
    collectMetrics,
    reportMetrics,
    preloadImage,
    preloadFont,
    preloadScript,
    optimizeAboveTheFold,
    deferNonCriticalResources,
    analyzeBundle,
    optimizeChunks,
    optimizeMemory,
    addCleanupTask,
    initializeOptimizations,
    getOptimizationReport
  }
}