<template>
  <div class="space-y-8">
    <div class="focus-content prose-theme">
      <h1 class="">Typography Scale Demonstration</h1>
      <p class="lead">
        This component showcases the enhanced typography hierarchy with fluid scaling,
        optimal readability, and language-aware font loading.
      </p>
      
      <h2 class="heading-2">Heading Level 2</h2>
      <p class="body-base">
        This is body text with optimal line height and spacing for comfortable reading.
        The typography system uses CSS clamp() for fluid scaling across all screen sizes.
      </p>
      
      <h3 class="heading-3">Heading Level 3</h3>
      <p class="body-base">
        Our typography system supports both English and Arabic text with appropriate
        font families. <strong>Bold text</strong> uses proper font weights, and 
        <em>italic text</em> provides emphasis where needed.
      </p>
      
      <h4 class="heading-4">Heading Level 4</h4>
      <p class="body-base">
        Links are styled with <a href="#">proper hover states</a> and smooth transitions.
        Inline <code>code snippets</code> use our monospace font with proper styling.
      </p>
      
      <h5 class="heading-5">Heading Level 5</h5>
      <p class="body-small">
        This is smaller body text, useful for captions and secondary information.
        The color is slightly muted for proper visual hierarchy.
      </p>
      
      <h6 class="heading-6">Heading Level 6</h6>
      <p class="caption">
        Caption text is the smallest size, perfect for image descriptions,
        copyright notices, and metadata.
      </p>
      
      <blockquote>
        "Typography is the craft of endowing human language with a durable visual form."
        — Robert Bringhurst
      </blockquote>
      
      <h3>List Examples</h3>
      <ul>
        <li>Unordered list item with proper spacing</li>
        <li>Second item with consistent formatting</li>
        <li>Third item maintaining visual rhythm</li>
      </ul>
      
      <ol>
        <li>Numbered list item with clear hierarchy</li>
        <li>Second numbered item</li>
        <li>Third numbered item</li>
      </ol>
    </div>
    
    <!-- Font loading demonstration -->
    <div class="card-theme p-6">
      <h3 class="heading-3 mb-4">Font Loading Optimization</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <h4 class="font-semibold mb-2">English (Inter)</h4>
          <p class="font-en">
            Inter is a typeface carefully crafted & designed for computer screens.
            It features a tall x-height to aid in readability of mixed-case and 
            lower-case text.
          </p>
        </div>
        <div>
          <h4 class="font-semibold mb-2">Arabic (Noto Sans Arabic)</h4>
          <p class="font-ar" dir="rtl">
            خط نوتو سانس العربي مصمم خصيصاً لضمان وضوح النص العربي
            على الشاشات الرقمية مع دعم جميع الأحرف والعلامات العربية.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// This component demonstrates the typography system
// No additional logic needed for demo purposes
</script>