import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
  },
  resolve: {
    alias: {
      '~': resolve(__dirname, '.'),
      '@': resolve(__dirname, '.'),
      '#app': resolve(__dirname, 'node_modules/@nuxt/kit/dist/app'),
      '#imports': resolve(__dirname, 'node_modules/@nuxt/kit/dist/imports'),
      '#content/client': resolve(__dirname, 'node_modules/@nuxt/content/dist/runtime/client'),
    },
  },
})