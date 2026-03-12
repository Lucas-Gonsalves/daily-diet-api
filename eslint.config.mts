import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import prettier from 'eslint-plugin-prettier/recommended'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores([
    // ignore folders and files
    'node_modules/**',
    'dist/**',
    'build/**',
    'coverage/**',
    '**/.config/',
  ]),
  prettier,
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

      'max-len': ['warn', { code: 100 }], // Warn when a line exceeds 80 characters

      'object-curly-spacing': ['warn', 'always'], // Require spaces inside curly braces (e.g., { foo: "bar" })

      'arrow-parens': ['warn', 'always'], // Require parentheses around arrow function parameters

      'jsx-quotes': ['warn', 'prefer-double'], // Enforce double quotes in JSX attributes

      'simple-import-sort/imports': 'warn', // turn import sort to warn

      'simple-import-sort/exports': 'warn', // turn export sort to warn

      'prettier/prettier': 'warn', // turn prettier error in warning
    },
  },
  tseslint.configs.recommended,
])
