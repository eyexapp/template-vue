import { globalIgnores } from 'eslint/config';
import pluginVue from 'eslint-plugin-vue';
import vueTsEslintConfig from '@vue/eslint-config-typescript';

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },

  globalIgnores(['dist/**', 'coverage/**', 'auto-imports.d.ts', 'components.d.ts']),

  ...pluginVue.configs['flat/recommended'],
  ...vueTsEslintConfig(),

  {
    name: 'app/custom-rules',
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'warn',
      'vue/multi-word-component-names': 'warn',
      'vue/define-macros-order': ['warn', { order: ['defineProps', 'defineEmits'] }],
      'vue/block-order': ['warn', { order: ['script', 'template', 'style'] }],
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      eqeqeq: 'warn',
      curly: 'warn',
    },
  },
];
