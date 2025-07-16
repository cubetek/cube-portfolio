/**
 * Personal Data Formatting Utilities
 * 
 * Collection of utility functions for formatting and displaying personal data
 * including dates, skill levels, project status, and social media validation.
 * These utilities ensure consistent formatting across the application.
 */

import type { SkillLevel, ProjectStatus, ContactPreference } from '~/types/personal'

/**
 * Date formatting utilities
 */
export const dateFormatters = {
  /**
   * Format date string (YYYY-MM or YYYY-MM-DD) to localized display format
   */
  formatDate: (dateString: string, locale: string = 'en'): string => {
    try {
      if (!dateString) return ''
      
      // Handle YYYY-MM format
      if (/^\d{4}-\d{2}$/.test(dateString)) {
        const [year, month] = dateString.split('-')
        const date = new Date(parseInt(year!), parseInt(month!) - 1, 1)
        
        return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
          year: 'numeric',
          month: 'long'
        }).format(date)
      }
      
      // Handle YYYY-MM-DD format
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const date = new Date(dateString)
        
        return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }).format(date)
      }
      
      // Handle year only
      if (/^\d{4}$/.test(dateString)) {
        return dateString
      }
      
      return dateString
    } catch (error) {
      console.warn('[PersonalData] Error formatting date:', dateString, error)
      return dateString
    }
  },

  /**
   * Format date range for experience and education
   */
  formatDateRange: (startDate: string, endDate?: string | null, locale: string = 'en'): string => {
    const start = dateFormatters.formatDate(startDate, locale)
    
    if (!endDate) {
      return locale === 'ar' 
        ? `${start} - الحاضر`
        : `${start} - Present`
    }
    
    const end = dateFormatters.formatDate(endDate, locale)
    return `${start} - ${end}`
  },

  /**
   * Calculate duration between dates
   */
  calculateDuration: (startDate: string, endDate?: string | null, locale: string = 'en'): string => {
    try {
      const start = new Date(startDate + (startDate.length === 7 ? '-01' : ''))
      const end = endDate ? new Date(endDate + (endDate.length === 7 ? '-01' : '')) : new Date()
      
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44))
      
      const years = Math.floor(diffMonths / 12)
      const months = diffMonths % 12
      
      if (locale === 'ar') {
        if (years === 0) {
          return months === 1 ? 'شهر واحد' : `${months} أشهر`
        } else if (months === 0) {
          return years === 1 ? 'سنة واحدة' : `${years} سنوات`
        } else {
          return `${years} ${years === 1 ? 'سنة' : 'سنوات'} و ${months} ${months === 1 ? 'شهر' : 'أشهر'}`
        }
      } else {
        if (years === 0) {
          return months === 1 ? '1 month' : `${months} months`
        } else if (months === 0) {
          return years === 1 ? '1 year' : `${years} years`
        } else {
          return `${years} ${years === 1 ? 'year' : 'years'} ${months} ${months === 1 ? 'month' : 'months'}`
        }
      }
    } catch (error) {
      console.warn('[PersonalData] Error calculating duration:', error)
      return ''
    }
  },

  /**
   * Get relative time (e.g., "2 years ago")
   */
  getRelativeTime: (dateString: string, locale: string = 'en'): string => {
    try {
      const date = new Date(dateString + (dateString.length === 7 ? '-01' : ''))
      const now = new Date()
      const diffTime = now.getTime() - date.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      if (locale === 'ar') {
        if (diffDays < 30) {
          return diffDays === 1 ? 'منذ يوم واحد' : `منذ ${diffDays} أيام`
        } else if (diffDays < 365) {
          const months = Math.floor(diffDays / 30)
          return months === 1 ? 'منذ شهر واحد' : `منذ ${months} أشهر`
        } else {
          const years = Math.floor(diffDays / 365)
          return years === 1 ? 'منذ سنة واحدة' : `منذ ${years} سنوات`
        }
      } else {
        if (diffDays < 30) {
          return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`
        } else if (diffDays < 365) {
          const months = Math.floor(diffDays / 30)
          return months === 1 ? '1 month ago' : `${months} months ago`
        } else {
          const years = Math.floor(diffDays / 365)
          return years === 1 ? '1 year ago' : `${years} years ago`
        }
      }
    } catch (error) {
      console.warn('[PersonalData] Error calculating relative time:', error)
      return ''
    }
  }
}

/**
 * Skill level display utilities
 */
export const skillFormatters = {
  /**
   * Get localized skill level display text
   */
  getSkillLevelText: (level: SkillLevel, locale: string = 'en'): string => {
    const levels = {
      ar: {
        beginner: 'مبتدئ',
        intermediate: 'متوسط',
        advanced: 'متقدم',
        expert: 'خبير'
      },
      en: {
        beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced',
        expert: 'Expert'
      }
    }
    
    return levels[locale as keyof typeof levels]?.[level] || levels.en[level]
  },

  /**
   * Get skill level progress percentage (for progress bars)
   */
  getSkillLevelProgress: (level: SkillLevel): number => {
    const progressMap = {
      beginner: 25,
      intermediate: 50,
      advanced: 75,
      expert: 100
    }
    
    return progressMap[level] || 50
  },

  /**
   * Get skill level color class (for styling)
   */
  getSkillLevelColor: (level: SkillLevel): string => {
    const colorMap = {
      beginner: 'text-yellow-600 bg-yellow-100',
      intermediate: 'text-blue-600 bg-blue-100',
      advanced: 'text-green-600 bg-green-100',
      expert: 'text-purple-600 bg-purple-100'
    }
    
    return colorMap[level] || colorMap.intermediate
  },

  /**
   * Sort skills by level (expert first)
   */
  sortSkillsByLevel: <T extends { level: SkillLevel }>(skills: T[]): T[] => {
    const levelOrder = { expert: 4, advanced: 3, intermediate: 2, beginner: 1 }
    
    return [...skills].sort((a, b) => levelOrder[b.level] - levelOrder[a.level])
  },

  /**
   * Format skill with years of experience
   */
  formatSkillWithExperience: (skillName: string, level: SkillLevel, years?: number, locale: string = 'en'): string => {
    const levelText = skillFormatters.getSkillLevelText(level, locale)
    
    if (!years) {
      return `${skillName} (${levelText})`
    }
    
    const yearsText = locale === 'ar' 
      ? years === 1 ? 'سنة واحدة' : `${years} سنوات`
      : years === 1 ? '1 year' : `${years} years`
    
    return `${skillName} (${levelText}, ${yearsText})`
  }
}

/**
 * Project status formatting utilities
 */
export const projectFormatters = {
  /**
   * Get localized project status text
   */
  getProjectStatusText: (status: ProjectStatus, locale: string = 'en'): string => {
    const statuses = {
      ar: {
        completed: 'مكتمل',
        'in-progress': 'قيد التطوير',
        planned: 'مخطط',
        'on-hold': 'متوقف مؤقتاً'
      },
      en: {
        completed: 'Completed',
        'in-progress': 'In Progress',
        planned: 'Planned',
        'on-hold': 'On Hold'
      }
    }
    
    return statuses[locale as keyof typeof statuses]?.[status] || statuses.en[status]
  },

  /**
   * Get project status color class
   */
  getProjectStatusColor: (status: ProjectStatus): string => {
    const colorMap = {
      completed: 'text-green-600 bg-green-100',
      'in-progress': 'text-blue-600 bg-blue-100',
      planned: 'text-gray-600 bg-gray-100',
      'on-hold': 'text-orange-600 bg-orange-100'
    }
    
    return colorMap[status] || colorMap.planned
  },

  /**
   * Get project status icon
   */
  getProjectStatusIcon: (status: ProjectStatus): string => {
    const iconMap = {
      completed: 'heroicons:check-circle-20-solid',
      'in-progress': 'heroicons:clock-20-solid',
      planned: 'heroicons:calendar-20-solid',
      'on-hold': 'heroicons:pause-circle-20-solid'
    }
    
    return iconMap[status] || iconMap.planned
  },

  /**
   * Sort projects by status priority
   */
  sortProjectsByStatus: <T extends { status: ProjectStatus }>(projects: T[]): T[] => {
    const statusOrder = { 'in-progress': 4, completed: 3, planned: 2, 'on-hold': 1 }
    
    return [...projects].sort((a, b) => statusOrder[b.status] - statusOrder[a.status])
  }
}

/**
 * Social media and URL validation utilities
 */
export const socialMediaFormatters = {
  /**
   * Validate URL format
   */
  isValidUrl: (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  },

  /**
   * Validate email format
   */
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  /**
   * Validate phone number format
   */
  isValidPhone: (phone: string): boolean => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/
    return phoneRegex.test(phone)
  },

  /**
   * Get platform-specific icon mapping
   */
  getPlatformIcon: (platform: string): string => {
    const iconMap: Record<string, string> = {
      github: 'heroicons:github-20-solid',
      linkedin: 'heroicons:linkedin-20-solid',
      twitter: 'heroicons:twitter-20-solid',
      facebook: 'heroicons:facebook-20-solid',
      instagram: 'heroicons:instagram-20-solid',
      youtube: 'heroicons:youtube-20-solid',
      email: 'heroicons:envelope-20-solid',
      phone: 'heroicons:phone-20-solid',
      website: 'heroicons:globe-alt-20-solid',
      whatsapp: 'heroicons:chat-bubble-left-right-20-solid'
    }
    
    return iconMap[platform.toLowerCase()] || iconMap.website!
  },

  /**
   * Extract username from social media URL
   */
  extractUsername: (url: string, platform: string): string => {
    try {
      const urlObj = new URL(url)
      const pathname = urlObj.pathname
      
      switch (platform.toLowerCase()) {
        case 'github':
          return pathname.split('/')[1] || ''
        case 'linkedin':
          const linkedinMatch = pathname.match(/\/in\/([^\/]+)/)
          return linkedinMatch ? linkedinMatch[1]! : ''
        case 'twitter':
          return pathname.split('/')[1] || ''
        default:
          return pathname.split('/').filter(Boolean)[0] || ''
      }
    } catch {
      return ''
    }
  },

  /**
   * Format social media display name
   */
  formatSocialMediaDisplay: (platform: string, username: string): string => {
    switch (platform.toLowerCase()) {
      case 'twitter':
        return username.startsWith('@') ? username : `@${username}`
      case 'email':
        return username
      case 'phone':
        return username
      default:
        return `${platform}: ${username}`
    }
  }
}

/**
 * Contact preference formatting utilities
 */
export const contactFormatters = {
  /**
   * Get localized contact preference text
   */
  getContactPreferenceText: (preference: ContactPreference, locale: string = 'en'): string => {
    const preferences = {
      ar: {
        email: 'البريد الإلكتروني',
        phone: 'الهاتف',
        linkedin: 'لينكد إن',
        whatsapp: 'واتساب'
      },
      en: {
        email: 'Email',
        phone: 'Phone',
        linkedin: 'LinkedIn',
        whatsapp: 'WhatsApp'
      }
    }
    
    return preferences[locale as keyof typeof preferences]?.[preference] || preferences.en[preference]
  },

  /**
   * Get contact preference icon
   */
  getContactPreferenceIcon: (preference: ContactPreference): string => {
    const iconMap = {
      email: 'heroicons:envelope-20-solid',
      phone: 'heroicons:phone-20-solid',
      linkedin: 'heroicons:linkedin-20-solid',
      whatsapp: 'heroicons:chat-bubble-left-right-20-solid'
    }
    
    return iconMap[preference] || iconMap.email
  }
}

/**
 * General formatting utilities
 */
export const generalFormatters = {
  /**
   * Truncate text with ellipsis
   */
  truncateText: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  },

  /**
   * Format list with proper conjunctions
   */
  formatList: (items: string[], locale: string = 'en'): string => {
    if (items.length === 0) return ''
    if (items.length === 1) return items[0]!
    if (items.length === 2) {
      return locale === 'ar' ? `${items[0]} و ${items[1]}` : `${items[0]} and ${items[1]}`
    }
    
    const lastItem = items[items.length - 1]
    const otherItems = items.slice(0, -1)
    const conjunction = locale === 'ar' ? 'و' : 'and'
    
    return `${otherItems.join(', ')} ${conjunction} ${lastItem}`
  },

  /**
   * Convert string to slug format
   */
  slugify: (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  },

  /**
   * Capitalize first letter of each word
   */
  titleCase: (text: string): string => {
    return text.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()
    )
  },

  /**
   * Format number with locale-specific formatting
   */
  formatNumber: (num: number, locale: string = 'en'): string => {
    return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US').format(num)
  }
}

/**
 * Export all formatters as a single object for easy importing
 */
export const personalDataFormatters = {
  date: dateFormatters,
  skill: skillFormatters,
  project: projectFormatters,
  socialMedia: socialMediaFormatters,
  contact: contactFormatters,
  general: generalFormatters
}