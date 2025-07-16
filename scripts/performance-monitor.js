#!/usr/bin/env node

/**
 * Performance Monitoring Script
 * Monitors application performance and generates alerts if thresholds are exceeded
 */

const https = require('https')
const http = require('http')
const fs = require('fs')
const path = require('path')

// Configuration
const config = {
  baseUrl: process.env.MONITOR_URL || 'http://localhost:3000',
  endpoints: [
    '/',
    '/en',
    '/about',
    '/en/about',
    '/blog',
    '/en/blog',
    '/contact',
    '/en/contact',
    '/api/health',
    '/api/performance'
  ],
  thresholds: {
    responseTime: 2000, // 2 seconds
    healthCheck: 5000,  // 5 seconds for health endpoint
    availability: 99.5  // 99.5% uptime
  },
  intervals: {
    monitor: 60000,     // Check every minute
    report: 300000      // Generate report every 5 minutes
  },
  alerting: {
    webhook: process.env.ALERT_WEBHOOK,
    email: process.env.ALERT_EMAIL,
    slack: process.env.SLACK_WEBHOOK
  }
}

// Performance data storage
let performanceData = {
  checks: [],
  lastReport: Date.now(),
  stats: {
    totalChecks: 0,
    failedChecks: 0,
    averageResponseTime: 0,
    uptime: 0
  }
}

// Load existing data if available
const dataFile = path.join(__dirname, '../.nuxt/performance-data.json')
if (fs.existsSync(dataFile)) {
  try {
    performanceData = JSON.parse(fs.readFileSync(dataFile, 'utf8'))
  } catch (error) {
    console.warn('Failed to load existing performance data:', error.message)
  }
}

/**
 * Check endpoint performance
 */
async function checkEndpoint(endpoint) {
  const startTime = Date.now()
  const url = config.baseUrl + endpoint
  
  return new Promise((resolve) => {
    const request = (url.startsWith('https') ? https : http).get(url, {
      timeout: config.thresholds.responseTime + 1000,
      headers: {
        'User-Agent': 'Performance-Monitor/1.0'
      }
    }, (response) => {
      const endTime = Date.now()
      const responseTime = endTime - startTime
      
      // Collect response data
      let data = ''
      response.on('data', chunk => data += chunk)
      response.on('end', () => {
        resolve({
          endpoint,
          status: response.statusCode,
          responseTime,
          success: response.statusCode >= 200 && response.statusCode < 400,
          timestamp: new Date().toISOString(),
          size: data.length,
          headers: response.headers
        })
      })
    })
    
    request.on('timeout', () => {
      request.destroy()
      resolve({
        endpoint,
        status: 0,
        responseTime: config.thresholds.responseTime + 1000,
        success: false,
        timestamp: new Date().toISOString(),
        error: 'timeout'
      })
    })
    
    request.on('error', (error) => {
      resolve({
        endpoint,
        status: 0,
        responseTime: Date.now() - startTime,
        success: false,
        timestamp: new Date().toISOString(),
        error: error.message
      })
    })
  })
}

/**
 * Run performance check on all endpoints
 */
async function runPerformanceCheck() {
  console.log(`🔍 Running performance check at ${new Date().toISOString()}`)
  
  const results = []
  
  for (const endpoint of config.endpoints) {
    const result = await checkEndpoint(endpoint)
    results.push(result)
    
    // Log results
    const status = result.success ? '✅' : '❌'
    const time = result.responseTime + 'ms'
    console.log(`${status} ${endpoint} - ${result.status} (${time})`)
    
    // Check thresholds and alert if necessary
    await checkThresholds(result)
  }
  
  // Store results
  performanceData.checks.push({
    timestamp: new Date().toISOString(),
    results
  })
  
  // Update statistics
  updateStatistics(results)
  
  // Keep only last 1000 checks
  if (performanceData.checks.length > 1000) {
    performanceData.checks = performanceData.checks.slice(-1000)
  }
  
  // Save data
  savePerformanceData()
  
  // Generate report if needed
  if (Date.now() - performanceData.lastReport > config.intervals.report) {
    await generatePerformanceReport()
    performanceData.lastReport = Date.now()
  }
}

/**
 * Check performance thresholds and send alerts
 */
async function checkThresholds(result) {
  const alerts = []
  
  // Response time check
  const threshold = result.endpoint === '/api/health' ? 
    config.thresholds.healthCheck : config.thresholds.responseTime
    
  if (result.responseTime > threshold) {
    alerts.push({
      type: 'response_time',
      severity: 'warning',
      message: `High response time detected for ${result.endpoint}: ${result.responseTime}ms (threshold: ${threshold}ms)`,
      endpoint: result.endpoint,
      value: result.responseTime,
      threshold
    })
  }
  
  // Availability check
  if (!result.success) {
    alerts.push({
      type: 'availability',
      severity: result.status === 0 ? 'critical' : 'error',
      message: `Endpoint ${result.endpoint} is not responding properly (status: ${result.status || 'timeout'})`,
      endpoint: result.endpoint,
      status: result.status,
      error: result.error
    })
  }
  
  // Send alerts
  for (const alert of alerts) {
    await sendAlert(alert)
  }
}

/**
 * Update performance statistics
 */
function updateStatistics(results) {
  performanceData.stats.totalChecks += results.length
  
  const failedCount = results.filter(r => !r.success).length
  performanceData.stats.failedChecks += failedCount
  
  const responseTimes = results.filter(r => r.success).map(r => r.responseTime)
  if (responseTimes.length > 0) {
    const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    performanceData.stats.averageResponseTime = 
      (performanceData.stats.averageResponseTime + avgResponseTime) / 2
  }
  
  const uptime = ((performanceData.stats.totalChecks - performanceData.stats.failedChecks) / 
    performanceData.stats.totalChecks) * 100
  performanceData.stats.uptime = uptime
}

/**
 * Send alert notification
 */
async function sendAlert(alert) {
  console.log(`🚨 ${alert.severity.toUpperCase()}: ${alert.message}`)
  
  // Webhook notification
  if (config.alerting.webhook) {
    try {
      await sendWebhookAlert(config.alerting.webhook, alert)
    } catch (error) {
      console.error('Failed to send webhook alert:', error.message)
    }
  }
  
  // Slack notification
  if (config.alerting.slack) {
    try {
      await sendSlackAlert(config.alerting.slack, alert)
    } catch (error) {
      console.error('Failed to send Slack alert:', error.message)
    }
  }
}

/**
 * Send webhook alert
 */
async function sendWebhookAlert(webhookUrl, alert) {
  const data = JSON.stringify({
    alert,
    timestamp: new Date().toISOString(),
    source: 'performance-monitor'
  })
  
  return new Promise((resolve, reject) => {
    const request = https.request(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }, (response) => {
      resolve(response.statusCode)
    })
    
    request.on('error', reject)
    request.write(data)
    request.end()
  })
}

/**
 * Send Slack alert
 */
async function sendSlackAlert(slackWebhook, alert) {
  const severityColors = {
    info: '#36a64f',
    warning: '#ffb347',
    error: '#ff6b6b',
    critical: '#dc3545'
  }
  
  const data = JSON.stringify({
    attachments: [{
      color: severityColors[alert.severity] || '#666666',
      title: `Performance Alert - ${alert.type}`,
      text: alert.message,
      fields: [
        {
          title: 'Endpoint',
          value: alert.endpoint,
          short: true
        },
        {
          title: 'Severity',
          value: alert.severity.toUpperCase(),
          short: true
        },
        {
          title: 'Time',
          value: new Date().toISOString(),
          short: true
        }
      ]
    }]
  })
  
  return new Promise((resolve, reject) => {
    const request = https.request(slackWebhook, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }, (response) => {
      resolve(response.statusCode)
    })
    
    request.on('error', reject)
    request.write(data)
    request.end()
  })
}

/**
 * Generate performance report
 */
async function generatePerformanceReport() {
  console.log('📊 Generating performance report...')
  
  const recentChecks = performanceData.checks.slice(-20)
  const report = {
    timestamp: new Date().toISOString(),
    period: {
      start: recentChecks[0]?.timestamp || new Date().toISOString(),
      end: new Date().toISOString(),
      duration: config.intervals.report
    },
    statistics: { ...performanceData.stats },
    summary: generateSummary(recentChecks),
    recommendations: generateRecommendations()
  }
  
  // Save report
  const reportFile = path.join(__dirname, '../.nuxt/performance-report.json')
  fs.writeFileSync(reportFile, JSON.stringify(report, null, 2))
  
  console.log('📊 Performance report saved to:', reportFile)
  return report
}

/**
 * Generate performance summary
 */
function generateSummary(checks) {
  if (checks.length === 0) return null
  
  const allResults = checks.flatMap(check => check.results)
  const successfulResults = allResults.filter(r => r.success)
  
  return {
    totalRequests: allResults.length,
    successfulRequests: successfulResults.length,
    failedRequests: allResults.length - successfulResults.length,
    averageResponseTime: successfulResults.length > 0 ?
      successfulResults.reduce((sum, r) => sum + r.responseTime, 0) / successfulResults.length : 0,
    uptime: (successfulResults.length / allResults.length) * 100,
    slowestEndpoint: allResults.reduce((slowest, current) => 
      current.responseTime > slowest.responseTime ? current : slowest
    ),
    fastestEndpoint: successfulResults.reduce((fastest, current) => 
      current.responseTime < fastest.responseTime ? current : fastest
    )
  }
}

/**
 * Generate performance recommendations
 */
function generateRecommendations() {
  const recommendations = []
  
  if (performanceData.stats.averageResponseTime > 1000) {
    recommendations.push({
      type: 'performance',
      priority: 'high',
      message: 'Average response time is high. Consider optimizing server performance or adding caching.',
      action: 'Review ISR configuration and optimize slow endpoints'
    })
  }
  
  if (performanceData.stats.uptime < 99) {
    recommendations.push({
      type: 'reliability',
      priority: 'critical',
      message: 'Uptime is below 99%. Investigate service reliability issues.',
      action: 'Check server logs and implement health monitoring'
    })
  }
  
  recommendations.push({
    type: 'monitoring',
    priority: 'medium',
    message: 'Continue monitoring performance metrics and adjust thresholds as needed.',
    action: 'Review performance trends and optimize based on usage patterns'
  })
  
  return recommendations
}

/**
 * Save performance data to file
 */
function savePerformanceData() {
  try {
    const dir = path.dirname(dataFile)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(dataFile, JSON.stringify(performanceData, null, 2))
  } catch (error) {
    console.error('Failed to save performance data:', error.message)
  }
}

/**
 * Main monitoring loop
 */
async function startMonitoring() {
  console.log('🚀 Starting performance monitoring...')
  console.log(`Base URL: ${config.baseUrl}`)
  console.log(`Monitoring ${config.endpoints.length} endpoints`)
  console.log(`Check interval: ${config.intervals.monitor / 1000}s`)
  console.log(`Report interval: ${config.intervals.report / 1000}s`)
  
  // Run initial check
  await runPerformanceCheck()
  
  // Set up monitoring interval
  setInterval(runPerformanceCheck, config.intervals.monitor)
  
  console.log('📊 Performance monitoring is running...')
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping performance monitoring...')
  savePerformanceData()
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n🛑 Stopping performance monitoring...')
  savePerformanceData()
  process.exit(0)
})

// Start monitoring if this script is run directly
if (require.main === module) {
  startMonitoring().catch(console.error)
}

module.exports = {
  startMonitoring,
  runPerformanceCheck,
  generatePerformanceReport,
  config
}