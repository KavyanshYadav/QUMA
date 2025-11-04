import { ZodTypeAny } from 'zod';
// --- TYPES ---
export type UserRole = 'admin' | 'editor' | 'guest';
export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

export function defineRoute<
  const TKey extends string,
  TParams extends ZodTypeAny | undefined = undefined,
  TQuery extends ZodTypeAny | undefined = undefined,
  TBody extends ZodTypeAny | undefined = undefined,
  TResponses extends Record<number, ZodTypeAny> = Record<number, ZodTypeAny>
>(config: {
  key: TKey;
  path: string;
  method: HttpMethod;
  description?: string;
  public?: boolean;
  auth: UserRole[];
  meta: any;
  schemas: {
    params?: TParams;
    query?: TQuery;
    body?: TBody;
    responses: TResponses;
  };
}) {
  return config;
}
