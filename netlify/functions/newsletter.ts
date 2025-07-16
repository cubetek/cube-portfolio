/**
 * Netlify Function for Newsletter Subscription
 * Handles newsletter subscriptions with validation and spam protection
 */

import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

interface NewsletterData {
  email: string;
  name?: string;
  language: string;
  'bot-field'?: string; // Honeypot field
}

// Simple email validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Check for spam patterns in email
const isSpamEmail = (email: string): boolean => {
  const spamPatterns = [
    /temp.*mail/i,
    /10minute/i,
    /throwaway/i,
    /guerrillamail/i,
    /mailinator/i,
  ];
  
  return spamPatterns.some(pattern => pattern.test(email));
};

// Subscribe to newsletter (integrate with your email service)
const subscribeToNewsletter = async (data: NewsletterData): Promise<boolean> => {
  // Implementation depends on your email service (Mailchimp, ConvertKit, etc.)
  console.log('Newsletter subscription:', {
    email: data.email,
    name: data.name,
    language: data.language,
    timestamp: new Date().toISOString()
  });

  // In a real implementation, you would:
  // 1. Use your email service API (Mailchimp, ConvertKit, etc.)
  // 2. Add subscriber to appropriate language list
  // 3. Send welcome email
  
  return true; // Simulate successful subscription
};

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse form data
    let formData: NewsletterData;
    
    if (event.headers['content-type']?.includes('application/json')) {
      formData = JSON.parse(event.body || '{}');
    } else {
      // Parse URL-encoded form data
      const params = new URLSearchParams(event.body || '');
      formData = {
        email: params.get('email') || '',
        name: params.get('name') || '',
        language: params.get('language') || 'ar',
        'bot-field': params.get('bot-field') || ''
      };
    }

    // Check honeypot field for spam
    if (formData['bot-field']) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Spam detected' })
      };
    }

    // Validate email is provided
    if (!formData.email) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ 
          error: formData.language === 'en' 
            ? 'Email is required' 
            : 'البريد الإلكتروني مطلوب'
        })
      };
    }

    // Validate email format
    if (!isValidEmail(formData.email)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ 
          error: formData.language === 'en' 
            ? 'Invalid email format' 
            : 'تنسيق البريد الإلكتروني غير صالح'
        })
      };
    }

    // Check for spam email providers
    if (isSpamEmail(formData.email)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ 
          error: formData.language === 'en' 
            ? 'Please use a valid email address' 
            : 'يرجى استخدام عنوان بريد إلكتروني صالح'
        })
      };
    }

    // Subscribe to newsletter
    const subscribed = await subscribeToNewsletter(formData);
    
    if (!subscribed) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ 
          error: formData.language === 'en' 
            ? 'Failed to subscribe to newsletter' 
            : 'فشل في الاشتراك في النشرة الإخبارية'
        })
      };
    }

    // Return success response
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        success: true,
        message: formData.language === 'en' 
          ? 'Successfully subscribed to newsletter!' 
          : 'تم الاشتراك في النشرة الإخبارية بنجاح!'
      })
    };

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: 'Internal server error'
      })
    };
  }
};

// Export for edge runtime compatibility
export { handler as default };