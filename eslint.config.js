// @ts-check
import tseslint from 'typescript-eslint';
import pluginAstro from 'eslint-plugin-astro';

export default tseslint.config(
  { ignores: ['**/dist/**', '**/.astro/**', '**/src/assets/generated/**', '**/node_modules/**'] },
  ...tseslint.configs.recommended,
  ...pluginAstro.configs.recommended,
  {
    files: ['**/*.astro'],
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      // Inline <script> blocks in Astro files use var extensively; downgrade to warn
      // to avoid blocking lint without rewriting browser-side script logic.
      'no-var': 'warn',
    },
  },
);
