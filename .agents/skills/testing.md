---
name: testing
type: knowledge
version: 1.0.0
agent: CodeActAgent
triggers:
  - test
  - vitest
  - vue test utils
  - component test
  - mock
---

# Testing — Vue 3 (Vitest + Vue Test Utils)

## Component Testing

```ts
import { mount } from '@vue/test-utils';
import UserCard from '@/components/UserCard.vue';

it('should render user name', () => {
  const wrapper = mount(UserCard, {
    props: { user: { name: 'Alice', email: 'alice@test.com' } },
  });
  expect(wrapper.text()).toContain('Alice');
});

it('should emit update on save', async () => {
  const wrapper = mount(UserCard, { props: { user: mockUser } });
  await wrapper.find('button').trigger('click');
  expect(wrapper.emitted('update')).toHaveLength(1);
});
```

## Composable Testing

```ts
import { useCounter } from '@/composables/useCounter';

it('should increment counter', () => {
  const { count, increment } = useCounter(0);
  expect(count.value).toBe(0);
  increment();
  expect(count.value).toBe(1);
});
```

No need for `mount` — composables are plain functions returning refs.

## Pinia Store Testing

```ts
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '@/stores/auth.store';

beforeEach(() => setActivePinia(createPinia()));

it('should login user', async () => {
  const store = useAuthStore();
  await store.login({ email: 'a@b.com', password: 'pass' });
  expect(store.isAuthenticated).toBe(true);
});
```

## Mocking

- Mock services: `vi.mock('@/services/user.service')`.
- Mock Vue Router: `vi.mock('vue-router')` + provide mock `useRoute/useRouter`.
- Provide Pinia in mount: `global: { plugins: [createTestingPinia()] }`.
- `createTestingPinia({ stubActions: false })` to test real actions.

## Rules

- Mount with `mount()` for full rendering, `shallowMount()` for isolation.
- Test emits with `wrapper.emitted()`.
- Test reactive props: change prop → assert re-render.
- Use `await nextTick()` after reactive state changes.
