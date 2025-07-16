/**
 * Personal Data Composable
 * 
 * Provides reactive access to centralized personal and professional information
 * with automatic language switching, type safety, and utility functions.
 * This composable serves as the single source of truth for all personal data
 * throughout the application.
 */

import type {
  PersonalData,
  PersonalProfile,
  SkillCategory,
  Experience,
  Project,
  Education,
  ContactInfo,
  SocialMedia,
  MultilingualText,
  OptionalMultilingualText,
  PersonalDataLanguage,
  SkillLevel,
  ProjectStatus
} from '~/types/personal'

/**
 * Localized personal data interface with computed string values
 */
interface LocalizedPersonalData {
  profile: {
    name: string
    title: string
    bio: string
    location: string
    avatar: string
    resume?: string
    yearsOfExperience: number
    tagline?: string
    availability?: string
  }
  skills: Array<{
    name: string
    icon?: string
    description?: string
    skills: Array<{
      name: string
      level: SkillLevel
      years?: number
      description?: string
      featured?: boolean
    }>
  }>
  experience: Array<{
    company: string
    position: string
    description: string
    startDate: string
    endDate?: string | null
    location: string
    technologies: string[]
    achievements?: string[]
    companyUrl?: string
    type?: string
    featured?: boolean
  }>
  projects: Array<{
    name: string
    description: string
    longDescription?: string
    technologies: string[]
    url?: string
    github?: string
    image?: string
    featured: boolean
    status: ProjectStatus
    startDate: string
    endDate?: string
    client?: string
    highlights?: string[]
  }>
  education: Array<{
    institution: string
    degree: string
    field: string
    startDate: string
    endDate?: string
    location: string
    gpa?: string
    achievements?: string[]
    coursework?: string[]
    featured?: boolean
  }>
  contact: {
    email: string
    phone?: string
    location: string
    availability: string
    preferredContact: string
    timezone?: string
    languages?: string[]
    responseTime?: string
  }
  social: SocialMedia[]
}

/**
 * Main composable for accessing personal data
 */
export const usePersonalData = () => {
  const appConfig = useAppConfig()
  const { currentLocale } = useLanguage()

  // Validate personal data in development
  if (process.dev) {
    try {
      import('~/utils/personalDataValidators').then(({ validatePersonalDataInDev }) => {
        validatePersonalDataInDev(appConfig.personalData)
      })
    } catch (error) {
      console.warn('[PersonalData] Validation skipped:', error)
    }
  }

  /**
   * Helper function to get localized text with fallback support and error handling
   */
  const getLocalizedText = (
    text: MultilingualText | OptionalMultilingualText | undefined,
    fallbackLocale: PersonalDataLanguage = 'en'
  ): string => {
    try {
      if (!text) return ''
      
      if (typeof text === 'string') return text
      
      // Validate structure
      if (typeof text !== 'object' || text === null) {
        console.warn('[PersonalData] Invalid text structure:', text)
        return ''
      }
      
      const currentLang = currentLocale.value as PersonalDataLanguage
      
      // Try current language
      if (text[currentLang] && typeof text[currentLang] === 'string') {
        return text[currentLang]
      }
      
      // Try fallback language
      if (text[fallbackLocale] && typeof text[fallbackLocale] === 'string') {
        if (process.dev) {
          console.warn(`[PersonalData] Missing translation for '${currentLang}', using '${fallbackLocale}'`)
        }
        return text[fallbackLocale]
      }
      
      // Try any available language
      const availableKeys = Object.keys(text) as PersonalDataLanguage[]
      for (const key of availableKeys) {
        if (text[key] && typeof text[key] === 'string') {
          if (process.dev) {
            console.warn(`[PersonalData] Using '${key}' as last resort translation`)
          }
          return text[key]
        }
      }
      
      return ''
    } catch (error) {
      console.error('[PersonalData] Error processing localized text:', error)
      return ''
    }
  }

  /**
   * Helper function to get localized array of texts with error handling
   */
  const getLocalizedTextArray = (
    textArray: MultilingualText[] | undefined
  ): string[] => {
    try {
      if (!textArray || !Array.isArray(textArray)) {
        if (textArray !== undefined && process.dev) {
          console.warn('[PersonalData] Expected array, got:', typeof textArray)
        }
        return []
      }
      
      return textArray
        .map(text => getLocalizedText(text))
        .filter(text => text.length > 0)
    } catch (error) {
      console.error('[PersonalData] Error processing text array:', error)
      return []
    }
  }

  /**
   * Get localized file path (for resumes, documents) with error handling
   */
  const getLocalizedFile = (file: { ar: string; en: string } | undefined): string => {
    try {
      if (!file || typeof file !== 'object') {
        if (process.dev) {
          console.warn('[PersonalData] Invalid file structure:', file)
        }
        return ''
      }
      
      const currentLang = currentLocale.value as PersonalDataLanguage
      
      if (file[currentLang] && typeof file[currentLang] === 'string') {
        return file[currentLang]
      }
      
      if (file.en && typeof file.en === 'string') {
        if (process.dev) {
          console.warn(`[PersonalData] Missing file for '${currentLang}', using English version`)
        }
        return file.en
      }
      
      if (file.ar && typeof file.ar === 'string') {
        if (process.dev) {
          console.warn(`[PersonalData] Missing file for '${currentLang}', using Arabic version`)
        }
        return file.ar
      }
      
      return ''
    } catch (error) {
      console.error('[PersonalData] Error processing file path:', error)
      return ''
    }
  }

  /**
   * Reactive computed property for localized profile data
   */
  const profile = computed(() => ({
    name: getLocalizedText(appConfig.personalData.profile.name),
    title: getLocalizedText(appConfig.personalData.profile.title),
    bio: getLocalizedText(appConfig.personalData.profile.bio),
    location: getLocalizedText(appConfig.personalData.profile.location),
    avatar: appConfig.personalData.profile.avatar,
    resume: appConfig.personalData.profile.resume ? getLocalizedFile(appConfig.personalData.profile.resume) : undefined,
    yearsOfExperience: appConfig.personalData.profile.yearsOfExperience,
    tagline: getLocalizedText(appConfig.personalData.profile.tagline),
    availability: getLocalizedText(appConfig.personalData.profile.availability)
  }))

  /**
   * Reactive computed property for localized skills data
   */
  const skills = computed(() =>
    appConfig.personalData.skills.map((category, index) => ({
      id: category.name.en.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, ''),
      name: getLocalizedText(category.name),
      icon: category.icon,
      description: getLocalizedText(category.description || ''),
      skills: category.skills.map(skill => ({
        name: getLocalizedText(skill.name),
        level: skill.level,
        years: skill.years,
        description: getLocalizedText(skill.description || ''),
        featured: skill.featured,
        icon: skill.icon || '',
        certification: getLocalizedText(skill.certification || ''),
        categoryId: category.name.en.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, ''),
        categoryName: getLocalizedText(category.name)
      }))
    }))
  )

  /**
   * Reactive computed property for localized experience data
   */
  const experience = computed(() =>
    appConfig.personalData.experience.map(exp => ({
      company: getLocalizedText(exp.company),
      position: getLocalizedText(exp.position),
      description: getLocalizedText(exp.description),
      startDate: exp.startDate,
      endDate: exp.endDate,
      location: getLocalizedText(exp.location),
      technologies: exp.technologies,
      achievements: getLocalizedTextArray(exp.achievements),
      companyUrl: exp.companyUrl,
      companyLogo: (exp as any).companyLogo || '',
      type: exp.type,
      featured: exp.featured
    }))
  )

  /**
   * Reactive computed property for localized projects data
   */
  const projects = computed(() =>
    appConfig.personalData.projects.map(project => ({
      name: getLocalizedText(project.name),
      description: getLocalizedText(project.description),
      longDescription: getLocalizedText(project.longDescription),
      technologies: project.technologies,
      url: project.url,
      github: project.github,
      image: project.image,
      gallery: (project as any).gallery || [],
      featured: project.featured,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
      client: getLocalizedText(project.client),
      category: (project as any).category || '',
      highlights: getLocalizedTextArray(project.highlights),
      challenges: getLocalizedTextArray((project as any).challenges || [])
    }))
  )

  /**
   * Reactive computed property for localized education data
   */
  const education = computed(() =>
    appConfig.personalData.education.map(edu => ({
      institution: getLocalizedText(edu.institution),
      degree: getLocalizedText(edu.degree),
      field: getLocalizedText(edu.field),
      startDate: edu.startDate,
      endDate: edu.endDate,
      location: getLocalizedText(edu.location),
      gpa: edu.gpa,
      achievements: getLocalizedTextArray(edu.achievements),
      logo: (edu as any).logo || '',
      coursework: edu.coursework,
      thesis: getLocalizedText((edu as any).thesis || ''),
      featured: edu.featured
    }))
  )

  /**
   * Reactive computed property for localized contact data
   */
  const contact = computed(() => ({
    email: appConfig.personalData.contact.email,
    phone: appConfig.personalData.contact.phone,
    location: getLocalizedText(appConfig.personalData.contact.location),
    availability: getLocalizedText(appConfig.personalData.contact.availability),
    preferredContact: appConfig.personalData.contact.preferredContact,
    timezone: appConfig.personalData.contact.timezone,
    languages: getLocalizedTextArray(appConfig.personalData.contact.languages),
    responseTime: getLocalizedText(appConfig.personalData.contact.responseTime)
  }))

  /**
   * Reactive computed property for social media data (no localization needed)
   */
  const social = computed(() => appConfig.personalData.social)

  // Utility Functions

  /**
   * Get featured projects with optional limit
   */
  const getFeaturedProjects = (limit?: number) => {
    const featured = projects.value.filter(p => p.featured)
    return limit ? featured.slice(0, limit) : featured
  }

  /**
   * Get projects by status
   */
  const getProjectsByStatus = (status: ProjectStatus) => {
    return projects.value.filter(p => p.status === status)
  }

  /**
   * Get skills by category name
   */
  const getSkillsByCategory = (categoryName: string) => {
    const category = skills.value.find(cat => 
      cat.name.toLowerCase().includes(categoryName.toLowerCase())
    )
    return category?.skills || []
  }

  /**
   * Get featured skills across all categories
   */
  const getFeaturedSkills = () => {
    const featuredSkills: Array<{
      name: string
      level: SkillLevel
      years?: number
      description?: string
      category: string
    }> = []

    skills.value.forEach(category => {
      category.skills.forEach(skill => {
        if (skill.featured) {
          featuredSkills.push({
            name: skill.name,
            level: skill.level as SkillLevel,
            years: skill.years,
            description: skill.description,
            category: category.name
          })
        }
      })
    })

    return featuredSkills
  }

  /**
   * Get primary social media profiles
   */
  const getPrimarySocialMedia = () => {
    return social.value.filter(s => s.primary)
  }

  /**
   * Get featured experience entries
   */
  const getFeaturedExperience = () => {
    return experience.value.filter(exp => exp.featured)
  }

  /**
   * Get current job (experience with no end date)
   */
  const getCurrentJob = () => {
    return experience.value.find(exp => !exp.endDate)
  }

  /**
   * Get featured education entries
   */
  const getFeaturedEducation = () => {
    return education.value.filter(edu => edu.featured)
  }

  /**
   * Calculate total years of experience
   */
  const getTotalExperience = () => {
    return profile.value.yearsOfExperience
  }

  /**
   * Get skills by proficiency level
   */
  const getSkillsByLevel = (level: SkillLevel) => {
    const skillsByLevel: Array<{
      name: string
      category: string
      years?: number
      description?: string
    }> = []

    skills.value.forEach(category => {
      category.skills.forEach(skill => {
        if (skill.level === level) {
          skillsByLevel.push({
            name: skill.name,
            category: category.name,
            years: skill.years,
            description: skill.description
          })
        }
      })
    })

    return skillsByLevel
  }

  /**
   * Get contact information by preference
   */
  const getPreferredContact = () => {
    const preference = contact.value.preferredContact
    
    switch (preference) {
      case 'email':
        return {
          type: 'email',
          value: contact.value.email,
          url: `mailto:${contact.value.email}`
        }
      case 'phone':
        return {
          type: 'phone',
          value: contact.value.phone,
          url: `tel:${contact.value.phone}`
        }
      case 'linkedin':
        const linkedin = social.value.find(s => s.platform.toLowerCase() === 'linkedin')
        return {
          type: 'linkedin',
          value: linkedin?.username,
          url: linkedin?.url
        }
      default:
        return {
          type: 'email',
          value: contact.value.email,
          url: `mailto:${contact.value.email}`
        }
    }
  }

  /**
   * Search functionality across all personal data
   */
  const searchPersonalData = (query: string) => {
    const results: Array<{
      type: 'skill' | 'project' | 'experience' | 'education'
      title: string
      description: string
      relevance: number
    }> = []

    const searchTerm = query.toLowerCase()

    // Search skills
    skills.value.forEach(category => {
      category.skills.forEach(skill => {
        if (skill.name.toLowerCase().includes(searchTerm) ||
            skill.description?.toLowerCase().includes(searchTerm)) {
          results.push({
            type: 'skill',
            title: skill.name,
            description: skill.description || `${skill.level} level skill`,
            relevance: skill.featured ? 2 : 1
          })
        }
      })
    })

    // Search projects
    projects.value.forEach(project => {
      if (project.name.toLowerCase().includes(searchTerm) ||
          project.description.toLowerCase().includes(searchTerm) ||
          project.technologies.some(tech => tech.toLowerCase().includes(searchTerm))) {
        results.push({
          type: 'project',
          title: project.name,
          description: project.description,
          relevance: project.featured ? 2 : 1
        })
      }
    })

    // Search experience
    experience.value.forEach(exp => {
      if (exp.company.toLowerCase().includes(searchTerm) ||
          exp.position.toLowerCase().includes(searchTerm) ||
          exp.description.toLowerCase().includes(searchTerm)) {
        results.push({
          type: 'experience',
          title: `${exp.position} at ${exp.company}`,
          description: exp.description,
          relevance: exp.featured ? 2 : 1
        })
      }
    })

    // Sort by relevance
    return results.sort((a, b) => b.relevance - a.relevance)
  }

  return {
    // Main data sections
    profile,
    skills,
    experience,
    projects,
    education,
    contact,
    social,

    // Utility functions
    getFeaturedProjects,
    getProjectsByStatus,
    getSkillsByCategory,
    getFeaturedSkills,
    getPrimarySocialMedia,
    getFeaturedExperience,
    getCurrentJob,
    getFeaturedEducation,
    getTotalExperience,
    getSkillsByLevel,
    getPreferredContact,
    searchPersonalData,

    // Helper functions
    getLocalizedText,
    getLocalizedTextArray,
    getLocalizedFile
  }
}