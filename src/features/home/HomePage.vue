<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
  <div class="mx-auto max-w-3xl px-6 py-16 text-center">
    <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
      {{ t('home.heading') }}
    </h1>
    <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
      {{ t('home.description') }}
    </p>
  </div>
</template>
