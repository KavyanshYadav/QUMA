import { AsyncLocalStorage } from 'async_hooks';

export interface AppRequestContext {
  requestId: string;
  transactionConnection?: unknown;
  userId?: string;
}

const asyncLocalStorage = new AsyncLocalStorage<AppRequestContext>();

export class RequestContext {
  static runWithContext<T>(
    fn: () => T,
    context: Partial<AppRequestContext> = {}
  ): T {
    const defaultContext: AppRequestContext = {
      requestId: context.requestId || '',
      transactionConnection: context.transactionConnection,
    };
    return asyncLocalStorage.run(defaultContext, fn);
  }

  static getContext(): AppRequestContext {
    const ctx = asyncLocalStorage.getStore();
    if (!ctx) throw new Error('RequestContext not initialized!');
    return ctx;
  }

  static setUserId(userID: string): void {
    const ctx = this.getContext();
    ctx.userId = userID;
  }

  static setRequestId(id: string) {
    const ctx = this.getContext();
    ctx.requestId = id;
  }

  static getRequestId(): string {
    return this.getContext().requestId;
  }

  static setTransactionConnection(tx?: unknown) {
    const ctx = this.getContext();
    ctx.transactionConnection = tx;
  }

  static getTransactionConnection(): unknown | undefined {
    return this.getContext().transactionConnection;
  }

  static cleanTransactionConnection() {
    const ctx = this.getContext();
    ctx.transactionConnection = undefined;
  }
}
