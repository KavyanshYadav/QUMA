import { z, ZodTypeAny } from 'zod';
import {
  AuthCreateEmailRequestDTO,
  AuthCreateEmailResponseDTO,
} from './DTO/auth/auth.dto.js';

// --- TYPES ---
export type UserRole = 'admin' | 'editor' | 'guest';
export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

// --- HELPERS ---
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

export const ApiErrorSchema = z.object({
  status: z.literal('error'),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

export function createResponseSchema(responses: Record<number, ZodTypeAny>) {
  const responseSchemas = Object.values(responses);
  if (responseSchemas.length === 0) return z.any();
  if (responseSchemas.length === 1) return responseSchemas[0];
  return z.union(responseSchemas as [ZodTypeAny, ZodTypeAny, ...ZodTypeAny[]]);
}

// --- DEFINE ROUTE ---
function defineRoute<
  TParams extends ZodTypeAny,
  TQuery extends ZodTypeAny,
  TBody extends ZodTypeAny,
  TResponses extends Record<number, ZodTypeAny>
>(config: {
  key: string;
  path: string;
  method: HttpMethod;
  description?: string;
  auth: UserRole[];
  schemas: {
    params?: TParams;
    query?: TQuery;
    body?: TBody;
    responses: TResponses;
  };
}) {
  return config;
}

// --- APP ROUTER ---
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
} as const;

export function getRouteConfigFromKey(key: RouteKey) {
  const parts = key.split('.');
  let config: any = AppRouter;
  for (const part of parts) {
    if (config && typeof config === 'object' && part in config) {
      config = config[part];
    } else {
      // This should ideally never happen if the RouteKey is correct
      return null;
    }
  }
  return config;
}

// --- ROUTE TYPE EXTRACTION LOGIC ---
// Flatten nested modules into route definitions
type FlattenRoutes<T> = {
  [K in keyof T]: T[K] extends { schemas: any } ? T[K] : FlattenRoutes<T[K]>;
}[keyof T];

// Route key becomes a string path (e.g. "AUTH_MODULE.CREATE_WITH_EMAIL")
type NestedKeyOf<T> = {
  [K in keyof T & string]: T[K] extends { schemas: any }
    ? K
    : `${K}.${NestedKeyOf<T[K]>}`;
}[keyof T & string];

type RouteDefinitions = FlattenRoutes<typeof AppRouter>;
export type RouteKey = NestedKeyOf<typeof AppRouter>;

type GetRouteConfig<K extends RouteKey> =
  K extends `${infer Parent}.${infer Child}`
    ? Parent extends keyof typeof AppRouter
      ? Child extends keyof (typeof AppRouter)[Parent]
        ? (typeof AppRouter)[Parent][Child]
        : never
      : never
    : K extends keyof typeof AppRouter
    ? (typeof AppRouter)[K]
    : never;

// --- TYPE HELPERS ---
export type RouteBody<K extends RouteKey> = NonNullable<
  GetRouteConfig<K>['schemas']['body']
> extends ZodTypeAny
  ? z.infer<NonNullable<GetRouteConfig<K>['schemas']['body']>>
  : never;

export type RouteParams<K extends RouteKey> = NonNullable<
  GetRouteConfig<K>['schemas']['params']
> extends ZodTypeAny
  ? z.infer<NonNullable<GetRouteConfig<K>['schemas']['params']>>
  : never;

export type RouteQuery<K extends RouteKey> = NonNullable<
  GetRouteConfig<K>['schemas']['query']
> extends ZodTypeAny
  ? z.infer<NonNullable<GetRouteConfig<K>['schemas']['query']>>
  : never;

type SuccessStatusCodes = 200 | 201;

export type RouteSuccessResponse<K extends RouteKey> =
  GetRouteConfig<K>['schemas']['responses'] extends Record<
    infer Code,
    ZodTypeAny
  >
    ? Code extends SuccessStatusCodes
      ? z.infer<GetRouteConfig<K>['schemas']['responses'][Code]>
      : never
    : never;
