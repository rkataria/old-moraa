/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')

const rulesDirPlugin = require('eslint-plugin-rulesdir')

const prettierConfig = require('./.prettierrc.json')

rulesDirPlugin.RULES_DIR = 'eslint/rules'

const codeDir = fs
  .readdirSync('./src', {
    withFileTypes: true,
  })
  .filter((folderOrFile) => folderOrFile.isDirectory())
  .map((folder) => folder.name)

module.exports = {
  parser: '@typescript-eslint/parser',
  settings: {
    'import/internal-regex': `^(${codeDir.join('|')})+(.)*`,
  },
  extends: [
    'eslint:recommended',
    'prettier',
    'plugin:prettier/recommended',
    'airbnb',
    'airbnb/hooks',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: [
    '@typescript-eslint',
    'unused-imports',
    'prettier',
    'react',
    'import',
    'rulesdir',
    'react-refresh',
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true,
    },
  },
  overrides: [
    {
      files: ['./*/**.(js|jsx|ts|tsx)'],
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
    {
      files: ['./**/*'],
      rules: {
        'import/no-default-export': 'error',
      },
    },
    // App router
    {
      files: ['app/**/{page,layout,not-found}.{tsx,tsx}'],
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
  rules: {
    'prettier/prettier': ['error', prettierConfig],

    'lines-between-class-members': 'off',
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'implicit-arrow-linebreak': 'off',
    'newline-before-return': 'error',
    'object-curly-newline': 'off',
    'no-use-before-define': 'off',
    'no-shadow': 'off',
    'no-unused-vars': 'off',
    indent: 'off',
    semi: 'off',
    'operator-linebreak': 'off',
    'function-paren-newline': 'off',
    'max-len': 'off',
    'no-param-reassign': 'off',
    'comma-dangle': 'off',
    'no-underscore-dangle': 'off',
    'no-nested-ternary': 'off',
    'no-confusing-arrow': 'off',

    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
          'type',
          'object',
        ],
        pathGroups: [
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    // This rule is configured in overrides.
    // 'import/no-default-export': 'error',
    'import/no-unresolved': 0,
    'import/prefer-default-export': 'off',
    'import/newline-after-import': ['error', { count: 1 }],
    'import/extensions': 'off',
    'unused-imports/no-unused-imports': 'error',

    'react/react-in-jsx-scope': 'off',
    'react/jsx-closing-bracket-location': 'off',
    'react/require-default-props': 'off',
    'react/style-prop-object': 'off',
    'react/jsx-curly-newline': 'off',
    'react/prop-types': 0,
    'react/jsx-wrap-multilines': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.ts', '.tsx'],
      },
    ],

    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-explicit-any': ['error'],

    'rulesdir/invalid-query-variable-name': 'error',
    'linebreak-style': 'off',
    'react-refresh/only-export-components': 'warn',
  },
  ignorePatterns: ['babel.config.js', 'build'],
}
