import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import AppButton from '@/components/ui/AppButton.vue';

describe('AppButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(AppButton, { slots: { default: 'Click me' } });
    expect(wrapper.text()).toBe('Click me');
  });

  it('emits click event', async () => {
    const wrapper = mount(AppButton, { slots: { default: 'Click' } });
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toHaveLength(1);
  });

  it('applies primary variant by default', () => {
    const wrapper = mount(AppButton, { slots: { default: 'Btn' } });
    expect(wrapper.classes()).toContain('bg-primary-600');
  });

  it('applies secondary variant', () => {
    const wrapper = mount(AppButton, {
      props: { variant: 'secondary' },
      slots: { default: 'Btn' },
    });
    expect(wrapper.classes()).toContain('border');
  });

  it('is disabled when disabled prop is set', () => {
    const wrapper = mount(AppButton, { props: { disabled: true }, slots: { default: 'Btn' } });
    expect(wrapper.attributes('disabled')).toBeDefined();
  });
});
