import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['**/dist/', '**/node_modules/', '**/.next/', '**/*.tsbuildinfo'],
  },
  ...tseslint.configs.recommendedTypeChecked,
  eslintConfigPrettier,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: [
            'eslint.config.mjs',
            'apps/web/next.config.mjs',
            'apps/web/postcss.config.mjs',
            'apps/api/prisma/seed.ts',
            'apps/api/src/digest/digest.service.spec.ts',
            'packages/engine/vitest.config.ts',
            'apps/api/prisma.config.ts',
            'packages/engine/src/__tests__/*.test.ts',
            'playwright.config.ts',
            'vitest.config.ts',
            'e2e/*.spec.ts',
          ],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.mjs', '**/*.js'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ['packages/engine/src/__tests__/**/*.test.ts'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ['apps/api/prisma/seed.ts'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ['apps/api/src/digest/digest.service.spec.ts'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    files: ['e2e/**/*.spec.ts', 'playwright.config.ts', 'vitest.config.ts'],
    ...tseslint.configs.disableTypeChecked,
  },
);
