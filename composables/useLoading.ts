import { ref, computed } from 'vue'

interface LoadingState {
  isLoading: boolean
  message?: string
  progress?: number
}

const globalLoadingState = ref<LoadingState>({
  isLoading: false,
  progress: 0
})

const loadingStates = ref<Map<string, LoadingState>>(new Map())

export const useLoading = (key?: string) => {
  const { t } = useI18n()

  // Global loading state
  const isGlobalLoading = computed(() => globalLoadingState.value.isLoading)
  const globalMessage = computed(() => globalLoadingState.value.message || t('loading'))
  const globalProgress = computed(() => globalLoadingState.value.progress || 0)

  // Scoped loading state
  const scopedState = computed(() => {
    if (!key) return globalLoadingState.value
    return loadingStates.value.get(key) || { isLoading: false, progress: 0 }
  })

  const isLoading = computed(() => {
    if (!key) return globalLoadingState.value.isLoading
    return scopedState.value.isLoading
  })

  const message = computed(() => {
    if (!key) return globalLoadingState.value.message || t('loading')
    return scopedState.value.message || t('loading')
  })

  const progress = computed(() => {
    if (!key) return globalLoadingState.value.progress || 0
    return scopedState.value.progress || 0
  })

  // Actions
  const startLoading = (loadingMessage?: string, initialProgress = 0) => {
    const state: LoadingState = {
      isLoading: true,
      progress: initialProgress
    }

    if (loadingMessage) {
      state.message = loadingMessage
    }

    if (key) {
      loadingStates.value.set(key, state)
    } else {
      globalLoadingState.value = state
    }
  }

  const stopLoading = () => {
    if (key) {
      loadingStates.value.delete(key)
    } else {
      globalLoadingState.value = {
        isLoading: false,
        progress: 0
      }
    }
  }

  const updateProgress = (newProgress: number, newMessage?: string) => {
    const currentState = key ? scopedState.value : globalLoadingState.value
    
    const updatedState = {
      ...currentState,
      progress: Math.max(0, Math.min(100, newProgress)),
      ...(newMessage && { message: newMessage })
    }

    if (key) {
      loadingStates.value.set(key, updatedState)
    } else {
      globalLoadingState.value = updatedState
    }
  }

  const setMessage = (newMessage: string) => {
    const currentState = key ? scopedState.value : globalLoadingState.value
    
    const updatedState = {
      ...currentState,
      message: newMessage
    }

    if (key) {
      loadingStates.value.set(key, updatedState)
    } else {
      globalLoadingState.value = updatedState
    }
  }

  // Utility functions
  const withLoading = async <T>(
    asyncFn: () => Promise<T>,
    loadingMessage?: string
  ): Promise<T> => {
    try {
      startLoading(loadingMessage)
      const result = await asyncFn()
      return result
    } finally {
      stopLoading()
    }
  }

  const simulateProgress = (
    duration = 2000,
    steps = 20,
    finalMessage?: string
  ) => {
    return new Promise<void>((resolve) => {
      const stepDuration = duration / steps
      let currentStep = 0

      const interval = setInterval(() => {
        currentStep++
        const progressValue = (currentStep / steps) * 100

        if (currentStep === steps) {
          updateProgress(100, finalMessage)
          clearInterval(interval)
          setTimeout(() => {
            stopLoading()
            resolve()
          }, 200)
        } else {
          updateProgress(progressValue)
        }
      }, stepDuration)
    })
  }

  // Reactive loading for async operations
  const loadingRef = <T>(
    asyncFn: () => Promise<T>,
    options: {
      immediate?: boolean
      loadingMessage?: string
      errorMessage?: string
    } = {}
  ) => {
    const { immediate = false, loadingMessage, errorMessage } = options
    
    const data = ref<T | null>(null)
    const error = ref<Error | null>(null)
    
    const execute = async () => {
      try {
        error.value = null
        startLoading(loadingMessage)
        data.value = await asyncFn()
      } catch (err) {
        error.value = err instanceof Error ? err : new Error(String(err))
        setMessage(errorMessage || t('error.general'))
      } finally {
        stopLoading()
      }
    }

    if (immediate) {
      execute()
    }

    return {
      data: readonly(data),
      error: readonly(error),
      execute,
      isLoading,
      message,
      progress
    }
  }

  return {
    // State
    isLoading: readonly(isLoading),
    isGlobalLoading: readonly(isGlobalLoading),
    message: readonly(message),
    globalMessage: readonly(globalMessage),
    progress: readonly(progress),
    globalProgress: readonly(globalProgress),

    // Actions
    startLoading,
    stopLoading,
    updateProgress,
    setMessage,

    // Utilities
    withLoading,
    simulateProgress,
    loadingRef
  }
}