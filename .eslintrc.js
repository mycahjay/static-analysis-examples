'use strict';

const SHARED_RULES = {
  'prefer-const': ['error', { destructuring: 'all' }],
  'dot-location': ['error', 'property'],
  'dot-notation': 'error',
  'object-shorthand': ['error', 'always'],
  'prefer-template': 'error',
  'one-var': [2, 'never'],
  'padded-blocks': 'off',

  // Block style
  'brace-style': ['error', 'stroustrup', { allowSingleLine: true }],
  'linebreak-style': [2, 'unix'],

  // Delimiters
  semi: [2, 'always'],
  radix: ['error'],
  curly: ['error'],
  quotes: ['error', 'single', { avoidEscape: true }],
  'arrow-parens': ['error', 'always'],
  // 'comma-dangle': ['error', 'always-multiline'],

  // Disallowed globals
  'no-console': ['error', { allow: ['warn', 'error'] }],
  'no-prototype-builtins': 'off',

  // Spacing rules
  // indent: ['error', 'tab', { SwitchCase: 1 }],
  'block-spacing': ['error', 'always'],
  'comma-spacing': ['error', {
    before: false,
    after: true
  }],
  'keyword-spacing': ['error'],
  'key-spacing': [
    'error',
    {
      beforeColon: false,
      afterColon: true
    }
  ],
  'generator-star-spacing': ['error', { before: true, after: true }],
  'object-curly-spacing': ['error', 'always'],
  'template-curly-spacing': 'error',
  'no-multiple-empty-lines': 'off',
  'no-spaced-func': [2],
  'no-trailing-spaces': 'error',
  'space-before-blocks': ['error', 'always'],
  'space-before-function-paren': [
    'error',
    {
      anonymous: 'never',
      named: 'never',
      asyncArrow: 'always'
    }
  ],
  'space-in-parens': ['error', 'never'],
  'space-infix-ops': 'error',
  'space-unary-ops': [
    'error',
    {
      words: false,
      nonwords: false
    }
  ]
};

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018
  },
  plugins: [
    '@typescript-eslint'
  ],
  env: {
    mocha: true,
    es6: true,
    node: true
  },
  globals: {
    fakeTaskKue: true
  },
  extends: [
    'eslint:recommended'
  ],
  rules: {
    ...SHARED_RULES,
    // strict: ['error'],
    'no-unused-vars': [2, {
      args: 'after-used',
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_$'
    }]
  },
  overrides: [
    {
      files: ['*.ts'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended'
      ],
      rules: {
        'prefer-rest-params': 'off',
        'no-case-declarations': 'off',
        'no-prototype-builtins': 'off',

        // Spacing rules
        '@typescript-eslint/type-annotation-spacing': 'error',

        'space-infix-ops': 'off',
        '@typescript-eslint/space-infix-ops': 'error',

        // Correctness rules
        '@typescript-eslint/ban-types': ['error', {
          extendDefaults: false,
          types: {
            String: { message: 'Use string instead', fixWith: 'string' },
            Boolean: { message: 'Use boolean instead', fixWith: 'boolean' },
            Number: { message: 'Use number instead', fixWith: 'number' },
            Symbol: { message: 'Use symbol instead', fixWith: 'symbol' },
            Object: { message: 'Use object instead', fixWith: 'object' },
            Function: { message: 'Use `(...args: any[]) => unknown` instead', fixWith: '(...args: any[]) => unknown' }
          }
        }],

        // Ignore TSLint rules for easier interop
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-this-alias': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',

        // Disable because these rules don't work w/ typescript
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off'
      }
    }
  ]
};
