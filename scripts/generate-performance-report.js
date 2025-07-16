#!/usr/bin/env node

/**
 * Performance Report Generator
 * Generates comprehensive performance reports with charts and insights
 */

const fs = require('fs')
const path = require('path')

// Configuration
const config = {
  dataFile: path.join(__dirname, '../.nuxt/performance-data.json'),
  reportDir: path.join(__dirname, '../.nuxt/reports'),
  outputFormats: ['json', 'html', 'csv'],
  reportTypes: ['summary', 'detailed', 'trends'],
  thresholds: {
    responseTime: {
      excellent: 200,
      good: 500,
      acceptable: 1000,
      poor: 2000
    },
    uptime: {
      excellent: 99.9,
      good: 99.5,
      acceptable: 99.0,
      poor: 95.0
    }
  }
}

/**
 * Load performance data
 */
function loadPerformanceData() {
  try {
    if (!fs.existsSync(config.dataFile)) {
      throw new Error('Performance data file not found. Run performance monitoring first.')
    }
    
    const data = fs.readFileSync(config.dataFile, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Failed to load performance data:', error.message)
    return null
  }
}

/**
 * Generate summary report
 */
function generateSummaryReport(data) {
  const recentChecks = data.checks.slice(-100) // Last 100 checks
  const allResults = recentChecks.flatMap(check => check.results)
  const successfulResults = allResults.filter(r => r.success)
  
  // Calculate metrics by endpoint
  const endpointMetrics = {}
  allResults.forEach(result => {
    if (!endpointMetrics[result.endpoint]) {
      endpointMetrics[result.endpoint] = {
        totalRequests: 0,
        successfulRequests: 0,
        totalResponseTime: 0,
        minResponseTime: Infinity,
        maxResponseTime: 0,
        errors: []
      }
    }
    
    const metrics = endpointMetrics[result.endpoint]
    metrics.totalRequests++
    
    if (result.success) {
      metrics.successfulRequests++
      metrics.totalResponseTime += result.responseTime
      metrics.minResponseTime = Math.min(metrics.minResponseTime, result.responseTime)
      metrics.maxResponseTime = Math.max(metrics.maxResponseTime, result.responseTime)
    } else {
      metrics.errors.push({
        timestamp: result.timestamp,
        status: result.status,
        error: result.error
      })
    }
  })
  
  // Calculate averages and ratings
  Object.keys(endpointMetrics).forEach(endpoint => {
    const metrics = endpointMetrics[endpoint]
    metrics.averageResponseTime = metrics.successfulRequests > 0 ? 
      metrics.totalResponseTime / metrics.successfulRequests : 0
    metrics.uptime = (metrics.successfulRequests / metrics.totalRequests) * 100
    metrics.performanceRating = getPerformanceRating(metrics.averageResponseTime, metrics.uptime)
    
    if (metrics.minResponseTime === Infinity) {
      metrics.minResponseTime = 0
    }
  })
  
  return {
    timestamp: new Date().toISOString(),
    summary: {
      totalChecks: recentChecks.length,
      totalRequests: allResults.length,
      successfulRequests: successfulResults.length,
      failedRequests: allResults.length - successfulResults.length,
      overallUptime: (successfulResults.length / allResults.length) * 100,
      averageResponseTime: successfulResults.length > 0 ?
        successfulResults.reduce((sum, r) => sum + r.responseTime, 0) / successfulResults.length : 0,
      period: {
        start: recentChecks[0]?.timestamp || null,
        end: recentChecks[recentChecks.length - 1]?.timestamp || null
      }
    },
    endpoints: endpointMetrics,
    insights: generateInsights(endpointMetrics, data.stats),
    recommendations: generateDetailedRecommendations(endpointMetrics, data.stats)
  }
}

/**
 * Generate detailed report with trends
 */
function generateDetailedReport(data) {
  const summary = generateSummaryReport(data)
  
  // Trend analysis (last 50 checks)
  const trendChecks = data.checks.slice(-50)
  const trendData = trendChecks.map(check => {
    const results = check.results
    const successfulResults = results.filter(r => r.success)
    
    return {
      timestamp: check.timestamp,
      averageResponseTime: successfulResults.length > 0 ?
        successfulResults.reduce((sum, r) => sum + r.responseTime, 0) / successfulResults.length : 0,
      uptime: (successfulResults.length / results.length) * 100,
      totalRequests: results.length,
      errors: results.filter(r => !r.success).length
    }
  })
  
  // Performance distribution
  const allResults = data.checks.flatMap(check => check.results)
  const responseTimeDistribution = categorizeResponseTimes(allResults.filter(r => r.success))
  
  return {
    ...summary,
    trends: {
      data: trendData,
      analysis: analyzeTrends(trendData)
    },
    distribution: {
      responseTime: responseTimeDistribution,
      status: generateStatusDistribution(allResults),
      errors: analyzeErrors(allResults.filter(r => !r.success))
    },
    alerts: generateAlerts(summary.endpoints)
  }
}

/**
 * Get performance rating based on response time and uptime
 */
function getPerformanceRating(responseTime, uptime) {
  let responseRating = 'poor'
  let uptimeRating = 'poor'
  
  // Response time rating
  if (responseTime <= config.thresholds.responseTime.excellent) {
    responseRating = 'excellent'
  } else if (responseTime <= config.thresholds.responseTime.good) {
    responseRating = 'good'
  } else if (responseTime <= config.thresholds.responseTime.acceptable) {
    responseRating = 'acceptable'
  }
  
  // Uptime rating
  if (uptime >= config.thresholds.uptime.excellent) {
    uptimeRating = 'excellent'
  } else if (uptime >= config.thresholds.uptime.good) {
    uptimeRating = 'good'
  } else if (uptime >= config.thresholds.uptime.acceptable) {
    uptimeRating = 'acceptable'
  }
  
  // Overall rating (take the worse of the two)
  const ratings = ['excellent', 'good', 'acceptable', 'poor']
  const responseIndex = ratings.indexOf(responseRating)
  const uptimeIndex = ratings.indexOf(uptimeRating)
  
  return ratings[Math.max(responseIndex, uptimeIndex)]
}

/**
 * Generate insights from performance data
 */
function generateInsights(endpointMetrics, stats) {
  const insights = []
  
  // Find slowest and fastest endpoints
  const endpoints = Object.entries(endpointMetrics)
  const slowestEndpoint = endpoints.reduce((slowest, [endpoint, metrics]) => 
    metrics.averageResponseTime > slowest[1].averageResponseTime ? [endpoint, metrics] : slowest
  )
  const fastestEndpoint = endpoints.reduce((fastest, [endpoint, metrics]) => 
    metrics.averageResponseTime < fastest[1].averageResponseTime ? [endpoint, metrics] : fastest
  )
  
  insights.push({
    type: 'performance',
    title: 'Slowest Endpoint',
    description: `${slowestEndpoint[0]} has the highest average response time at ${Math.round(slowestEndpoint[1].averageResponseTime)}ms`,
    severity: slowestEndpoint[1].averageResponseTime > 1000 ? 'high' : 'medium',
    endpoint: slowestEndpoint[0],
    value: slowestEndpoint[1].averageResponseTime
  })
  
  insights.push({
    type: 'performance',
    title: 'Fastest Endpoint',
    description: `${fastestEndpoint[0]} has the lowest average response time at ${Math.round(fastestEndpoint[1].averageResponseTime)}ms`,
    severity: 'info',
    endpoint: fastestEndpoint[0],
    value: fastestEndpoint[1].averageResponseTime
  })
  
  // Find endpoints with uptime issues
  const problemEndpoints = endpoints.filter(([_, metrics]) => metrics.uptime < 99)
  if (problemEndpoints.length > 0) {
    insights.push({
      type: 'reliability',
      title: 'Uptime Issues',
      description: `${problemEndpoints.length} endpoint(s) have uptime below 99%`,
      severity: 'high',
      endpoints: problemEndpoints.map(([endpoint, metrics]) => ({
        endpoint,
        uptime: metrics.uptime
      }))
    })
  }
  
  // Overall health assessment
  const overallHealth = stats.uptime >= 99.5 ? 'healthy' : stats.uptime >= 99 ? 'warning' : 'critical'
  insights.push({
    type: 'health',
    title: 'Overall System Health',
    description: `System is ${overallHealth} with ${stats.uptime.toFixed(2)}% uptime`,
    severity: overallHealth === 'healthy' ? 'info' : overallHealth === 'warning' ? 'medium' : 'high',
    value: stats.uptime
  })
  
  return insights
}

/**
 * Generate detailed recommendations
 */
function generateDetailedRecommendations(endpointMetrics, stats) {
  const recommendations = []
  
  // Performance recommendations
  const slowEndpoints = Object.entries(endpointMetrics)
    .filter(([_, metrics]) => metrics.averageResponseTime > 1000)
  
  if (slowEndpoints.length > 0) {
    recommendations.push({
      type: 'performance',
      priority: 'high',
      title: 'Optimize Slow Endpoints',
      description: `${slowEndpoints.length} endpoint(s) have response times over 1 second`,
      actions: [
        'Review and optimize ISR cache settings',
        'Implement additional caching layers',
        'Optimize database queries if applicable',
        'Consider CDN optimization'
      ],
      endpoints: slowEndpoints.map(([endpoint, metrics]) => ({
        endpoint,
        responseTime: metrics.averageResponseTime
      }))
    })
  }
  
  // Reliability recommendations
  const unreliableEndpoints = Object.entries(endpointMetrics)
    .filter(([_, metrics]) => metrics.uptime < 99.5)
  
  if (unreliableEndpoints.length > 0) {
    recommendations.push({
      type: 'reliability',
      priority: 'critical',
      title: 'Improve Endpoint Reliability',
      description: `${unreliableEndpoints.length} endpoint(s) have uptime below 99.5%`,
      actions: [
        'Investigate error causes and implement fixes',
        'Add error handling and retry logic',
        'Monitor server resources and scaling',
        'Implement health checks and automated recovery'
      ],
      endpoints: unreliableEndpoints.map(([endpoint, metrics]) => ({
        endpoint,
        uptime: metrics.uptime,
        errorCount: metrics.errors.length
      }))
    })
  }
  
  // General recommendations
  recommendations.push({
    type: 'monitoring',
    priority: 'medium',
    title: 'Enhance Monitoring',
    description: 'Continue improving performance monitoring and alerting',
    actions: [
      'Set up real-time alerting for critical thresholds',
      'Implement Core Web Vitals monitoring',
      'Add user experience metrics tracking',
      'Create automated performance regression tests'
    ]
  })
  
  return recommendations
}

/**
 * Categorize response times
 */
function categorizeResponseTimes(results) {
  const categories = {
    excellent: 0, // < 200ms
    good: 0,      // 200-500ms
    acceptable: 0, // 500-1000ms
    poor: 0       // > 1000ms
  }
  
  results.forEach(result => {
    if (result.responseTime < 200) {
      categories.excellent++
    } else if (result.responseTime < 500) {
      categories.good++
    } else if (result.responseTime < 1000) {
      categories.acceptable++
    } else {
      categories.poor++
    }
  })
  
  return categories
}

/**
 * Generate status code distribution
 */
function generateStatusDistribution(results) {
  const distribution = {}
  
  results.forEach(result => {
    const status = result.status || 'timeout'
    distribution[status] = (distribution[status] || 0) + 1
  })
  
  return distribution
}

/**
 * Analyze error patterns
 */
function analyzeErrors(errorResults) {
  const errorTypes = {}
  const timePatterns = {}
  
  errorResults.forEach(result => {
    // Error type analysis
    const errorType = result.error || `http_${result.status}` || 'unknown'
    errorTypes[errorType] = (errorTypes[errorType] || 0) + 1
    
    // Time pattern analysis
    const hour = new Date(result.timestamp).getHours()
    timePatterns[hour] = (timePatterns[hour] || 0) + 1
  })
  
  return {
    types: errorTypes,
    timePatterns,
    total: errorResults.length,
    mostCommonError: Object.entries(errorTypes).sort((a, b) => b[1] - a[1])[0]
  }
}

/**
 * Analyze performance trends
 */
function analyzeTrends(trendData) {
  if (trendData.length < 2) return null
  
  // Calculate trend directions
  const responseTimeTrend = calculateTrend(trendData.map(d => d.averageResponseTime))
  const uptimeTrend = calculateTrend(trendData.map(d => d.uptime))
  
  return {
    responseTime: {
      direction: responseTimeTrend > 0.1 ? 'increasing' : responseTimeTrend < -0.1 ? 'decreasing' : 'stable',
      slope: responseTimeTrend,
      current: trendData[trendData.length - 1].averageResponseTime,
      previous: trendData[0].averageResponseTime
    },
    uptime: {
      direction: uptimeTrend > 0.1 ? 'improving' : uptimeTrend < -0.1 ? 'degrading' : 'stable',
      slope: uptimeTrend,
      current: trendData[trendData.length - 1].uptime,
      previous: trendData[0].uptime
    }
  }
}

/**
 * Calculate simple linear trend
 */
function calculateTrend(values) {
  if (values.length < 2) return 0
  
  const n = values.length
  const x = Array.from({length: n}, (_, i) => i)
  const y = values
  
  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = y.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0)
  
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  return slope
}

/**
 * Generate alerts based on current performance
 */
function generateAlerts(endpointMetrics) {
  const alerts = []
  
  Object.entries(endpointMetrics).forEach(([endpoint, metrics]) => {
    // High response time alert
    if (metrics.averageResponseTime > 2000) {
      alerts.push({
        type: 'performance',
        severity: 'critical',
        endpoint,
        message: `Very high response time: ${Math.round(metrics.averageResponseTime)}ms`,
        threshold: 2000,
        value: metrics.averageResponseTime
      })
    } else if (metrics.averageResponseTime > 1000) {
      alerts.push({
        type: 'performance',
        severity: 'warning',
        endpoint,
        message: `High response time: ${Math.round(metrics.averageResponseTime)}ms`,
        threshold: 1000,
        value: metrics.averageResponseTime
      })
    }
    
    // Low uptime alert
    if (metrics.uptime < 95) {
      alerts.push({
        type: 'reliability',
        severity: 'critical',
        endpoint,
        message: `Very low uptime: ${metrics.uptime.toFixed(2)}%`,
        threshold: 95,
        value: metrics.uptime
      })
    } else if (metrics.uptime < 99) {
      alerts.push({
        type: 'reliability',
        severity: 'warning',
        endpoint,
        message: `Low uptime: ${metrics.uptime.toFixed(2)}%`,
        threshold: 99,
        value: metrics.uptime
      })
    }
  })
  
  return alerts
}

/**
 * Generate HTML report
 */
function generateHTMLReport(report) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Performance Report - ${new Date(report.timestamp).toLocaleString()}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { margin: 0; color: #1e40af; font-size: 2.5em; }
        .header .timestamp { color: #6b7280; font-size: 1.1em; margin-top: 5px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
        .metric-card h3 { margin: 0 0 10px 0; font-size: 1.1em; opacity: 0.9; }
        .metric-card .value { font-size: 2.5em; font-weight: bold; margin: 0; }
        .metric-card .unit { font-size: 0.9em; opacity: 0.8; }
        .section { margin-bottom: 40px; }
        .section h2 { color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; }
        .endpoint-list { display: grid; gap: 15px; }
        .endpoint-item { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; }
        .endpoint-item h4 { margin: 0 0 10px 0; color: #1e40af; font-family: monospace; }
        .endpoint-metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 10px; }
        .endpoint-metric { text-align: center; }
        .endpoint-metric .label { font-size: 0.8em; color: #6b7280; text-transform: uppercase; font-weight: 600; }
        .endpoint-metric .value { font-size: 1.2em; font-weight: bold; color: #374151; }
        .rating-excellent { color: #10b981; }
        .rating-good { color: #f59e0b; }
        .rating-acceptable { color: #ef4444; }
        .rating-poor { color: #dc2626; }
        .alert { padding: 15px; border-radius: 6px; margin-bottom: 10px; }
        .alert-critical { background: #fef2f2; border-left: 4px solid #dc2626; color: #991b1b; }
        .alert-warning { background: #fffbeb; border-left: 4px solid #f59e0b; color: #92400e; }
        .alert-info { background: #eff6ff; border-left: 4px solid #3b82f6; color: #1e40af; }
        .recommendation { background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 6px; padding: 15px; margin-bottom: 15px; }
        .recommendation h4 { margin: 0 0 10px 0; color: #0c4a6e; }
        .recommendation ul { margin: 10px 0; padding-left: 20px; }
        .recommendation li { margin-bottom: 5px; }
        .footer { text-align: center; color: #6b7280; font-size: 0.9em; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Performance Report</h1>
            <div class="timestamp">Generated: ${new Date(report.timestamp).toLocaleString()}</div>
        </div>

        <div class="grid">
            <div class="metric-card">
                <h3>Overall Uptime</h3>
                <div class="value">${report.summary.overallUptime.toFixed(1)}<span class="unit">%</span></div>
            </div>
            <div class="metric-card">
                <h3>Avg Response Time</h3>
                <div class="value">${Math.round(report.summary.averageResponseTime)}<span class="unit">ms</span></div>
            </div>
            <div class="metric-card">
                <h3>Total Requests</h3>
                <div class="value">${report.summary.totalRequests}</div>
            </div>
            <div class="metric-card">
                <h3>Failed Requests</h3>
                <div class="value">${report.summary.failedRequests}</div>
            </div>
        </div>

        <div class="section">
            <h2>🎯 Endpoint Performance</h2>
            <div class="endpoint-list">
                ${Object.entries(report.endpoints).map(([endpoint, metrics]) => `
                    <div class="endpoint-item">
                        <h4>${endpoint}</h4>
                        <div class="endpoint-metrics">
                            <div class="endpoint-metric">
                                <div class="label">Rating</div>
                                <div class="value rating-${metrics.performanceRating}">${metrics.performanceRating.toUpperCase()}</div>
                            </div>
                            <div class="endpoint-metric">
                                <div class="label">Avg Response</div>
                                <div class="value">${Math.round(metrics.averageResponseTime)}ms</div>
                            </div>
                            <div class="endpoint-metric">
                                <div class="label">Uptime</div>
                                <div class="value">${metrics.uptime.toFixed(1)}%</div>
                            </div>
                            <div class="endpoint-metric">
                                <div class="label">Requests</div>
                                <div class="value">${metrics.totalRequests}</div>
                            </div>
                            <div class="endpoint-metric">
                                <div class="label">Errors</div>
                                <div class="value">${metrics.errors.length}</div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>

        ${report.alerts && report.alerts.length > 0 ? `
        <div class="section">
            <h2>🚨 Active Alerts</h2>
            ${report.alerts.map(alert => `
                <div class="alert alert-${alert.severity}">
                    <strong>${alert.endpoint}</strong>: ${alert.message}
                </div>
            `).join('')}
        </div>
        ` : ''}

        <div class="section">
            <h2>💡 Insights</h2>
            ${report.insights.map(insight => `
                <div class="alert alert-${insight.severity === 'high' ? 'critical' : insight.severity === 'medium' ? 'warning' : 'info'}">
                    <strong>${insight.title}</strong>: ${insight.description}
                </div>
            `).join('')}
        </div>

        <div class="section">
            <h2>🛠️ Recommendations</h2>
            ${report.recommendations.map(rec => `
                <div class="recommendation">
                    <h4>${rec.title} (${rec.priority} priority)</h4>
                    <p>${rec.description}</p>
                    <ul>
                        ${rec.actions.map(action => `<li>${action}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </div>

        <div class="footer">
            Report generated by Performance Monitoring System<br>
            Next update: ${new Date(Date.now() + 300000).toLocaleString()}
        </div>
    </div>
</body>
</html>
  `
  
  return html
}

/**
 * Save report to file
 */
function saveReport(report, format, type) {
  // Ensure report directory exists
  if (!fs.existsSync(config.reportDir)) {
    fs.mkdirSync(config.reportDir, { recursive: true })
  }
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = `performance-${type}-${timestamp}.${format}`
  const filepath = path.join(config.reportDir, filename)
  
  let content
  switch (format) {
    case 'json':
      content = JSON.stringify(report, null, 2)
      break
    case 'html':
      content = generateHTMLReport(report)
      break
    case 'csv':
      content = generateCSVReport(report)
      break
    default:
      throw new Error(`Unsupported format: ${format}`)
  }
  
  fs.writeFileSync(filepath, content)
  return filepath
}

/**
 * Generate CSV report
 */
function generateCSVReport(report) {
  const headers = ['Endpoint', 'Average Response Time', 'Uptime', 'Total Requests', 'Errors', 'Rating']
  const rows = Object.entries(report.endpoints).map(([endpoint, metrics]) => [
    endpoint,
    Math.round(metrics.averageResponseTime),
    metrics.uptime.toFixed(2),
    metrics.totalRequests,
    metrics.errors.length,
    metrics.performanceRating
  ])
  
  return [headers, ...rows].map(row => row.join(',')).join('\n')
}

/**
 * Main function to generate reports
 */
async function generateReports() {
  console.log('📊 Generating performance reports...')
  
  const data = loadPerformanceData()
  if (!data) {
    process.exit(1)
  }
  
  try {
    // Generate different types of reports
    const summaryReport = generateSummaryReport(data)
    const detailedReport = generateDetailedReport(data)
    
    const savedFiles = []
    
    // Save reports in different formats
    for (const format of config.outputFormats) {
      savedFiles.push(saveReport(summaryReport, format, 'summary'))
      if (format !== 'csv') { // CSV format doesn't support detailed reports well
        savedFiles.push(saveReport(detailedReport, format, 'detailed'))
      }
    }
    
    console.log('✅ Reports generated successfully:')
    savedFiles.forEach(file => console.log(`  📄 ${file}`))
    
    // Output summary to console
    console.log('\n📈 Performance Summary:')
    console.log(`  Overall Uptime: ${summaryReport.summary.overallUptime.toFixed(2)}%`)
    console.log(`  Average Response Time: ${Math.round(summaryReport.summary.averageResponseTime)}ms`)
    console.log(`  Total Requests: ${summaryReport.summary.totalRequests}`)
    console.log(`  Failed Requests: ${summaryReport.summary.failedRequests}`)
    
    if (detailedReport.alerts.length > 0) {
      console.log(`\n🚨 Active Alerts: ${detailedReport.alerts.length}`)
      detailedReport.alerts.forEach(alert => {
        console.log(`  ${alert.severity.toUpperCase()}: ${alert.endpoint} - ${alert.message}`)
      })
    }
    
    return { summaryReport, detailedReport, savedFiles }
  } catch (error) {
    console.error('❌ Failed to generate reports:', error.message)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  generateReports().catch(console.error)
}

module.exports = {
  generateReports,
  generateSummaryReport,
  generateDetailedReport,
  loadPerformanceData
}