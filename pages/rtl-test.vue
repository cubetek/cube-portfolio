<template>
  <div class="min-h-screen p-8">
    <!-- Header with language switcher -->
    <header class="mb-8">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-3xl font-bold">{{ $t('rtl_test.title') }}</h1>
        <LanguageSwitcher />
      </div>
      <p class="text-gray-600">
        {{ $t('rtl_test.description') }}
      </p>
      <div class="mt-4 p-4 bg-gray-100 rounded">
        <p class="text-sm">
          <strong>Current Direction:</strong> {{ direction }} | 
          <strong>Is RTL:</strong> {{ isRTL ? 'Yes' : 'No' }} |
          <strong>Locale:</strong> {{ locale }}
        </p>
      </div>
    </header>

    <!-- RTL Layout Tests -->
    <div class="space-y-8">
      <!-- Test 1: Text Alignment -->
      <section class="border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">{{ $t('rtl_test.text_alignment') }}</h2>
        <div class="space-y-2">
          <p class="text-start">{{ $t('rtl_test.start_aligned') }}</p>
          <p class="text-end">{{ $t('rtl_test.end_aligned') }}</p>
          <p class="text-center">{{ $t('rtl_test.center_aligned') }}</p>
        </div>
      </section>

      <!-- Test 2: Flexbox Layout -->
      <section class="border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">{{ $t('rtl_test.flexbox_layout') }}</h2>
        <div class="flex gap-4 mb-4">
          <div class="bg-blue-500 text-white p-4 rounded">{{ $t('rtl_test.item') }} 1</div>
          <div class="bg-green-500 text-white p-4 rounded">{{ $t('rtl_test.item') }} 2</div>
          <div class="bg-red-500 text-white p-4 rounded">{{ $t('rtl_test.item') }} 3</div>
        </div>
        <div class="flex justify-between gap-4">
          <div class="bg-purple-500 text-white p-4 rounded">{{ $t('rtl_test.start') }}</div>
          <div class="bg-yellow-500 text-white p-4 rounded">{{ $t('rtl_test.end') }}</div>
        </div>
      </section>

      <!-- Test 3: Margins and Padding -->
      <section class="border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">{{ $t('rtl_test.spacing') }}</h2>
        <div class="space-y-4">
          <div class="bg-gray-200 p-2">
            <div :class="[marginStart('8'), 'bg-blue-500 text-white p-2 rounded']">
              {{ $t('rtl_test.margin_start') }}
            </div>
          </div>
          <div class="bg-gray-200 p-2">
            <div :class="[marginEnd('8'), 'bg-green-500 text-white p-2 rounded']">
              {{ $t('rtl_test.margin_end') }}
            </div>
          </div>
          <div :class="[paddingStart('8'), 'bg-red-500 text-white p-2 rounded']">
            {{ $t('rtl_test.padding_start') }}
          </div>
          <div :class="[paddingEnd('8'), 'bg-purple-500 text-white p-2 rounded']">
            {{ $t('rtl_test.padding_end') }}
          </div>
        </div>
      </section>

      <!-- Test 4: Icons and Directional Elements -->
      <section class="border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">{{ $t('rtl_test.icons') }}</h2>
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <span>{{ $t('rtl_test.arrow_icon') }}:</span>
            <span :class="flipForRTL()" class="text-2xl">→</span>
          </div>
          <div class="flex items-center gap-4">
            <span>{{ $t('rtl_test.chevron_icon') }}:</span>
            <span :class="flipForRTL()" class="text-2xl">›</span>
          </div>
        </div>
      </section>

      <!-- Test 5: Grid Layout -->
      <section class="border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">{{ $t('rtl_test.grid_layout') }}</h2>
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-indigo-500 text-white p-4 rounded text-center">1</div>
          <div class="bg-indigo-500 text-white p-4 rounded text-center">2</div>
          <div class="bg-indigo-500 text-white p-4 rounded text-center">3</div>
          <div class="bg-indigo-500 text-white p-4 rounded text-center">4</div>
          <div class="bg-indigo-500 text-white p-4 rounded text-center">5</div>
          <div class="bg-indigo-500 text-white p-4 rounded text-center">6</div>
        </div>
      </section>

      <!-- Test 6: Form Elements -->
      <section class="border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">{{ $t('rtl_test.form_elements') }}</h2>
        <form class="space-y-4">
          <div>
            <label :class="['block mb-2', textStart()]">{{ $t('rtl_test.text_input') }}</label>
            <input 
              type="text" 
              :class="['w-full p-2 border rounded', textStart()]"
              :placeholder="$t('rtl_test.placeholder')"
            >
          </div>
          <div>
            <label :class="['block mb-2', textStart()]">{{ $t('rtl_test.textarea') }}</label>
            <textarea 
              :class="['w-full p-2 border rounded', textStart()]"
              rows="3"
              :placeholder="$t('rtl_test.placeholder')"
            ></textarea>
          </div>
          <div class="flex items-center gap-2">
            <input type="checkbox" id="checkbox">
            <label for="checkbox" :class="textStart()">{{ $t('rtl_test.checkbox_label') }}</label>
          </div>
        </form>
      </section>

      <!-- Test 7: Borders -->
      <section class="border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">{{ $t('rtl_test.borders') }}</h2>
        <div class="space-y-4">
          <div :class="[borderStart('4'), 'p-4 border-blue-500']">
            {{ $t('rtl_test.border_start') }}
          </div>
          <div :class="[borderEnd('4'), 'p-4 border-green-500']">
            {{ $t('rtl_test.border_end') }}
          </div>
        </div>
      </section>

      <!-- Test 8: Mixed Content -->
      <section class="border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">{{ $t('rtl_test.mixed_content') }}</h2>
        <div class="space-y-4">
          <p class="mixed-content">
            {{ $t('rtl_test.mixed_text') }}
          </p>
          <div class="flex gap-4">
            <span class="font-english">English Text</span>
            <span class="font-arabic">نص عربي</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
// Import composables
const { locale } = useI18n()
const { 
  isRTL, 
  direction, 
  marginStart, 
  marginEnd, 
  paddingStart, 
  paddingEnd,
  textStart,
  textEnd,
  flipForRTL,
  borderStart,
  borderEnd
} = useRTL()

// Page meta
definePageMeta({
  layout: 'default'
})

// SEO
useHead({
  title: 'RTL Layout Test',
  meta: [
    { name: 'description', content: 'Test page for RTL layout functionality' }
  ]
})
</script>