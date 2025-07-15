<template>
  <div class="space-y-8">
    <!-- Page Header using improved structure -->
    <div class="text-center space-y-4">
      <UButton
        to="/"
        variant="ghost"
        size="xs"
        label="← Back to Home"
        class="mb-4"
      />
      
      <div class="space-y-2">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Nuxt UI Components Test
        </h1>
        <p class="text-gray-600 dark:text-gray-300">
          Testing various Nuxt UI components and their functionality
        </p>
      </div>
    </div>

    <!-- Color Mode Toggle -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">Color Mode</h2>
      </template>
      
      <UButton @click="$colorMode.preference = $colorMode.preference === 'dark' ? 'light' : 'dark'">
        Toggle {{ $colorMode.preference === 'dark' ? 'Light' : 'Dark' }} Mode
      </UButton>
    </UCard>

    <!-- Buttons Section -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">Buttons</h2>
      </template>
      
      <div class="flex flex-wrap gap-4">
        <UButton>Default</UButton>
        <UButton color="primary">Primary</UButton>
        <UButton color="gray">Gray</UButton>
        <UButton color="red">Red</UButton>
        <UButton color="green">Green</UButton>
        <UButton color="blue">Blue</UButton>
        <UButton variant="outline">Outline</UButton>
        <UButton variant="soft">Soft</UButton>
        <UButton variant="ghost">Ghost</UButton>
        <UButton variant="link">Link</UButton>
      </div>
    </UCard>

    <!-- Form Elements -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">Form Elements</h2>
      </template>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UInput 
          v-model="inputValue"
          placeholder="Enter your name" 
          icon="i-heroicons-user"
        />
        
        <USelect 
          v-model="selectValue"
          :options="selectOptions" 
          placeholder="Select an option"
        />
        
        <UTextarea 
          v-model="textareaValue"
          placeholder="Enter a message"
          :rows="3"
        />
        
        <USwitch
          v-model="switchValue"
          label="Enable notifications"
        />
      </div>
    </UCard>

      

      <!-- Cards -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Cards</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UCard>
            <template #header>
              <h3 class="text-lg font-medium">Card Title</h3>
            </template>
            <p class="text-gray-600 dark:text-gray-300">
              This is a sample card content with some descriptive text.
            </p>
            <template #footer>
              <UButton size="sm">Action</UButton>
            </template>
          </UCard>

          <UCard>
            <template #header>
              <h3 class="text-lg font-medium">Another Card</h3>
            </template>
            <p class="text-gray-600 dark:text-gray-300">
              Another card with different content to showcase variety.
            </p>
          </UCard>

          <UCard>
            <template #header>
              <h3 class="text-lg font-medium">Third Card</h3>
            </template>
            <p class="text-gray-600 dark:text-gray-300">
              A third card to complete the grid layout demonstration.
            </p>
          </UCard>
        </div>
      </div>

      <!-- Badges and Alerts -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Badges & Alerts</h2>
        <div class="space-y-4">
          <div class="flex flex-wrap gap-2">
            <UBadge>Default</UBadge>
            <UBadge color="primary">Primary</UBadge>
            <UBadge color="red">Error</UBadge>
            <UBadge color="green">Success</UBadge>
            <UBadge color="yellow">Warning</UBadge>
            <UBadge variant="outline">Outline</UBadge>
          </div>
          <UAlert
            title="Information"
            description="This is an informational alert message."
            color="blue"
          />
        </div>
      </div>

      <!-- Navigation -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Navigation</h2>
        <UTabs :items="tabs" class="w-full">
          <template #item="{ item }">
            <div class="py-4">
              <p>{{ item.content }}</p>
            </div>
          </template>
        </UTabs>
      </div>

      <!-- Data Display -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Data Display</h2>
        <UTable :data="tableData" :columns="tableColumns" />
      </div>

      <!-- Modals and Overlays -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Modals & Overlays</h2>
        <div class="flex gap-4">
          <UButton @click="isModalOpen = true">Open Modal</UButton>
          <UButton @click="showNotification">Show Notification</UButton>
        </div>
      </div>

      <!-- Modal -->
      <UModal v-model:open="isModalOpen" title="Modal Title">
        <template #body>
          <div class="py-4">
            <p class="text-gray-600 dark:text-gray-300">
              This is a modal dialog with some content inside.
            </p>
          </div>
        </template>
        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton variant="ghost" @click="isModalOpen = false">Cancel</UButton>
            <UButton @click="isModalOpen = false">Confirm</UButton>
          </div>
        </template>
      </UModal>

      <!-- Icons -->
      <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4">Icons</h2>
        <div class="flex gap-4">
          <UIcon name="i-heroicons-home" class="w-6 h-6" />
          <UIcon name="i-heroicons-user" class="w-6 h-6" />
          <UIcon name="i-heroicons-heart" class="w-6 h-6" />
          <UIcon name="i-heroicons-star" class="w-6 h-6" />
          <UIcon name="i-heroicons-bell" class="w-6 h-6" />
        </div>
      </div>

      <!-- Back to Home -->
      <div class="text-center">
        <UButton 
          to="/" 
          variant="outline" 
          icon="i-heroicons-arrow-left"
        >
          Back to Home
        </UButton>
      </div>
    </div>
</template>

<script setup lang="ts">
// Page metadata
useHead({
  title: 'Nuxt UI Components Test',
  meta: [
    { name: 'description', content: 'Testing page for Nuxt UI components' }
  ]
})

// Reactive data
const isModalOpen = ref(false)
const inputValue = ref('')
const selectValue = ref(null)
const textareaValue = ref('')
const switchValue = ref(false)

// Select options
const selectOptions = [
  { label: 'Option 1', value: 'option1' },
  { label: 'Option 2', value: 'option2' },
  { label: 'Option 3', value: 'option3' }
]

// Tab data
const tabs = [
  {
    label: 'Tab 1',
    content: 'This is the content of the first tab.'
  },
  {
    label: 'Tab 2', 
    content: 'This is the content of the second tab.'
  },
  {
    label: 'Tab 3',
    content: 'This is the content of the third tab.'
  }
]

// Table data
const tableColumns = [
  { id: 'id', accessorKey: 'id', header: 'ID' },
  { id: 'name', accessorKey: 'name', header: 'Name' },
  { id: 'email', accessorKey: 'email', header: 'Email' },
  { id: 'role', accessorKey: 'role', header: 'Role' }
]

const tableData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' }
]

// Notification function
const toast = useToast()
const showNotification = () => {
  toast.add({
    title: 'Success!',
    description: 'This is a notification message.',
    color: 'success'
  })
}
</script>