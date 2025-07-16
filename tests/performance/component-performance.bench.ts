/**
 * Component Performance Benchmarks
 * 
 * Benchmarks for testing component rendering performance under different scenarios:
 * - Different data sizes
 * - Language switching performance
 * - Theme switching performance
 * - Complex component interactions
 */

import { bench, describe } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref, computed } from 'vue'
import { 
  measureComponentPerformance,
  MemoryMonitor,
  assertPerformance,
  type PerformanceMetrics
} from './performance-utils'
import { createMockPersonalData, createMockTheme } from '../utils/mock-factories'
import { createMockI18nContext } from '../utils/multilingual-helpers'
import { flushPromises } from '../utils/testing-helpers'

// Mock components for testing
const SimpleComponent = defineComponent({
  name: 'SimpleComponent',
  props: {
    title: String,
    content: String
  },
  template: `
    <div class="simple-component">
      <h1>{{ title }}</h1>
      <p>{{ content }}</p>
    </div>
  `
})

const ComplexComponent = defineComponent({
  name: 'ComplexComponent',
  props: {
    data: Object,
    locale: String,
    theme: String
  },
  setup(props) {
    const processedData = computed(() => {
      if (!props.data) return []
      
      // Simulate complex data processing
      return Object.entries(props.data).map(([key, value]) => ({
        id: key,
        value: typeof value === 'object' ? JSON.stringify(value) : value,
        processed: true
      }))
    })
    
    const themeClasses = computed(() => {
      return [
        `theme-${props.theme}`,
        `locale-${props.locale}`,
        props.locale === 'ar' ? 'rtl' : 'ltr'
      ]
    })
    
    return {
      processedData,
      themeClasses
    }
  },
  template: `
    <div :class="themeClasses" class="complex-component">
      <div v-for="item in processedData" :key="item.id" class="data-item">
        <span>{{ item.id }}: {{ item.value }}</span>
      </div>
    </div>
  `
})

const ListComponent = defineComponent({
  name: 'ListComponent',
  props: {
    items: Array,
    itemsPerPage: {
      type: Number,
      default: 50
    }
  },
  setup(props) {
    const currentPage = ref(1)
    
    const paginatedItems = computed(() => {
      const start = (currentPage.value - 1) * props.itemsPerPage
      const end = start + props.itemsPerPage
      return props.items?.slice(start, end) || []
    })
    
    const totalPages = computed(() => {
      return Math.ceil((props.items?.length || 0) / props.itemsPerPage)
    })
    
    return {
      currentPage,
      paginatedItems,
      totalPages
    }
  },
  template: `
    <div class="list-component">
      <div class="list-items">
        <div v-for="item in paginatedItems" :key="item.id" class="list-item">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <span class="meta">{{ item.date }}</span>
        </div>
      </div>
      <div class="pagination">
        <button 
          v-for="page in totalPages" 
          :key="page"
          @click="currentPage = page"
          :class="{ active: currentPage === page }"
        >
          {{ page }}
        </button>
      </div>
    </div>
  `
})

describe('Component Performance Benchmarks', () => {
  describe('Simple Component Rendering', () => {
    bench('SimpleComponent - Single render', async () => {
      const wrapper = mount(SimpleComponent, {
        props: {
          title: 'Test Title',
          content: 'Test content'
        }
      })
      
      await flushPromises()
      wrapper.unmount()
    })

    bench('SimpleComponent - Multiple renders', async () => {
      for (let i = 0; i < 10; i++) {
        const wrapper = mount(SimpleComponent, {
          props: {
            title: `Test Title ${i}`,
            content: `Test content ${i}`
          }
        })
        
        await flushPromises()
        wrapper.unmount()
      }
    })

    bench('SimpleComponent - With props updates', async () => {
      const wrapper = mount(SimpleComponent, {
        props: {
          title: 'Initial Title',
          content: 'Initial content'
        }
      })
      
      // Update props multiple times
      for (let i = 0; i < 5; i++) {
        await wrapper.setProps({
          title: `Updated Title ${i}`,
          content: `Updated content ${i}`
        })
        await flushPromises()
      }
      
      wrapper.unmount()
    })
  })

  describe('Complex Component Rendering', () => {
    const smallData = createMockPersonalData('en')
    const largeData = {
      ...createMockPersonalData('en'),
      projects: Array.from({ length: 100 }, (_, i) => ({
        id: i,
        title: `Project ${i}`,
        description: `Description for project ${i}`,
        technologies: ['Vue.js', 'TypeScript', 'Tailwind']
      })),
      skills: Array.from({ length: 50 }, (_, i) => ({
        id: i,
        name: `Skill ${i}`,
        level: 'intermediate',
        years: Math.floor(Math.random() * 5) + 1
      }))
    }

    bench('ComplexComponent - Small dataset', async () => {
      const wrapper = mount(ComplexComponent, {
        props: {
          data: smallData,
          locale: 'en',
          theme: 'light'
        }
      })
      
      await flushPromises()
      wrapper.unmount()
    })

    bench('ComplexComponent - Large dataset', async () => {
      const wrapper = mount(ComplexComponent, {
        props: {
          data: largeData,
          locale: 'en',
          theme: 'light'
        }
      })
      
      await flushPromises()
      wrapper.unmount()
    })

    bench('ComplexComponent - Language switching', async () => {
      const wrapper = mount(ComplexComponent, {
        props: {
          data: smallData,
          locale: 'en',
          theme: 'light'
        }
      })
      
      // Switch between languages
      for (const locale of ['en', 'ar', 'en']) {
        await wrapper.setProps({ locale })
        await flushPromises()
      }
      
      wrapper.unmount()
    })

    bench('ComplexComponent - Theme switching', async () => {
      const wrapper = mount(ComplexComponent, {
        props: {
          data: smallData,
          locale: 'en',
          theme: 'light'
        }
      })
      
      // Switch between themes
      for (const theme of ['light', 'dark', 'modern', 'light']) {
        await wrapper.setProps({ theme })
        await flushPromises()
      }
      
      wrapper.unmount()
    })
  })

  describe('List Component Performance', () => {
    const smallList = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      title: `Item ${i}`,
      description: `Description for item ${i}`,
      date: new Date().toISOString()
    }))

    const mediumList = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      title: `Item ${i}`,
      description: `Description for item ${i}`,
      date: new Date().toISOString()
    }))

    const largeList = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      title: `Item ${i}`,
      description: `Description for item ${i}`,
      date: new Date().toISOString()
    }))

    bench('ListComponent - Small list (10 items)', async () => {
      const wrapper = mount(ListComponent, {
        props: {
          items: smallList,
          itemsPerPage: 10
        }
      })
      
      await flushPromises()
      wrapper.unmount()
    })

    bench('ListComponent - Medium list (100 items)', async () => {
      const wrapper = mount(ListComponent, {
        props: {
          items: mediumList,
          itemsPerPage: 20
        }
      })
      
      await flushPromises()
      wrapper.unmount()
    })

    bench('ListComponent - Large list (1000 items)', async () => {
      const wrapper = mount(ListComponent, {
        props: {
          items: largeList,
          itemsPerPage: 50
        }
      })
      
      await flushPromises()
      wrapper.unmount()
    })

    bench('ListComponent - Pagination navigation', async () => {
      const wrapper = mount(ListComponent, {
        props: {
          items: mediumList,
          itemsPerPage: 10
        }
      })
      
      // Navigate through pages
      for (let page = 1; page <= 5; page++) {
        wrapper.vm.currentPage = page
        await flushPromises()
      }
      
      wrapper.unmount()
    })
  })

  describe('Memory Performance', () => {
    bench('Memory usage - Component creation and destruction', async () => {
      const monitor = new MemoryMonitor()
      monitor.start(50)
      
      // Create and destroy multiple components
      for (let i = 0; i < 20; i++) {
        const wrapper = mount(ComplexComponent, {
          props: {
            data: createMockPersonalData('en'),
            locale: 'en',
            theme: 'light'
          }
        })
        
        await flushPromises()
        wrapper.unmount()
        
        // Force garbage collection if available
        if (global.gc) {
          global.gc()
        }
      }
      
      monitor.stop()
      
      const memoryGrowth = monitor.getMemoryGrowth()
      const peakUsage = monitor.getPeakMemoryUsage()
      
      // Assert reasonable memory usage
      console.log(`Memory growth: ${memoryGrowth / 1024}KB, Peak: ${peakUsage / 1024}KB`)
    })
  })

  describe('Real-world Performance Scenarios', () => {
    bench('Multilingual website simulation', async () => {
      const i18nContext = createMockI18nContext('en')
      const personalData = createMockPersonalData('en')
      
      // Simulate full page render with language switching
      const wrapper = mount(ComplexComponent, {
        props: {
          data: personalData,
          locale: i18nContext.currentLocale.value,
          theme: 'light'
        }
      })
      
      // Switch language multiple times
      for (const locale of ['ar', 'en', 'ar']) {
        await i18nContext.switchLanguage(locale)
        await wrapper.setProps({ 
          locale,
          data: createMockPersonalData(locale)
        })
        await flushPromises()
      }
      
      wrapper.unmount()
    })

    bench('Theme switching with large dataset', async () => {
      const largeData = {
        ...createMockPersonalData('en'),
        projects: Array.from({ length: 50 }, (_, i) => ({
          id: i,
          title: `Project ${i}`,
          description: `Description for project ${i}`
        }))
      }
      
      const wrapper = mount(ComplexComponent, {
        props: {
          data: largeData,
          locale: 'en',
          theme: 'light'
        }
      })
      
      // Switch themes rapidly
      const themes = ['light', 'dark', 'modern', 'minimal', 'ocean']
      for (const theme of themes) {
        await wrapper.setProps({ theme })
        await flushPromises()
      }
      
      wrapper.unmount()
    })
  })

  describe('Performance Regression Tests', () => {
    bench('Performance baseline - SimpleComponent', async () => {
      const benchmark = await measureComponentPerformance(
        SimpleComponent,
        { title: 'Test', content: 'Content' },
        5
      )
      
      // Assert performance thresholds
      assertPerformance(benchmark.average, {
        renderTime: 50, // 50ms max
        memoryUsage: 1024 * 1024 // 1MB max
      })
    })

    bench('Performance baseline - ComplexComponent', async () => {
      const benchmark = await measureComponentPerformance(
        ComplexComponent,
        {
          data: createMockPersonalData('en'),
          locale: 'en',
          theme: 'light'
        },
        5
      )
      
      // Assert performance thresholds
      assertPerformance(benchmark.average, {
        renderTime: 100, // 100ms max
        memoryUsage: 2 * 1024 * 1024 // 2MB max
      })
    })
  })
})