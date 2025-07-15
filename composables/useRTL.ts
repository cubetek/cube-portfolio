/**
 * RTL (Right-to-Left) utilities composable
 * Provides reactive RTL state and utility functions
 */
export const useRTL = () => {
  const { locale } = useI18n()
  
  // RTL language codes
  const rtlLanguages = ['ar', 'he', 'fa', 'ur', 'ku', 'dv', 'sd', 'ug', 'yi']
  
  // Reactive RTL state
  const isRTL = computed(() => rtlLanguages.includes(locale.value))
  
  // Direction string for HTML attributes
  const direction = computed(() => isRTL.value ? 'rtl' : 'ltr')
  
  // Helper functions for conditional classes
  const rtlClass = (rtlClasses: string, ltrClasses?: string) => {
    return isRTL.value ? rtlClasses : (ltrClasses || '')
  }
  
  // Direction-aware spacing utilities
  const marginStart = (value: string) => isRTL.value ? `mr-${value}` : `ml-${value}`
  const marginEnd = (value: string) => isRTL.value ? `ml-${value}` : `mr-${value}`
  const paddingStart = (value: string) => isRTL.value ? `pr-${value}` : `pl-${value}`
  const paddingEnd = (value: string) => isRTL.value ? `pl-${value}` : `pr-${value}`
  
  // Text alignment utilities
  const textStart = () => isRTL.value ? 'text-right' : 'text-left'
  const textEnd = () => isRTL.value ? 'text-left' : 'text-right'
  
  // Float utilities
  const floatStart = () => isRTL.value ? 'float-right' : 'float-left'
  const floatEnd = () => isRTL.value ? 'float-left' : 'float-right'
  
  // Border utilities
  const borderStart = (value?: string) => {
    const width = value || '1'
    return isRTL.value ? `border-r-${width}` : `border-l-${width}`
  }
  const borderEnd = (value?: string) => {
    const width = value || '1'
    return isRTL.value ? `border-l-${width}` : `border-r-${width}`
  }
  
  // Position utilities
  const insetStart = (value: string) => isRTL.value ? `right-${value}` : `left-${value}`
  const insetEnd = (value: string) => isRTL.value ? `left-${value}` : `right-${value}`
  
  // Rounded corner utilities
  const roundedStart = (value?: string) => {
    const size = value || ''
    return isRTL.value ? `rounded-r${size ? `-${size}` : ''}` : `rounded-l${size ? `-${size}` : ''}`
  }
  const roundedEnd = (value?: string) => {
    const size = value || ''
    return isRTL.value ? `rounded-l${size ? `-${size}` : ''}` : `rounded-r${size ? `-${size}` : ''}`
  }
  
  // Transform utilities for icons and elements that need flipping
  const flipForRTL = () => isRTL.value ? 'transform scale-x-[-1]' : ''
  
  return {
    // State
    isRTL: readonly(isRTL),
    direction: readonly(direction),
    
    // Class utilities
    rtlClass,
    
    // Spacing
    marginStart,
    marginEnd,
    paddingStart,
    paddingEnd,
    
    // Text
    textStart,
    textEnd,
    
    // Float
    floatStart,
    floatEnd,
    
    // Borders
    borderStart,
    borderEnd,
    
    // Position
    insetStart,
    insetEnd,
    
    // Rounded corners
    roundedStart,
    roundedEnd,
    
    // Transform
    flipForRTL,
  }
}