/**
 * Personal Data Types and Interfaces
 * 
 * This file defines comprehensive TypeScript interfaces for all personal and
 * professional information used throughout the website. These interfaces ensure
 * type safety, multilingual support, and consistent data structure across
 * all components and pages.
 */

/**
 * Base multilingual text interface for content that needs translation
 */
export interface MultilingualText {
  /** Arabic text content */
  ar: string
  /** English text content */
  en: string
}

/**
 * Multilingual file interface for language-specific documents
 */
export interface MultilingualFile {
  /** Arabic version file path */
  ar: string
  /** English version file path */
  en: string
}

/**
 * Optional multilingual text that can fallback to a single language
 */
export type OptionalMultilingualText = MultilingualText | string

/**
 * Skill proficiency levels
 */
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

/**
 * Project status types
 */
export type ProjectStatus = 'completed' | 'in-progress' | 'planned' | 'on-hold'

/**
 * Contact preference types
 */
export type ContactPreference = 'email' | 'phone' | 'linkedin' | 'whatsapp'

/**
 * Personal profile information
 */
export interface PersonalProfile {
  /** Full name in both languages */
  name: MultilingualText
  /** Professional title/role */
  title: MultilingualText
  /** Professional bio/summary */
  bio: MultilingualText
  /** Current location */
  location: MultilingualText
  /** Profile avatar image path */
  avatar: string
  /** Resume/CV files in both languages */
  resume?: MultilingualFile
  /** Years of professional experience */
  yearsOfExperience: number
  /** Date of birth (optional, for age calculation) */
  dateOfBirth?: string
  /** Professional tagline/motto */
  tagline?: MultilingualText
  /** Current availability status */
  availability?: MultilingualText
}

/**
 * Individual skill information
 */
export interface Skill {
  /** Skill name */
  name: OptionalMultilingualText
  /** Proficiency level */
  level: SkillLevel
  /** Years of experience with this skill */
  years?: number
  /** Detailed description of skill */
  description?: MultilingualText
  /** Skill icon (optional) */
  icon?: string
  /** Whether this is a featured/primary skill */
  featured?: boolean
  /** Certification or credential related to skill */
  certification?: MultilingualText
}

/**
 * Skill category grouping
 */
export interface SkillCategory {
  /** Category name */
  name: MultilingualText
  /** Skills in this category */
  skills: Skill[]
  /** Category icon */
  icon?: string
  /** Category description */
  description?: MultilingualText
  /** Display order */
  order?: number
}

/**
 * Professional experience entry
 */
export interface Experience {
  /** Company/organization name */
  company: MultilingualText
  /** Job position/title */
  position: MultilingualText
  /** Job description and responsibilities */
  description: MultilingualText
  /** Employment start date (YYYY-MM format) */
  startDate: string
  /** Employment end date (YYYY-MM format, null for current) */
  endDate?: string | null
  /** Work location */
  location: MultilingualText
  /** Technologies and tools used */
  technologies: string[]
  /** Key achievements and accomplishments */
  achievements?: MultilingualText[]
  /** Company website URL */
  companyUrl?: string
  /** Company logo image path */
  companyLogo?: string
  /** Employment type */
  type?: 'full-time' | 'part-time' | 'contract' | 'freelance' | 'internship'
  /** Whether this is a featured experience */
  featured?: boolean
}

/**
 * Project showcase entry
 */
export interface Project {
  /** Project name */
  name: MultilingualText
  /** Short project description */
  description: MultilingualText
  /** Detailed project description */
  longDescription?: MultilingualText
  /** Technologies and frameworks used */
  technologies: string[]
  /** Live project URL */
  url?: string
  /** GitHub repository URL */
  github?: string
  /** Project image/screenshot */
  image?: string
  /** Additional project images */
  gallery?: string[]
  /** Whether this is a featured project */
  featured: boolean
  /** Current project status */
  status: ProjectStatus
  /** Project start date */
  startDate: string
  /** Project completion date */
  endDate?: string
  /** Client/company name (if applicable) */
  client?: MultilingualText
  /** Project category/type */
  category?: string
  /** Key features or highlights */
  highlights?: MultilingualText[]
  /** Challenges faced and solutions */
  challenges?: MultilingualText[]
}

/**
 * Education background entry
 */
export interface Education {
  /** Educational institution name */
  institution: MultilingualText
  /** Degree type (Bachelor's, Master's, etc.) */
  degree: MultilingualText
  /** Field of study */
  field: MultilingualText
  /** Education start date */
  startDate: string
  /** Education end date */
  endDate?: string
  /** Institution location */
  location: MultilingualText
  /** GPA or grade */
  gpa?: string
  /** Academic achievements */
  achievements?: MultilingualText[]
  /** Institution logo */
  logo?: string
  /** Relevant coursework */
  coursework?: string[]
  /** Thesis or final project title */
  thesis?: MultilingualText
  /** Whether this education is featured */
  featured?: boolean
}

/**
 * Certification or course entry
 */
export interface Certification {
  /** Certification name */
  name: MultilingualText
  /** Issuing organization */
  issuer: MultilingualText
  /** Issue date */
  issueDate: string
  /** Expiration date (if applicable) */
  expirationDate?: string
  /** Certification URL or credential ID */
  credentialUrl?: string
  /** Certification badge/logo */
  badge?: string
  /** Description of what was learned */
  description?: MultilingualText
  /** Skills gained from certification */
  skills?: string[]
}

/**
 * Contact information
 */
export interface ContactInfo {
  /** Primary email address */
  email: string
  /** Phone number (optional) */
  phone?: string
  /** Current location */
  location: MultilingualText
  /** Availability status */
  availability: MultilingualText
  /** Preferred contact method */
  preferredContact: ContactPreference
  /** Time zone */
  timezone?: string
  /** Languages spoken */
  languages?: MultilingualText[]
  /** Response time expectation */
  responseTime?: MultilingualText
}

/**
 * Social media profile
 */
export interface SocialMedia {
  /** Platform name (GitHub, LinkedIn, etc.) */
  platform: string
  /** Profile URL */
  url: string
  /** Username/handle */
  username: string
  /** Platform icon identifier */
  icon: string
  /** Whether this is a primary/featured social profile */
  primary: boolean
  /** Display name (if different from username) */
  displayName?: string
  /** Platform-specific metrics (followers, etc.) */
  metrics?: {
    followers?: number
    following?: number
    posts?: number
  }
}

/**
 * Testimonial or recommendation
 */
export interface Testimonial {
  /** Person giving testimonial */
  name: MultilingualText
  /** Their position/title */
  position: MultilingualText
  /** Their company */
  company: MultilingualText
  /** Testimonial content */
  content: MultilingualText
  /** Their photo */
  photo?: string
  /** Date of testimonial */
  date: string
  /** Rating (1-5 stars) */
  rating?: number
  /** Relationship to you */
  relationship: 'colleague' | 'client' | 'manager' | 'mentor' | 'other'
}

/**
 * Complete personal data structure
 */
export interface PersonalData {
  /** Personal profile information */
  profile: PersonalProfile
  /** Professional experience history */
  experience: Experience[]
  /** Skills organized by categories */
  skills: SkillCategory[]
  /** Project portfolio */
  projects: Project[]
  /** Educational background */
  education: Education[]
  /** Certifications and courses */
  certifications?: Certification[]
  /** Contact information */
  contact: ContactInfo
  /** Social media profiles */
  social: SocialMedia[]
  /** Testimonials and recommendations */
  testimonials?: Testimonial[]
}

/**
 * Utility type for getting localized content
 */
export type LocalizedContent<T> = T extends MultilingualText 
  ? string 
  : T extends MultilingualFile 
    ? string 
    : T

/**
 * Language codes supported by the personal data system
 */
export type PersonalDataLanguage = 'ar' | 'en'

/**
 * Default values for optional fields
 */
export const PersonalDataDefaults = {
  skillLevel: 'intermediate' as SkillLevel,
  projectStatus: 'completed' as ProjectStatus,
  contactPreference: 'email' as ContactPreference,
  experienceType: 'full-time' as Experience['type'],
  testimonialRelationship: 'colleague' as Testimonial['relationship']
} as const

/**
 * Validation patterns for personal data
 */
export const PersonalDataValidation = {
  /** Email validation pattern */
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  
  /** Phone number validation pattern (international format) */
  phone: /^\+?[\d\s\-\(\)]+$/,
  
  /** URL validation pattern */
  url: /^https?:\/\/.+/,
  
  /** Date format pattern (YYYY-MM or YYYY-MM-DD) */
  date: /^\d{4}-\d{2}(-\d{2})?$/,
  
  /** Skill level values */
  skillLevels: ['beginner', 'intermediate', 'advanced', 'expert'] as const,
  
  /** Project status values */
  projectStatuses: ['completed', 'in-progress', 'planned', 'on-hold'] as const,
  
  /** Contact preference values */
  contactPreferences: ['email', 'phone', 'linkedin', 'whatsapp'] as const
} as const

/**
 * Type guards for runtime validation
 */
export const PersonalDataTypeGuards = {
  isMultilingualText: (value: any): value is MultilingualText => {
    return typeof value === 'object' && 
           value !== null && 
           typeof value.ar === 'string' && 
           typeof value.en === 'string'
  },
  
  isMultilingualFile: (value: any): value is MultilingualFile => {
    return typeof value === 'object' && 
           value !== null && 
           typeof value.ar === 'string' && 
           typeof value.en === 'string'
  },
  
  isSkillLevel: (value: any): value is SkillLevel => {
    return PersonalDataValidation.skillLevels.includes(value)
  },
  
  isProjectStatus: (value: any): value is ProjectStatus => {
    return PersonalDataValidation.projectStatuses.includes(value)
  },
  
  isContactPreference: (value: any): value is ContactPreference => {
    return PersonalDataValidation.contactPreferences.includes(value)
  }
} as const