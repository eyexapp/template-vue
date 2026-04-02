import { computed } from 'vue';

import { type Theme, useAppStore } from '@/stores/app.store';

export function useTheme() {
  const store = useAppStore();

  const isDark = computed(() => {
    if (store.theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return store.theme === 'dark';
  });

  function setTheme(value: Theme): void {
    store.setTheme(value);
  }

  function toggle(): void {
    setTheme(isDark.value ? 'light' : 'dark');
  }

  return { theme: computed(() => store.theme), isDark, setTheme, toggle };
}
