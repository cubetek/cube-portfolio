/**
 * Performance Testing Utilities
 * 
 * This module provides utilities for testing performance characteristics:
 * - Component render performance
 * - Memory usage monitoring
 * - Bundle size analysis
 * - Network performance simulation
 * - Core Web Vitals measurement
 */

import { vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import type { Component } from 'vue'
import { flushPromises } from '../utils/testing-helpers'

// Types
export interface PerformanceMetrics {
  renderTime: number
  memoryUsage: number
  componentCount: number
  bundleSize?: number
  networkTime?: number
  cacheHitRatio?: number
}

export interface CoreWebVitals {
  LCP: number // Largest Contentful Paint
  FID: number // First Input Delay
  CLS: number // Cumulative Layout Shift
  FCP: number // First Contentful Paint
  TTFB: number // Time to First Byte
}

export interface PerformanceBenchmark {
  name: string
  iterations: number
  metrics: PerformanceMetrics[]
  average: PerformanceMetrics
  best: PerformanceMetrics
  worst: PerformanceMetrics
}

export interface MemorySnapshot {
  usedJSHeapSize: number
  totalJSHeapSize: number
  jsHeapSizeLimit: number
  timestamp: number
}

export interface NetworkCondition {
  name: string
  downloadThroughput: number // bytes/second
  uploadThroughput: number // bytes/second
  latency: number // milliseconds
  packetLoss: number // percentage
}

/**
 * Performance Measurement Utilities
 */

/**
 * Measure component rendering performance
 */
export async function measureComponentPerformance<T extends Component>(
  component: T,
  props: any = {},
  iterations: number = 10
): Promise<PerformanceBenchmark> {
  const metrics: PerformanceMetrics[] = []
  
  for (let i = 0; i < iterations; i++) {
    const startMemory = getMemoryUsage()
    const startTime = performance.now()
    
    const wrapper = mount(component, { props })
    await flushPromises()
    
    const endTime = performance.now()
    const endMemory = getMemoryUsage()
    
    const renderTime = endTime - startTime
    const memoryUsage = endMemory.usedJSHeapSize - startMemory.usedJSHeapSize
    const componentCount = countComponentInstances(wrapper)
    
    metrics.push({
      renderTime,
      memoryUsage,
      componentCount
    })
    
    wrapper.unmount()
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc()
    }
    
    // Small delay between iterations
    await new Promise(resolve => setTimeout(resolve, 10))
  }
  
  return {
    name: component.name || 'Anonymous Component',
    iterations,
    metrics,
    average: calculateAverageMetrics(metrics),
    best: findBestMetrics(metrics),
    worst: findWorstMetrics(metrics)
  }
}

/**
 * Measure function execution performance
 */
export async function measureExecutionPerformance<T>(
  fn: () => T | Promise<T>,
  name: string = 'Function',
  iterations: number = 100
): Promise<PerformanceBenchmark> {
  const metrics: PerformanceMetrics[] = []
  
  for (let i = 0; i < iterations; i++) {
    const startMemory = getMemoryUsage()
    const startTime = performance.now()
    
    await fn()
    
    const endTime = performance.now()
    const endMemory = getMemoryUsage()
    
    metrics.push({
      renderTime: endTime - startTime,
      memoryUsage: endMemory.usedJSHeapSize - startMemory.usedJSHeapSize,
      componentCount: 0
    })
    
    // Small delay between iterations
    await new Promise(resolve => setTimeout(resolve, 1))
  }
  
  return {
    name,
    iterations,
    metrics,
    average: calculateAverageMetrics(metrics),
    best: findBestMetrics(metrics),
    worst: findWorstMetrics(metrics)
  }
}

/**
 * Memory Usage Utilities
 */

/**
 * Get current memory usage
 */
export function getMemoryUsage(): MemorySnapshot {
  const memory = (performance as any).memory || {
    usedJSHeapSize: 0,
    totalJSHeapSize: 0,
    jsHeapSizeLimit: 0
  }
  
  return {
    usedJSHeapSize: memory.usedJSHeapSize,
    totalJSHeapSize: memory.totalJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
    timestamp: Date.now()
  }
}

/**
 * Monitor memory usage over time
 */
export class MemoryMonitor {
  private snapshots: MemorySnapshot[] = []
  private interval: NodeJS.Timeout | null = null
  
  start(intervalMs: number = 100): void {
    this.stop() // Stop any existing monitoring
    
    this.interval = setInterval(() => {
      this.snapshots.push(getMemoryUsage())
    }, intervalMs)
  }
  
  stop(): void {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }
  
  getSnapshots(): MemorySnapshot[] {
    return [...this.snapshots]
  }
  
  getMemoryGrowth(): number {
    if (this.snapshots.length < 2) return 0
    
    const first = this.snapshots[0]
    const last = this.snapshots[this.snapshots.length - 1]
    
    return last.usedJSHeapSize - first.usedJSHeapSize
  }
  
  getPeakMemoryUsage(): number {
    return Math.max(...this.snapshots.map(s => s.usedJSHeapSize))
  }
  
  clear(): void {
    this.snapshots = []
  }
}

/**
 * Core Web Vitals Simulation
 */

/**
 * Simulate Core Web Vitals measurement
 */
export function simulateCoreWebVitals(
  scenario: 'fast' | 'average' | 'slow' = 'average'
): CoreWebVitals {
  const scenarios = {
    fast: {
      LCP: 1200,
      FID: 50,
      CLS: 0.05,
      FCP: 800,
      TTFB: 200
    },
    average: {
      LCP: 2000,
      FID: 80,
      CLS: 0.1,
      FCP: 1200,
      TTFB: 400
    },
    slow: {
      LCP: 3500,
      FID: 150,
      CLS: 0.2,
      FCP: 2000,
      TTFB: 800
    }
  }
  
  const base = scenarios[scenario]
  
  // Add some randomization
  return {
    LCP: base.LCP + (Math.random() - 0.5) * base.LCP * 0.2,
    FID: base.FID + (Math.random() - 0.5) * base.FID * 0.3,
    CLS: base.CLS + (Math.random() - 0.5) * base.CLS * 0.4,
    FCP: base.FCP + (Math.random() - 0.5) * base.FCP * 0.2,
    TTFB: base.TTFB + (Math.random() - 0.5) * base.TTFB * 0.3
  }
}

/**
 * Validate Core Web Vitals thresholds
 */
export function validateCoreWebVitals(vitals: CoreWebVitals): {
  LCP: 'good' | 'needs-improvement' | 'poor'
  FID: 'good' | 'needs-improvement' | 'poor'
  CLS: 'good' | 'needs-improvement' | 'poor'
  overall: 'good' | 'needs-improvement' | 'poor'
} {
  const lcpRating = vitals.LCP <= 2500 ? 'good' : vitals.LCP <= 4000 ? 'needs-improvement' : 'poor'
  const fidRating = vitals.FID <= 100 ? 'good' : vitals.FID <= 300 ? 'needs-improvement' : 'poor'
  const clsRating = vitals.CLS <= 0.1 ? 'good' : vitals.CLS <= 0.25 ? 'needs-improvement' : 'poor'
  
  const ratings = [lcpRating, fidRating, clsRating]
  const overall = ratings.every(r => r === 'good') 
    ? 'good' 
    : ratings.some(r => r === 'poor') 
      ? 'poor' 
      : 'needs-improvement'
  
  return {
    LCP: lcpRating,
    FID: fidRating,
    CLS: clsRating,
    overall
  }
}

/**
 * Network Performance Utilities
 */

/**
 * Predefined network conditions
 */
export const NETWORK_CONDITIONS: Record<string, NetworkCondition> = {
  '4G': {
    name: '4G',
    downloadThroughput: 4 * 1024 * 1024, // 4 Mbps
    uploadThroughput: 3 * 1024 * 1024,   // 3 Mbps
    latency: 20,
    packetLoss: 0
  },
  '3G': {
    name: '3G',
    downloadThroughput: 1.6 * 1024 * 1024, // 1.6 Mbps
    uploadThroughput: 750 * 1024,          // 750 Kbps
    latency: 150,
    packetLoss: 0
  },
  'Slow 3G': {
    name: 'Slow 3G',
    downloadThroughput: 500 * 1024, // 500 Kbps
    uploadThroughput: 500 * 1024,   // 500 Kbps
    latency: 400,
    packetLoss: 0
  },
  'Offline': {
    name: 'Offline',
    downloadThroughput: 0,
    uploadThroughput: 0,
    latency: 0,
    packetLoss: 100
  }
}

/**
 * Simulate network delay based on conditions
 */
export async function simulateNetworkDelay(
  condition: NetworkCondition,
  dataSize: number = 1024 // bytes
): Promise<number> {
  if (condition.name === 'Offline') {
    throw new Error('Network offline')
  }
  
  const transmissionTime = (dataSize / condition.downloadThroughput) * 1000
  const totalTime = condition.latency + transmissionTime
  
  await new Promise(resolve => setTimeout(resolve, totalTime))
  
  return totalTime
}

/**
 * Mock fetch with network conditions
 */
export function createNetworkAwareFetch(condition: NetworkCondition) {
  return async (url: string, options?: RequestInit): Promise<Response> => {
    const dataSize = options?.body ? 
      new Blob([options.body as string]).size : 
      1024 // Default 1KB for request
    
    try {
      const networkTime = await simulateNetworkDelay(condition, dataSize)
      
      // Simulate response
      const responseData = { data: 'mock response', networkTime }
      const responseSize = JSON.stringify(responseData).length
      
      await simulateNetworkDelay(condition, responseSize)
      
      return new Response(JSON.stringify(responseData), {
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'application/json',
          'x-network-time': networkTime.toString()
        }
      })
    } catch (error) {
      return new Response(null, {
        status: 0,
        statusText: 'Network Error'
      })
    }
  }
}

/**
 * Bundle Size Analysis
 */

/**
 * Simulate bundle size analysis
 */
export interface BundleAnalysis {
  totalSize: number
  gzippedSize: number
  chunks: Array<{
    name: string
    size: number
    gzippedSize: number
  }>
  duplicates: string[]
  recommendations: string[]
}

export function simulateBundleAnalysis(): BundleAnalysis {
  return {
    totalSize: 245 * 1024, // 245 KB
    gzippedSize: 85 * 1024, // 85 KB
    chunks: [
      { name: 'app', size: 120 * 1024, gzippedSize: 45 * 1024 },
      { name: 'vendor', size: 80 * 1024, gzippedSize: 28 * 1024 },
      { name: 'commons', size: 45 * 1024, gzippedSize: 12 * 1024 }
    ],
    duplicates: ['lodash', 'moment'],
    recommendations: [
      'Consider code splitting for vendor chunk',
      'Remove unused dependencies',
      'Enable tree shaking'
    ]
  }
}

/**
 * Helper Functions
 */

/**
 * Count component instances in wrapper
 */
function countComponentInstances(wrapper: VueWrapper<any>): number {
  const countInstances = (component: any): number => {
    let count = 1
    
    if (component.$children) {
      component.$children.forEach((child: any) => {
        count += countInstances(child)
      })
    }
    
    return count
  }
  
  return countInstances(wrapper.vm)
}

/**
 * Calculate average metrics
 */
function calculateAverageMetrics(metrics: PerformanceMetrics[]): PerformanceMetrics {
  const sum = metrics.reduce((acc, metric) => ({
    renderTime: acc.renderTime + metric.renderTime,
    memoryUsage: acc.memoryUsage + metric.memoryUsage,
    componentCount: acc.componentCount + metric.componentCount
  }), { renderTime: 0, memoryUsage: 0, componentCount: 0 })
  
  const count = metrics.length
  
  return {
    renderTime: sum.renderTime / count,
    memoryUsage: sum.memoryUsage / count,
    componentCount: sum.componentCount / count
  }
}

/**
 * Find best performance metrics
 */
function findBestMetrics(metrics: PerformanceMetrics[]): PerformanceMetrics {
  return metrics.reduce((best, current) => ({
    renderTime: Math.min(best.renderTime, current.renderTime),
    memoryUsage: Math.min(best.memoryUsage, current.memoryUsage),
    componentCount: Math.min(best.componentCount, current.componentCount)
  }))
}

/**
 * Find worst performance metrics
 */
function findWorstMetrics(metrics: PerformanceMetrics[]): PerformanceMetrics {
  return metrics.reduce((worst, current) => ({
    renderTime: Math.max(worst.renderTime, current.renderTime),
    memoryUsage: Math.max(worst.memoryUsage, current.memoryUsage),
    componentCount: Math.max(worst.componentCount, current.componentCount)
  }))
}

/**
 * Performance Assertions
 */

/**
 * Assert performance is within acceptable bounds
 */
export function assertPerformance(
  metrics: PerformanceMetrics,
  thresholds: Partial<PerformanceMetrics>
): void {
  if (thresholds.renderTime && metrics.renderTime > thresholds.renderTime) {
    throw new Error(`Render time ${metrics.renderTime}ms exceeds threshold ${thresholds.renderTime}ms`)
  }
  
  if (thresholds.memoryUsage && metrics.memoryUsage > thresholds.memoryUsage) {
    throw new Error(`Memory usage ${metrics.memoryUsage} bytes exceeds threshold ${thresholds.memoryUsage} bytes`)
  }
  
  if (thresholds.componentCount && metrics.componentCount > thresholds.componentCount) {
    throw new Error(`Component count ${metrics.componentCount} exceeds threshold ${thresholds.componentCount}`)
  }
}

/**
 * Performance Test Reporter
 */
export class PerformanceReporter {
  private benchmarks: PerformanceBenchmark[] = []
  
  addBenchmark(benchmark: PerformanceBenchmark): void {
    this.benchmarks.push(benchmark)
  }
  
  generateReport(): string {
    let report = '# Performance Test Report\n\n'
    
    this.benchmarks.forEach(benchmark => {
      report += `## ${benchmark.name}\n`
      report += `- Iterations: ${benchmark.iterations}\n`
      report += `- Average Render Time: ${benchmark.average.renderTime.toFixed(2)}ms\n`
      report += `- Average Memory Usage: ${(benchmark.average.memoryUsage / 1024).toFixed(2)}KB\n`
      report += `- Best Render Time: ${benchmark.best.renderTime.toFixed(2)}ms\n`
      report += `- Worst Render Time: ${benchmark.worst.renderTime.toFixed(2)}ms\n\n`
    })
    
    return report
  }
  
  clear(): void {
    this.benchmarks = []
  }
}