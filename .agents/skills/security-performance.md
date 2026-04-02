---
name: security-performance
type: knowledge
version: 1.0.0
agent: CodeActAgent
triggers:
  - security
  - performance
  - lazy load
  - virtual scroll
  - xss
  - optimize
---

# Security & Performance — Vue 3

## Performance

### Computed vs Watch

- `computed()` — derived state, cached until deps change. **Prefer this.**
- `watch()` — side effects (API calls, logging). Avoid for derived state.
- `watchEffect()` — auto-tracks deps. Use for complex reactive side effects.

### Component Optimization

- `v-once` — render once, skip future updates (static content).
- `v-memo="[item.id]"` — memoize `v-for` items when deps haven't changed.
- `shallowRef()` — for large objects where you only replace, not mutate deeply.
- `defineAsyncComponent(() => import(...))` — lazy load heavy components.

### List Rendering

- Always `:key` with stable unique ID (not index).
- Virtual scrolling for 100+ items: `vue-virtual-scroller`.
- `v-show` vs `v-if`: use `v-show` for frequent toggles, `v-if` for rare.

### Route-Level Code Splitting

```ts
// Automatic with dynamic imports in router
{ path: '/admin', component: () => import('@/views/Admin.vue') }
```

## Security

### XSS Prevention

- Vue auto-escapes template interpolation `{{ }}` — safe by default.
- **NEVER use `v-html`** with user input — raw HTML injection risk.
- Sanitize if `v-html` is required: use `DOMPurify`.

### Environment Variables

- `VITE_*` vars are embedded in client bundle — **NO secrets**.
- Server-side secrets: keep in backend, never in Vue app.

### Dependencies

- `npm audit` regularly.
- Pin major versions in `package.json`.
- Vet Vue plugins before adding — check maintenance, downloads.

### Router Guards

```ts
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }
});
```
