import { IDatabase } from './IDatabase.js';
export abstract class BaseDatabase implements IDatabase {
  protected connected = false;

  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract execute<T>(query: string, params?: any[]): Promise<T[]>;

  isConnected() {
    return this.connected;
  }
}
