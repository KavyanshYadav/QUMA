import { PostGresDatabase } from 'packages/quma_ddd_base/src';
import { drizzle } from 'drizzle-orm/node-postgres';

const pool = new PostGresDatabase({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'quma_user',
  password: process.env.DB_PASSWORD || 'quma_user',
  database: process.env.DB_NAME || 'quma_test',
});

export async function initDB() {
  await pool.connect();
  console.log('DATABSE:', pool.isConnected);
}

export const db = drizzle(pool.getPool());
