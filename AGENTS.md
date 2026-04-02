# AGENTS.md — Vue 3 Composition API Application

## Project Identity

| Key | Value |
|-----|-------|
| Framework | Vue 3.5+ (Composition API, `<script setup>`) |
| Language | TypeScript (strict mode) |
| Category | Frontend SPA |
| State Management | Pinia (setup stores) |
| Styling | Tailwind CSS 4 |
| Testing | Vitest + Vue Test Utils |
| Routing | Vue Router 4 (lazy-loaded) |
| i18n | vue-i18n 11 (Composition API) |
| Auto-imports | unplugin-auto-import + unplugin-vue-components |

---

## Architecture — Layered with Composable Extraction

```
src/
├── assets/              ← Static assets, global CSS
├── components/          ← Shared/reusable components
│   ├── ui/              ← Design system atoms: VButton, VInput, VModal
│   └── layout/          ← AppHeader, AppSidebar, AppFooter
├── composables/         ← Shared composable functions (useX)
├── views/               ← Route page components
│   └── <feature>/
│       ├── <Feature>View.vue
│       ├── components/  ← Feature-scoped components
│       └── composables/ ← Feature-scoped composables
├── stores/              ← Pinia setup stores
├── services/            ← API client functions
├── repositories/        ← Data-access layer (HTTP calls)
├── types/               ← TypeScript interfaces, enums, DTOs
├── router/              ← Route definitions (lazy-loaded)
├── plugins/             ← Vue plugins (i18n, pinia, etc.)
└── utils/               ← Pure utility functions
```

### Strict Layer Rules

| Layer | Can Import From | NEVER Imports |
|-------|----------------|---------------|
| `views/` | components/, composables/, stores/, services/, types/ | Other features' internals |
| `components/` | composables/, types/, utils/ | stores/, services/, views/ |
| `composables/` | services/, stores/, types/, utils/ | components/, views/ |
| `stores/` | services/, repositories/, types/ | components/, views/, composables/ |
| `services/` | repositories/, types/, utils/ | stores/, components/ |
| `repositories/` | types/ | Everything else |

---

## Adding New Code — Where Things Go

### New Feature/Page
1. Create `src/views/<feature>/<Feature>View.vue` with `<script setup lang="ts">`
2. Add lazy route: `{ path: '/x', component: () => import('@/views/x/XView.vue') }`
3. Create Pinia store if feature has state: `src/stores/<feature>.store.ts`
4. Feature-scoped components go in `src/views/<feature>/components/`

### New Component
- **Reusable UI atom** → `src/components/ui/<VName>.vue`
- **Layout shell** → `src/components/layout/<AppName>.vue`
- **Feature-scoped** → `src/views/<feature>/components/<Name>.vue`
- All components use `<script setup lang="ts">` (no Options API)

### New Composable
- File: `src/composables/use<Name>.ts` (shared) or `src/views/<feature>/composables/use<Name>.ts`
- Prefix with `use` always
- Returns reactive refs/computed/methods

### New Store
- File: `src/stores/<name>.store.ts`
- Use Pinia setup syntax (NOT options syntax):
```typescript
export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([]);
  const activeUser = computed(() => users.value.find(u => u.active));

  async function fetchUsers() { ... }

  return { users, activeUser, fetchUsers };
});
```

### New API Service
- File: `src/repositories/<domain>.repository.ts` → raw HTTP calls
- File: `src/services/<domain>.service.ts` → business logic wrapping repository

---

## Design & Architecture Principles

### SOLID in Vue Context
- **S**: One component = one visual responsibility. A `UserList` doesn't manage form state.
- **O**: Extend via slots and props. Never modify shared components for one use case.
- **L**: Components accepting same props should be swappable (e.g., `VButton` variants).
- **I**: Keep composable return types focused. `useAuth()` shouldn't return notification methods.
- **D**: Inject dependencies via `provide`/`inject` for cross-cutting concerns, not prop drilling.

### Reactivity — Vue's Superpower
```typescript
// ✅ Correct reactive primitives
const count = ref(0);
const doubled = computed(() => count.value * 2);

// ✅ Reactive objects
const user = reactive<User>({ name: '', email: '' });

// ❌ NEVER lose reactivity
const { name } = user;              // ❌ destructure loses reactivity
const { name } = toRefs(user);      // ✅ keeps reactivity

// ❌ NEVER reassign reactive()
let state = reactive({ x: 1 });
state = reactive({ x: 2 });         // ❌ old reference lost
state.x = 2;                         // ✅ mutate in place
```

### Composition Over Mixins
- **NEVER** use mixins or Options API
- Extract shared logic into composables (`useX` functions)
- Composables can compose other composables

---

## Error Handling

### Fail-Fast Validation
```typescript
// ✅ In services — validate before API calls
function updateUser(id: string, data: UpdateUserDto): Promise<User> {
  if (!id) throw new Error('User ID is required');
  return userRepository.update(id, data);
}
```

### Centralized HTTP Error Handling
- Configure Axios/fetch interceptors in `src/plugins/http.ts`
- 401 → clear auth store, redirect to `/login`
- 403 → show permission denied toast
- 422 → map validation errors to form fields
- 500 → generic error toast + error logging

### Graceful Degradation in Components
```vue
<template>
  <div v-if="isLoading">
    <VSkeleton />
  </div>
  <div v-else-if="error">
    <VErrorState :message="error.message" @retry="refetch" />
  </div>
  <div v-else-if="!data?.length">
    <VEmptyState message="No items found" />
  </div>
  <div v-else>
    <!-- actual content -->
  </div>
</template>
```

### Vue Error Boundary
- Use `onErrorCaptured()` in parent components for graceful error boundaries
- Global error handler: `app.config.errorHandler` for uncaught errors

---

## Code Quality

### Naming Conventions
| Artifact | Convention | Example |
|----------|-----------|---------|
| Component | PascalCase `.vue` | `UserProfile.vue` |
| Composable | camelCase `use` prefix `.ts` | `useUserProfile.ts` |
| Store | camelCase `use` prefix `.store.ts` | `useUserStore` in `user.store.ts` |
| Service | camelCase `.service.ts` | `user.service.ts` |
| Repository | camelCase `.repository.ts` | `user.repository.ts` |
| Type/Interface | PascalCase | `User`, `UpdateUserDto` |
| Util | camelCase `.ts` | `formatDate.ts` |
| Props/Emits | camelCase in TS, kebab-case in template | `modelValue` → `v-model` |

### Component Structure Order
```vue
<script setup lang="ts">
// 1. Type imports
// 2. Component imports
// 3. Composable usage
// 4. Props & emits
// 5. Reactive state (ref, reactive)
// 6. Computed properties
// 7. Watchers
// 8. Methods
// 9. Lifecycle hooks
</script>

<template>
  <!-- Single root element preferred -->
</template>
```

### Self-Documenting Code
- Template should read like a description of the UI
- Composable names describe what they provide: `useUserPermissions()`, not `useData()`
- Event names describe what happened: `@update:selected`, not `@change`

---

## Testing Strategy

### Test Pyramid
| Level | What | Where | Tool |
|-------|------|-------|------|
| Unit | Composables, stores, utils, services | `*.spec.ts` co-located | Vitest |
| Component | Render + interaction behavior | `*.spec.ts` co-located | Vitest + Vue Test Utils |
| E2E | Critical user flows | `e2e/` | Playwright |

### TDD Flow
1. Write failing test for store action / composable function
2. Implement minimal code to pass
3. Refactor, keep tests green

### Component Testing Rules
```typescript
// ✅ Test behavior, not implementation
it('shows error when form submitted empty', async () => {
  const wrapper = mount(LoginForm);
  await wrapper.find('form').trigger('submit');
  expect(wrapper.text()).toContain('Email is required');
});

// ❌ NEVER test internal state
it('sets isLoading ref', () => {
  // This tests Vue internals, not behavior
});
```

### Store Testing Rules
```typescript
// ✅ Test store actions and computed state
it('fetches and stores users', async () => {
  const store = useUserStore();
  await store.fetchUsers();
  expect(store.users).toHaveLength(3);
});
```

### What MUST Be Tested
- All Pinia store actions and getters
- All composables with logic (not just wrappers)
- All services/repositories (mock HTTP)
- Components with user interaction (forms, buttons, toggles)

---

## Security & Performance

### Input Validation
- Validate all form inputs before submission (use vee-validate or custom composable)
- Sanitize any `v-html` content — prefer `{{ }}` interpolation (auto-escaped)
- Never use `v-html` with user-provided content

### XSS Prevention
- Vue's template syntax auto-escapes by default — keep it that way
- Never use `v-html` with untrusted data
- CSP headers configured on deployment

### Performance Rules
- Lazy-load all routes: `() => import('@/views/...')`
- Use `defineAsyncComponent()` for heavy components
- Use `v-once` for static content that never changes
- Use `shallowRef()` / `shallowReactive()` for large objects that don't need deep reactivity
- Use `v-memo` for expensive list renders
- Images: use lazy loading (`loading="lazy"`)

### Watchers — Be Careful
```typescript
// ✅ Immediate + cleanup
watch(userId, async (id, _, onCleanup) => {
  const controller = new AbortController();
  onCleanup(() => controller.abort());
  await fetchUser(id, { signal: controller.signal });
}, { immediate: true });

// ❌ NEVER watch without considering cleanup or infinite loops
```

---

## Commands

| Action | Command |
|--------|---------|
| Dev server | `npm run dev` |
| Build | `npm run build` |
| Test | `npm test` |
| Lint | `npm run lint` |
| Type check | `npx vue-tsc --noEmit` |

---

## Prohibitions — NEVER Do These

1. **NEVER** use Options API or mixins — Composition API + `<script setup>` only
2. **NEVER** use Vuex — this project uses Pinia setup stores
3. **NEVER** mutate props — emit events or use `defineModel()`
4. **NEVER** use `this` — `<script setup>` has no `this` context
5. **NEVER** put business logic in components — extract to composables/stores
6. **NEVER** use `any` type — strict TypeScript always
7. **NEVER** register components globally unless they're design system atoms
8. **NEVER** use `v-html` with user-provided data
9. **NEVER** import from other feature directories — features are isolated
10. **NEVER** use synchronous route imports — always lazy-load
