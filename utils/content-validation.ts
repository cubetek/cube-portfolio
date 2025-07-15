/**
 * Content Validation Utilities
 * 
 * This module provides validation functions to ensure content files
 * follow the standardized schema and naming conventions.
 */

import type { 
  BaseFrontmatter, 
  BlogFrontmatter, 
  PageFrontmatter, 
  ContentCategory,
  ContentLanguage 
} from '~/types/content'
import { ContentValidationSchema } from '~/types/content'

/**
 * Validation error interface
 */
export interface ValidationError {
  field: string
  message: string
  value?: any
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
}

/**
 * Validates frontmatter against the schema
 */
export function validateFrontmatter(frontmatter: any): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []

  // Check required fields
  for (const field of ContentValidationSchema.required) {
    if (!frontmatter[field]) {
      errors.push({
        field,
        message: `Required field '${field}' is missing`,
        value: frontmatter[field]
      })
    }
  }

  // Validate field types
  for (const [field, expectedType] of Object.entries(ContentValidationSchema.types)) {
    if (frontmatter[field] !== undefined) {
      const actualType = Array.isArray(frontmatter[field]) ? 'array' : typeof frontmatter[field]
      if (actualType !== expectedType) {
        errors.push({
          field,
          message: `Field '${field}' should be ${expectedType}, got ${actualType}`,
          value: frontmatter[field]
        })
      }
    }
  }

  // Validate category
  if (frontmatter.category && !ContentValidationSchema.categories.includes(frontmatter.category)) {
    errors.push({
      field: 'category',
      message: `Invalid category '${frontmatter.category}'. Must be one of: ${ContentValidationSchema.categories.join(', ')}`,
      value: frontmatter.category
    })
  }

  // Validate slug format
  if (frontmatter.slug && !ContentValidationSchema.slugPattern.test(frontmatter.slug)) {
    errors.push({
      field: 'slug',
      message: 'Slug must contain only lowercase letters, numbers, and hyphens',
      value: frontmatter.slug
    })
  }

  // Validate date formats
  if (frontmatter.created && !ContentValidationSchema.datePattern.test(frontmatter.created)) {
    errors.push({
      field: 'created',
      message: 'Date must be in YYYY-MM-DD format',
      value: frontmatter.created
    })
  }

  if (frontmatter.updated && !ContentValidationSchema.datePattern.test(frontmatter.updated)) {
    errors.push({
      field: 'updated',
      message: 'Date must be in YYYY-MM-DD format',
      value: frontmatter.updated
    })
  }

  // Validate meta object
  if (frontmatter.meta) {
    if (!frontmatter.meta.title) {
      errors.push({
        field: 'meta.title',
        message: 'Meta title is required',
        value: frontmatter.meta.title
      })
    }

    if (!frontmatter.meta.description) {
      errors.push({
        field: 'meta.description',
        message: 'Meta description is required',
        value: frontmatter.meta.description
      })
    }

    // SEO warnings
    if (frontmatter.meta.title && frontmatter.meta.title.length > 60) {
      warnings.push({
        field: 'meta.title',
        message: 'Meta title longer than 60 characters may be truncated in search results',
        value: frontmatter.meta.title.length
      })
    }

    if (frontmatter.meta.description && frontmatter.meta.description.length > 160) {
      warnings.push({
        field: 'meta.description',
        message: 'Meta description longer than 160 characters may be truncated in search results',
        value: frontmatter.meta.description.length
      })
    }
  }

  // Category-specific validations
  if (frontmatter.category === 'blog') {
    if (!frontmatter.author) {
      warnings.push({
        field: 'author',
        message: 'Blog posts should include an author field',
        value: frontmatter.author
      })
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Validates filename against naming conventions
 */
export function validateFilename(filename: string): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []

  // Check file extension
  if (!filename.endsWith('.md')) {
    errors.push({
      field: 'filename',
      message: 'Content files must have .md extension',
      value: filename
    })
  }

  // Check naming pattern
  const nameWithoutExt = filename.replace(/\.md$/, '')
  if (!ContentValidationSchema.slugPattern.test(nameWithoutExt)) {
    errors.push({
      field: 'filename',
      message: 'Filename must contain only lowercase letters, numbers, and hyphens',
      value: filename
    })
  }

  // Check length
  if (filename.length > 100) {
    errors.push({
      field: 'filename',
      message: 'Filename must be 100 characters or less',
      value: filename.length
    })
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Validates content path structure
 */
export function validateContentPath(path: string): ValidationResult {
  const errors: ValidationError[] = []
  const warnings: ValidationError[] = []

  // Extract language from path
  const pathParts = path.split('/')
  if (pathParts[0] !== 'content') {
    errors.push({
      field: 'path',
      message: 'Content path must start with "content/"',
      value: path
    })
  }

  const language = pathParts[1] as ContentLanguage
  if (!ContentValidationSchema.languages.includes(language)) {
    errors.push({
      field: 'language',
      message: `Invalid language '${language}'. Must be one of: ${ContentValidationSchema.languages.join(', ')}`,
      value: language
    })
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Comprehensive content validation
 */
export function validateContent(
  frontmatter: any,
  filename: string,
  path: string
): ValidationResult {
  const frontmatterResult = validateFrontmatter(frontmatter)
  const filenameResult = validateFilename(filename)
  const pathResult = validateContentPath(path)

  return {
    valid: frontmatterResult.valid && filenameResult.valid && pathResult.valid,
    errors: [
      ...frontmatterResult.errors,
      ...filenameResult.errors,
      ...pathResult.errors
    ],
    warnings: [
      ...frontmatterResult.warnings,
      ...filenameResult.warnings,
      ...pathResult.warnings
    ]
  }
}

/**
 * Creates a validation report string
 */
export function createValidationReport(result: ValidationResult): string {
  let report = `Validation ${result.valid ? 'PASSED' : 'FAILED'}\n\n`

  if (result.errors.length > 0) {
    report += 'ERRORS:\n'
    for (const error of result.errors) {
      report += `  ❌ ${error.field}: ${error.message}\n`
      if (error.value !== undefined) {
        report += `     Value: ${error.value}\n`
      }
    }
    report += '\n'
  }

  if (result.warnings.length > 0) {
    report += 'WARNINGS:\n'
    for (const warning of result.warnings) {
      report += `  ⚠️  ${warning.field}: ${warning.message}\n`
      if (warning.value !== undefined) {
        report += `     Value: ${warning.value}\n`
      }
    }
  }

  return report
}

/**
 * Validates slug uniqueness within a language
 */
export async function validateSlugUniqueness(
  slug: string,
  language: ContentLanguage,
  excludePath?: string
): Promise<boolean> {
  try {
    // This would typically query the content database
    // For now, we'll simulate the check
    const { $content } = useNuxtApp()
    
    const existing = await $content(`/${language}`)
      .where({ slug })
      .without(['body'])
      .find()

    // If excluding current path, filter it out
    const conflicts = excludePath 
      ? existing.filter(item => item._path !== excludePath)
      : existing

    return conflicts.length === 0
  } catch (error) {
    console.warn('Could not validate slug uniqueness:', error)
    return true // Assume valid if check fails
  }
}

/**
 * Type guards for content types
 */
export function isBlogContent(frontmatter: any): frontmatter is BlogFrontmatter {
  return frontmatter.category === 'blog' && 'author' in frontmatter
}

export function isPageContent(frontmatter: any): frontmatter is PageFrontmatter {
  return frontmatter.category === 'page'
}

export function isBaseFrontmatter(frontmatter: any): frontmatter is BaseFrontmatter {
  return (
    typeof frontmatter.title === 'string' &&
    typeof frontmatter.description === 'string' &&
    typeof frontmatter.slug === 'string' &&
    typeof frontmatter.category === 'string'
  )
}