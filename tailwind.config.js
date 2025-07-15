/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue"
  ],
  theme: {
    extend: {
      // Font family configuration for multilingual support
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'], // Default for English
        'arabic': ['Tajawal', 'Noto Sans Arabic', 'system-ui', 'sans-serif'], // Arabic text
        'mono': ['Fira Code', 'Courier New', 'monospace'], // Monospace
      },
      // Custom CSS properties for direction-aware spacing
      spacing: {
        'start': 'var(--spacing-start)',
        'end': 'var(--spacing-end)',
        '15': '3.75rem', // 60px
      },
      // RTL-aware positioning
      inset: {
        'start': 'var(--inset-start)',
        'end': 'var(--inset-end)',
        '15': '3.75rem', // 60px
      },
      // RTL-aware text alignment
      textAlign: {
        'start': 'start',
        'end': 'end',
      },
      // Custom animations
      keyframes: {
        slideUp: {
          'from': {
            opacity: '0',
            transform: 'translateY(30px)'
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)'
          },
          '50%': {
            transform: 'translateY(-20px)'
          }
        }
      },
      animation: {
        slideUp: 'slideUp 0.8s ease-out forwards',
        float: 'float 6s ease-in-out infinite',
      },
      // Additional box shadow for better shadows
      boxShadow: {
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
      }
    },
  },
  plugins: [
    // RTL plugin for Tailwind CSS
    require('tailwindcss-rtl'),
    // Typography plugin (already installed)
    require('@tailwindcss/typography'),
  ],
  // RTL configuration
  rtl: {
    // Enable RTL variants for utilities
    enabled: true,
    // Use dir attribute instead of rtl class
    dirAttribute: true,
  }
}