<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <UContainer class="py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          📊 Performance Dashboard
        </h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">
          Real-time performance monitoring and analytics
        </p>
      </div>

      <!-- Status Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <UCard>
          <template #default>
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <UIcon name="i-heroicons-heart" class="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">System Health</p>
                <p class="text-2xl font-semibold" :class="healthData.status === 'healthy' ? 'text-green-600' : 'text-red-600'">
                  {{ healthData.status === 'healthy' ? 'Healthy' : 'Unhealthy' }}
                </p>
              </div>
            </div>
          </template>
        </UCard>

        <UCard>
          <template #default>
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UIcon name="i-heroicons-clock" class="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Response Time</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ healthData.performance?.responseTime || 0 }}ms
                </p>
              </div>
            </div>
          </template>
        </UCard>

        <UCard>
          <template #default>
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <UIcon name="i-heroicons-cpu-chip" class="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Memory Usage</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ memoryUsagePercent }}%
                </p>
              </div>
            </div>
          </template>
        </UCard>

        <UCard>
          <template #default>
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <UIcon name="i-heroicons-arrow-trending-up" class="w-5 h-5 text-yellow-600" />
                </div>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Uptime</p>
                <p class="text-2xl font-semibold text-gray-900 dark:text-white">
                  {{ formatUptime(healthData.uptime || 0) }}
                </p>
              </div>
            </div>
          </template>
        </UCard>
      </div>

      <!-- Performance Metrics -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Core Web Vitals -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              🎯 Core Web Vitals
            </h3>
          </template>
          <template #default>
            <div class="space-y-4">
              <!-- LCP -->
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Largest Contentful Paint (LCP)
                  </span>
                  <span class="text-sm font-semibold" :class="getLCPClass(performanceData.lcp)">
                    {{ performanceData.lcp || 0 }}ms
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="h-2 rounded-full transition-all duration-300"
                    :class="getLCPClass(performanceData.lcp, true)"
                    :style="{ width: `${Math.min((performanceData.lcp || 0) / 4000 * 100, 100)}%` }"
                  ></div>
                </div>
                <p class="text-xs text-gray-500 mt-1">Target: < 2.5s</p>
              </div>

              <!-- FID -->
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    First Input Delay (FID)
                  </span>
                  <span class="text-sm font-semibold" :class="getFIDClass(performanceData.fid)">
                    {{ performanceData.fid || 0 }}ms
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="h-2 rounded-full transition-all duration-300"
                    :class="getFIDClass(performanceData.fid, true)"
                    :style="{ width: `${Math.min((performanceData.fid || 0) / 300 * 100, 100)}%` }"
                  ></div>
                </div>
                <p class="text-xs text-gray-500 mt-1">Target: < 100ms</p>
              </div>

              <!-- CLS -->
              <div>
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cumulative Layout Shift (CLS)
                  </span>
                  <span class="text-sm font-semibold" :class="getCLSClass(performanceData.cls)">
                    {{ (performanceData.cls || 0).toFixed(3) }}
                  </span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="h-2 rounded-full transition-all duration-300"
                    :class="getCLSClass(performanceData.cls, true)"
                    :style="{ width: `${Math.min((performanceData.cls || 0) / 0.25 * 100, 100)}%` }"
                  ></div>
                </div>
                <p class="text-xs text-gray-500 mt-1">Target: < 0.1</p>
              </div>
            </div>
          </template>
        </UCard>

        <!-- Service Health -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              🔧 Service Health
            </h3>
          </template>
          <template #default>
            <div class="space-y-3">
              <div 
                v-for="(status, service) in healthData.services" 
                :key="service"
                class="flex items-center justify-between p-3 rounded-lg border"
                :class="status === 'healthy' ? 'bg-green-50 border-green-200 dark:bg-green-900/20' : 'bg-red-50 border-red-200 dark:bg-red-900/20'"
              >
                <div class="flex items-center">
                  <div 
                    class="w-3 h-3 rounded-full mr-3"
                    :class="status === 'healthy' ? 'bg-green-500' : 'bg-red-500'"
                  ></div>
                  <span class="font-medium text-gray-900 dark:text-white capitalize">
                    {{ service }}
                  </span>
                </div>
                <span 
                  class="text-sm font-semibold capitalize"
                  :class="status === 'healthy' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
                >
                  {{ status }}
                </span>
              </div>
            </div>
          </template>
        </UCard>
      </div>

      <!-- Caching Status -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- ISR Cache Status -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              ⚡ ISR Cache Status
            </h3>
          </template>
          <template #default>
            <div class="space-y-4">
              <div 
                v-for="(cache, route) in performanceData.caching?.routes" 
                :key="route"
                class="border rounded-lg p-4"
              >
                <div class="flex justify-between items-center mb-2">
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ route }}
                  </span>
                  <span class="text-sm text-gray-500">
                    TTL: {{ formatDuration(cache.ttl) }}
                  </span>
                </div>
                <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Last revalidated:</span>
                  <span>{{ formatRelativeTime(cache.lastRevalidated) }}</span>
                </div>
              </div>
            </div>
          </template>
        </UCard>

        <!-- Performance Recommendations -->
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              💡 Recommendations
            </h3>
          </template>
          <template #default>
            <div class="space-y-3">
              <div 
                v-for="recommendation in performanceData.recommendations" 
                :key="recommendation.type"
                class="border rounded-lg p-4"
                :class="getSeverityClass(recommendation.severity)"
              >
                <div class="flex items-start">
                  <div class="flex-shrink-0 mt-1">
                    <UIcon 
                      :name="getSeverityIcon(recommendation.severity)" 
                      class="w-4 h-4"
                      :class="getSeverityIconClass(recommendation.severity)"
                    />
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ recommendation.message }}
                    </p>
                    <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {{ recommendation.action }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </UCard>
      </div>

      <!-- Actions -->
      <div class="flex flex-wrap gap-4">
        <UButton 
          @click="refreshData"
          :loading="loading"
          icon="i-heroicons-arrow-path"
          color="primary"
        >
          Refresh Data
        </UButton>
        
        <UButton 
          @click="runPerformanceTest"
          :loading="performanceTestLoading"
          icon="i-heroicons-play"
          color="blue"
          variant="outline"
        >
          Run Performance Test
        </UButton>
        
        <UButton 
          @click="downloadReport"
          icon="i-heroicons-document-arrow-down"
          color="green"
          variant="outline"
        >
          Download Report
        </UButton>
        
        <UButton 
          @click="openLighthouse"
          icon="i-heroicons-light-bulb"
          color="yellow"
          variant="outline"
        >
          Lighthouse Audit
        </UButton>
      </div>

      <!-- Performance Test Modal -->
      <UModal v-model="showPerformanceTest">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">⚡ Performance Test Results</h3>
          </template>
          <template #default>
            <div v-if="performanceTestResults" class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {{ performanceTestResults.score }}/100
                  </p>
                  <p class="text-sm text-blue-600 dark:text-blue-400">Performance Score</p>
                </div>
                <div class="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p class="text-2xl font-bold text-green-600 dark:text-green-400">
                    {{ performanceTestResults.responseTime }}ms
                  </p>
                  <p class="text-sm text-green-600 dark:text-green-400">Response Time</p>
                </div>
              </div>
              
              <div class="prose prose-sm dark:prose-invert max-w-none">
                <h4>Test Summary</h4>
                <ul>
                  <li v-for="metric in performanceTestResults.metrics" :key="metric.name">
                    <strong>{{ metric.name }}:</strong> {{ metric.value }} {{ metric.unit }}
                  </li>
                </ul>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-blue-500 mx-auto" />
              <p class="text-gray-600 dark:text-gray-400 mt-2">Running performance test...</p>
            </div>
          </template>
          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton 
                @click="showPerformanceTest = false"
                variant="outline"
              >
                Close
              </UButton>
            </div>
          </template>
        </UCard>
      </UModal>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
// Define page meta
definePageMeta({
  title: 'Performance Dashboard',
  description: 'Real-time performance monitoring and analytics dashboard',
  layout: 'default'
})

// SEO
useSEO({
  title: 'Performance Dashboard',
  description: 'Real-time performance monitoring and analytics dashboard for the application'
})

// Reactive data
const loading = ref(false)
const performanceTestLoading = ref(false)
const showPerformanceTest = ref(false)
const performanceTestResults = ref(null)

const healthData = ref({
  status: 'healthy',
  uptime: 0,
  timestamp: new Date().toISOString(),
  performance: {
    responseTime: 0,
    memoryUsage: {
      heapUsed: 0,
      heapTotal: 0
    }
  },
  services: {
    api: 'healthy',
    database: 'healthy',
    content: 'healthy',
    i18n: 'healthy'
  }
})

const performanceData = ref({
  lcp: 0,
  fid: 0,
  cls: 0,
  caching: {
    routes: {
      '/': { ttl: 300, lastRevalidated: new Date(Date.now() - 150000).toISOString() },
      '/blog': { ttl: 900, lastRevalidated: new Date(Date.now() - 450000).toISOString() },
      '/about': { ttl: 3600, lastRevalidated: new Date(Date.now() - 1800000).toISOString() }
    }
  },
  recommendations: [
    {
      type: 'caching',
      severity: 'info',
      message: 'ISR is enabled for optimal performance',
      action: 'Review ISR configuration and adjust revalidation intervals'
    },
    {
      type: 'bundle',
      severity: 'info', 
      message: 'Use bundle analyzer to identify optimization opportunities',
      action: 'Run bundle analysis to visualize composition and identify large dependencies'
    }
  ]
})

// Computed properties
const memoryUsagePercent = computed(() => {
  const { heapUsed, heapTotal } = healthData.value.performance?.memoryUsage || { heapUsed: 0, heapTotal: 1 }
  return Math.round((heapUsed / heapTotal) * 100)
})

// Methods
async function refreshData() {
  loading.value = true
  try {
    // Fetch health data
    const health = await $fetch('/api/health')
    healthData.value = health
    
    // Fetch performance data  
    const performance = await $fetch('/api/performance')
    
    // Simulate Core Web Vitals data (would come from real monitoring)
    performanceData.value = {
      ...performanceData.value,
      lcp: Math.random() * 3000 + 1000, // 1-4 seconds
      fid: Math.random() * 200 + 50, // 50-250ms
      cls: Math.random() * 0.3, // 0-0.3
      caching: performance.caching || performanceData.value.caching,
      recommendations: performance.recommendations || performanceData.value.recommendations
    }
    
    console.log('Performance data refreshed')
  } catch (error) {
    console.error('Failed to refresh data:', error)
  } finally {
    loading.value = false
  }
}

async function runPerformanceTest() {
  performanceTestLoading.value = true
  showPerformanceTest.value = true
  performanceTestResults.value = null
  
  try {
    // Simulate running a performance test
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    performanceTestResults.value = {
      score: Math.floor(Math.random() * 30) + 70, // 70-100
      responseTime: Math.floor(Math.random() * 1000) + 200, // 200-1200ms
      metrics: [
        { name: 'First Contentful Paint', value: Math.floor(Math.random() * 1000) + 500, unit: 'ms' },
        { name: 'Speed Index', value: Math.floor(Math.random() * 2000) + 1000, unit: 'ms' },
        { name: 'Time to Interactive', value: Math.floor(Math.random() * 3000) + 2000, unit: 'ms' }
      ]
    }
  } catch (error) {
    console.error('Performance test failed:', error)
  } finally {
    performanceTestLoading.value = false
  }
}

function downloadReport() {
  const report = {
    timestamp: new Date().toISOString(),
    health: healthData.value,
    performance: performanceData.value,
    summary: {
      status: healthData.value.status,
      responseTime: healthData.value.performance?.responseTime,
      memoryUsage: memoryUsagePercent.value,
      uptime: formatUptime(healthData.value.uptime)
    }
  }
  
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `performance-report-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function openLighthouse() {
  const url = window.location.origin
  window.open(`https://pagespeed.web.dev/report?url=${encodeURIComponent(url)}`, '_blank')
}

// Utility functions
function formatUptime(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes}m`
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  return `${Math.floor(seconds / 3600)}h`
}

function formatRelativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) return `${hours}h ago`
  return `${minutes}m ago`
}

function getLCPClass(value: number, isBar = false): string {
  if (isBar) {
    if (value <= 2500) return 'bg-green-500'
    if (value <= 4000) return 'bg-yellow-500'
    return 'bg-red-500'
  }
  if (value <= 2500) return 'text-green-600 dark:text-green-400'
  if (value <= 4000) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

function getFIDClass(value: number, isBar = false): string {
  if (isBar) {
    if (value <= 100) return 'bg-green-500'
    if (value <= 300) return 'bg-yellow-500'
    return 'bg-red-500'
  }
  if (value <= 100) return 'text-green-600 dark:text-green-400'
  if (value <= 300) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

function getCLSClass(value: number, isBar = false): string {
  if (isBar) {
    if (value <= 0.1) return 'bg-green-500'
    if (value <= 0.25) return 'bg-yellow-500'
    return 'bg-red-500'
  }
  if (value <= 0.1) return 'text-green-600 dark:text-green-400'
  if (value <= 0.25) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

function getSeverityClass(severity: string): string {
  switch (severity) {
    case 'critical': return 'border-red-200 bg-red-50 dark:bg-red-900/20'
    case 'warning': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20'
    case 'info': return 'border-blue-200 bg-blue-50 dark:bg-blue-900/20'
    default: return 'border-gray-200 bg-gray-50 dark:bg-gray-900/20'
  }
}

function getSeverityIcon(severity: string): string {
  switch (severity) {
    case 'critical': return 'i-heroicons-exclamation-triangle'
    case 'warning': return 'i-heroicons-exclamation-circle'
    case 'info': return 'i-heroicons-information-circle'
    default: return 'i-heroicons-chat-bubble-left-ellipsis'
  }
}

function getSeverityIconClass(severity: string): string {
  switch (severity) {
    case 'critical': return 'text-red-500'
    case 'warning': return 'text-yellow-500'
    case 'info': return 'text-blue-500'
    default: return 'text-gray-500'
  }
}

// Initialize data on mount
onMounted(() => {
  refreshData()
  
  // Set up auto-refresh every 30 seconds
  const interval = setInterval(refreshData, 30000)
  
  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>