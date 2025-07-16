/**
 * Personal Data Type Guards and Strict Type Checking
 * 
 * Advanced type guards and runtime type checking utilities for ensuring
 * strict type safety throughout the personal data system.
 */

import type {
  PersonalData,
  PersonalProfile,
  SkillCategory,
  Skill,
  Experience,
  Project,
  Education,
  ContactInfo,
  SocialMedia,
  MultilingualText,
  MultilingualFile,
  SkillLevel,
  ProjectStatus,
  ContactPreference
} from '~/types/personal'

/**
 * Strict type guard for MultilingualText
 */
export function isStrictMultilingualText(value: unknown): value is MultilingualText {
  return (
    typeof value === 'object' &&
    value !== null &&
    'ar' in value &&
    'en' in value &&
    typeof (value as any).ar === 'string' &&
    typeof (value as any).en === 'string' &&
    Object.keys(value).length === 2
  )
}

/**
 * Strict type guard for MultilingualFile
 */
export function isStrictMultilingualFile(value: unknown): value is MultilingualFile {
  return (
    typeof value === 'object' &&
    value !== null &&
    'ar' in value &&
    'en' in value &&
    typeof (value as any).ar === 'string' &&
    typeof (value as any).en === 'string' &&
    Object.keys(value).length === 2 &&
    (value as any).ar.length > 0 &&
    (value as any).en.length > 0
  )
}

/**
 * Strict type guard for SkillLevel
 */
export function isStrictSkillLevel(value: unknown): value is SkillLevel {
  return (
    typeof value === 'string' &&
    ['beginner', 'intermediate', 'advanced', 'expert'].includes(value)
  )
}

/**
 * Strict type guard for ProjectStatus
 */
export function isStrictProjectStatus(value: unknown): value is ProjectStatus {
  return (
    typeof value === 'string' &&
    ['completed', 'in-progress', 'planned', 'on-hold'].includes(value)
  )
}

/**
 * Strict type guard for ContactPreference
 */
export function isStrictContactPreference(value: unknown): value is ContactPreference {
  return (
    typeof value === 'string' &&
    ['email', 'phone', 'linkedin', 'whatsapp'].includes(value)
  )
}

/**
 * Strict type guard for Skill
 */
export function isStrictSkill(value: unknown): value is Skill {
  if (typeof value !== 'object' || value === null) return false
  
  const skill = value as any
  
  return (
    // Required fields
    'name' in skill &&
    'level' in skill &&
    isStrictSkillLevel(skill.level) &&
    
    // Optional fields with correct types
    (skill.years === undefined || (typeof skill.years === 'number' && skill.years >= 0)) &&
    (skill.description === undefined || isStrictMultilingualText(skill.description)) &&
    (skill.icon === undefined || typeof skill.icon === 'string') &&
    (skill.featured === undefined || typeof skill.featured === 'boolean') &&
    (skill.certification === undefined || isStrictMultilingualText(skill.certification))
  )
}

/**
 * Strict type guard for SkillCategory
 */
export function isStrictSkillCategory(value: unknown): value is SkillCategory {
  if (typeof value !== 'object' || value === null) return false
  
  const category = value as any
  
  return (
    'name' in category &&
    isStrictMultilingualText(category.name) &&
    'skills' in category &&
    Array.isArray(category.skills) &&
    category.skills.every(isStrictSkill) &&
    (category.icon === undefined || typeof category.icon === 'string') &&
    (category.description === undefined || isStrictMultilingualText(category.description)) &&
    (category.order === undefined || typeof category.order === 'number')
  )
}

/**
 * Strict type guard for PersonalProfile
 */
export function isStrictPersonalProfile(value: unknown): value is PersonalProfile {
  if (typeof value !== 'object' || value === null) return false
  
  const profile = value as any
  
  return (
    // Required fields
    'name' in profile && isStrictMultilingualText(profile.name) &&
    'title' in profile && isStrictMultilingualText(profile.title) &&
    'bio' in profile && isStrictMultilingualText(profile.bio) &&
    'location' in profile && isStrictMultilingualText(profile.location) &&
    'avatar' in profile && typeof profile.avatar === 'string' && profile.avatar.length > 0 &&
    'resume' in profile && isStrictMultilingualFile(profile.resume) &&
    'yearsOfExperience' in profile && typeof profile.yearsOfExperience === 'number' && profile.yearsOfExperience >= 0 &&
    
    // Optional fields
    (profile.dateOfBirth === undefined || typeof profile.dateOfBirth === 'string') &&
    (profile.tagline === undefined || isStrictMultilingualText(profile.tagline)) &&
    (profile.availability === undefined || isStrictMultilingualText(profile.availability))
  )
}

/**
 * Strict type guard for Experience
 */
export function isStrictExperience(value: unknown): value is Experience {
  if (typeof value !== 'object' || value === null) return false
  
  const exp = value as any
  
  return (
    // Required fields
    'company' in exp && isStrictMultilingualText(exp.company) &&
    'position' in exp && isStrictMultilingualText(exp.position) &&
    'description' in exp && isStrictMultilingualText(exp.description) &&
    'startDate' in exp && typeof exp.startDate === 'string' && /^\d{4}-\d{2}(-\d{2})?$/.test(exp.startDate) &&
    'location' in exp && isStrictMultilingualText(exp.location) &&
    'technologies' in exp && Array.isArray(exp.technologies) && exp.technologies.every((t: any) => typeof t === 'string') &&
    
    // Optional fields
    (exp.endDate === undefined || exp.endDate === null || (typeof exp.endDate === 'string' && /^\d{4}-\d{2}(-\d{2})?$/.test(exp.endDate))) &&
    (exp.achievements === undefined || (Array.isArray(exp.achievements) && exp.achievements.every(isStrictMultilingualText))) &&
    (exp.companyUrl === undefined || typeof exp.companyUrl === 'string') &&
    (exp.companyLogo === undefined || typeof exp.companyLogo === 'string') &&
    (exp.type === undefined || ['full-time', 'part-time', 'contract', 'freelance', 'internship'].includes(exp.type)) &&
    (exp.featured === undefined || typeof exp.featured === 'boolean')
  )
}

/**
 * Strict type guard for Project
 */
export function isStrictProject(value: unknown): value is Project {
  if (typeof value !== 'object' || value === null) return false
  
  const project = value as any
  
  return (
    // Required fields
    'name' in project && isStrictMultilingualText(project.name) &&
    'description' in project && isStrictMultilingualText(project.description) &&
    'technologies' in project && Array.isArray(project.technologies) && project.technologies.every((t: any) => typeof t === 'string') &&
    'featured' in project && typeof project.featured === 'boolean' &&
    'status' in project && isStrictProjectStatus(project.status) &&
    'startDate' in project && typeof project.startDate === 'string' && /^\d{4}-\d{2}(-\d{2})?$/.test(project.startDate) &&
    
    // Optional fields
    (project.longDescription === undefined || isStrictMultilingualText(project.longDescription)) &&
    (project.url === undefined || typeof project.url === 'string') &&
    (project.github === undefined || typeof project.github === 'string') &&
    (project.image === undefined || typeof project.image === 'string') &&
    (project.gallery === undefined || (Array.isArray(project.gallery) && project.gallery.every((g: any) => typeof g === 'string'))) &&
    (project.endDate === undefined || (typeof project.endDate === 'string' && /^\d{4}-\d{2}(-\d{2})?$/.test(project.endDate))) &&
    (project.client === undefined || isStrictMultilingualText(project.client)) &&
    (project.category === undefined || typeof project.category === 'string') &&
    (project.highlights === undefined || (Array.isArray(project.highlights) && project.highlights.every(isStrictMultilingualText))) &&
    (project.challenges === undefined || (Array.isArray(project.challenges) && project.challenges.every(isStrictMultilingualText)))
  )
}

/**
 * Strict type guard for Education
 */
export function isStrictEducation(value: unknown): value is Education {
  if (typeof value !== 'object' || value === null) return false
  
  const edu = value as any
  
  return (
    // Required fields
    'institution' in edu && isStrictMultilingualText(edu.institution) &&
    'degree' in edu && isStrictMultilingualText(edu.degree) &&
    'field' in edu && isStrictMultilingualText(edu.field) &&
    'startDate' in edu && typeof edu.startDate === 'string' && /^\d{4}-\d{2}(-\d{2})?$/.test(edu.startDate) &&
    'location' in edu && isStrictMultilingualText(edu.location) &&
    
    // Optional fields
    (edu.endDate === undefined || (typeof edu.endDate === 'string' && /^\d{4}-\d{2}(-\d{2})?$/.test(edu.endDate))) &&
    (edu.gpa === undefined || typeof edu.gpa === 'string') &&
    (edu.achievements === undefined || (Array.isArray(edu.achievements) && edu.achievements.every(isStrictMultilingualText))) &&
    (edu.logo === undefined || typeof edu.logo === 'string') &&
    (edu.coursework === undefined || (Array.isArray(edu.coursework) && edu.coursework.every((c: any) => typeof c === 'string'))) &&
    (edu.thesis === undefined || isStrictMultilingualText(edu.thesis)) &&
    (edu.featured === undefined || typeof edu.featured === 'boolean')
  )
}

/**
 * Strict type guard for ContactInfo
 */
export function isStrictContactInfo(value: unknown): value is ContactInfo {
  if (typeof value !== 'object' || value === null) return false
  
  const contact = value as any
  
  return (
    // Required fields
    'email' in contact && typeof contact.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email) &&
    'location' in contact && isStrictMultilingualText(contact.location) &&
    'availability' in contact && isStrictMultilingualText(contact.availability) &&
    'preferredContact' in contact && isStrictContactPreference(contact.preferredContact) &&
    
    // Optional fields
    (contact.phone === undefined || (typeof contact.phone === 'string' && /^\+?[\d\s\-\(\)]+$/.test(contact.phone))) &&
    (contact.timezone === undefined || typeof contact.timezone === 'string') &&
    (contact.languages === undefined || (Array.isArray(contact.languages) && contact.languages.every(isStrictMultilingualText))) &&
    (contact.responseTime === undefined || isStrictMultilingualText(contact.responseTime))
  )
}

/**
 * Strict type guard for SocialMedia
 */
export function isStrictSocialMedia(value: unknown): value is SocialMedia {
  if (typeof value !== 'object' || value === null) return false
  
  const social = value as any
  
  return (
    // Required fields
    'platform' in social && typeof social.platform === 'string' && social.platform.length > 0 &&
    'url' in social && typeof social.url === 'string' && /^https?:\/\/.+/.test(social.url) &&
    'username' in social && typeof social.username === 'string' && social.username.length > 0 &&
    'icon' in social && typeof social.icon === 'string' && social.icon.length > 0 &&
    'primary' in social && typeof social.primary === 'boolean' &&
    
    // Optional fields
    (social.displayName === undefined || typeof social.displayName === 'string') &&
    (social.metrics === undefined || (
      typeof social.metrics === 'object' &&
      social.metrics !== null &&
      (social.metrics.followers === undefined || typeof social.metrics.followers === 'number') &&
      (social.metrics.following === undefined || typeof social.metrics.following === 'number') &&
      (social.metrics.posts === undefined || typeof social.metrics.posts === 'number')
    ))
  )
}

/**
 * Strict type guard for complete PersonalData
 */
export function isStrictPersonalData(value: unknown): value is PersonalData {
  if (typeof value !== 'object' || value === null) return false
  
  const data = value as any
  
  return (
    // Required sections
    'profile' in data && isStrictPersonalProfile(data.profile) &&
    'experience' in data && Array.isArray(data.experience) && data.experience.every(isStrictExperience) &&
    'skills' in data && Array.isArray(data.skills) && data.skills.every(isStrictSkillCategory) &&
    'projects' in data && Array.isArray(data.projects) && data.projects.every(isStrictProject) &&
    'education' in data && Array.isArray(data.education) && data.education.every(isStrictEducation) &&
    'contact' in data && isStrictContactInfo(data.contact) &&
    'social' in data && Array.isArray(data.social) && data.social.every(isStrictSocialMedia) &&
    
    // Optional sections
    (data.certifications === undefined || Array.isArray(data.certifications)) &&
    (data.testimonials === undefined || Array.isArray(data.testimonials))
  )
}

/**
 * Type assertion with detailed error messages
 */
export function assertStrictPersonalData(value: unknown): asserts value is PersonalData {
  if (!isStrictPersonalData(value)) {
    const errors: string[] = []
    
    if (typeof value !== 'object' || value === null) {
      throw new TypeError('Personal data must be an object')
    }
    
    const data = value as any
    
    // Check each section
    if (!('profile' in data) || !isStrictPersonalProfile(data.profile)) {
      errors.push('Invalid or missing profile data')
    }
    
    if (!('skills' in data) || !Array.isArray(data.skills) || !data.skills.every(isStrictSkillCategory)) {
      errors.push('Invalid or missing skills data')
    }
    
    if (!('experience' in data) || !Array.isArray(data.experience) || !data.experience.every(isStrictExperience)) {
      errors.push('Invalid or missing experience data')
    }
    
    if (!('projects' in data) || !Array.isArray(data.projects) || !data.projects.every(isStrictProject)) {
      errors.push('Invalid or missing projects data')
    }
    
    if (!('education' in data) || !Array.isArray(data.education) || !data.education.every(isStrictEducation)) {
      errors.push('Invalid or missing education data')
    }
    
    if (!('contact' in data) || !isStrictContactInfo(data.contact)) {
      errors.push('Invalid or missing contact data')
    }
    
    if (!('social' in data) || !Array.isArray(data.social) || !data.social.every(isStrictSocialMedia)) {
      errors.push('Invalid or missing social media data')
    }
    
    throw new TypeError(`Personal data validation failed:\n${errors.join('\n')}`)
  }
}

/**
 * Development-only strict validation
 */
export function validateStrictPersonalDataInDev(data: unknown): void {
  if (!process.dev) return
  
  try {
    assertStrictPersonalData(data)
    console.log('✅ Strict personal data validation passed')
  } catch (error) {
    console.error('❌ Strict Personal Data Validation Failed:', error)
    
    // Provide helpful debugging information
    if (typeof data === 'object' && data !== null) {
      const sections = Object.keys(data)
      console.log('📋 Available sections:', sections)
      
      sections.forEach(section => {
        const sectionData = (data as any)[section]
        if (Array.isArray(sectionData)) {
          console.log(`📊 ${section}: Array with ${sectionData.length} items`)
        } else if (typeof sectionData === 'object' && sectionData !== null) {
          console.log(`📋 ${section}: Object with keys:`, Object.keys(sectionData))
        } else {
          console.log(`📄 ${section}: ${typeof sectionData}`)
        }
      })
    }
  }
}

/**
 * Export all strict type guards
 */
export const StrictPersonalDataTypeGuards = {
  isStrictMultilingualText,
  isStrictMultilingualFile,
  isStrictSkillLevel,
  isStrictProjectStatus,
  isStrictContactPreference,
  isStrictSkill,
  isStrictSkillCategory,
  isStrictPersonalProfile,
  isStrictExperience,
  isStrictProject,
  isStrictEducation,
  isStrictContactInfo,
  isStrictSocialMedia,
  isStrictPersonalData,
  assertStrictPersonalData,
  validateStrictPersonalDataInDev
} as const