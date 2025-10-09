import { defineConfig } from 'drizzle-kit';
export default defineConfig({
  schema: './src/modules/**/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: 'localhost',
    port: 5432,
    user: 'quma_user',
    password: 'quma_user',
    database: 'quma_test',
    ssl: false,
  },
});
