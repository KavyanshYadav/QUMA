import { PostGresDatabase } from '@quma/quma_ddd_base';
import { drizzle } from 'drizzle-orm/node-postgres';
import { users } from '../modules/user/database/schema';

const pool = new PostGresDatabase({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'quma_user',
  password: process.env.DB_PASSWORD || 'quma_user',
  database: process.env.DB_NAME || 'quma_test',
});

export async function initDB() {
  await db.execute('CREATE TABLE IF NOT EXISTS users (...)');

  await pool.connect();
  console.log('DATABSE:', pool.isConnected());
  db.insert(users).values({
    email: 'asdas',
    display_name: 'RRRRM',
  });
}

export const db = drizzle(pool.getPool());
