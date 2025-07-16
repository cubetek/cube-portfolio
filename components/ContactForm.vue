<template>
  <UCard class="w-full max-w-2xl mx-auto shadow-lg border-0 bg-white dark:bg-gray-900">
    <template #header>
      <div class="flex items-center gap-3 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <UIcon name="i-heroicons-envelope" class="size-6 text-primary-500" />
        <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
          {{ $t('contact.form.title') }}
        </h3>
      </div>
    </template>

    <!-- Success Message -->
    <UAlert
      v-if="submitted && !error"
      icon="i-heroicons-check-circle"
      color="green"
      variant="subtle"
      :title="$t('contact.form.success.title')"
      :description="$t('contact.form.success.message')"
      class="mx-6 mt-6"
    />

    <!-- Error Message -->
    <UAlert
      v-if="error"
      icon="i-heroicons-x-circle"
      color="red"
      variant="subtle"
      :title="$t('contact.form.error.title')"
      :description="error"
      class="mx-6 mt-6"
    />

    <!-- Contact Form using UForm -->
    <UForm
      v-if="!submitted || error"
      :validate="validateContactForm"
      :state="state"
      class="p-6 space-y-6"
      @submit="onSubmit"
      @error="onError"
      name="contact"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      netlify
    >
      <!-- Honeypot field for spam protection -->
      <input type="hidden" name="form-name" value="contact" />
      <input
        v-model="state['bot-field']"
        type="text"
        name="bot-field"
        class="sr-only absolute -left-[9999px] opacity-0 h-0 w-0"
        tabindex="-1"
        autocomplete="off"
      />
      
      <!-- Hidden language field -->
      <input type="hidden" name="language" :value="locale" />

      <!-- Name Field -->
      <UFormField
        :label="$t('contact.form.name.label')"
        name="name"
        required
        :help="$t('contact.form.name.help')"
      >
        <UInput
          v-model="state.name"
          name="name"
          :placeholder="$t('contact.form.name.placeholder')"
          :disabled="loading"
          size="lg"
          icon="i-heroicons-user"
          variant="outline"
        />
      </UFormField>

      <!-- Email Field -->
      <UFormField
        :label="$t('contact.form.email.label')"
        name="email"
        required
        :help="$t('contact.form.email.help')"
      >
        <UInput
          v-model="state.email"
          name="email"
          type="email"
          :placeholder="$t('contact.form.email.placeholder')"
          :disabled="loading"
          size="lg"
          icon="i-heroicons-at-symbol"
          variant="outline"
        />
      </UFormField>

      <!-- Subject Field -->
      <UFormField
        :label="$t('contact.form.subject.label')"
        name="subject"
        :help="$t('contact.form.subject.help')"
      >
        <UInput
          v-model="state.subject"
          name="subject"
          :placeholder="$t('contact.form.subject.placeholder')"
          :disabled="loading"
          size="lg"
          icon="i-heroicons-tag"
          variant="outline"
        />
      </UFormField>

      <!-- Message Field -->
      <UFormField
        :label="$t('contact.form.message.label')"
        name="message"
        required
        :help="$t('contact.form.message.help')"
      >
        <UTextarea
          v-model="state.message"
          name="message"
          :placeholder="$t('contact.form.message.placeholder')"
          :disabled="loading"
          :rows="6"
          size="lg"
          variant="outline"
          class="w-full"
        />
      </UFormField>

      <!-- Privacy Notice -->
      <div class="flex items-start gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <UIcon name="i-heroicons-shield-check" class="size-5 text-green-500 mt-0.5 shrink-0" />
        <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {{ $t('contact.form.privacy') }}
        </p>
      </div>

      <!-- Submit Button -->
      <div class="pt-4">
        <UButton
          type="submit"
          :loading="loading"
          :disabled="loading"
          size="lg"
          block
          color="primary"
          variant="solid"
          loading-auto
          class="shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          <template #leading v-if="!loading">
            <UIcon name="i-heroicons-paper-airplane" class="size-5" />
          </template>
          
          <span v-if="loading">{{ $t('contact.form.sending') }}</span>
          <span v-else>{{ $t('contact.form.submit') }}</span>
        </UButton>
      </div>
    </UForm>

    <!-- Post-submission message -->
    <div v-if="submitted && !error" class="text-center px-6 py-12 space-y-6">
      <div class="mx-auto size-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
        <UIcon name="i-heroicons-check-circle" class="size-8 text-green-600 dark:text-green-400" />
      </div>
      <div class="space-y-2">
        <h4 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ $t('contact.form.success.title') }}
        </h4>
        <p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          {{ $t('contact.form.success.followup') }}
        </p>
      </div>
      
      <UButton
        @click="resetForm"
        variant="outline"
        size="lg"
        color="primary"
        class="mt-6"
      >
        <template #leading>
          <UIcon name="i-heroicons-plus" class="size-4" />
        </template>
        {{ $t('contact.form.sendAnother') }}
      </UButton>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { FormSubmitEvent, FormErrorEvent } from '@nuxt/ui'

// Define schema validation using basic interface
interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
  'bot-field': string
}

// Simple validation function
function validateContactForm(data: ContactFormData) {
  const errors = []
  
  if (!data.name?.trim()) {
    errors.push({ name: 'name', message: 'Name is required' })
  } else if (data.name.trim().length < 2) {
    errors.push({ name: 'name', message: 'Name must be at least 2 characters' })
  }
  
  if (!data.email?.trim()) {
    errors.push({ name: 'email', message: 'Email is required' })
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push({ name: 'email', message: 'Please enter a valid email address' })
  }
  
  if (!data.message?.trim()) {
    errors.push({ name: 'message', message: 'Message is required' })
  } else if (data.message.trim().length < 10) {
    errors.push({ name: 'message', message: 'Message must be at least 10 characters' })
  }
  
  return errors
}

// Composables
const { locale, t } = useI18n()
const toast = useToast()

// Form state using reactive with proper types
const state = reactive<ContactFormData>({
  name: '',
  email: '',
  subject: '',
  message: '',
  'bot-field': ''
})

// Loading and submission states
const loading = ref(false)
const submitted = ref(false)
const error = ref<string | null>(null)

// Form submission handler
async function onSubmit(event: FormSubmitEvent<ContactFormData>) {
  loading.value = true
  error.value = null

  try {
    // Prepare form data for submission
    const submitData = new FormData()
    submitData.append('form-name', 'contact')
    submitData.append('name', event.data.name)
    submitData.append('email', event.data.email)
    submitData.append('subject', event.data.subject || t('contact.form.defaultSubject'))
    submitData.append('message', event.data.message)
    submitData.append('language', locale.value)
    submitData.append('bot-field', event.data['bot-field'] || '')

    // Submit to Netlify
    const response = await $fetch<{ success: boolean; error?: string }>('/.netlify/functions/contact-form', {
      method: 'POST',
      body: submitData
    })

    if (response.success) {
      submitted.value = true
      
      // Show success toast
      toast.add({
        title: t('contact.form.success.title'),
        description: t('contact.form.success.message'),
        color: 'green',
        icon: 'i-heroicons-check-circle'
      })
      
      // Track successful submission
      if (process.client && 'gtag' in window) {
        ;(window as any).gtag('event', 'form_submit', {
          event_category: 'Contact',
          event_label: 'Contact Form',
          value: 1
        })
      }
    } else {
      throw new Error(response.error || 'Unknown error')
    }

  } catch (submitError: any) {
    console.error('Form submission error:', submitError)
    
    // Set user-friendly error message
    if (submitError.data?.error) {
      error.value = submitError.data.error
    } else if (submitError.message) {
      error.value = submitError.message
    } else {
      error.value = t('contact.form.error.general')
    }
    
    // Show error toast
    toast.add({
      title: t('contact.form.error.title'),
      description: error.value || t('contact.form.error.general'),
      color: 'red',
      icon: 'i-heroicons-x-circle'
    })
    
    // Track form error
    if (process.client && 'gtag' in window) {
      ;(window as any).gtag('event', 'form_error', {
        event_category: 'Contact',
        event_label: 'Contact Form Error',
        value: 1
      })
    }
  } finally {
    loading.value = false
  }
}

// Form error handler
function onError(event: FormErrorEvent) {
  // Focus on first error field
  if (event?.errors?.[0]?.id) {
    const element = document.getElementById(event.errors[0].id)
    if (element) {
      element.focus()
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
  
  // Show error toast
  toast.add({
    title: t('contact.form.error.validation'),
    description: t('contact.form.error.checkFields'),
    color: 'orange',
    icon: 'i-heroicons-exclamation-triangle'
  })
}

// Reset form function
function resetForm() {
  state.name = ''
  state.email = ''
  state.subject = ''
  state.message = ''
  state['bot-field'] = ''
  
  submitted.value = false
  error.value = null
  loading.value = false
  
  toast.add({
    title: t('contact.form.reset'),
    description: t('contact.form.resetDescription'),
    color: 'blue',
    icon: 'i-heroicons-arrow-path'
  })
}

// Auto-clear errors when user types (using watch)
watch(state, () => {
  if (error.value) {
    error.value = null
  }
}, { deep: true })
</script>

<style scoped>
/* RTL support for form layout */
:deep(.rtl) {
  direction: rtl;
}

:deep(.rtl) .form-group {
  text-align: right;
}

/* Form animations and transitions for better UX */
.form-field-enter-active,
.form-field-leave-active {
  transition: all 0.3s ease;
}

.form-field-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.form-field-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Honeypot field should be completely hidden */
input[name="bot-field"] {
  position: absolute !important;
  left: -9999px !important;
  visibility: hidden !important;
  opacity: 0 !important;
  height: 0 !important;
  width: 0 !important;
}
</style>