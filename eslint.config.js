import { defineConfig, globalIgnores } from 'eslint/config';
// import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import eslintParser from '@typescript-eslint/parser';
// import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default defineConfig(
  globalIgnores(['src/routeTree.gen.ts'], 'Ignore Generated Route File'),
	{
		files: ['**/*.ts', '**/*.tsx', '**/*.js'],
    languageOptions: {
      parser: eslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        tsconfigRootDir: import.meta.dirname,
        projectService: {
          allowDefaultProject: ['*.js']
        }
      }
    },
		plugins: {
      '@typescript-eslint': tseslint
		},
    extends: [
      reactRefresh.configs.vite
    ],
    // extends: [
    //   js.configs.recommended,
    //   tseslint.configs.recommended,
    //   reactHooks.configs['recommended-latest'],
    //   reactRefresh.configs.vite,
    // ],
		rules: {
      '@typescript-eslint/no-unnecessary-condition': 'error',
      quotes: [2, 'single', { avoidEscape: true, allowTemplateLiterals: true }]
		}
	}
);
