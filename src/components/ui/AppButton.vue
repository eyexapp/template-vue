<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}>();

defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<template>
  <button
    :disabled="disabled"
    :class="[
      'focus-visible:outline-primary-500 inline-flex cursor-pointer items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50',
      {
        'bg-primary-600 hover:bg-primary-700 text-white': variant === 'primary' || !variant,
        'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700':
          variant === 'secondary',
        'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800':
          variant === 'ghost',
      },
      {
        'px-3 py-1.5 text-sm': size === 'sm',
        'px-4 py-2 text-sm': size === 'md' || !size,
        'px-5 py-2.5 text-base': size === 'lg',
      },
    ]"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>
