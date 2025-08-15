import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    globals: true,
    include: ['src/tests/**/*.test.ts?(x)'],
  },
});
