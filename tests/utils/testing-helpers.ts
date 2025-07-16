/**
 * Shared Testing Utilities
 * 
 * This module provides reusable testing utilities and helpers for:
 * - Component testing
 * - Theme testing
 * - SEO validation
 * - Performance measurement
 * - Common test scenarios
 */

import { vi, expect, type MockedFunction } from 'vitest'
import { mount, VueWrapper, type ComponentMountingOptions } from '@vue/test-utils'
import { ref, reactive, nextTick, type Ref, type Component } from 'vue'

// Types
export type MockFunction<T extends (...args: any[]) => any> = MockedFunction<T>

export interface TestComponent {
  name?: string
  template?: string
  props?: Record<string, any>
  emits?: string[]
  setup?: () => any
}

export interface TestTheme {
  name: string
  colors: Record<string, string>
  mode: 'light' | 'dark'
}

export interface TestPerformanceMetrics {
  duration: number
  memoryUsage?: number
  renderTime?: number
  componentCount?: number
}

export interface TestSEOData {
  title?: string
  description?: string
  keywords?: string[]
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  canonical?: string
  hreflang?: Record<string, string>
}

/**
 * Component Testing Utilities
 */

/**
 * Enhanced component mounting with common defaults
 */
export function mountComponent<T extends Component>(
  component: T,
  options: ComponentMountingOptions<T> = {}
): VueWrapper<any> {
  const defaultOptions: ComponentMountingOptions<T> = {
    global: {
      mocks: {
        $t: (key: string) => key,
        $route: {
          path: '/',
          params: {},
          query: {},
          meta: {}
        },
        $router: {
          push: vi.fn(),
          replace: vi.fn(),
          go: vi.fn(),
          back: vi.fn(),
          forward: vi.fn()
        }
      },
      stubs: {
        NuxtLink: true,
        NuxtImg: true,
        ClientOnly: true
      }
    }
  }

  return mount(component, {
    ...defaultOptions,
    ...options,
    global: {
      ...defaultOptions.global,
      ...options.global,
      mocks: {
        ...defaultOptions.global?.mocks,
        ...options.global?.mocks
      },
      stubs: {
        ...defaultOptions.global?.stubs,
        ...options.global?.stubs
      }
    }
  })
}

/**
 * Wait for all Vue updates and DOM changes
 */
export async function flushPromises(): Promise<void> {
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 0))
}

/**
 * Wait for a specific number of Vue ticks
 */
export async function waitForTicks(count: number = 1): Promise<void> {
  for (let i = 0; i < count; i++) {
    await nextTick()
  }
}

/**
 * Wait for an element to appear in the DOM
 */
export async function waitForElement(
  wrapper: VueWrapper<any>,
  selector: string,
  timeout: number = 1000
): Promise<void> {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    await flushPromises()
    if (wrapper.find(selector).exists()) {
      return
    }
    await new Promise(resolve => setTimeout(resolve, 10))
  }
  throw new Error(`Element "${selector}" not found within ${timeout}ms`)
}

/**
 * Simulate user interaction with proper event handling
 */
export async function simulateUserInteraction(
  wrapper: VueWrapper<any>,
  action: 'click' | 'input' | 'keydown' | 'keyup',
  selector?: string,
  value?: any
): Promise<void> {
  const element = selector ? wrapper.find(selector) : wrapper
  
  switch (action) {
    case 'click':
      await element.trigger('click')
      break
    case 'input':
      await element.setValue(value)
      break
    case 'keydown':
    case 'keyup':
      await element.trigger(action, { key: value })
      break
  }
  
  await flushPromises()
}

/**
 * Theme Testing Utilities
 */

/**
 * Create a mock theme configuration
 */
export function createMockTheme(overrides: Partial<TestTheme> = {}): TestTheme {
  return {
    name: 'test-theme',
    mode: 'light',
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      success: '#28a745',
      danger: '#dc3545',
      warning: '#ffc107',
      info: '#17a2b8',
      light: '#f8f9fa',
      dark: '#343a40'
    },
    ...overrides
  }
}

/**
 * Test theme switching functionality
 */
export async function testThemeSwitching(
  themeRef: Ref<string>,
  themes: string[],
  validator: (theme: string) => boolean | Promise<boolean>
): Promise<void> {
  for (const theme of themes) {
    themeRef.value = theme
    await flushPromises()
    
    const isValid = await validator(theme)
    expect(isValid).toBe(true)
  }
}

/**
 * Performance Testing Utilities
 */

/**
 * Measure component render performance
 */
export async function measureRenderPerformance<T extends Component>(
  component: T,
  options: ComponentMountingOptions<T> = {},
  iterations: number = 10
): Promise<TestPerformanceMetrics> {
  const durations: number[] = []
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    const wrapper = mountComponent(component, options)
    await flushPromises()
    const end = performance.now()
    
    durations.push(end - start)
    wrapper.unmount()
  }
  
  const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length
  
  return {
    duration: avgDuration,
    renderTime: avgDuration
  }
}

/**
 * Measure function execution performance
 */
export async function measureExecutionTime<T>(
  fn: () => T | Promise<T>,
  iterations: number = 100
): Promise<TestPerformanceMetrics> {
  const durations: number[] = []
  
  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    await fn()
    const end = performance.now()
    durations.push(end - start)
  }
  
  const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length
  
  return {
    duration: avgDuration
  }
}

/**
 * SEO Testing Utilities
 */

/**
 * Validate SEO meta tags in document head
 */
export function validateSEOTags(expectedData: TestSEOData): void {
  const { title, description, keywords, ogTitle, ogDescription, ogImage, canonical } = expectedData
  
  if (title) {
    expect(document.title).toBe(title)
  }
  
  if (description) {
    const metaDescription = document.querySelector('meta[name="description"]')
    expect(metaDescription?.getAttribute('content')).toBe(description)
  }
  
  if (keywords) {
    const metaKeywords = document.querySelector('meta[name="keywords"]')
    expect(metaKeywords?.getAttribute('content')).toBe(keywords.join(', '))
  }
  
  if (ogTitle) {
    const ogTitleMeta = document.querySelector('meta[property="og:title"]')
    expect(ogTitleMeta?.getAttribute('content')).toBe(ogTitle)
  }
  
  if (ogDescription) {
    const ogDescMeta = document.querySelector('meta[property="og:description"]')
    expect(ogDescMeta?.getAttribute('content')).toBe(ogDescription)
  }
  
  if (ogImage) {
    const ogImageMeta = document.querySelector('meta[property="og:image"]')
    expect(ogImageMeta?.getAttribute('content')).toBe(ogImage)
  }
  
  if (canonical) {
    const canonicalLink = document.querySelector('link[rel="canonical"]')
    expect(canonicalLink?.getAttribute('href')).toBe(canonical)
  }
}

/**
 * Mock Utilities
 */

/**
 * Create a mock reactive object with Vue reactivity
 */
export function createMockReactive<T extends Record<string, any>>(data: T): T {
  return reactive(data)
}

/**
 * Create a mock ref with initial value
 */
export function createMockRef<T>(initialValue: T): Ref<T> {
  return ref(initialValue)
}

/**
 * Create mock composable return value
 */
export function createMockComposable<T>(returnValue: T): () => T {
  return vi.fn(() => returnValue)
}

/**
 * Browser Testing Utilities
 */

/**
 * Mock viewport dimensions for responsive testing
 */
export function mockViewport(width: number, height: number): void {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width
  })
  
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height
  })
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'))
}

/**
 * Mock media query for testing responsive features
 */
export function mockMediaQuery(query: string, matches: boolean): void {
  const mediaQuery = {
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }
  
  window.matchMedia = vi.fn(() => mediaQuery)
}

/**
 * Accessibility Testing Utilities
 */

/**
 * Check if element has proper ARIA attributes
 */
export function validateARIA(
  wrapper: VueWrapper<any>,
  selector: string,
  expectedAttributes: Record<string, string>
): void {
  const element = wrapper.find(selector)
  expect(element.exists()).toBe(true)
  
  Object.entries(expectedAttributes).forEach(([attr, value]) => {
    expect(element.attributes(attr)).toBe(value)
  })
}

/**
 * Check keyboard navigation functionality
 */
export async function testKeyboardNavigation(
  wrapper: VueWrapper<any>,
  selector: string,
  keys: string[]
): Promise<void> {
  const element = wrapper.find(selector)
  
  for (const key of keys) {
    await element.trigger('keydown', { key })
    await flushPromises()
  }
}

/**
 * Data Testing Utilities
 */

/**
 * Create test data with multilingual support
 */
export function createMultilingualTestData<T>(
  data: Record<string, T>
): Record<string, T> {
  return {
    en: data.en || data.default,
    ar: data.ar || data.default,
    ...data
  } as Record<string, T>
}

/**
 * Validation Utilities
 */

/**
 * Check if all required props are provided
 */
export function validateRequiredProps(
  wrapper: VueWrapper<any>,
  requiredProps: string[]
): void {
  const component = wrapper.vm
  requiredProps.forEach(prop => {
    expect(component.$props).toHaveProperty(prop)
    expect(component.$props[prop]).toBeDefined()
  })
}

/**
 * Check if component emits expected events
 */
export function validateEmittedEvents(
  wrapper: VueWrapper<any>,
  expectedEvents: string[]
): void {
  expectedEvents.forEach(eventName => {
    expect(wrapper.emitted()).toHaveProperty(eventName)
  })
}