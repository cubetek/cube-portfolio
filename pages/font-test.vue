<template>
  <div class="container mx-auto p-8">
    <h1 class="text-3xl font-bold mb-8">Font Loading Test Page</h1>
    
    <!-- English Section -->
    <section class="mb-12" lang="en">
      <h2 class="text-2xl font-semibold mb-4">English Text (Inter Font)</h2>
      <div class="space-y-4">
        <p class="font-light">Light (300): The quick brown fox jumps over the lazy dog.</p>
        <p class="font-normal">Regular (400): The quick brown fox jumps over the lazy dog.</p>
        <p class="font-medium">Medium (500): The quick brown fox jumps over the lazy dog.</p>
        <p class="font-semibold">Semi-bold (600): The quick brown fox jumps over the lazy dog.</p>
        <p class="font-bold">Bold (700): The quick brown fox jumps over the lazy dog.</p>
        <p class="italic">Italic: The quick brown fox jumps over the lazy dog.</p>
      </div>
    </section>

    <!-- Arabic Section -->
    <section class="mb-12" lang="ar" dir="rtl">
      <h2 class="text-2xl font-semibold mb-4">النص العربي (خط نوتو سانس العربي)</h2>
      <div class="space-y-4">
        <p class="font-light">خفيف (300): نص تجريبي لاختبار الخط العربي في الموقع.</p>
        <p class="font-normal">عادي (400): نص تجريبي لاختبار الخط العربي في الموقع.</p>
        <p class="font-medium">متوسط (500): نص تجريبي لاختبار الخط العربي في الموقع.</p>
        <p class="font-semibold">شبه عريض (600): نص تجريبي لاختبار الخط العربي في الموقع.</p>
        <p class="font-bold">عريض (700): نص تجريبي لاختبار الخط العربي في الموقع.</p>
      </div>
    </section>

    <!-- Mixed Content Section -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold mb-4">Mixed Content Test</h2>
      <p class="mixed-content">
        This paragraph contains both English text and <span lang="ar">نص عربي</span> to test how the fonts work together.
      </p>
      <p class="mixed-content" dir="rtl" lang="ar">
        هذه الفقرة تحتوي على نص عربي و <span lang="en">English text</span> لاختبار كيفية عمل الخطوط معًا.
      </p>
    </section>

    <!-- Font Loading Status -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold mb-4">Font Loading Status</h2>
      <div id="font-status" class="space-y-2">
        <p>Checking font loading status...</p>
      </div>
    </section>

    <!-- Visual Font Test -->
    <section class="mb-12">
      <h2 class="text-2xl font-semibold mb-4">Visual Font Comparison</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="border p-4 rounded">
          <h3 class="font-semibold mb-2">English (with Inter)</h3>
          <p style="font-family: 'Inter', sans-serif;">ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
          <p style="font-family: 'Inter', sans-serif;">abcdefghijklmnopqrstuvwxyz</p>
          <p style="font-family: 'Inter', sans-serif;">1234567890!@#$%^&*()</p>
        </div>
        <div class="border p-4 rounded" dir="rtl">
          <h3 class="font-semibold mb-2">العربية (مع نوتو سانس العربي)</h3>
          <p style="font-family: 'Noto Sans Arabic', sans-serif;">أبتثجحخدذرزسشصضطظعغفقكلمنهوي</p>
          <p style="font-family: 'Noto Sans Arabic', sans-serif;">١٢٣٤٥٦٧٨٩٠</p>
          <p style="font-family: 'Noto Sans Arabic', sans-serif;">السلام عليكم ورحمة الله وبركاته</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // Check if fonts are loaded
  const checkFonts = async () => {
    const statusDiv = document.getElementById('font-status')
    statusDiv.innerHTML = ''
    
    try {
      // Check if Font Loading API is supported
      if ('fonts' in document) {
        const fontCheckPromises = [
          document.fonts.check('12px Inter'),
          document.fonts.check('12px "Noto Sans Arabic"')
        ]
        
        const results = await Promise.all(fontCheckPromises)
        
        statusDiv.innerHTML = `
          <p class="text-green-600">✓ Inter font loaded: ${results[0] ? 'Yes' : 'No'}</p>
          <p class="text-green-600">✓ Noto Sans Arabic font loaded: ${results[1] ? 'Yes' : 'No'}</p>
          <p class="text-blue-600">Total fonts loaded: ${document.fonts.size}</p>
        `
        
        // List all loaded fonts
        const loadedFonts = []
        document.fonts.forEach(font => {
          loadedFonts.push(`${font.family} ${font.weight} ${font.style}`)
        })
        
        if (loadedFonts.length > 0) {
          statusDiv.innerHTML += `
            <div class="mt-4">
              <p class="font-semibold">Loaded font variations:</p>
              <ul class="list-disc list-inside text-sm text-gray-600">
                ${loadedFonts.map(font => `<li>${font}</li>`).join('')}
              </ul>
            </div>
          `
        }
      } else {
        statusDiv.innerHTML = '<p class="text-yellow-600">Font Loading API not supported in this browser</p>'
      }
    } catch (error) {
      statusDiv.innerHTML = `<p class="text-red-600">Error checking fonts: ${error.message}</p>`
    }
  }
  
  // Check fonts after a short delay to ensure they're loaded
  setTimeout(checkFonts, 1000)
})
</script>