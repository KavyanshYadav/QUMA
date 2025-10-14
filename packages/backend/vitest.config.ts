import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/backend',
  plugins: [],
  test: {
    name: '@quma/backend',
    watch: false,
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts', 'src/**/*.test.ts', 'src/**/*.d.ts'],
    },
    setupFiles: ['./src/test-setup.ts'],
  },
  resolve: {
    alias: {
      '@quma/backend': resolve(__dirname, 'src'),
      '@quma/ddd': resolve(__dirname, '../quma_ddd_base/src'),
      '@quma/types': resolve(__dirname, '../quma_types/src'),
    },
  },
}));
