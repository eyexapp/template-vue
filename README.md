# Vue Template

Production-ready Vue 3 template with layered architecture, full TypeScript support, and modern DX tooling.

## Tech Stack

| Category  | Technology                                                |
| --------- | --------------------------------------------------------- |
| Framework | Vue 3.5 — Composition API, `<script setup>`               |
| Build     | Vite 7 + vue-tsc                                          |
| Routing   | Vue Router 4 — lazy-loaded routes                         |
| State     | Pinia — setup stores                                      |
| i18n      | vue-i18n 11 — Composition API mode, lazy locale loading   |
| Styling   | Tailwind CSS v4 — CSS-first `@theme` config               |
| Testing   | Vitest + @vue/test-utils                                  |
| Lint      | ESLint 9 flat config + eslint-plugin-vue                  |
| Format    | Prettier + prettier-plugin-tailwindcss                    |
| DX        | Auto-imports (vue/router/pinia/i18n), Husky + lint-staged |

## Project Structure

```
src/
├── main.ts                 # Entry — createApp + plugin registration
├── env.d.ts                # Vite env type declarations
├── app/
│   ├── App.vue             # Root component
│   └── router.ts           # Route definitions (lazy-loaded)
├── components/ui/          # Shared reusable components (auto-imported)
│   └── AppButton.vue
├── composables/            # Vue composables (use* hooks)
│   ├── useApi.ts           # Reactive fetch wrapper
│   └── useTheme.ts         # Theme management (dark/light/system)
├── features/               # Feature modules (pages by domain)
│   └── home/
│       └── HomePage.vue
├── layouts/                # Page layout wrappers
│   └── DefaultLayout.vue
├── lib/                    # Non-reactive utilities
│   ├── http.ts             # Typed HTTP client
│   └── i18n/
│       ├── index.ts        # vue-i18n setup
│       └── locales/
│           ├── en.json     # English locale
│           └── tr.json     # Turkish locale
├── stores/                 # Pinia stores
│   └── app.store.ts        # App-level state (theme, locale)
├── styles/
│   └── app.css             # Tailwind v4 entry + theme
└── types/
    └── index.ts            # Shared types
tests/
├── setup.ts                # Test bootstrap (i18n mock)
└── components/
    └── AppButton.test.ts   # Example component test
```

## Getting Started

```bash
# Clone and install
git clone <repo-url> my-app
cd my-app
npm install

# Start development
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Architecture

### Dependency Flow

```
features/ → composables/ → stores/ → lib/
    ↓            ↓
components/ui/  (presentation only)
```

- **features/** — Page components grouped by domain. Depend on composables, stores, and components.
- **composables/** — Reactive hooks (`use*`). May depend on stores and lib.
- **stores/** — Pinia stores for global state. Depend only on lib.
- **lib/** — Pure utilities with no internal dependencies (HTTP client, i18n setup).
- **components/ui/** — Presentation-only. Receive data via props, emit events.

### Auto-Imports

Vue APIs (`ref`, `computed`, `watch`), Vue Router (`useRoute`, `useRouter`), Pinia (`defineStore`, `storeToRefs`), and vue-i18n (`useI18n`) are automatically available without explicit imports.

Components in `src/components/` are auto-registered globally.

Generated type declarations (`auto-imports.d.ts`, `components.d.ts`) are gitignored and regenerated on dev/build.

## Common Tasks

### Add a Route

Create the page component in `src/features/`:

```
src/features/about/AboutPage.vue
```

Add to `src/app/router.ts`:

```ts
{
  path: 'about',
  name: 'about',
  component: () => import('@/features/about/AboutPage.vue'),
}
```

### Add a Store

```ts
// src/stores/cart.store.ts
export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);
  const total = computed(() => items.value.reduce((sum, i) => sum + i.price, 0));
  function addItem(item: CartItem) {
    items.value.push(item);
  }
  return { items, total, addItem };
});
```

### Add a Composable

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

### Add a Translation Key

1. Add key to `src/lib/i18n/locales/en.json` and `src/lib/i18n/locales/tr.json`
2. Use in template: `{{ $t('section.key') }}`
3. Use in script: `const { t } = useI18n(); t('section.key');`

### Add a UI Component

Create in `src/components/ui/AppCard.vue` — it will be auto-imported everywhere.

## Scripts

| Command                 | Purpose                                   |
| ----------------------- | ----------------------------------------- |
| `npm run dev`           | Start Vite dev server with HMR            |
| `npm run build`         | Type-check (`vue-tsc`) + production build |
| `npm run preview`       | Preview production build locally          |
| `npm run test`          | Run tests once with Vitest                |
| `npm run test:watch`    | Run tests in watch mode                   |
| `npm run test:coverage` | Run tests with coverage report            |
| `npm run lint`          | Check ESLint rules                        |
| `npm run lint:fix`      | Auto-fix ESLint issues                    |
| `npm run format`        | Format all files with Prettier            |
| `npm run format:check`  | Check Prettier compliance                 |
| `npm run typecheck`     | Run vue-tsc type checker                  |

## Environment Variables

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Variables prefixed with `VITE_` are exposed to client code and typed in `src/env.d.ts`.

> **Security:** Never put secrets in `VITE_` variables — they are embedded in the client bundle. Use a backend proxy for sensitive API keys.

## Testing

Tests live in `tests/` and mirror the source structure. Run with:

```bash
npm test                 # Single run
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage
```

Component tests use `@vue/test-utils` with `mount()`. The test setup (`tests/setup.ts`) provides a global vue-i18n instance.

## Recommended Addons

These are not included to keep the template minimal, but are commonly used:

- **[VueUse](https://vueuse.org/)** — 200+ utility composables
- **[Pinia Plugin Persistedstate](https://prazdevs.github.io/pinia-plugin-persistedstate/)** — Automatic store persistence
- **[unplugin-vue-router](https://uvr.esm.is/)** — File-based routing
- **[@vueuse/head](https://unhead.unjs.io/)** — Document head management
