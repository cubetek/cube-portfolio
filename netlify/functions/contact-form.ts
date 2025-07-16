/**
 * Netlify Function for Contact Form Processing
 * Handles form submissions with spam protection and email notifications
 */

import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  language: string;
  'bot-field'?: string; // Honeypot field
}

// Simple email validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Simple spam detection
const detectSpam = (data: ContactFormData): boolean => {
  // Check honeypot field
  if (data['bot-field']) {
    return true;
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /\b(viagra|cialis|pharmacy)\b/i,
    /\b(casino|gambling|poker)\b/i,
    /\b(loan|credit|debt)\b/i,
    /http[s]?:\/\/[^\s]+/g, // URLs in message
  ];

  const textToCheck = `${data.name} ${data.email} ${data.subject} ${data.message}`.toLowerCase();
  
  return suspiciousPatterns.some(pattern => pattern.test(textToCheck));
};

// Send email notification (using a service like SendGrid, Mailgun, or AWS SES)
const sendEmailNotification = async (data: ContactFormData): Promise<boolean> => {
  // Implementation depends on your email service
  // For this example, we'll just log the data
  console.log('Contact form submission:', {
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message.substring(0, 100) + '...',
    language: data.language,
    timestamp: new Date().toISOString()
  });

  // In a real implementation, you would:
  // 1. Use an email service API (SendGrid, Mailgun, etc.)
  // 2. Send notification to your email
  // 3. Send confirmation to the user
  
  return true; // Simulate successful sending
};

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse form data
    let formData: ContactFormData;
    
    if (event.headers['content-type']?.includes('application/json')) {
      formData = JSON.parse(event.body || '{}');
    } else {
      // Parse URL-encoded form data
      const params = new URLSearchParams(event.body || '');
      formData = {
        name: params.get('name') || '',
        email: params.get('email') || '',
        subject: params.get('subject') || '',
        message: params.get('message') || '',
        language: params.get('language') || 'ar',
        'bot-field': params.get('bot-field') || ''
      };
    }

    // Validate required fields
    if (!formData.name || !formData.email || !formData.message) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ 
          error: formData.language === 'en' 
            ? 'Missing required fields' 
            : 'حقول مطلوبة مفقودة'
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

    // Check for spam
    if (detectSpam(formData)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ 
          error: formData.language === 'en' 
            ? 'Message flagged as spam' 
            : 'تم تصنيف الرسالة كرسائل مزعجة'
        })
      };
    }

    // Send email notification
    const emailSent = await sendEmailNotification(formData);
    
    if (!emailSent) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ 
          error: formData.language === 'en' 
            ? 'Failed to send email' 
            : 'فشل في إرسال البريد الإلكتروني'
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
          ? 'Thank you for your message! We will get back to you soon.' 
          : 'شكراً لرسالتك! سنقوم بالرد عليك قريباً.'
      })
    };

  } catch (error) {
    console.error('Contact form error:', error);
    
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