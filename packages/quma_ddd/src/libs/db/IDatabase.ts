export interface IDatabase {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  execute<T>(query: string, params?: any[]): Promise<T[]>;
}
