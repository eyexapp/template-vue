---
name: architecture
type: knowledge
version: 1.0.0
agent: CodeActAgent
triggers:
  - architecture
  - composition api
  - composable
  - pinia
  - vue router
  - script setup
---

# Architecture — Vue 3 (Composition API + Pinia)

## Component Model

- **`<script setup>`** syntax is the standard — no `defineComponent`, no `setup()` return.
- Single File Components (SFC): `<script setup>`, `<template>`, `<style scoped>`.
- Props: `defineProps<{ title: string }>()`.
- Emits: `defineEmits<{ (e: 'submit', data: FormData): void }>()`.
- Slots: `<slot>`, named slots `<slot name="header">`.

## Composables (useX Pattern)

Extract reusable reactive logic into composables:

```ts
// composables/useCounter.ts
export function useCounter(initial = 0) {
  const count = ref(initial);
  const increment = () => count.value++;
  const decrement = () => count.value--;
  return { count, increment, decrement };
}
```

- Always prefix with `use`.
- Return reactive refs/computed — consumer decides how to use them.
- Composables can call other composables.

## Pinia Stores (Setup Syntax)

```ts
// stores/auth.store.ts
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const isAuthenticated = computed(() => !!user.value);

  async function login(credentials: LoginDto) {
    user.value = await authService.login(credentials);
  }

  function logout() {
    user.value = null;
  }

  return { user, isAuthenticated, login, logout };
});
```

- Use **setup store** syntax (function), not options syntax.
- One store per domain: `auth.store.ts`, `cart.store.ts`.
- Keep API calls in services, not directly in stores.

## Vue Router 4

```ts
const routes = [
  { path: '/', component: () => import('@/views/Home.vue') },
  {
    path: '/dashboard',
    component: () => import('@/layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('@/views/Dashboard.vue') },
      { path: 'settings', component: () => import('@/views/Settings.vue') },
    ],
  },
];
```

- Lazy-load all route components with `() => import()`.
- Navigation guards for auth: `router.beforeEach()`.
- Use `meta` for route-level metadata (auth, roles, title).

## Directory Structure

```
src/
├── views/          ← Route-level pages
├── components/     ← Reusable UI components
│   ├── ui/         ← Base atoms (Button, Input, Modal)
│   └── layout/     ← App shell (Sidebar, Header)
├── composables/    ← Reactive logic (useX)
├── stores/         ← Pinia stores
├── services/       ← API/business logic
├── router/         ← Vue Router config
├── types/          ← TypeScript interfaces
└── utils/          ← Pure helper functions
```

## Auto-imports (unplugin-vue-components + unplugin-auto-import)

- Vue APIs (`ref`, `computed`, `watch`, `onMounted`) auto-imported.
- Components auto-resolved from `components/` directory.
- Pinia stores, Vue Router, VueUse composables auto-imported.
