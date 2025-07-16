/**
 * Safe Personal Data Composable
 * 
 * Enhanced version of usePersonalData with comprehensive error handling,
 * fallback mechanisms, and runtime validation. This composable ensures
 * the application remains stable even with incomplete or malformed data.
 */

import type {
  PersonalData,
  MultilingualText,
  OptionalMultilingualText,
  PersonalDataLanguage,
  SkillLevel,
  ProjectStatus
} from '~/types/personal'
import { PersonalDataTypeGuards, PersonalDataValidation } from '~/types/personal'

/**
 * Error types for personal data operations
 */
interface PersonalDataError {
  type: 'missing_data' | 'invalid_format' | 'translation_missing' | 'runtime_error'
  field: string
  message: string
  fallbackUsed: boolean
}

/**
 * Safe personal data composable with error handling
 */
export const usePersonalDataSafe = () => {
  const appConfig = useAppConfig()
  const { currentLocale } = useLanguage()
  
  // Error tracking
  const errors = ref<PersonalDataError[]>([])
  const hasErrors = computed(() => errors.value.length > 0)

  /**
   * Log error for debugging in development
   */
  const logError = (error: PersonalDataError) => {
    errors.value.push(error)
    
    if (process.dev) {
      console.warn(`[PersonalData] ${error.type}: ${error.message}`, {
        field: error.field,
        fallbackUsed: error.fallbackUsed
      })
    }
  }

  /**
   * Clear all logged errors
   */
  const clearErrors = () => {
    errors.value = []
  }

  /**
   * Safe helper function to get localized text with comprehensive error handling
   */
  const safeGetLocalizedText = (
    text: MultilingualText | OptionalMultilingualText | undefined,
    fieldName: string,
    fallbackText = '',
    fallbackLocale: PersonalDataLanguage = 'en'
  ): string => {
    try {
      // Handle undefined/null
      if (!text) {
        if (fallbackText) {
          logError({
            type: 'missing_data',
            field: fieldName,
            message: `Missing text data for field '${fieldName}', using fallback`,
            fallbackUsed: true
          })
          return fallbackText
        }
        return ''
      }

      // Handle string (non-multilingual)
      if (typeof text === 'string') {
        return text
      }

      // Validate multilingual text structure
      if (!PersonalDataTypeGuards.isMultilingualText(text)) {
        logError({
          type: 'invalid_format',
          field: fieldName,
          message: `Invalid multilingual text format for field '${fieldName}'`,
          fallbackUsed: true
        })
        return fallbackText
      }

      const currentLang = currentLocale.value as PersonalDataLanguage
      
      // Try current language
      if (text[currentLang] && typeof text[currentLang] === 'string') {
        return text[currentLang]
      }

      // Try fallback language
      if (text[fallbackLocale] && typeof text[fallbackLocale] === 'string') {
        logError({
          type: 'translation_missing',
          field: fieldName,
          message: `Missing translation for '${currentLang}' in field '${fieldName}', using '${fallbackLocale}'`,
          fallbackUsed: true
        })
        return text[fallbackLocale]
      }

      // Try any available language
      const availableLanguages = Object.keys(text) as PersonalDataLanguage[]
      for (const lang of availableLanguages) {
        if (text[lang] && typeof text[lang] === 'string') {
          logError({
            type: 'translation_missing',
            field: fieldName,
            message: `Using '${lang}' translation as last resort for field '${fieldName}'`,
            fallbackUsed: true
          })
          return text[lang]
        }
      }

      // Final fallback
      logError({
        type: 'missing_data',
        field: fieldName,
        message: `No valid translations found for field '${fieldName}', using fallback text`,
        fallbackUsed: true
      })
      return fallbackText

    } catch (error) {
      logError({
        type: 'runtime_error',
        field: fieldName,
        message: `Runtime error processing field '${fieldName}': ${error}`,
        fallbackUsed: true
      })
      return fallbackText
    }
  }

  /**
   * Safe helper for multilingual text arrays
   */
  const safeGetLocalizedTextArray = (
    textArray: MultilingualText[] | undefined,
    fieldName: string
  ): string[] => {
    try {
      if (!textArray || !Array.isArray(textArray)) {
        if (textArray !== undefined) {
          logError({
            type: 'invalid_format',
            field: fieldName,
            message: `Expected array for field '${fieldName}', got ${typeof textArray}`,
            fallbackUsed: true
          })
        }
        return []
      }

      return textArray.map((text, index) => 
        safeGetLocalizedText(text, `${fieldName}[${index}]`, '')
      ).filter(text => text.length > 0)

    } catch (error) {
      logError({
        type: 'runtime_error',
        field: fieldName,
        message: `Runtime error processing array field '${fieldName}': ${error}`,
        fallbackUsed: true
      })
      return []
    }
  }

  /**
   * Safe helper for multilingual files
   */
  const safeGetLocalizedFile = (
    file: { ar: string; en: string } | undefined,
    fieldName: string,
    fallbackFile = ''
  ): string => {
    try {
      if (!file || typeof file !== 'object') {
        logError({
          type: 'missing_data',
          field: fieldName,
          message: `Missing file data for field '${fieldName}'`,
          fallbackUsed: true
        })
        return fallbackFile
      }

      const currentLang = currentLocale.value as PersonalDataLanguage
      
      if (file[currentLang] && typeof file[currentLang] === 'string') {
        return file[currentLang]
      }

      // Fallback to English
      if (file.en && typeof file.en === 'string') {
        logError({
          type: 'translation_missing',
          field: fieldName,
          message: `Missing file for '${currentLang}' in field '${fieldName}', using English version`,
          fallbackUsed: true
        })
        return file.en
      }

      // Fallback to Arabic
      if (file.ar && typeof file.ar === 'string') {
        logError({
          type: 'translation_missing',
          field: fieldName,
          message: `Missing file for '${currentLang}' in field '${fieldName}', using Arabic version`,
          fallbackUsed: true
        })
        return file.ar
      }

      logError({
        type: 'missing_data',
        field: fieldName,
        message: `No valid file paths found for field '${fieldName}'`,
        fallbackUsed: true
      })
      return fallbackFile

    } catch (error) {
      logError({
        type: 'runtime_error',
        field: fieldName,
        message: `Runtime error processing file field '${fieldName}': ${error}`,
        fallbackUsed: true
      })
      return fallbackFile
    }
  }

  /**
   * Validate personal data structure
   */
  const validatePersonalData = (): boolean => {
    try {
      const personalData = appConfig.personalData

      if (!personalData || typeof personalData !== 'object') {
        logError({
          type: 'missing_data',
          field: 'personalData',
          message: 'Personal data configuration is missing or invalid',
          fallbackUsed: false
        })
        return false
      }

      // Validate required sections
      const requiredSections = ['profile', 'skills', 'experience', 'projects', 'education', 'contact', 'social']
      
      for (const section of requiredSections) {
        if (!personalData[section as keyof PersonalData]) {
          logError({
            type: 'missing_data',
            field: section,
            message: `Required section '${section}' is missing from personal data`,
            fallbackUsed: false
          })
        }
      }

      // Validate profile required fields
      if (personalData.profile) {
        const requiredProfileFields = ['name', 'title', 'bio', 'location', 'avatar', 'resume', 'yearsOfExperience']
        
        for (const field of requiredProfileFields) {
          if (!personalData.profile[field as keyof typeof personalData.profile]) {
            logError({
              type: 'missing_data',
              field: `profile.${field}`,
              message: `Required profile field '${field}' is missing`,
              fallbackUsed: false
            })
          }
        }
      }

      // Validate email format
      if (personalData.contact?.email) {
        if (!PersonalDataValidation.email.test(personalData.contact.email)) {
          logError({
            type: 'invalid_format',
            field: 'contact.email',
            message: `Invalid email format: ${personalData.contact.email}`,
            fallbackUsed: false
          })
        }
      }

      // Validate phone format (if provided)
      if (personalData.contact?.phone) {
        if (!PersonalDataValidation.phone.test(personalData.contact.phone)) {
          logError({
            type: 'invalid_format',
            field: 'contact.phone',
            message: `Invalid phone format: ${personalData.contact.phone}`,
            fallbackUsed: false
          })
        }
      }

      // Validate URLs in social media
      personalData.social?.forEach((social, index) => {
        if (social.url && !PersonalDataValidation.url.test(social.url)) {
          logError({
            type: 'invalid_format',
            field: `social[${index}].url`,
            message: `Invalid URL format: ${social.url}`,
            fallbackUsed: false
          })
        }
      })

      return errors.value.length === 0

    } catch (error) {
      logError({
        type: 'runtime_error',
        field: 'validation',
        message: `Runtime error during validation: ${error}`,
        fallbackUsed: false
      })
      return false
    }
  }

  /**
   * Safe computed properties with error handling
   */
  const safeProfile = computed(() => {
    try {
      const profileData = appConfig.personalData?.profile

      if (!profileData) {
        logError({
          type: 'missing_data',
          field: 'profile',
          message: 'Profile data is missing',
          fallbackUsed: true
        })
        return {
          name: 'Name Not Available',
          title: 'Title Not Available',
          bio: 'Bio not available',
          location: 'Location not available',
          avatar: '/images/default-avatar.jpg',
          resume: '',
          yearsOfExperience: 0,
          tagline: '',
          availability: ''
        }
      }

      return {
        name: safeGetLocalizedText(profileData.name, 'profile.name', 'Name Not Available'),
        title: safeGetLocalizedText(profileData.title, 'profile.title', 'Title Not Available'),
        bio: safeGetLocalizedText(profileData.bio, 'profile.bio', 'Bio not available'),
        location: safeGetLocalizedText(profileData.location, 'profile.location', 'Location not available'),
        avatar: profileData.avatar || '/images/default-avatar.jpg',
        resume: safeGetLocalizedFile(profileData.resume, 'profile.resume'),
        yearsOfExperience: typeof profileData.yearsOfExperience === 'number' ? profileData.yearsOfExperience : 0,
        tagline: safeGetLocalizedText(profileData.tagline, 'profile.tagline'),
        availability: safeGetLocalizedText(profileData.availability, 'profile.availability')
      }
    } catch (error) {
      logError({
        type: 'runtime_error',
        field: 'profile',
        message: `Runtime error processing profile: ${error}`,
        fallbackUsed: true
      })
      return {
        name: 'Error Loading Profile',
        title: 'Error Loading Title',
        bio: 'Error loading bio',
        location: 'Error loading location',
        avatar: '/images/default-avatar.jpg',
        resume: '',
        yearsOfExperience: 0,
        tagline: '',
        availability: ''
      }
    }
  })

  /**
   * Safe skills with error handling
   */
  const safeSkills = computed(() => {
    try {
      const skillsData = appConfig.personalData?.skills

      if (!skillsData || !Array.isArray(skillsData)) {
        logError({
          type: 'missing_data',
          field: 'skills',
          message: 'Skills data is missing or invalid',
          fallbackUsed: true
        })
        return []
      }

      return skillsData.map((category, categoryIndex) => {
        try {
          return {
            name: safeGetLocalizedText(category.name, `skills[${categoryIndex}].name`, 'Unnamed Category'),
            icon: category.icon,
            description: safeGetLocalizedText(category.description, `skills[${categoryIndex}].description`),
            skills: (category.skills || []).map((skill, skillIndex) => ({
              name: safeGetLocalizedText(skill.name, `skills[${categoryIndex}].skills[${skillIndex}].name`, 'Unnamed Skill'),
              level: PersonalDataTypeGuards.isSkillLevel(skill.level) ? skill.level : 'intermediate',
              years: typeof skill.years === 'number' ? skill.years : undefined,
              description: safeGetLocalizedText(skill.description, `skills[${categoryIndex}].skills[${skillIndex}].description`),
              featured: Boolean(skill.featured),
              icon: skill.icon,
              certification: safeGetLocalizedText(skill.certification, `skills[${categoryIndex}].skills[${skillIndex}].certification`)
            }))
          }
        } catch (error) {
          logError({
            type: 'runtime_error',
            field: `skills[${categoryIndex}]`,
            message: `Error processing skill category: ${error}`,
            fallbackUsed: true
          })
          return {
            name: 'Error Loading Category',
            icon: undefined,
            description: '',
            skills: []
          }
        }
      })
    } catch (error) {
      logError({
        type: 'runtime_error',
        field: 'skills',
        message: `Runtime error processing skills: ${error}`,
        fallbackUsed: true
      })
      return []
    }
  })

  /**
   * Get error summary for debugging
   */
  const getErrorSummary = () => {
    const summary = {
      total: errors.value.length,
      byType: {} as Record<string, number>,
      critical: errors.value.filter(e => e.type === 'missing_data' && !e.fallbackUsed),
      warnings: errors.value.filter(e => e.fallbackUsed)
    }

    errors.value.forEach(error => {
      summary.byType[error.type] = (summary.byType[error.type] || 0) + 1
    })

    return summary
  }

  /**
   * Initialize validation on composable creation
   */
  onMounted(() => {
    validatePersonalData()
  })

  return {
    // Safe data access
    profile: safeProfile,
    skills: safeSkills,
    
    // Error handling
    errors: readonly(errors),
    hasErrors,
    clearErrors,
    validatePersonalData,
    getErrorSummary,
    
    // Safe helper functions
    safeGetLocalizedText,
    safeGetLocalizedTextArray,
    safeGetLocalizedFile
  }
}