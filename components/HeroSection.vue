<template>
  <div class="hero-section">
    <!-- Background with subtle animation -->
    <div class="hero-background">
      <div class="hero-gradient"></div>
      <div class="hero-particles"></div>
    </div>
    
    <!-- Main hero content -->
    <div class="hero-content">
      <div class="hero-text">
        <!-- Animated title -->
        <Transition name="hero-title" appear>
          <h1 v-if="isLoaded" class="hero-title">
            <span class="hero-greeting">{{ $t('welcome') }}</span>
            <span class="hero-name">{{ $t('hello_world') }}</span>
          </h1>
        </Transition>
        
        <!-- Animated subtitle -->
        <Transition name="hero-subtitle" appear>
          <p v-if="isLoaded" class="hero-subtitle">
            {{ $t('description') }}
          </p>
        </Transition>
        
        <!-- Animated CTA buttons -->
        <Transition name="hero-cta" appear>
          <div v-if="isLoaded" class="hero-actions">
            <UButton
              :to="localePath('/about')"
              size="lg"
              variant="solid"
              color="primary"
              class="hero-btn hero-btn-primary"
              :aria-label="$t('nav.aboutFullDesc')"
            >
              <template #leading>
                <UIcon name="i-heroicons-user" class="w-5 h-5" aria-hidden="true" />
              </template>
              {{ $t('nav.about') }}
            </UButton>
            
            <UButton
              :to="localePath('/contact')"
              size="lg"
              variant="outline"
              color="primary"
              class="hero-btn hero-btn-outline"
              :aria-label="$t('nav.contactFullDesc')"
            >
              <template #leading>
                <UIcon name="i-heroicons-envelope" class="w-5 h-5" aria-hidden="true" />
              </template>
              {{ $t('nav.contact') }}
            </UButton>
          </div>
        </Transition>
      </div>
      
      <!-- Scroll indicator -->
      <Transition name="hero-scroll" appear>
        <div v-if="isLoaded" class="hero-scroll-indicator">
          <div class="scroll-icon" @click="scrollToNext">
            <UIcon name="i-heroicons-chevron-down" class="w-6 h-6" />
          </div>
          <span class="scroll-text">{{ $t('scroll_down') || 'Scroll Down' }}</span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// Composables
const { locale } = useI18n()
const localePath = useLocalePath()

// State
const isLoaded = ref(false)

// Lifecycle
onMounted(() => {
  // Trigger animations after component is mounted
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})

// Methods
const scrollToNext = () => {
  const nextSection = document.querySelector('.hero-section')?.nextElementSibling
  if (nextSection) {
    nextSection.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, 
    var(--color-primary-50) 0%, 
    var(--color-primary-100) 100%
  );
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}

.hero-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.1) 0%,
    rgba(139, 92, 246, 0.1) 50%,
    rgba(236, 72, 153, 0.1) 100%
  );
  animation: gradient-shift 8s ease-in-out infinite;
}

.hero-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.1) 0%, transparent 50%);
  animation: particles-float 12s ease-in-out infinite;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.hero-text {
  margin-bottom: 4rem;
}

.hero-title {
  margin-bottom: 1.5rem;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  color: var(--color-gray-900);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.hero-greeting {
  font-size: 0.7em;
  font-weight: 500;
  color: var(--color-primary-600);
  opacity: 0.9;
}

.hero-name {
  background: linear-gradient(135deg, 
    var(--color-primary-600) 0%, 
    var(--color-secondary-600) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: text-shimmer 3s ease-in-out infinite;
}

.hero-subtitle {
  font-size: clamp(1.1rem, 2.5vw, 1.5rem);
  color: var(--color-gray-600);
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.hero-btn {
  transform: translateY(0);
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.2);
}

.hero-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px 0 rgba(59, 130, 246, 0.3);
}

.hero-btn-primary {
  background: linear-gradient(135deg, 
    var(--color-primary-600) 0%, 
    var(--color-primary-700) 100%
  );
}

.hero-btn-outline {
  border: 2px solid var(--color-primary-600);
  color: var(--color-primary-600);
}

.hero-btn-outline:hover {
  background: var(--color-primary-600);
  color: white;
}

.hero-scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.hero-scroll-indicator:hover {
  opacity: 1;
}

.scroll-icon {
  width: 2rem;
  height: 2rem;
  border: 2px solid var(--color-primary-600);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: bounce 2s infinite;
}

.scroll-text {
  font-size: 0.875rem;
  color: var(--color-gray-600);
  font-weight: 500;
}

/* Animations */
@keyframes gradient-shift {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

@keyframes particles-float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(1deg); }
  66% { transform: translateY(10px) rotate(-1deg); }
}

@keyframes text-shimmer {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

/* Transition animations */
.hero-title-enter-active {
  animation: slide-up 0.8s ease-out;
}

.hero-subtitle-enter-active {
  animation: slide-up 0.8s ease-out 0.2s both;
}

.hero-cta-enter-active {
  animation: slide-up 0.8s ease-out 0.4s both;
}

.hero-scroll-enter-active {
  animation: fade-in 0.8s ease-out 0.6s both;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .hero-section {
    background: linear-gradient(135deg, 
      var(--color-gray-900) 0%, 
      var(--color-gray-800) 100%
    );
  }
  
  .hero-title {
    color: var(--color-gray-100);
  }
  
  .hero-subtitle {
    color: var(--color-gray-400);
  }
  
  .scroll-text {
    color: var(--color-gray-400);
  }
}

/* RTL support */
[dir="rtl"] .hero-title {
  text-align: right;
}

[dir="rtl"] .hero-subtitle {
  text-align: right;
}

/* Responsive design */
@media (max-width: 768px) {
  .hero-content {
    padding: 1rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-btn {
    width: 100%;
    max-width: 300px;
  }
}

/* Accessibility - respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .hero-gradient,
  .hero-particles,
  .text-shimmer,
  .scroll-icon {
    animation: none;
  }
  
  .hero-title-enter-active,
  .hero-subtitle-enter-active,
  .hero-cta-enter-active,
  .hero-scroll-enter-active {
    animation: none;
  }
}
</style>