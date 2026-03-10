import js from '@eslint/js'
import globals from 'globals'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([ // ignore folders and files
    'node_modules/**',
    'dist/**',
    'build/**',
    'coverage/**',
    '**/.config/',
  ]),
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: {
      js,
      'simple-import-sort': simpleImportSort, 
    },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
    rules: {
      // normal rules 
      semi: ['warn', 'never'], // Disallow semicolons at the end of statements

      quotes: ['warn', 'single'], // Enforce the use of single quotes for strings

      indent: ['warn', 2], // Enforce consistent indentation of 2 spaces

      'comma-dangle': ['warn', 'always-multiline'], // Require trailing commas in multiline objects, arrays, etc.

      'max-len': ['warn', { code: 120 }], // Warn when a line exceeds 80 characters

      'object-curly-spacing': ['warn', 'always'], // Require spaces inside curly braces (e.g., { foo: "bar" })

      'arrow-parens': ['warn', 'always'], // Require parentheses around arrow function parameters

      'jsx-quotes': ['warn', 'prefer-double'], // Enforce double quotes in JSX attributes
    },
  },
  tseslint.configs.recommended,
])
