import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'dump/**',
    'next-env.d.ts',
  ]),
  {
    rules: {
      // proíbe process.env fora de src/config/**
      // exceto NODE_ENV (build-time switch padrão do node, não é config de app)
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "MemberExpression[object.object.name='process'][object.property.name='env']:not([property.name='NODE_ENV'])",
          message:
            'process.env não pode ser acessado diretamente. Use o objeto `env` de `@/config/env` (cliente) ou `@/config/env.server` (server).',
        },
      ],
      // cruzar a fronteira client/server só via server actions / server-only modules
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/lib/supabase/admin'],
              message:
                'admin.ts é server-only (service role). Importe apenas de arquivos com `import "server-only"`.',
            },
          ],
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    // exceção: env.ts é exatamente onde process.env pode ser lido
    files: ['src/config/env.ts', 'src/config/env.server.ts'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
  {
    // RLS integration: não importar @/config/env (zod throw no load no CI sem .env.test).
    files: ['src/test/rls/**/*.ts'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
  {
    files: ['scripts/**/*.mjs'],
    rules: {
      'no-console': 'off',
    },
  },
])

export default eslintConfig
