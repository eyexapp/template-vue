import { createI18n } from 'vue-i18n';

import en from './locales/en.json';

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') ?? 'en',
  fallbackLocale: 'en',
  messages: { en },
});

export async function loadLocale(locale: string): Promise<void> {
  const global = i18n.global;

  if ((global.availableLocales as string[]).includes(locale)) {
    (global.locale as unknown as { value: string }).value = locale;
    return;
  }

  const messages = await import(`./locales/${locale}.json`);
  global.setLocaleMessage(locale, messages.default);
  (global.locale as unknown as { value: string }).value = locale;
}

export default i18n;
