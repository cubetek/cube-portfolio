/**
 * Personal Data Type Validators
 * 
 * Runtime type validation utilities for personal data to ensure type safety
 * and provide better error messages when data doesn't match expected types.
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
  SkillLevel,
  ProjectStatus,
  ContactPreference
} from '~/types/personal'
import { PersonalDataTypeGuards, PersonalDataValidation } from '~/types/personal'

/**
 * Validation result interface
 */
interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Validation context for better error messages
 */
interface ValidationContext {
  path: string
  field: string
}

/**
 * Validate multilingual text structure
 */
export function validateMultilingualText(
  value: unknown,
  context: ValidationContext,
  required = true
): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] }

  if (!value) {
    if (required) {
      result.isValid = false
      result.errors.push(`${context.path}.${context.field}: Multilingual text is required`)
    }
    return result
  }

  if (typeof value === 'string') {
    result.warnings.push(`${context.path}.${context.field}: Expected multilingual object, got string`)
    return result
  }

  if (!PersonalDataTypeGuards.isMultilingualText(value)) {
    result.isValid = false
    result.errors.push(`${context.path}.${context.field}: Invalid multilingual text structure`)
    return result
  }

  // Check for empty strings
  if (!value.ar.trim() && !value.en.trim()) {
    result.warnings.push(`${context.path}.${context.field}: Both Arabic and English texts are empty`)
  } else if (!value.ar.trim()) {
    result.warnings.push(`${context.path}.${context.field}: Arabic text is empty`)
  } else if (!value.en.trim()) {
    result.warnings.push(`${context.path}.${context.field}: English text is empty`)
  }

  return result
}

/**
 * Validate personal profile data
 */
export function validatePersonalProfile(profile: unknown): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] }

  if (!profile || typeof profile !== 'object') {
    result.isValid = false
    result.errors.push('Profile data is missing or invalid')
    return result
  }

  const p = profile as Partial<PersonalProfile>

  // Required fields validation
  const requiredFields: (keyof PersonalProfile)[] = [
    'name', 'title', 'bio', 'location', 'avatar', 'resume', 'yearsOfExperience'
  ]

  for (const field of requiredFields) {
    if (!p[field]) {
      result.isValid = false
      result.errors.push(`Profile.${field}: Required field is missing`)
      continue
    }

    // Validate multilingual fields
    if (['name', 'title', 'bio', 'location', 'tagline', 'availability'].includes(field)) {
      const validation = validateMultilingualText(
        p[field],
        { path: 'profile', field },
        ['name', 'title', 'bio', 'location'].includes(field)
      )
      result.errors.push(...validation.errors)
      result.warnings.push(...validation.warnings)
      if (!validation.isValid) result.isValid = false
    }
  }

  // Validate years of experience
  if (typeof p.yearsOfExperience !== 'number' || p.yearsOfExperience < 0) {
    result.isValid = false
    result.errors.push('Profile.yearsOfExperience: Must be a positive number')
  }

  // Validate avatar URL
  if (typeof p.avatar !== 'string' || !p.avatar.trim()) {
    result.isValid = false
    result.errors.push('Profile.avatar: Must be a valid image path')
  }

  // Validate resume files
  if (p.resume && typeof p.resume === 'object') {
    if (!PersonalDataTypeGuards.isMultilingualFile(p.resume)) {
      result.isValid = false
      result.errors.push('Profile.resume: Invalid multilingual file structure')
    }
  }

  return result
}

/**
 * Validate skill category data
 */
export function validateSkillCategory(category: unknown, index: number): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] }

  if (!category || typeof category !== 'object') {
    result.isValid = false
    result.errors.push(`Skills[${index}]: Category data is missing or invalid`)
    return result
  }

  const c = category as Partial<SkillCategory>

  // Validate category name
  const nameValidation = validateMultilingualText(
    c.name,
    { path: `skills[${index}]`, field: 'name' },
    true
  )
  result.errors.push(...nameValidation.errors)
  result.warnings.push(...nameValidation.warnings)
  if (!nameValidation.isValid) result.isValid = false

  // Validate skills array
  if (!Array.isArray(c.skills)) {
    result.isValid = false
    result.errors.push(`Skills[${index}].skills: Must be an array`)
  } else {
    c.skills.forEach((skill, skillIndex) => {
      // Validate skill level
      if (!PersonalDataTypeGuards.isSkillLevel(skill.level)) {
        result.isValid = false
        result.errors.push(`Skills[${index}].skills[${skillIndex}].level: Invalid skill level`)
      }

      // Validate years if provided
      if (skill.years !== undefined && (typeof skill.years !== 'number' || skill.years < 0)) {
        result.warnings.push(`Skills[${index}].skills[${skillIndex}].years: Should be a positive number`)
      }
    })
  }

  return result
}

/**
 * Validate experience data
 */
export function validateExperience(experience: unknown, index: number): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] }

  if (!experience || typeof experience !== 'object') {
    result.isValid = false
    result.errors.push(`Experience[${index}]: Data is missing or invalid`)
    return result
  }

  const e = experience as Partial<Experience>

  // Required multilingual fields
  const requiredFields: (keyof Experience)[] = ['company', 'position', 'description', 'location']
  
  for (const field of requiredFields) {
    const validation = validateMultilingualText(
      e[field],
      { path: `experience[${index}]`, field },
      true
    )
    result.errors.push(...validation.errors)
    result.warnings.push(...validation.warnings)
    if (!validation.isValid) result.isValid = false
  }

  // Validate dates
  if (!e.startDate || !PersonalDataValidation.date.test(e.startDate)) {
    result.isValid = false
    result.errors.push(`Experience[${index}].startDate: Invalid date format (expected YYYY-MM or YYYY-MM-DD)`)
  }

  if (e.endDate && !PersonalDataValidation.date.test(e.endDate)) {
    result.isValid = false
    result.errors.push(`Experience[${index}].endDate: Invalid date format (expected YYYY-MM or YYYY-MM-DD)`)
  }

  // Validate technologies array
  if (!Array.isArray(e.technologies)) {
    result.warnings.push(`Experience[${index}].technologies: Should be an array of strings`)
  }

  return result
}

/**
 * Validate project data
 */
export function validateProject(project: unknown, index: number): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] }

  if (!project || typeof project !== 'object') {
    result.isValid = false
    result.errors.push(`Projects[${index}]: Data is missing or invalid`)
    return result
  }

  const p = project as Partial<Project>

  // Required multilingual fields
  const requiredFields: (keyof Project)[] = ['name', 'description']
  
  for (const field of requiredFields) {
    const validation = validateMultilingualText(
      p[field],
      { path: `projects[${index}]`, field },
      true
    )
    result.errors.push(...validation.errors)
    result.warnings.push(...validation.warnings)
    if (!validation.isValid) result.isValid = false
  }

  // Validate project status
  if (!PersonalDataTypeGuards.isProjectStatus(p.status)) {
    result.isValid = false
    result.errors.push(`Projects[${index}].status: Invalid project status`)
  }

  // Validate URLs
  if (p.url && !PersonalDataValidation.url.test(p.url)) {
    result.warnings.push(`Projects[${index}].url: Invalid URL format`)
  }

  if (p.github && !PersonalDataValidation.url.test(p.github)) {
    result.warnings.push(`Projects[${index}].github: Invalid URL format`)
  }

  // Validate dates
  if (!p.startDate || !PersonalDataValidation.date.test(p.startDate)) {
    result.isValid = false
    result.errors.push(`Projects[${index}].startDate: Invalid date format`)
  }

  if (p.endDate && !PersonalDataValidation.date.test(p.endDate)) {
    result.warnings.push(`Projects[${index}].endDate: Invalid date format`)
  }

  // Validate technologies array
  if (!Array.isArray(p.technologies)) {
    result.isValid = false
    result.errors.push(`Projects[${index}].technologies: Must be an array of strings`)
  }

  return result
}

/**
 * Validate contact information
 */
export function validateContactInfo(contact: unknown): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] }

  if (!contact || typeof contact !== 'object') {
    result.isValid = false
    result.errors.push('Contact data is missing or invalid')
    return result
  }

  const c = contact as Partial<ContactInfo>

  // Validate email
  if (!c.email || !PersonalDataValidation.email.test(c.email)) {
    result.isValid = false
    result.errors.push('Contact.email: Invalid email format')
  }

  // Validate phone if provided
  if (c.phone && !PersonalDataValidation.phone.test(c.phone)) {
    result.warnings.push('Contact.phone: Invalid phone format')
  }

  // Validate preferred contact
  if (!PersonalDataTypeGuards.isContactPreference(c.preferredContact)) {
    result.warnings.push('Contact.preferredContact: Invalid contact preference')
  }

  // Validate multilingual fields
  const multilingualFields: (keyof ContactInfo)[] = ['location', 'availability']
  
  for (const field of multilingualFields) {
    if (c[field]) {
      const validation = validateMultilingualText(
        c[field],
        { path: 'contact', field },
        field === 'location'
      )
      result.errors.push(...validation.errors)
      result.warnings.push(...validation.warnings)
      if (!validation.isValid) result.isValid = false
    }
  }

  return result
}

/**
 * Validate social media data
 */
export function validateSocialMedia(social: unknown, index: number): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] }

  if (!social || typeof social !== 'object') {
    result.isValid = false
    result.errors.push(`Social[${index}]: Data is missing or invalid`)
    return result
  }

  const s = social as Partial<SocialMedia>

  // Required fields
  if (!s.platform || typeof s.platform !== 'string') {
    result.isValid = false
    result.errors.push(`Social[${index}].platform: Required string field`)
  }

  if (!s.url || (!PersonalDataValidation.url.test(s.url) && !s.url.startsWith('mailto:'))) {
    result.isValid = false
    result.errors.push(`Social[${index}].url: Invalid URL format`)
  }

  if (!s.username || typeof s.username !== 'string') {
    result.isValid = false
    result.errors.push(`Social[${index}].username: Required string field`)
  }

  if (!s.icon || typeof s.icon !== 'string') {
    result.warnings.push(`Social[${index}].icon: Icon identifier should be provided`)
  }

  if (typeof s.primary !== 'boolean') {
    result.warnings.push(`Social[${index}].primary: Should be a boolean value`)
  }

  return result
}

/**
 * Validate complete personal data structure
 */
export function validatePersonalData(data: unknown): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] }

  if (!data || typeof data !== 'object') {
    result.isValid = false
    result.errors.push('Personal data is missing or invalid')
    return result
  }

  const personalData = data as Partial<PersonalData>

  // Validate profile
  if (personalData.profile) {
    const profileValidation = validatePersonalProfile(personalData.profile)
    result.errors.push(...profileValidation.errors)
    result.warnings.push(...profileValidation.warnings)
    if (!profileValidation.isValid) result.isValid = false
  } else {
    result.isValid = false
    result.errors.push('Profile data is required')
  }

  // Validate skills
  if (Array.isArray(personalData.skills)) {
    personalData.skills.forEach((category, index) => {
      const categoryValidation = validateSkillCategory(category, index)
      result.errors.push(...categoryValidation.errors)
      result.warnings.push(...categoryValidation.warnings)
      if (!categoryValidation.isValid) result.isValid = false
    })
  } else {
    result.warnings.push('Skills data should be an array')
  }

  // Validate experience
  if (Array.isArray(personalData.experience)) {
    personalData.experience.forEach((exp, index) => {
      const expValidation = validateExperience(exp, index)
      result.errors.push(...expValidation.errors)
      result.warnings.push(...expValidation.warnings)
      if (!expValidation.isValid) result.isValid = false
    })
  } else {
    result.warnings.push('Experience data should be an array')
  }

  // Validate projects
  if (Array.isArray(personalData.projects)) {
    personalData.projects.forEach((project, index) => {
      const projectValidation = validateProject(project, index)
      result.errors.push(...projectValidation.errors)
      result.warnings.push(...projectValidation.warnings)
      if (!projectValidation.isValid) result.isValid = false
    })
  } else {
    result.warnings.push('Projects data should be an array')
  }

  // Validate contact
  if (personalData.contact) {
    const contactValidation = validateContactInfo(personalData.contact)
    result.errors.push(...contactValidation.errors)
    result.warnings.push(...contactValidation.warnings)
    if (!contactValidation.isValid) result.isValid = false
  } else {
    result.isValid = false
    result.errors.push('Contact data is required')
  }

  // Validate social media
  if (Array.isArray(personalData.social)) {
    personalData.social.forEach((social, index) => {
      const socialValidation = validateSocialMedia(social, index)
      result.errors.push(...socialValidation.errors)
      result.warnings.push(...socialValidation.warnings)
      if (!socialValidation.isValid) result.isValid = false
    })
  } else {
    result.warnings.push('Social media data should be an array')
  }

  return result
}

/**
 * Type assertion function with runtime validation
 */
export function assertPersonalData(data: unknown): asserts data is PersonalData {
  const validation = validatePersonalData(data)
  
  if (!validation.isValid) {
    const errorMessage = `Personal data validation failed:\n${validation.errors.join('\n')}`
    throw new TypeError(errorMessage)
  }

  if (validation.warnings.length > 0 && process.dev) {
    console.warn('Personal data validation warnings:', validation.warnings)
  }
}

/**
 * Safe type guard with validation
 */
export function isValidPersonalData(data: unknown): data is PersonalData {
  try {
    assertPersonalData(data)
    return true
  } catch {
    return false
  }
}

/**
 * Development-only validation helper
 */
export function validatePersonalDataInDev(data: unknown): void {
  if (!process.dev) return

  const validation = validatePersonalData(data)
  
  if (!validation.isValid) {
    console.error('❌ Personal Data Validation Errors:', validation.errors)
  }
  
  if (validation.warnings.length > 0) {
    console.warn('⚠️ Personal Data Validation Warnings:', validation.warnings)
  }
  
  if (validation.isValid && validation.warnings.length === 0) {
    console.log('✅ Personal data validation passed')
  }
}