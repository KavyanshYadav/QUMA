import { AsyncLocalStorage } from 'async_hooks';
import { tracer } from '../../log/tracer.js';
import { Span, SpanStatusCode, trace } from '@opentelemetry/api';
import { context as openContext } from '@opentelemetry/api';

export interface AppRequestContext {
  requestId: string;
  transactionConnection?: unknown;
  userId?: string;
  traceId?: string;
  span?: Span;
}

const asyncLocalStorage = new AsyncLocalStorage<AppRequestContext>();

export class RequestContext {
  static async runWithContext<T>(
    fn: () => Promise<T> | T,
    context: Partial<AppRequestContext> = {}
  ): Promise<T> {
    const span = tracer.startSpan(context.requestId || 'request');

    const defaultContext: AppRequestContext = {
      requestId: context.requestId || '',
      transactionConnection: context.transactionConnection,
      userId: context.userId,
      traceId: span.spanContext().traceId,
      span: span,
    };
    const otelCtx = trace.setSpan(openContext.active(), span);
    return asyncLocalStorage.run(defaultContext, () =>
      openContext.with(otelCtx, async () => {
        try {
          const result = await fn();
          span.end();
          return result;
        } catch (err: unknown) {
          if (err instanceof Error) {
            span.recordException(err);
          } else {
            span.recordException(String(err));
          }
          span.setStatus({ code: SpanStatusCode.ERROR });
          span.end();
          throw err;
        }
      })
    );
  }

  static getContext(): AppRequestContext {
    const ctx = asyncLocalStorage.getStore();
    if (!ctx) throw new Error('RequestContext not initialized!');
    return ctx;
  }
  static getSpan(): Span | undefined {
    return this.getContext().span;
  }

  static getTraceId(): string | undefined {
    return this.getContext().traceId;
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
