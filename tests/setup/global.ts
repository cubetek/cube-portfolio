/**
 * Global Test Setup
 * 
 * This file is run before all tests and sets up the global testing environment.
 * It includes mocks, global utilities, and configuration needed across all tests.
 */

import { vi } from 'vitest'

// Mock Nuxt runtime globals
global.console = {
  ...console,
  // Suppress console.log in tests unless needed for debugging
  log: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
  warn: console.warn,
  error: console.error
}

// Mock window and navigator for SSR testing
Object.defineProperty(window, 'navigator', {
  value: {
    userAgent: 'vitest',
    language: 'en-US',
    languages: ['en-US', 'en']
  },
  writable: true
})

Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
    protocol: 'http:',
    hostname: 'localhost',
    port: '3000',
    pathname: '/',
    search: '',
    hash: ''
  },
  writable: true
})

// Mock localStorage and sessionStorage
const createStorageMock = () => {
  const storage = new Map()
  return {
    getItem: vi.fn((key: string) => storage.get(key) || null),
    setItem: vi.fn((key: string, value: string) => storage.set(key, value)),
    removeItem: vi.fn((key: string) => storage.delete(key)),
    clear: vi.fn(() => storage.clear()),
    length: 0,
    key: vi.fn()
  }
}

Object.defineProperty(window, 'localStorage', {
  value: createStorageMock()
})

Object.defineProperty(window, 'sessionStorage', {
  value: createStorageMock()
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})

// Mock fetch
global.fetch = vi.fn()

// Mock Image constructor for image loading tests
global.Image = class {
  onload?: () => void
  onerror?: () => void
  src?: string
  
  constructor() {
    setTimeout(() => {
      if (this.onload) this.onload()
    }, 100)
  }
} as any

// Set up timezone for consistent date testing
process.env.TZ = 'UTC'

// Mock Nuxt environment variables
process.env.NODE_ENV = 'test'
process.env.NUXT_ENV_ENVIRONMENT = 'test'
process.env.NUXT_PUBLIC_SITE_URL = 'http://localhost:3000'
process.env.NUXT_PUBLIC_SITE_NAME = 'Test Site'

// Performance mark for testing
if (!global.performance) {
  global.performance = {
    now: vi.fn(() => Date.now()),
    mark: vi.fn(),
    measure: vi.fn(),
    getEntriesByName: vi.fn(() => []),
    getEntriesByType: vi.fn(() => [])
  } as any
}