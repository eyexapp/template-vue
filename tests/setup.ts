import { config } from '@vue/test-utils';
import { createI18n } from 'vue-i18n';

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      app: { title: 'Vue Template', home: 'Home' },
      common: { loading: 'Loading…', error: 'Something went wrong', retry: 'Retry' },
      home: { heading: 'Welcome', description: 'Start building your application.' },
    },
  },
});

config.global.plugins = [i18n];
