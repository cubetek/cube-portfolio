<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Bilingual Header Example -->
    <header class="mb-8">
      <h1 class="text-4xl font-bold mb-2">
        <span lang="en" class="block font-sans tracking-tight">Welcome to My Portfolio</span>
        <span lang="ar" class="block leading-relaxed" dir="rtl">مرحباً بكم في ملفي الشخصي</span>
      </h1>
    </header>

    <!-- Card with bilingual content -->
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div class="mb-4">
        <h2 class="text-2xl font-semibold font-sans tracking-tight" lang="en">About Me</h2>
        <p lang="en" class="mt-2 font-sans tracking-tight">
          I'm a full-stack developer passionate about creating beautiful, functional web applications.
        </p>
      </div>
      
      <div dir="rtl">
        <h2 class="text-2xl font-semibold leading-relaxed" lang="ar">نبذة عني</h2>
        <p lang="ar" class="mt-2 leading-relaxed">
          أنا مطور ويب متكامل شغوف بإنشاء تطبيقات ويب جميلة وعملية.
        </p>
      </div>
    </div>

    <!-- Font Style Examples -->
    <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 class="text-xl font-semibold mb-3 font-sans tracking-tight" lang="en">Typography Showcase</h3>
        <div class="space-y-2 font-sans tracking-tight" lang="en">
          <p class="text-xs">Extra Small Text (12px)</p>
          <p class="text-sm">Small Text (14px)</p>
          <p class="text-base">Base Text (16px)</p>
          <p class="text-lg">Large Text (18px)</p>
          <p class="text-xl">Extra Large Text (20px)</p>
        </div>
      </div>
      
      <div dir="rtl">
        <h3 class="text-xl font-semibold mb-3 leading-relaxed" lang="ar">عرض الطباعة</h3>
        <div class="space-y-2 leading-relaxed" lang="ar">
          <p class="text-xs">نص صغير جداً (12px)</p>
          <p class="text-sm">نص صغير (14px)</p>
          <p class="text-base">نص أساسي (16px)</p>
          <p class="text-lg">نص كبير (18px)</p>
          <p class="text-xl">نص كبير جداً (20px)</p>
        </div>
      </div>
    </div>
  </div>
</template>

