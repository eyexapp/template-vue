import { defineStore } from 'pinia';
import { ref } from 'vue';

import { loadLocale } from '@/lib/i18n';

export type Theme = 'light' | 'dark' | 'system';

export const useAppStore = defineStore('app', () => {
  const theme = ref<Theme>((localStorage.getItem('theme') as Theme) ?? 'system');
  const locale = ref(localStorage.getItem('locale') ?? 'en');

  function applyTheme(value: Theme): void {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = value === 'dark' || (value === 'system' && prefersDark);
    document.documentElement.classList.toggle('dark', isDark);
  }

  function setTheme(value: Theme): void {
    theme.value = value;
    localStorage.setItem('theme', value);
    applyTheme(value);
  }

  async function setLocale(value: string): Promise<void> {
    await loadLocale(value);
    locale.value = value;
    localStorage.setItem('locale', value);
    document.documentElement.setAttribute('lang', value);
  }

  // Initialize theme on store creation
  applyTheme(theme.value);

  // Watch system preference changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (theme.value === 'system') {
      applyTheme('system');
    }
  });

  return { theme, locale, setTheme, setLocale };
});
