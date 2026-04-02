---
name: code-quality
type: knowledge
version: 1.0.0
agent: CodeActAgent
triggers:
  - clean code
  - naming
  - lint
  - eslint
  - style
  - refactor
---

# Code Quality — Vue 3 + TypeScript

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Component file | PascalCase | `UserCard.vue` |
| View/Page | PascalCase + View | `DashboardView.vue` |
| Composable | camelCase + use prefix | `useAuth.ts` |
| Store | camelCase + .store | `auth.store.ts` |
| Service | camelCase + .service | `user.service.ts` |
| Prop | camelCase | `:userName="name"` |
| Emit event | camelCase verb | `@updateProfile` |
| CSS class | kebab-case | `.user-card` |

## SFC Order

1. `<script setup lang="ts">` — logic first
2. `<template>` — markup
3. `<style scoped>` — styles (always scoped)

## Component Rules

- One component per file.
- Props must be typed: `defineProps<{ items: Item[] }>()`.
- Complex prop defaults: `withDefaults(defineProps<Props>(), { ... })`.
- Use `v-model` with `defineModel()` for two-way binding.
- Key `v-for` loops: `v-for="item in items" :key="item.id"`.

## Anti-Patterns

- **No reactive in templates**: Don't call `ref()` in templates.
- **No watchers for derived state**: Use `computed()` instead.
- **No direct store mutation from components**: Use store actions.
- **No `this`**: `<script setup>` has no `this`.
- **Avoid mixins**: Use composables instead.

## Linting — ESLint 9 + @vue/eslint-config-typescript

- Flat config: `eslint.config.ts`.
- Vue-specific: `eslint-plugin-vue` (recommended rules).
- Auto-fix: `npm run lint -- --fix`.
- Prettier integration: `eslint-plugin-prettier`.
