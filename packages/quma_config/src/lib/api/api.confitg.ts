import { z, ZodTypeAny } from 'zod';
import {
  AuthCreateEmailRequestDTO,
  AuthCreateEmailResponseDTO,
} from './DTO/auth/auth.dto.js';

import type { ApiErrorResponse } from '@quma/types';
export type UserRole = 'admin' | 'editor' | 'guest';

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
export function createRequestSchema(schemas: {
  params?: ZodTypeAny;
  query?: ZodTypeAny;
  body?: ZodTypeAny;
}) {
  return z.object({
    params: schemas.params ?? z.object({}),
    query: schemas.query ?? z.object({}),
    body: schemas.body ?? z.any(),
  });
}

export function createResponseSchema(responses: Record<number, ZodTypeAny>) {
  const responseSchemas = Object.values(responses);

  if (responseSchemas.length === 0) {
    return z.any(); // No responses defined
  }
  if (responseSchemas.length === 1) {
    return responseSchemas[0]; // Only one possible response
  }

  return z.union(responseSchemas as [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]]);
}

// Runtime schema that mirrors the ApiErrorResponse type
export const ApiErrorSchema = z.object({
  status: z.literal('error'),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});
function defineRoute<
  TParams extends z.ZodTypeAny,
  TQuery extends z.ZodTypeAny,
  TBody extends z.ZodTypeAny,
  TResponses extends Record<number, z.ZodTypeAny>
>(config: {
  key: string;
  path: string;
  method: HttpMethod;
  description?: string;
  auth: UserRole[]; // An empty array signifies a public route
  schemas: {
    params?: TParams;
    query?: TQuery;
    body?: TBody;
    responses: TResponses;
  };
}) {
  return config;
}

export const AppRouter = {
  AUTH_MODULE: {
    CREATE_WITH_EMAIL: defineRoute({
      key: 'auth:create:withEmail',
      path: '/auth/email',
      method: 'POST',
      auth: [],
      schemas: {
        body: AuthCreateEmailRequestDTO,
        responses: {
          201: AuthCreateEmailResponseDTO,
          400: ApiErrorSchema,
        },
      },
    }),
  },
};
