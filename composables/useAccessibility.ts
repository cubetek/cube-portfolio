/**
 * Accessibility composable for homepage components
 * Provides utilities for ARIA attributes, keyboard navigation, and screen reader support
 */

import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

export interface AccessibilityOptions {
  announceChanges?: boolean
  manageFocus?: boolean
  enableKeyboardNavigation?: boolean
  respectReducedMotion?: boolean
}

export interface FocusableElement {
  element: HTMLElement
  tabIndex: number
  isVisible: boolean
}

export interface AriaLiveRegion {
  id: string
  politeness: 'polite' | 'assertive'
  element: HTMLElement | null
}

/**
 * ARIA live region management
 */
export function useAriaLiveRegions() {
  const liveRegions = ref<AriaLiveRegion[]>([])

  const createLiveRegion = (id: string, politeness: 'polite' | 'assertive' = 'polite') => {
    if (typeof window === 'undefined') return null

    const existing = liveRegions.value.find(region => region.id === id)
    if (existing) return existing

    const element = document.createElement('div')
    element.id = id
    element.setAttribute('aria-live', politeness)
    element.setAttribute('aria-atomic', 'true')
    element.className = 'sr-only'
    element.style.cssText = `
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    `

    document.body.appendChild(element)

    const region: AriaLiveRegion = {
      id,
      politeness,
      element
    }

    liveRegions.value.push(region)
    return region
  }

  const announce = (message: string, politeness: 'polite' | 'assertive' = 'polite') => {
    if (!message.trim()) return

    const regionId = `aria-live-${politeness}`
    let region = liveRegions.value.find(r => r.id === regionId)

    if (!region) {
      region = createLiveRegion(regionId, politeness)
      if (region) {
        liveRegions.value.push(region)
      }
    }

    if (region?.element) {
      region.element.textContent = message
      
      // Clear the message after a short delay to allow re-announcement
      setTimeout(() => {
        if (region?.element) {
          region.element.textContent = ''
        }
      }, 1000)
    }
  }

  const clearLiveRegions = () => {
    liveRegions.value.forEach(region => {
      if (region.element) {
        document.body.removeChild(region.element)
      }
    })
    liveRegions.value = []
  }

  onUnmounted(() => {
    clearLiveRegions()
  })

  return {
    liveRegions,
    createLiveRegion,
    announce,
    clearLiveRegions
  }
}

/**
 * Focus management utilities
 */
export function useFocusManagement() {
  const focusStack = ref<HTMLElement[]>([])
  const trapFocus = ref(false)
  const focusableElements = ref<FocusableElement[]>([])

  const FOCUSABLE_SELECTORS = [
    'button',
    'input',
    'select',
    'textarea',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(', ')

  const getFocusableElements = (container: HTMLElement = document.body): FocusableElement[] => {
    const elements = Array.from(container.querySelectorAll(FOCUSABLE_SELECTORS)) as HTMLElement[]
    
    return elements
      .filter(element => {
        return !(element as any).disabled && 
               element.offsetWidth > 0 && 
               element.offsetHeight > 0 &&
               window.getComputedStyle(element).visibility !== 'hidden'
      })
      .map(element => ({
        element,
        tabIndex: element.tabIndex,
        isVisible: true
      }))
  }

  const updateFocusableElements = (container?: HTMLElement) => {
    focusableElements.value = getFocusableElements(container)
  }

  const focusElement = (element: HTMLElement, options: FocusOptions = {}) => {
    if (!element) return

    element.focus(options)
    
    // Add to focus stack
    const currentFocus = document.activeElement as HTMLElement
    if (currentFocus && currentFocus !== element) {
      focusStack.value.push(currentFocus)
    }
  }

  const restoreFocus = () => {
    const previousElement = focusStack.value.pop()
    if (previousElement && document.body.contains(previousElement)) {
      previousElement.focus()
    }
  }

  const trapFocusInContainer = (container: HTMLElement) => {
    if (!container) return

    const focusableElements = getFocusableElements(container)
    if (focusableElements.length === 0) return

    const firstElement = focusableElements[0].element
    const lastElement = focusableElements[focusableElements.length - 1].element

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement.focus()
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    
    // Focus first element
    firstElement.focus()

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }

  const skipToContent = (contentId: string) => {
    const contentElement = document.getElementById(contentId)
    if (contentElement) {
      // Make element focusable if it's not already
      if (contentElement.tabIndex === -1) {
        contentElement.tabIndex = -1
      }
      
      contentElement.focus()
      contentElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return {
    focusStack,
    trapFocus,
    focusableElements,
    updateFocusableElements,
    focusElement,
    restoreFocus,
    trapFocusInContainer,
    skipToContent
  }
}

/**
 * Keyboard navigation utilities
 */
export function useKeyboardNavigation() {
  const activeIndex = ref(0)
  const items = ref<HTMLElement[]>([])
  const orientation = ref<'horizontal' | 'vertical'>('horizontal')
  const wrap = ref(true)

  const setItems = (elements: HTMLElement[]) => {
    items.value = elements
    activeIndex.value = 0
  }

  const navigate = (direction: 'next' | 'previous' | 'first' | 'last') => {
    if (items.value.length === 0) return

    let newIndex = activeIndex.value

    switch (direction) {
      case 'next':
        newIndex = activeIndex.value + 1
        if (newIndex >= items.value.length) {
          newIndex = wrap.value ? 0 : items.value.length - 1
        }
        break
      
      case 'previous':
        newIndex = activeIndex.value - 1
        if (newIndex < 0) {
          newIndex = wrap.value ? items.value.length - 1 : 0
        }
        break
      
      case 'first':
        newIndex = 0
        break
      
      case 'last':
        newIndex = items.value.length - 1
        break
    }

    activeIndex.value = newIndex
    const activeElement = items.value[newIndex]
    if (activeElement) {
      activeElement.focus()
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    const isHorizontal = orientation.value === 'horizontal'
    
    switch (event.key) {
      case 'ArrowRight':
        if (isHorizontal) {
          event.preventDefault()
          navigate('next')
        }
        break
      
      case 'ArrowLeft':
        if (isHorizontal) {
          event.preventDefault()
          navigate('previous')
        }
        break
      
      case 'ArrowDown':
        if (!isHorizontal) {
          event.preventDefault()
          navigate('next')
        }
        break
      
      case 'ArrowUp':
        if (!isHorizontal) {
          event.preventDefault()
          navigate('previous')
        }
        break
      
      case 'Home':
        event.preventDefault()
        navigate('first')
        break
      
      case 'End':
        event.preventDefault()
        navigate('last')
        break
    }
  }

  return {
    activeIndex,
    items,
    orientation,
    wrap,
    setItems,
    navigate,
    handleKeyDown
  }
}

/**
 * Screen reader utilities
 */
export function useScreenReader() {
  const isScreenReaderActive = ref(false)
  const screenReaderContent = ref<string[]>([])

  const detectScreenReader = () => {
    if (typeof window === 'undefined') return false

    // Check for screen reader indicators
    const hasScreenReader = 
      window.speechSynthesis ||
      window.navigator.userAgent.includes('NVDA') ||
      window.navigator.userAgent.includes('JAWS') ||
      window.navigator.userAgent.includes('VoiceOver') ||
      document.body.classList.contains('screen-reader-active')

    isScreenReaderActive.value = Boolean(hasScreenReader)
    return isScreenReaderActive.value
  }

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1
    utterance.pitch = 1
    utterance.volume = 1
    
    window.speechSynthesis.speak(utterance)
  }

  const addScreenReaderContent = (content: string) => {
    screenReaderContent.value.push(content)
  }

  const clearScreenReaderContent = () => {
    screenReaderContent.value = []
  }

  const generateAriaDescription = (element: HTMLElement): string => {
    const role = element.getAttribute('role')
    const label = element.getAttribute('aria-label')
    const describedBy = element.getAttribute('aria-describedby')
    
    let description = ''
    
    if (label) {
      description += label
    } else if (element.textContent) {
      description += element.textContent.trim()
    }
    
    if (role) {
      description += ` (${role})`
    }
    
    if (describedBy) {
      const describedElement = document.getElementById(describedBy)
      if (describedElement) {
        description += ` ${describedElement.textContent?.trim()}`
      }
    }
    
    return description
  }

  onMounted(() => {
    detectScreenReader()
  })

  return {
    isScreenReaderActive,
    screenReaderContent,
    detectScreenReader,
    speakText,
    addScreenReaderContent,
    clearScreenReaderContent,
    generateAriaDescription
  }
}

/**
 * Reduced motion utilities
 */
export function useReducedMotion() {
  const prefersReducedMotion = ref(false)

  const checkReducedMotion = () => {
    if (typeof window === 'undefined') return false

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    prefersReducedMotion.value = mediaQuery.matches
    
    return prefersReducedMotion.value
  }

  const applyReducedMotion = (element: HTMLElement) => {
    if (prefersReducedMotion.value) {
      element.style.animation = 'none'
      element.style.transition = 'none'
    }
  }

  const respectReducedMotion = (animationOptions: KeyframeAnimationOptions) => {
    if (prefersReducedMotion.value) {
      return {
        ...animationOptions,
        duration: 0
      }
    }
    return animationOptions
  }

  onMounted(() => {
    checkReducedMotion()
    
    // Listen for changes in motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    mediaQuery.addEventListener('change', checkReducedMotion)
    
    // Cleanup listener on unmount
    onUnmounted(() => {
      mediaQuery.removeEventListener('change', checkReducedMotion)
    })
  })

  return {
    prefersReducedMotion,
    checkReducedMotion,
    applyReducedMotion,
    respectReducedMotion
  }
}

/**
 * Color contrast utilities
 */
export function useColorContrast() {
  const contrastRatio = ref(1)
  const meetsWCAG = ref(false)

  const calculateContrast = (foreground: string, background: string): number => {
    const getLuminance = (color: string): number => {
      // Convert hex to RGB
      const hex = color.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16) / 255
      const g = parseInt(hex.substr(2, 2), 16) / 255
      const b = parseInt(hex.substr(4, 2), 16) / 255

      // Calculate relative luminance
      const getLinearValue = (value: number) => {
        return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4)
      }

      return 0.2126 * getLinearValue(r) + 0.7152 * getLinearValue(g) + 0.0722 * getLinearValue(b)
    }

    const l1 = getLuminance(foreground)
    const l2 = getLuminance(background)
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)

    return (lighter + 0.05) / (darker + 0.05)
  }

  const checkContrast = (foreground: string, background: string, level: 'AA' | 'AAA' = 'AA') => {
    const ratio = calculateContrast(foreground, background)
    contrastRatio.value = ratio

    const threshold = level === 'AA' ? 4.5 : 7
    meetsWCAG.value = ratio >= threshold

    return {
      ratio,
      meetsWCAG: meetsWCAG.value,
      level
    }
  }

  const suggestColor = (baseColor: string, targetBackground: string, level: 'AA' | 'AAA' = 'AA') => {
    // This is a simplified version - real implementation would be more complex
    const threshold = level === 'AA' ? 4.5 : 7
    let adjustedColor = baseColor
    
    // Basic color adjustment logic would go here
    // For now, return the original color
    return adjustedColor
  }

  return {
    contrastRatio,
    meetsWCAG,
    calculateContrast,
    checkContrast,
    suggestColor
  }
}

/**
 * Main accessibility hook
 */
export function useAccessibility(options: AccessibilityOptions = {}) {
  const {
    announceChanges = true,
    manageFocus = true,
    enableKeyboardNavigation = true,
    respectReducedMotion = true
  } = options

  const { announce, clearLiveRegions } = useAriaLiveRegions()
  const { focusElement, restoreFocus, trapFocusInContainer, skipToContent } = useFocusManagement()
  const { navigate, handleKeyDown, setItems } = useKeyboardNavigation()
  const { detectScreenReader, speakText, generateAriaDescription } = useScreenReader()
  const { prefersReducedMotion, applyReducedMotion, respectReducedMotion: respectMotion } = useReducedMotion()
  const { checkContrast, suggestColor } = useColorContrast()

  const initializeAccessibility = () => {
    if (announceChanges) {
      announce('Page loaded. Welcome to the homepage.')
    }
    
    if (respectReducedMotion) {
      // Apply reduced motion preferences
      document.documentElement.style.setProperty(
        '--animation-duration',
        prefersReducedMotion.value ? '0s' : '0.3s'
      )
    }
    
    detectScreenReader()
  }

  const enhanceElement = (element: HTMLElement, options: {
    label?: string
    description?: string
    role?: string
    keyboard?: boolean
  } = {}) => {
    const { label, description, role, keyboard = true } = options

    if (label) {
      element.setAttribute('aria-label', label)
    }

    if (description) {
      const descId = `desc-${Date.now()}`
      const descElement = document.createElement('span')
      descElement.id = descId
      descElement.textContent = description
      descElement.className = 'sr-only'
      element.appendChild(descElement)
      element.setAttribute('aria-describedby', descId)
    }

    if (role) {
      element.setAttribute('role', role)
    }

    if (keyboard && enableKeyboardNavigation) {
      element.tabIndex = 0
      element.addEventListener('keydown', handleKeyDown)
    }

    return element
  }

  const createSkipLink = (targetId: string, text: string = 'Skip to main content') => {
    const skipLink = document.createElement('a')
    skipLink.href = `#${targetId}`
    skipLink.textContent = text
    skipLink.className = 'skip-link'
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: #000;
      color: #fff;
      padding: 8px;
      text-decoration: none;
      z-index: 1000;
      transition: top 0.3s;
    `
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px'
    })
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px'
    })
    
    skipLink.addEventListener('click', (e) => {
      e.preventDefault()
      skipToContent(targetId)
    })

    return skipLink
  }

  const getAccessibilityReport = () => {
    return {
      screenReaderActive: detectScreenReader(),
      reducedMotionPreferred: prefersReducedMotion.value,
      focusableElementsCount: document.querySelectorAll(
        'button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])'
      ).length,
      ariaLabelsCount: document.querySelectorAll('[aria-label]').length,
      headingStructure: Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(
        (h, i) => ({ level: h.tagName, text: h.textContent?.trim(), index: i })
      ),
      timestamp: new Date().toISOString()
    }
  }

  onMounted(() => {
    initializeAccessibility()
  })

  onUnmounted(() => {
    clearLiveRegions()
  })

  return {
    // Live regions
    announce,
    clearLiveRegions,
    
    // Focus management
    focusElement,
    restoreFocus,
    trapFocusInContainer,
    skipToContent,
    
    // Keyboard navigation
    navigate,
    handleKeyDown,
    setItems,
    
    // Screen reader
    detectScreenReader,
    speakText,
    generateAriaDescription,
    
    // Reduced motion
    prefersReducedMotion,
    applyReducedMotion,
    respectReducedMotion: respectMotion,
    
    // Color contrast
    checkContrast,
    suggestColor,
    
    // Utilities
    enhanceElement,
    createSkipLink,
    initializeAccessibility,
    getAccessibilityReport
  }
}