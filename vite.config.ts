import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import autoImport from 'unplugin-auto-import/vite';
import components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    autoImport({
      imports: ['vue', 'vue-router', 'pinia', 'vue-i18n'],
      dts: 'auto-imports.d.ts',
      vueTemplate: true,
    }),
    components({
      dirs: ['src/components'],
      dts: 'components.d.ts',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['tests/setup.ts'],
    include: ['tests/**/*.test.ts'],
  },
});
