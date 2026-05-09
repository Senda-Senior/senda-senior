import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'server-only': path.resolve(__dirname, './src/test/server-only.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    exclude: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/tests/**/*.spec.ts',
      '**/tests/**/*.spec.tsx',
      '**/*.debug.test.ts',
      '**/debug*.test.ts',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        'src/app/**/*.page.tsx',
        'src/app/**/*.layout.tsx',
        'src/app/**/*.route.tsx',
        'src/app/**/*.loading.tsx',
        'src/app/**/*.error.tsx',
      ],
    },
  },
});
