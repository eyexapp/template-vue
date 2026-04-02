# Project Intelligence — Vue Template

## Architecture Overview

This is a Vue 3 + TypeScript + Vite production template with layered architecture, auto-imports, and full DX tooling.

### Tech Stack

| Layer     | Technology                                                         |
| --------- | ------------------------------------------------------------------ |
| Framework | Vue 3 (Composition API, `<script setup>`)                          |
| Build     | Vite 7 + vue-tsc                                                   |
| Routing   | Vue Router 4 (lazy-loaded routes)                                  |
| State     | Pinia (setup stores)                                               |
| i18n      | vue-i18n 11 (Composition API mode)                                 |
| Styling   | Tailwind CSS v4 (CSS-first config)                                 |
| Testing   | Vitest + @vue/test-utils                                           |
| Lint      | ESLint 9 flat config + eslint-plugin-vue                           |
| Format    | Prettier + prettier-plugin-tailwindcss                             |
| DX        | unplugin-auto-import, unplugin-vue-components, Husky + lint-staged |

## Layer Map

```
src/
├── main.ts              → Entry point: plugin registration
├── app/                 → App shell: root component + router config
├── features/            → Feature modules (pages grouped by domain)
├── components/ui/       → Shared reusable UI components
├── composables/         → Vue composables (use* reactive hooks)
├── stores/              → Pinia stores (global state)
├── layouts/             → Page layout wrappers
├── lib/                 → Non-reactive utilities (HTTP client, i18n setup)
├── styles/              → Global CSS (Tailwind entry point)
└── types/               → Shared TypeScript type definitions
tests/
├── setup.ts             → Test bootstrap (i18n mock)
└── components/          → Component unit tests
```

## Dependency Flow

```
features/ → composables/ → stores/ → lib/
    ↓            ↓
components/ui/  (presentation only, no business logic)
```

- **features/** depend on composables, stores, and components
- **composables/** may depend on stores and lib
- **stores/** depend only on lib
- **lib/** has no internal dependencies (pure utilities)
- **components/ui/** are presentation-only — they receive data via props

## Critical Rules

1. **Always use Composition API with `<script setup>`** — never Options API
2. **Always use TypeScript** — no `.js` files in `src/`
3. **Multi-word component names** — `AppButton.vue`, not `Button.vue` (Vue ESLint rule)
4. **Block order in SFCs**: `<script>` → `<template>` → `<style>` (enforced by ESLint)
5. **Never use Vuex** — only Pinia for state management
6. **Lazy-load route components** — `() => import('@/features/...')`
7. **Scoped styles preferred** — use `<style scoped>` or Tailwind utility classes
8. **Path alias `@/`** maps to `src/` — always use it for imports
9. **Auto-imports are enabled** — `ref`, `computed`, `watch`, `useRoute`, `useI18n`, `defineStore` etc. are available without explicit imports
10. **No runtime dependencies beyond core four** — vue, vue-router, pinia, vue-i18n

## Key Patterns

### Adding a New Feature Page

```
src/features/products/
└── ProductsPage.vue
```

Register in `src/app/router.ts`:

```ts
{
  path: 'products',
  name: 'products',
  component: () => import('@/features/products/ProductsPage.vue'),
}
```

### Adding a Pinia Store

```ts
// src/stores/cart.store.ts
export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);
  const total = computed(() => items.value.reduce((sum, item) => sum + item.price, 0));
  function addItem(item: CartItem) {
    items.value.push(item);
  }
  return { items, total, addItem };
});
```

### Adding a Composable

```ts
// src/composables/useDebounce.ts
export function useDebounce<T>(value: Ref<T>, delay = 300): Ref<T> {
  const debounced = ref(value.value) as Ref<T>;
  let timeout: ReturnType<typeof setTimeout>;
  watch(value, (v) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      debounced.value = v;
    }, delay);
  });
  return debounced;
}
```

### Adding a Reusable UI Component

```
src/components/ui/AppCard.vue
```

- Receives data via `defineProps`
- Emits events via `defineEmits`
- Uses Tailwind for styling
- Auto-imported everywhere (via unplugin-vue-components)

### Adding an i18n Key

1. Add to `src/lib/i18n/locales/en.json` and `locales/tr.json`
2. Use in template: `{{ $t('section.key') }}` or `t('section.key')` in `<script setup>`

## File Naming Conventions

| Type          | Convention                         | Example              |
| ------------- | ---------------------------------- | -------------------- |
| Vue component | PascalCase.vue                     | `AppButton.vue`      |
| Composable    | camelCase with `use` prefix        | `useApi.ts`          |
| Store         | kebab-case with `.store` suffix    | `app.store.ts`       |
| Type file     | camelCase                          | `index.ts`           |
| i18n locale   | lowercase language code            | `en.json`, `tr.json` |
| Test file     | matches source with `.test` suffix | `AppButton.test.ts`  |

## Environment Variables

- Prefixed with `VITE_` to be exposed to client code
- Defined in `src/env.d.ts` for type safety
- Example: `VITE_API_BASE_URL` used by `src/lib/http.ts`
- **Never put secrets in VITE\_ variables** — they are embedded in the client bundle

## Scripts

| Command             | Purpose                        |
| ------------------- | ------------------------------ |
| `npm run dev`       | Start Vite dev server with HMR |
| `npm run build`     | Type-check + production build  |
| `npm run test`      | Run tests once                 |
| `npm run lint`      | Check ESLint rules             |
| `npm run format`    | Format all files with Prettier |
| `npm run typecheck` | Run vue-tsc type checker only  |
