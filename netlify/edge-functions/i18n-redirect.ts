/**
 * Netlify Edge Function for i18n Language Detection and Redirects
 * Handles automatic language detection and proper routing for Arabic/English content
 * Optimized for performance and reliability with proper error handling
 */

import type { Context, Config } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  
  // Only handle root path redirects
  if (url.pathname !== '/') {
    return;
  }

  try {
    // Get user's preferred language from various sources with fallbacks
    const acceptLanguage = request.headers.get('accept-language') || '';
    const userAgent = request.headers.get('user-agent') || '';
    const country = context.geo?.country?.code || '';
    
    // Enhanced cookie parsing with better error handling
    const cookieHeader = request.headers.get('cookie') || '';
    let langCookie = '';
    
    if (cookieHeader) {
      try {
        const cookies = Object.fromEntries(
          cookieHeader
            .split(';')
            .map(cookie => {
              const [key, ...valueParts] = cookie.trim().split('=');
              return [key, valueParts.join('=')];
            })
            .filter(([key]) => key)
        );
        langCookie = cookies['i18n_redirected'] || '';
      } catch (error) {
        console.warn('Cookie parsing error:', error);
      }
    }

    // Determine preferred language with improved logic
    let preferredLanguage = 'ar'; // Default to Arabic
    
    // Priority: Cookie > Accept-Language > Geo-location > Default
    if (langCookie && ['en', 'ar'].includes(langCookie)) {
      preferredLanguage = langCookie;
    } else {
      // Enhanced Accept-Language header parsing
      const languages = acceptLanguage
        .split(',')
        .map(lang => {
          const [code, qString = 'q=1'] = lang.trim().split(';');
          const quality = parseFloat(qString.replace('q=', '')) || 1;
          return { 
            code: code ? code.toLowerCase().trim() : '', 
            quality: Math.min(Math.max(quality, 0), 1) // Clamp between 0 and 1
          };
        })
        .filter(lang => lang.code && lang.quality > 0)
        .sort((a, b) => b.quality - a.quality);

      // Check for English preference with better logic
      const hasEnglishPreference = languages.some(lang => 
        (lang.code.startsWith('en') || lang.code === 'en') && lang.quality >= 0.5
      );

      // Enhanced Arabic-speaking countries list
      const arabicCountries = [
        'SA', 'AE', 'EG', 'MA', 'DZ', 'TN', 'LY', 'SY', 'IQ', 'JO', 
        'LB', 'PS', 'YE', 'OM', 'QA', 'BH', 'KW', 'MR', 'SO', 'DJ', 'KM'
      ];
      const isArabicCountry = country && arabicCountries.includes(country.toUpperCase());

      // Enhanced language detection logic
      if (hasEnglishPreference) {
        // If user prefers English and not from Arabic country, use English
        if (!isArabicCountry) {
          preferredLanguage = 'en';
        }
        // If from Arabic country but English is strongly preferred (>0.8), use English
        else if (languages[0]?.code.startsWith('en') && languages[0]?.quality > 0.8) {
          preferredLanguage = 'en';
        }
      }
    }

    // Cookie settings for better security and performance
    const cookieOptions = [
      'Path=/',
      `Max-Age=${60 * 60 * 24 * 365}`, // 1 year
      'SameSite=Lax',
      'Secure', // Only over HTTPS
    ].join('; ');

    // If user prefers English, redirect to /en
    if (preferredLanguage === 'en') {
      const redirectUrl = new URL('/en', url.origin);
      const response = Response.redirect(redirectUrl.toString(), 302);
      
      // Set cookie to remember preference
      response.headers.set('Set-Cookie', `i18n_redirected=en; ${cookieOptions}`);
      
      // Add performance headers
      response.headers.set('Cache-Control', 'public, max-age=300'); // 5 minutes
      response.headers.set('Vary', 'Accept-Language, Cookie');
      
      return response;
    }

    // For Arabic (default), continue to the origin
    // Use context.next() to properly handle the request chain
    const response = await context.next();
    
    // Set cookie to remember preference and add performance headers
    response.headers.set('Set-Cookie', `i18n_redirected=ar; ${cookieOptions}`);
    response.headers.set('Cache-Control', 'public, max-age=300'); // 5 minutes
    response.headers.set('Vary', 'Accept-Language, Cookie');
    
    return response;

  } catch (error) {
    // Enhanced error logging with more context
    console.error('i18n redirect error:', {
      error: error instanceof Error ? error.message : String(error),
      url: request.url,
      userAgent: request.headers.get('user-agent'),
      acceptLanguage: request.headers.get('accept-language'),
      country: context.geo?.country?.code,
      timestamp: new Date().toISOString()
    });
    
    // Graceful fallback - let the request continue normally
    return await context.next();
  }
};

export const config: Config = {
  path: "/",
  cache: "manual",
  excludedPath: ["/en/*", "/api/*", "/_nuxt/*", "/favicon.ico", "/robots.txt"]
};