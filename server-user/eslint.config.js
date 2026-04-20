import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
      },
    },
  },
  js.configs.recommended,
  prettierConfig,
  {
    files: [
      'server-user/*.js',
      'server-user/*.cjs',
      'server-user/*.mjs',
      'server-user/configs/**/*.js',
      'server-user/configs/**/*.cjs',
      'server-user/configs/**/*.mjs',
      'server-user/middlewares/**/*.js',
      'server-user/middlewares/**/*.cjs',
      'server-user/middlewares/**/*.mjs',
      'server-user/src/**/*.js',
      'server-user/src/**/*.cjs',
      'server-user/src/**/*.mjs',
      'server-user/utils/**/*.js',
      'server-user/utils/**/*.cjs',
      'server-user/utils/**/*.mjs',
    ],
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
];
