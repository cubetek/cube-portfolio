/**
 * Dynamic OpenGraph Image Generator
 * Generates social media images with custom text
 */

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const title = (query.title as string) || 'Your Personal Website'
  const subtitle = (query.subtitle as string) || 'Full Stack Developer'
  
  // Simple SVG template for OpenGraph image
  const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="background" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
        </linearGradient>
      </defs>
      
      <!-- Background -->
      <rect width="1200" height="630" fill="url(#background)" />
      
      <!-- Content Area -->
      <rect x="80" y="80" width="1040" height="470" fill="#ffffff" fill-opacity="0.1" rx="20" />
      
      <!-- Title -->
      <text x="600" y="280" font-family="Arial, sans-serif" font-size="60" font-weight="bold" 
            text-anchor="middle" fill="#ffffff" dominant-baseline="middle">
        ${escapeXml(title.length > 30 ? title.substring(0, 30) + '...' : title)}
      </text>
      
      <!-- Subtitle -->
      <text x="600" y="360" font-family="Arial, sans-serif" font-size="32" 
            text-anchor="middle" fill="#e0f2fe" dominant-baseline="middle">
        ${escapeXml(subtitle.length > 40 ? subtitle.substring(0, 40) + '...' : subtitle)}
      </text>
      
      <!-- Website URL -->
      <text x="600" y="520" font-family="Arial, sans-serif" font-size="24" 
            text-anchor="middle" fill="#bfdbfe" dominant-baseline="middle">
        your-domain.com
      </text>
      
      <!-- Decorative elements -->
      <circle cx="150" cy="150" r="30" fill="#ffffff" fill-opacity="0.2" />
      <circle cx="1050" cy="480" r="40" fill="#ffffff" fill-opacity="0.15" />
      <circle cx="200" cy="500" r="20" fill="#ffffff" fill-opacity="0.1" />
    </svg>
  `

  // Set headers for image response
  setHeader(event, 'Content-Type', 'image/svg+xml')
  setHeader(event, 'Cache-Control', 'public, max-age=86400') // Cache for 24 hours
  
  return svg
})

// Helper function to escape XML characters
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}