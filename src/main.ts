import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from '@/app/App.vue';
import i18n from '@/lib/i18n';
import router from '@/app/router';

import '@/styles/app.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount('#app');
