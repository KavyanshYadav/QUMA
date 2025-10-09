import { BaseDatabase } from './Baseclass.js';
import { Pool } from 'pg';

export interface PostGresDataBaseParams {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export class PostGresDatabase extends BaseDatabase {
  private pool: Pool;

  constructor(config: PostGresDataBaseParams) {
    super();
    this.pool = new Pool(config);
  }

  override async connect(): Promise<void> {
    await this.pool.query('SELECT 1');
    this.connected = true;
  }
  override async disconnect(): Promise<void> {
    await this.pool.end();
    this.connected = false;
  }
  async execute<T>(query: string, params?: any[]): Promise<T[]> {
    const result = await this.pool.query(query, params);
    return result.rows as T[];
  }

  getPool(): Pool {
    return this.pool;
  }
}
