import globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node
      },
      ecmaVersion: 12,
      sourceType: 'module',
      parser: tsParser
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      indent: ['error', 2]
    }
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      ...tseslint.configs.recommended.rules
    }
  }
];