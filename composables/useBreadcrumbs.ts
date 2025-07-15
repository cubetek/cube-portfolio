/**
 * Breadcrumb utility composable for consistent navigation
 */
export const useBreadcrumbs = () => {
  const { t } = useI18n()
  const localePath = useLocalePath()
  const route = useRoute()

  /**
   * Generate breadcrumb links for a given route
   */
  const generateBreadcrumbs = (currentPageKey?: string, customTitle?: string) => {
    const breadcrumbs = [
      {
        label: t('nav.home'),
        to: localePath('/'),
        icon: 'i-heroicons-home'
      }
    ]

    // Don't add current page to breadcrumbs if we're on home page
    if (route.path === '/' || route.path === localePath('/')) {
      return []
    }

    // Add current page based on route or provided key
    const pageKey = currentPageKey || route.name?.toString() || 'page'
    
    // Map route names to translation keys
    const pageKeyMap: Record<string, string> = {
      'about': 'nav.about',
      'contact': 'nav.contact',
      'projects': 'nav.projects',
      'blog': 'nav.blog'
    }

    const translationKey = pageKeyMap[pageKey] || pageKey
    const pageTitle = customTitle || t(translationKey, pageKey)

    breadcrumbs.push({
      label: pageTitle,
      to: route.path
    })

    return breadcrumbs
  }

  /**
   * Get breadcrumbs for the about page
   */
  const getAboutBreadcrumbs = () => {
    return generateBreadcrumbs('about')
  }

  /**
   * Get breadcrumbs for the contact page
   */
  const getContactBreadcrumbs = () => {
    return generateBreadcrumbs('contact')
  }

  /**
   * Get breadcrumbs for a project page
   */
  const getProjectBreadcrumbs = (projectTitle?: string) => {
    const breadcrumbs = [
      {
        label: t('nav.home'),
        to: localePath('/'),
        icon: 'i-heroicons-home'
      },
      {
        label: t('nav.projects'),
        to: localePath('/projects')
      }
    ]

    if (projectTitle) {
      breadcrumbs.push({
        label: projectTitle,
        to: route.path
      })
    }

    return breadcrumbs
  }

  /**
   * Get breadcrumbs for a blog post
   */
  const getBlogBreadcrumbs = (postTitle?: string) => {
    const breadcrumbs = [
      {
        label: t('nav.home'),
        to: localePath('/'),
        icon: 'i-heroicons-home'
      },
      {
        label: t('nav.blog'),
        to: localePath('/blog')
      }
    ]

    if (postTitle) {
      breadcrumbs.push({
        label: postTitle,
        to: route.path
      })
    }

    return breadcrumbs
  }

  /**
   * Format breadcrumb item for UBreadcrumb component
   */
  const formatBreadcrumbItem = (label: string, to?: string, icon?: string) => {
    const item: any = { label }
    
    if (to) {
      item.to = to
    }
    
    if (icon) {
      item.icon = icon
    }

    return item
  }

  /**
   * Get structured data for breadcrumbs (JSON-LD)
   */
  const getBreadcrumbStructuredData = (breadcrumbs: any[]) => {
    if (breadcrumbs.length <= 1) return null

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.label,
        item: crumb.to ? `https://yoursite.com${crumb.to}` : undefined
      }))
    }
  }

  return {
    generateBreadcrumbs,
    getAboutBreadcrumbs,
    getContactBreadcrumbs,
    getProjectBreadcrumbs,
    getBlogBreadcrumbs,
    formatBreadcrumbItem,
    getBreadcrumbStructuredData
  }
}