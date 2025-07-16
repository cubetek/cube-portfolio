/**
 * Unit Tests for usePersonalData Composable
 * 
 * Tests the personal data composable functionality including:
 * - Data access and reactivity
 * - Language switching behavior
 * - Utility functions
 * - Error handling and fallbacks
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ref, nextTick } from 'vue'
import { usePersonalData } from '~/composables/usePersonalData'
import { useLanguage } from '~/composables/useLanguage'

// Mock the dependencies
vi.mock('~/composables/useLanguage', () => ({
  useLanguage: vi.fn(() => ({
    currentLocale: ref('en'),
    switchLanguage: vi.fn()
  }))
}))

vi.mock('#app', () => ({
  useAppConfig: vi.fn(() => ({
    personalData: {
      profile: {
        name: { ar: 'أحمد محمد', en: 'Ahmed Mohammed' },
        title: { ar: 'مطور ويب', en: 'Web Developer' },
        bio: { ar: 'مطور متخصص', en: 'Specialized developer' },
        location: { ar: 'الرياض', en: 'Riyadh' },
        avatar: '/images/avatar.jpg',
        resume: { ar: '/resume-ar.pdf', en: '/resume-en.pdf' },
        yearsOfExperience: 5,
        tagline: { ar: 'بناء المستقبل', en: 'Building the future' },
        availability: { ar: 'متاح للعمل', en: 'Available for work' }
      },
      skills: [
        {
          name: { ar: 'تطوير الواجهات', en: 'Frontend Development' },
          icon: 'i-heroicons-code-bracket',
          skills: [
            {
              name: 'Vue.js',
              level: 'expert',
              years: 3,
              description: { ar: 'إطار عمل متقدم', en: 'Advanced framework' },
              featured: true
            },
            {
              name: 'React',
              level: 'intermediate',
              years: 2,
              description: { ar: 'مكتبة واجهات', en: 'UI library' },
              featured: false
            }
          ]
        }
      ],
      experience: [
        {
          company: { ar: 'شركة التقنية', en: 'Tech Company' },
          position: { ar: 'مطور أول', en: 'Senior Developer' },
          description: { ar: 'تطوير التطبيقات', en: 'Application development' },
          startDate: '2022-01',
          endDate: null,
          location: { ar: 'الرياض', en: 'Riyadh' },
          technologies: ['Vue.js', 'Node.js'],
          achievements: [
            { ar: 'تحسين الأداء', en: 'Performance improvement' }
          ],
          featured: true
        }
      ],
      projects: [
        {
          name: { ar: 'موقع شخصي', en: 'Personal Website' },
          description: { ar: 'موقع متعدد اللغات', en: 'Multilingual website' },
          technologies: ['Nuxt.js', 'Vue.js'],
          url: 'https://example.com',
          github: 'https://github.com/user/project',
          featured: true,
          status: 'completed',
          startDate: '2024-01',
          endDate: '2024-03'
        }
      ],
      education: [
        {
          institution: { ar: 'جامعة الملك سعود', en: 'King Saud University' },
          degree: { ar: 'بكالوريوس', en: 'Bachelor' },
          field: { ar: 'علوم الحاسب', en: 'Computer Science' },
          startDate: '2015-09',
          endDate: '2019-06',
          location: { ar: 'الرياض', en: 'Riyadh' },
          featured: true
        }
      ],
      contact: {
        email: 'test@example.com',
        phone: '+966501234567',
        location: { ar: 'الرياض', en: 'Riyadh' },
        availability: { ar: 'متاح', en: 'Available' },
        preferredContact: 'email',
        languages: [
          { ar: 'العربية', en: 'Arabic' },
          { ar: 'الإنجليزية', en: 'English' }
        ]
      },
      social: [
        {
          platform: 'GitHub',
          url: 'https://github.com/user',
          username: 'user',
          icon: 'i-heroicons-github',
          primary: true
        },
        {
          platform: 'LinkedIn',
          url: 'https://linkedin.com/in/user',
          username: 'user',
          icon: 'i-heroicons-linkedin',
          primary: true
        },
        {
          platform: 'Twitter',
          url: 'https://twitter.com/user',
          username: '@user',
          icon: 'i-heroicons-twitter',
          primary: false
        }
      ]
    }
  }))
}))

describe('usePersonalData', () => {
  let mockLanguage: any

  beforeEach(() => {
    mockLanguage = {
      currentLocale: ref('en'),
      switchLanguage: vi.fn()
    }
    vi.mocked(useLanguage).mockReturnValue(mockLanguage)
  })

  describe('Profile Data', () => {
    it('should return localized profile data in English', () => {
      const { profile } = usePersonalData()
      
      expect(profile.value.name).toBe('Ahmed Mohammed')
      expect(profile.value.title).toBe('Web Developer')
      expect(profile.value.bio).toBe('Specialized developer')
      expect(profile.value.location).toBe('Riyadh')
      expect(profile.value.avatar).toBe('/images/avatar.jpg')
      expect(profile.value.resume).toBe('/resume-en.pdf')
      expect(profile.value.yearsOfExperience).toBe(5)
      expect(profile.value.tagline).toBe('Building the future')
      expect(profile.value.availability).toBe('Available for work')
    })

    it('should return localized profile data in Arabic', () => {
      mockLanguage.currentLocale.value = 'ar'
      const { profile } = usePersonalData()
      
      expect(profile.value.name).toBe('أحمد محمد')
      expect(profile.value.title).toBe('مطور ويب')
      expect(profile.value.bio).toBe('مطور متخصص')
      expect(profile.value.location).toBe('الرياض')
      expect(profile.value.resume).toBe('/resume-ar.pdf')
      expect(profile.value.tagline).toBe('بناء المستقبل')
      expect(profile.value.availability).toBe('متاح للعمل')
    })

    it('should be reactive to language changes', async () => {
      const { profile } = usePersonalData()
      
      // Initially English
      expect(profile.value.name).toBe('Ahmed Mohammed')
      
      // Switch to Arabic
      mockLanguage.currentLocale.value = 'ar'
      await nextTick()
      
      expect(profile.value.name).toBe('أحمد محمد')
    })
  })

  describe('Skills Data', () => {
    it('should return localized skills data', () => {
      const { skills } = usePersonalData()
      
      expect(skills.value).toHaveLength(1)
      expect(skills.value[0]?.name).toBe('Frontend Development')
      expect(skills.value[0]?.skills).toHaveLength(2)
      expect(skills.value[0]?.skills?.[0]?.name).toBe('Vue.js')
      expect(skills.value[0]?.skills?.[0]?.level).toBe('expert')
      expect(skills.value[0]?.skills?.[0]?.years).toBe(3)
      expect(skills.value[0]?.skills?.[0]?.description).toBe('Advanced framework')
      expect(skills.value[0]?.skills?.[0]?.featured).toBe(true)
    })

    it('should handle Arabic skills data', () => {
      mockLanguage.currentLocale.value = 'ar'
      const { skills } = usePersonalData()
      
      expect(skills.value[0]?.name).toBe('تطوير الواجهات')
      expect(skills.value[0]?.skills?.[0]?.description).toBe('إطار عمل متقدم')
    })
  })

  describe('Experience Data', () => {
    it('should return localized experience data', () => {
      const { experience } = usePersonalData()
      
      expect(experience.value).toHaveLength(1)
      expect(experience.value[0]?.company).toBe('Tech Company')
      expect(experience.value[0]?.position).toBe('Senior Developer')
      expect(experience.value[0]?.description).toBe('Application development')
      expect(experience.value[0]?.location).toBe('Riyadh')
      expect(experience.value[0]?.startDate).toBe('2022-01')
      expect(experience.value[0]?.endDate).toBeNull()
      expect(experience.value[0]?.technologies).toEqual(['Vue.js', 'Node.js'])
      expect(experience.value[0]?.achievements).toEqual(['Performance improvement'])
      expect(experience.value[0]?.featured).toBe(true)
    })
  })

  describe('Projects Data', () => {
    it('should return localized projects data', () => {
      const { projects } = usePersonalData()
      
      expect(projects.value).toHaveLength(1)
      expect(projects.value[0]?.name).toBe('Personal Website')
      expect(projects.value[0]?.description).toBe('Multilingual website')
      expect(projects.value[0]?.technologies).toEqual(['Nuxt.js', 'Vue.js'])
      expect(projects.value[0]?.url).toBe('https://example.com')
      expect(projects.value[0]?.github).toBe('https://github.com/user/project')
      expect(projects.value[0]?.featured).toBe(true)
      expect(projects.value[0]?.status).toBe('completed')
    })
  })

  describe('Education Data', () => {
    it('should return localized education data', () => {
      const { education } = usePersonalData()
      
      expect(education.value).toHaveLength(1)
      expect(education.value[0]?.institution).toBe('King Saud University')
      expect(education.value[0]?.degree).toBe('Bachelor')
      expect(education.value[0]?.field).toBe('Computer Science')
      expect(education.value[0]?.location).toBe('Riyadh')
      expect(education.value[0]?.featured).toBe(true)
    })
  })

  describe('Contact Data', () => {
    it('should return localized contact data', () => {
      const { contact } = usePersonalData()
      
      expect(contact.value.email).toBe('test@example.com')
      expect(contact.value.phone).toBe('+966501234567')
      expect(contact.value.location).toBe('Riyadh')
      expect(contact.value.availability).toBe('Available')
      expect(contact.value.preferredContact).toBe('email')
      expect(contact.value.languages).toEqual(['Arabic', 'English'])
    })
  })

  describe('Social Media Data', () => {
    it('should return social media data', () => {
      const { social } = usePersonalData()
      
      expect(social.value).toHaveLength(3)
      expect(social.value[0]?.platform).toBe('GitHub')
      expect(social.value[0]?.url).toBe('https://github.com/user')
      expect(social.value[0]?.primary).toBe(true)
    })
  })

  describe('Utility Functions', () => {
    it('should get featured projects', () => {
      const { getFeaturedProjects } = usePersonalData()
      
      const featured = getFeaturedProjects()
      expect(featured).toHaveLength(1)
      expect(featured[0]?.featured).toBe(true)
      
      const limitedFeatured = getFeaturedProjects(0)
      expect(limitedFeatured).toHaveLength(0)
    })

    it('should get projects by status', () => {
      const { getProjectsByStatus } = usePersonalData()
      
      const completed = getProjectsByStatus('completed')
      expect(completed).toHaveLength(1)
      expect(completed[0]?.status).toBe('completed')
      
      const inProgress = getProjectsByStatus('in-progress')
      expect(inProgress).toHaveLength(0)
    })

    it('should get skills by category', () => {
      const { getSkillsByCategory } = usePersonalData()
      
      const frontendSkills = getSkillsByCategory('Frontend')
      expect(frontendSkills).toHaveLength(2)
      expect(frontendSkills[0]?.name).toBe('Vue.js')
      
      const backendSkills = getSkillsByCategory('Backend')
      expect(backendSkills).toHaveLength(0)
    })

    it('should get featured skills', () => {
      const { getFeaturedSkills } = usePersonalData()
      
      const featured = getFeaturedSkills()
      expect(featured).toHaveLength(1)
      expect(featured[0]?.name).toBe('Vue.js')
      expect(featured[0]?.category).toBe('Frontend Development')
    })

    it('should get primary social media', () => {
      const { getPrimarySocialMedia } = usePersonalData()
      
      const primary = getPrimarySocialMedia()
      expect(primary).toHaveLength(2)
      expect(primary.every(s => s.primary)).toBe(true)
    })

    it('should get featured experience', () => {
      const { getFeaturedExperience } = usePersonalData()
      
      const featured = getFeaturedExperience()
      expect(featured).toHaveLength(1)
      expect(featured[0]?.featured).toBe(true)
    })
    it('should get current job', () => {
      const { getCurrentJob } = usePersonalData()
      
      const current = getCurrentJob()
      expect(current).toBeDefined()
      expect(current?.endDate).toBeNull()
    })

    it('should get featured education', () => {
      const { getFeaturedEducation } = usePersonalData()
      
      const featured = getFeaturedEducation()
      expect(featured).toHaveLength(1)
      expect(featured[0]?.featured).toBe(true)
    })
    it('should get total experience', () => {
      const { getTotalExperience } = usePersonalData()
      
      const total = getTotalExperience()
      expect(total).toBe(5)
    })


    it('should get skills by level', () => {
      const { getSkillsByLevel } = usePersonalData()
      
      const expertSkills = getSkillsByLevel('expert')
      expect(expertSkills).toHaveLength(1)
      expect(expertSkills[0]?.name).toBe('Vue.js')
      
      const intermediateSkills = getSkillsByLevel('intermediate')
      expect(intermediateSkills).toHaveLength(1)
      expect(intermediateSkills[0]?.name).toBe('React')
    })
    it('should get preferred contact', () => {
      const { getPreferredContact } = usePersonalData()
      
      const preferred = getPreferredContact()
      expect(preferred.type).toBe('email')
      expect(preferred.value).toBe('test@example.com')
      expect(preferred.url).toBe('mailto:test@example.com')
    })

    it('should search personal data', () => {
      const { searchPersonalData } = usePersonalData()
      
      const results = searchPersonalData('Vue')
      expect(results.length).toBeGreaterThan(0)
      expect(results[0]?.type).toBe('skill')
      expect(results[0]?.title).toBe('Vue.js')
      
      const projectResults = searchPersonalData('website')
      expect(projectResults.some(r => r.type === 'project')).toBe(true)
    })
  })

  describe('Helper Functions', () => {
    it('should get localized text with fallback', () => {
      const { getLocalizedText } = usePersonalData()
      
      const multilingualText = { ar: 'نص عربي', en: 'English text' }
      
      // English
      mockLanguage.currentLocale.value = 'en'
      expect(getLocalizedText(multilingualText)).toBe('English text')
      
      // Arabic
      mockLanguage.currentLocale.value = 'ar'
      expect(getLocalizedText(multilingualText)).toBe('نص عربي')
      
      // String input
      expect(getLocalizedText('Simple string')).toBe('Simple string')
      
      // Undefined input
      expect(getLocalizedText(undefined)).toBe('')
    })

    it('should get localized text array', () => {
      const { getLocalizedTextArray } = usePersonalData()
      
      const multilingualArray = [
        { ar: 'نص أول', en: 'First text' },
        { ar: 'نص ثاني', en: 'Second text' }
      ]
      
      mockLanguage.currentLocale.value = 'en'
      const result = getLocalizedTextArray(multilingualArray)
      expect(result).toEqual(['First text', 'Second text'])
      
      // Empty array
      expect(getLocalizedTextArray(undefined)).toEqual([])
    })

    it('should get localized file', () => {
      const { getLocalizedFile } = usePersonalData()
      
      const multilingualFile = { ar: '/file-ar.pdf', en: '/file-en.pdf' }
      
      // English
      mockLanguage.currentLocale.value = 'en'
      expect(getLocalizedFile(multilingualFile)).toBe('/file-en.pdf')
      
      // Arabic
      mockLanguage.currentLocale.value = 'ar'
      expect(getLocalizedFile(multilingualFile)).toBe('/file-ar.pdf')
    })
  })

  describe('Error Handling', () => {
    it('should handle missing translations gracefully', () => {
      const { getLocalizedText } = usePersonalData()
      
      const incompleteText = { en: 'English only' }
      
      // Should fallback to English when Arabic is missing
      mockLanguage.currentLocale.value = 'ar'
      expect(getLocalizedText(incompleteText as any)).toBe('English only')
    })

    it('should handle invalid data structures', () => {
      const { getLocalizedText } = usePersonalData()
      
      // Should handle null/undefined gracefully
      expect(getLocalizedText(null as any)).toBe('')
      expect(getLocalizedText({} as any)).toBe('')
    })

    it('should handle empty arrays', () => {
      const { getLocalizedTextArray } = usePersonalData()
      
      expect(getLocalizedTextArray([])).toEqual([])
      expect(getLocalizedTextArray(null as any)).toEqual([])
    })
  })
})