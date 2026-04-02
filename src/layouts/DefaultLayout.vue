<script setup lang="ts"></script>

<template>
  <div class="min-h-screen bg-white dark:bg-gray-950">
    <header class="border-b border-gray-200 dark:border-gray-800">
      <nav class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <RouterLink to="/" class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ $t('app.title') }}
        </RouterLink>
        <div class="flex items-center gap-4">
          <!-- Navigation links go here -->
        </div>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>
