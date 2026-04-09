import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    rules: {
      'no-unused-vars': 'off', // Turn off the base rule
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      'no-undef': 'off', // TypeScript already handles this better
      'prefer-const': 'error',
      'no-console': 'warn',
    },
  },
  {
    ignores: ['**/node_modules/', '**/dist/'],
  },
);
