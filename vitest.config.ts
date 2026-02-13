import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['packages/engine/src/__tests__/**/*.test.ts'],
  },
});
