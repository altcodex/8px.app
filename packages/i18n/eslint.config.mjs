import reactHooks from 'eslint-plugin-react-hooks'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import neostandard from 'neostandard'

export default [
  // Ignore patterns
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'build/**',
      '*.d.ts'
    ]
  },

  // neostandard base config (TypeScript enabled)
  ...neostandard({ ts: true }),

  // Package-specific rules
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      'react-hooks': reactHooks,
      'simple-import-sort': simpleImportSort
    },
    rules: {
      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Import sorting
      'simple-import-sort/imports': 'error',

      // TypeScript type imports
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
          fixStyle: 'separate-type-imports'
        }
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',

      // JSX quotes
      'jsx-quotes': ['error', 'prefer-single']
    }
  }
]
