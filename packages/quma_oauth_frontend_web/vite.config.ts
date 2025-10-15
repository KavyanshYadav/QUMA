import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconf from 'vite-tsconfig-paths';
import path from 'path';
// import { AUTH_WEB_BASE_URL } from '../quma_config/src/index.js';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/quma_oauth_frontend_web',
  base: '/web/auth',
  server: {
    port: 4200,
    host: 'localhost',
  },

  preview: {
    port: 4200,
    host: 'localhost',
  },
  plugins: [react(), tsconf({ root: '../../' })],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
      outDir: path.resolve(__dirname, '../backend/dist/public/authWeb'),
    },
  },
  test: {
    name: '@quma/quma_oauth_frontend_web',
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
  },
}));
