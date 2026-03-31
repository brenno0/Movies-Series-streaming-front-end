import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './setupTests.tsx',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      reportsDirectory: './coverage',
      clean: false,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
