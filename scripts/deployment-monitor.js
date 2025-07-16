#!/usr/bin/env node

/**
 * Deployment Monitor & Automated Rollback Script
 * Monitors deployment health and triggers rollback if issues are detected
 */

const https = require('https')
const http = require('http')
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

// Configuration
const config = {
  // Health check configuration
  healthCheck: {
    url: process.env.HEALTH_CHECK_URL || 'https://your-domain.com/api/health',
    timeout: 10000,
    retries: 3,
    interval: 30000, // 30 seconds
    failureThreshold: 3 // Number of consecutive failures before rollback
  },
  
  // Performance thresholds
  performance: {
    responseTime: 5000, // 5 seconds
    uptime: 95, // 95% minimum uptime
    errorRate: 5 // 5% maximum error rate
  },
  
  // Rollback configuration
  rollback: {
    enabled: process.env.ENABLE_ROLLBACK === 'true',
    strategy: process.env.ROLLBACK_STRATEGY || 'previous', // 'previous' or 'stable'
    maxRollbacks: 3, // Maximum automatic rollbacks
    cooldownPeriod: 300000 // 5 minutes cooldown between rollbacks
  },
  
  // Platform configuration
  platform: {
    vercel: {
      token: process.env.VERCEL_TOKEN,
      teamId: process.env.VERCEL_TEAM_ID,
      projectId: process.env.VERCEL_PROJECT_ID
    },
    netlify: {
      token: process.env.NETLIFY_AUTH_TOKEN,
      siteId: process.env.NETLIFY_SITE_ID
    }
  },
  
  // Alerting
  alerting: {
    webhook: process.env.DEPLOYMENT_WEBHOOK,
    slack: process.env.SLACK_WEBHOOK,
    email: process.env.ALERT_EMAIL
  }
}

// State management
let monitoringState = {
  consecutiveFailures: 0,
  lastRollback: 0,
  rollbackCount: 0,
  deploymentHistory: [],
  isHealthy: true,
  lastHealthCheck: null
}

// Load previous state if exists
const stateFile = path.join(__dirname, '../.nuxt/deployment-state.json')
if (fs.existsSync(stateFile)) {
  try {
    monitoringState = { ...monitoringState, ...JSON.parse(fs.readFileSync(stateFile, 'utf8')) }
  } catch (error) {
    console.warn('Failed to load deployment state:', error.message)
  }
}

/**
 * Perform health check
 */
async function performHealthCheck() {
  const startTime = Date.now()
  
  for (let attempt = 1; attempt <= config.healthCheck.retries; attempt++) {
    try {
      const result = await checkHealth()
      const responseTime = Date.now() - startTime
      
      const healthStatus = {
        timestamp: new Date().toISOString(),
        success: true,
        responseTime,
        attempt,
        data: result
      }
      
      // Check performance thresholds
      const performanceIssues = checkPerformanceThresholds(result, responseTime)
      
      if (performanceIssues.length > 0) {
        healthStatus.success = false
        healthStatus.issues = performanceIssues
      }
      
      return healthStatus
    } catch (error) {
      console.log(`Health check attempt ${attempt}/${config.healthCheck.retries} failed:`, error.message)
      
      if (attempt === config.healthCheck.retries) {
        return {
          timestamp: new Date().toISOString(),
          success: false,
          responseTime: Date.now() - startTime,
          attempt,
          error: error.message
        }
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
}

/**
 * Check health endpoint
 */
async function checkHealth() {
  return new Promise((resolve, reject) => {
    const url = new URL(config.healthCheck.url)
    const client = url.protocol === 'https:' ? https : http
    
    const request = client.get(config.healthCheck.url, {
      timeout: config.healthCheck.timeout,
      headers: {
        'User-Agent': 'Deployment-Monitor/1.0'
      }
    }, (response) => {
      let data = ''
      response.on('data', chunk => data += chunk)
      response.on('end', () => {
        try {
          if (response.statusCode >= 200 && response.statusCode < 300) {
            resolve(JSON.parse(data))
          } else {
            reject(new Error(`HTTP ${response.statusCode}: ${data}`))
          }
        } catch (error) {
          reject(new Error(`Invalid JSON response: ${error.message}`))
        }
      })
    })
    
    request.on('timeout', () => {
      request.destroy()
      reject(new Error('Health check timeout'))
    })
    
    request.on('error', reject)
  })
}

/**
 * Check performance thresholds
 */
function checkPerformanceThresholds(healthData, responseTime) {
  const issues = []
  
  // Response time check
  if (responseTime > config.performance.responseTime) {
    issues.push({
      type: 'response_time',
      message: `Response time ${responseTime}ms exceeds threshold ${config.performance.responseTime}ms`,
      severity: 'critical',
      value: responseTime,
      threshold: config.performance.responseTime
    })
  }
  
  // Uptime check (if provided in health data)
  if (healthData.services) {
    Object.entries(healthData.services).forEach(([service, status]) => {
      if (status !== 'healthy') {
        issues.push({
          type: 'service_health',
          message: `Service ${service} is ${status}`,
          severity: 'critical',
          service,
          status
        })
      }
    })
  }
  
  // Memory usage check
  if (healthData.performance?.memoryUsage) {
    const memUsage = healthData.performance.memoryUsage
    const memPercent = (memUsage.heapUsed / memUsage.heapTotal) * 100
    
    if (memPercent > 90) {
      issues.push({
        type: 'memory_usage',
        message: `High memory usage: ${memPercent.toFixed(1)}%`,
        severity: 'warning',
        value: memPercent,
        threshold: 90
      })
    }
  }
  
  return issues
}

/**
 * Handle health check result
 */
async function handleHealthCheckResult(result) {
  monitoringState.lastHealthCheck = result
  
  if (result.success) {
    console.log(`✅ Health check passed (${result.responseTime}ms)`)
    
    // Reset failure count on success
    if (monitoringState.consecutiveFailures > 0) {
      console.log(`🔄 Resetting failure count (was ${monitoringState.consecutiveFailures})`)
      monitoringState.consecutiveFailures = 0
      monitoringState.isHealthy = true
    }
  } else {
    console.log(`❌ Health check failed: ${result.error || 'Unknown error'}`)
    monitoringState.consecutiveFailures++
    monitoringState.isHealthy = false
    
    // Send alert
    await sendAlert({
      type: 'health_check_failure',
      severity: 'error',
      message: `Health check failed (${monitoringState.consecutiveFailures}/${config.healthCheck.failureThreshold}): ${result.error}`,
      data: result
    })
    
    // Check if rollback should be triggered
    if (shouldTriggerRollback()) {
      await triggerRollback()
    }
  }
  
  // Save state
  saveState()
}

/**
 * Check if rollback should be triggered
 */
function shouldTriggerRollback() {
  if (!config.rollback.enabled) {
    console.log('🚫 Rollback is disabled')
    return false
  }
  
  if (monitoringState.consecutiveFailures < config.healthCheck.failureThreshold) {
    console.log(`🔍 Failure count ${monitoringState.consecutiveFailures} below threshold ${config.healthCheck.failureThreshold}`)
    return false
  }
  
  if (monitoringState.rollbackCount >= config.rollback.maxRollbacks) {
    console.log(`🚫 Maximum rollbacks (${config.rollback.maxRollbacks}) reached`)
    return false
  }
  
  const timeSinceLastRollback = Date.now() - monitoringState.lastRollback
  if (timeSinceLastRollback < config.rollback.cooldownPeriod) {
    const remainingCooldown = Math.ceil((config.rollback.cooldownPeriod - timeSinceLastRollback) / 1000)
    console.log(`⏳ Rollback cooldown active (${remainingCooldown}s remaining)`)
    return false
  }
  
  return true
}

/**
 * Trigger automated rollback
 */
async function triggerRollback() {
  console.log('🚨 Triggering automated rollback...')
  
  try {
    // Determine platform and rollback method
    const platform = detectPlatform()
    let rollbackResult
    
    switch (platform) {
      case 'vercel':
        rollbackResult = await rollbackVercel()
        break
      case 'netlify':
        rollbackResult = await rollbackNetlify()
        break
      default:
        throw new Error('Unknown deployment platform')
    }
    
    // Update state
    monitoringState.rollbackCount++
    monitoringState.lastRollback = Date.now()
    monitoringState.consecutiveFailures = 0
    
    // Record rollback in history
    monitoringState.deploymentHistory.push({
      timestamp: new Date().toISOString(),
      action: 'rollback',
      platform,
      result: rollbackResult,
      reason: 'automated_health_check_failure'
    })
    
    console.log('✅ Rollback completed successfully')
    
    // Send success alert
    await sendAlert({
      type: 'rollback_success',
      severity: 'warning',
      message: `Automated rollback completed successfully on ${platform}`,
      data: rollbackResult
    })
    
    // Wait and verify rollback success
    setTimeout(async () => {
      const verificationResult = await performHealthCheck()
      if (verificationResult.success) {
        console.log('✅ Rollback verification successful')
        await sendAlert({
          type: 'rollback_verification',
          severity: 'info',
          message: 'Rollback verification successful - service is healthy',
          data: verificationResult
        })
      } else {
        console.log('❌ Rollback verification failed')
        await sendAlert({
          type: 'rollback_verification_failed',
          severity: 'critical',
          message: 'Rollback verification failed - manual intervention required',
          data: verificationResult
        })
      }
    }, 60000) // Wait 1 minute before verification
    
  } catch (error) {
    console.error('❌ Rollback failed:', error.message)
    
    await sendAlert({
      type: 'rollback_failure',
      severity: 'critical',
      message: `Automated rollback failed: ${error.message}`,
      error: error.message
    })
  }
  
  saveState()
}

/**
 * Detect deployment platform
 */
function detectPlatform() {
  if (process.env.VERCEL && config.platform.vercel.token) {
    return 'vercel'
  }
  if (process.env.NETLIFY && config.platform.netlify.token) {
    return 'netlify'
  }
  
  // Try to detect from URL
  const url = config.healthCheck.url
  if (url.includes('vercel.app') || url.includes('vercel.com')) {
    return 'vercel'
  }
  if (url.includes('netlify.app') || url.includes('netlify.com')) {
    return 'netlify'
  }
  
  return 'unknown'
}

/**
 * Rollback on Vercel
 */
async function rollbackVercel() {
  console.log('🔄 Performing Vercel rollback...')
  
  // Get latest deployments
  const deployments = await vercelAPICall('GET', `/v6/deployments?projectId=${config.platform.vercel.projectId}&limit=10`)
  
  // Find previous successful deployment
  const currentDeployment = deployments.deployments[0]
  const previousDeployment = deployments.deployments.find(d => 
    d.id !== currentDeployment.id && d.state === 'READY'
  )
  
  if (!previousDeployment) {
    throw new Error('No previous successful deployment found')
  }
  
  // Promote previous deployment
  const result = await vercelAPICall('PATCH', `/v2/deployments/${previousDeployment.id}/promote`, {
    target: 'production'
  })
  
  return {
    from: currentDeployment.id,
    to: previousDeployment.id,
    url: result.url
  }
}

/**
 * Rollback on Netlify
 */
async function rollbackNetlify() {
  console.log('🔄 Performing Netlify rollback...')
  
  // Get site deploys
  const deploys = await netlifyAPICall('GET', `/sites/${config.platform.netlify.siteId}/deploys`)
  
  // Find previous successful deploy
  const currentDeploy = deploys[0]
  const previousDeploy = deploys.find(d => 
    d.id !== currentDeploy.id && d.state === 'ready'
  )
  
  if (!previousDeploy) {
    throw new Error('No previous successful deploy found')
  }
  
  // Restore previous deploy
  const result = await netlifyAPICall('POST', `/sites/${config.platform.netlify.siteId}/deploys/${previousDeploy.id}/restore`)
  
  return {
    from: currentDeploy.id,
    to: previousDeploy.id,
    url: result.url
  }
}

/**
 * Make Vercel API call
 */
async function vercelAPICall(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.vercel.com',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${config.platform.vercel.token}`,
        'Content-Type': 'application/json'
      }
    }
    
    if (config.platform.vercel.teamId) {
      options.headers['X-Vercel-Team-Id'] = config.platform.vercel.teamId
    }
    
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const result = JSON.parse(data)
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(result)
          } else {
            reject(new Error(`Vercel API error: ${result.error?.message || data}`))
          }
        } catch (error) {
          reject(new Error(`Invalid JSON response: ${error.message}`))
        }
      })
    })
    
    req.on('error', reject)
    
    if (body) {
      req.write(JSON.stringify(body))
    }
    
    req.end()
  })
}

/**
 * Make Netlify API call
 */
async function netlifyAPICall(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.netlify.com',
      path: `/api/v1${path}`,
      method,
      headers: {
        'Authorization': `Bearer ${config.platform.netlify.token}`,
        'Content-Type': 'application/json'
      }
    }
    
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try {
          const result = JSON.parse(data)
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(result)
          } else {
            reject(new Error(`Netlify API error: ${result.message || data}`))
          }
        } catch (error) {
          reject(new Error(`Invalid JSON response: ${error.message}`))
        }
      })
    })
    
    req.on('error', reject)
    
    if (body) {
      req.write(JSON.stringify(body))
    }
    
    req.end()
  })
}

/**
 * Send alert notification
 */
async function sendAlert(alert) {
  console.log(`🚨 ALERT [${alert.severity.toUpperCase()}]: ${alert.message}`)
  
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
    source: 'deployment-monitor',
    state: monitoringState
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
      title: `Deployment Alert - ${alert.type}`,
      text: alert.message,
      fields: [
        {
          title: 'Severity',
          value: alert.severity.toUpperCase(),
          short: true
        },
        {
          title: 'Time',
          value: new Date().toISOString(),
          short: true
        },
        {
          title: 'Consecutive Failures',
          value: monitoringState.consecutiveFailures.toString(),
          short: true
        },
        {
          title: 'Health Status',
          value: monitoringState.isHealthy ? 'Healthy' : 'Unhealthy',
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
 * Save monitoring state
 */
function saveState() {
  try {
    const dir = path.dirname(stateFile)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(stateFile, JSON.stringify(monitoringState, null, 2))
  } catch (error) {
    console.error('Failed to save state:', error.message)
  }
}

/**
 * Main monitoring loop
 */
async function startDeploymentMonitoring() {
  console.log('🚀 Starting deployment monitoring...')
  console.log(`Health check URL: ${config.healthCheck.url}`)
  console.log(`Check interval: ${config.healthCheck.interval / 1000}s`)
  console.log(`Failure threshold: ${config.healthCheck.failureThreshold}`)
  console.log(`Rollback enabled: ${config.rollback.enabled}`)
  
  // Perform initial health check
  const initialResult = await performHealthCheck()
  await handleHealthCheckResult(initialResult)
  
  // Set up monitoring interval
  setInterval(async () => {
    try {
      const result = await performHealthCheck()
      await handleHealthCheckResult(result)
    } catch (error) {
      console.error('Health check error:', error.message)
    }
  }, config.healthCheck.interval)
  
  console.log('📊 Deployment monitoring is running...')
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping deployment monitoring...')
  saveState()
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n🛑 Stopping deployment monitoring...')
  saveState()
  process.exit(0)
})

// Start monitoring if this script is run directly
if (require.main === module) {
  startDeploymentMonitoring().catch(console.error)
}

module.exports = {
  startDeploymentMonitoring,
  performHealthCheck,
  triggerRollback,
  config,
  monitoringState
}