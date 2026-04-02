---
name: version-control
type: knowledge
version: 1.0.0
agent: CodeActAgent
triggers:
  - git
  - commit
  - ci
  - build
  - vite
---

# Version Control — Vue 3 + Vite

## Commits (Conventional)

`<type>(<scope>): <description>`

Examples:
- `feat(auth): add login composable with token refresh`
- `fix(store): reset cart state on logout`
- `refactor(dashboard): extract chart composable`

## CI Pipeline

1. `npm ci`
2. `npx vue-tsc --noEmit` — Vue type check (handles SFCs)
3. `npm run lint` — ESLint
4. `npm test -- --coverage` — Vitest
5. `npm run build` — Vite production build

## Build — Vite

- `npm run build` → `dist/` folder.
- `VITE_*` prefix for client-exposed env vars.
- `.env.local` for local overrides (gitignored).
- Analyze bundle: `npx vite-bundle-visualizer`.

## .gitignore

```
node_modules/
dist/
.env.local
coverage/
*.local
```

## SFC Type Checking

- Use `vue-tsc` (NOT `tsc`) for `.vue` file support.
- Requires `@vue/tsconfig` in `tsconfig.json`.
