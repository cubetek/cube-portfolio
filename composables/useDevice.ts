/**
 * Device detection composable for responsive behavior
 * Provides reactive state for mobile/desktop detection
 */
export const useDevice = () => {
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(false)

  // Update device state based on window width
  const updateDeviceState = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth
      isMobile.value = width < 768
      isTablet.value = width >= 768 && width < 1024
      isDesktop.value = width >= 1024
    }
  }

  // Initialize on client side
  onMounted(() => {
    updateDeviceState()
    window.addEventListener('resize', updateDeviceState)
  })

  // Cleanup
  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', updateDeviceState)
    }
  })

  return {
    isMobile: readonly(isMobile),
    isTablet: readonly(isTablet),
    isDesktop: readonly(isDesktop)
  }
}