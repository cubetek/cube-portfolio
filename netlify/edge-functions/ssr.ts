/**
 * Netlify Edge Function for SSR Support
 * This function handles server-side rendering for the Nuxt 3 application
 * with proper multilingual routing and performance optimizations
 */

import type { Context } from "netlify:edge";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Skip processing for static assets and API routes
  if (
    pathname.startsWith('/_nuxt/') ||
    pathname.startsWith('/assets/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/.netlify/') ||
    pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/)
  ) {
    return;
  }

  try {
    // Get the original response from the origin
    const response = await context.next();
    
    // If response is already handled or has an error, return as is
    if (!response.ok && response.status !== 404) {
      return response;
    }

    // Handle 404s with proper language detection
    if (response.status === 404) {
      // Check if this might be a language-specific route
      const acceptLanguage = request.headers.get('accept-language') || '';
      const isArabicPreferred = acceptLanguage.includes('ar');
      
      // Try to redirect to appropriate language version
      if (pathname.startsWith('/en/') && isArabicPreferred) {
        const arabicPath = pathname.replace('/en/', '/');
        return Response.redirect(`${url.origin}${arabicPath}`, 302);
      } else if (!pathname.startsWith('/en/') && !isArabicPreferred) {
        const englishPath = `/en${pathname}`;
        return Response.redirect(`${url.origin}${englishPath}`, 302);
      }
    }

    // Add performance and security headers
    const modifiedResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        // Performance headers
        'X-Edge-Cache': 'HIT',
        'X-Edge-Location': context.geo?.city || 'Unknown',
        'X-Response-Time': Date.now().toString(),
        
        // Security headers (additional to netlify.toml)
        'X-Robots-Tag': pathname.includes('/admin') ? 'noindex, nofollow' : 'index, follow',
        
        // Language-specific headers
        'Content-Language': pathname.startsWith('/en/') ? 'en' : 'ar',
        'Vary': 'Accept-Language',
      }
    });

    return modifiedResponse;

  } catch (error) {
    console.error('Edge function error:', error);
    
    // Return a fallback response
    return new Response('Internal Server Error', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache'
      }
    });
  }
};

export const config = {
  path: ["/*"],
  excludedPath: [
    "/api/*",
    "/_nuxt/*",
    "/assets/*",
    "/*.js",
    "/*.css",
    "/*.png",
    "/*.jpg",
    "/*.jpeg",
    "/*.gif",
    "/*.svg",
    "/*.ico",
    "/*.woff",
    "/*.woff2",
    "/*.ttf",
    "/*.eot"
  ]
};