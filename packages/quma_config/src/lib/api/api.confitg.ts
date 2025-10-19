import { z, ZodTypeAny } from 'zod';
import {
  AuthCreateEmailRequestDTO,
  AuthCreateEmailResponseDTO,
  OAuthCreateEmailRequestDTO,
  OAuthCreateEmailResponseDTO,
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
  public?: boolean;
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
    CREATE_WITH_OAUTH: defineRoute({
      key: 'auth:create:withOauth2',
      path: '/auth/google',
      method: 'POST',
      auth: [],
      schemas: {
        body: OAuthCreateEmailRequestDTO,
        responses: {
          201: OAuthCreateEmailResponseDTO,
          400: ApiErrorSchema,
        },
      },
    }),
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

// --- BUILD ROUTE KEY MAP ---
export type RouteConfigWithKey = ReturnType<typeof defineRoute>;
const routeKeyMap: Record<string, RouteConfigWithKey> = {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function populateRouteKeyMap(obj: any) {
  for (const k in obj) {
    if ('key' in obj[k]) {
      routeKeyMap[obj[k].key] = obj[k];
    } else {
      populateRouteKeyMap(obj[k]);
    }
  }
}
populateRouteKeyMap(AppRouter);

export function getRouteConfigFromKey(key: RouteKey) {
  return routeKeyMap[key] ?? null;
}

// --- ROUTE KEYS ---
type ExtractRouteKeys<T> = T extends { key: infer K }
  ? K
  : T extends object
  ? ExtractRouteKeys<T[keyof T]>
  : never;
export type RouteKey = ExtractRouteKeys<typeof AppRouter>;

// --- GET ROUTE CONFIG TYPE ---
type GetRouteConfig<K extends RouteKey> = K extends 'auth:create:withEmail'
  ? typeof AppRouter.AUTH_MODULE.CREATE_WITH_EMAIL
  : K extends 'auth:create:withOauth2'
  ? typeof AppRouter.AUTH_MODULE.CREATE_WITH_OAUTH
  : never;

// --- TYPE HELPERS ---
export type RouteBody<K extends RouteKey> =
  GetRouteConfig<K>['schemas'] extends {
    body: ZodTypeAny;
  }
    ? z.infer<GetRouteConfig<K>['schemas']['body']>
    : Record<string, never>;

export type RouteParams<K extends RouteKey> =
  GetRouteConfig<K>['schemas'] extends {
    params: ZodTypeAny;
  }
    ? z.infer<GetRouteConfig<K>['schemas']['params']>
    : Record<string, never>;

export type RouteQuery<K extends RouteKey> =
  GetRouteConfig<K>['schemas'] extends {
    query: ZodTypeAny;
  }
    ? z.infer<GetRouteConfig<K>['schemas']['query']>
    : Record<string, never>;

type SuccessStatusCodes = 200 | 201;
export type RouteSuccessResponse<K extends RouteKey> =
  GetRouteConfig<K>['schemas'] extends {
    responses: Record<number, ZodTypeAny>;
  }
    ? {
        [Code in keyof GetRouteConfig<K>['schemas']['responses']]: Code extends SuccessStatusCodes
          ? z.infer<GetRouteConfig<K>['schemas']['responses'][Code]>
          : never;
      }[keyof GetRouteConfig<K>['schemas']['responses']]
    : never;
