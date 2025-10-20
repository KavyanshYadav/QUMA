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

// --- SIMPLIFIED DEFINE ROUTE ---
function defineRoute<
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
  schemas: {
    params?: TParams;
    query?: TQuery;
    body?: TBody;
    responses: TResponses;
  };
}) {
  return config;
}

// --- SIMPLIFIED APP ROUTER (Flat structure) ---
export const routes = {
  'auth:create:withOauth2': defineRoute({
    key: 'auth:create:withOauth2',
    path: '/auth/google',
    method: 'POST',
    description: 'Create a new user with OAuth2',
    auth: ['admin'],
    schemas: {
      body: OAuthCreateEmailRequestDTO,
      responses: {
        201: OAuthCreateEmailResponseDTO,
        400: ApiErrorSchema,
      },
    },
  }),
  'auth:create:withEmail': defineRoute({
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
  'auth:create:withPOP': defineRoute({
    key: 'auth:create:withPOP',
    path: '/auth/name',
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
} as const;

// --- SIMPLE TYPE EXTRACTION ---
export type RouteKey = keyof typeof routes;

type GetRoute<K extends RouteKey> = (typeof routes)[K];

// --- TYPE HELPERS (Now super simple!) ---
export type RouteBody<K extends RouteKey> = GetRoute<K>['schemas'] extends {
  body?: infer B;
}
  ? B extends ZodTypeAny
    ? z.infer<B>
    : never
  : never;

export type RouteParams<K extends RouteKey> = GetRoute<K>['schemas'] extends {
  params?: infer P;
}
  ? P extends ZodTypeAny
    ? z.infer<P>
    : never
  : never;

export type RouteQuery<K extends RouteKey> = GetRoute<K>['schemas'] extends {
  query?: infer Q;
}
  ? Q extends ZodTypeAny
    ? z.infer<Q>
    : never
  : never;

type SuccessStatusCodes = 200 | 201;
export type RouteSuccessResponse<K extends RouteKey> = {
  [Code in keyof GetRoute<K>['schemas']['responses']]: Code extends SuccessStatusCodes
    ? GetRoute<K>['schemas']['responses'][Code] extends ZodTypeAny
      ? z.infer<GetRoute<K>['schemas']['responses'][Code]>
      : never
    : never;
}[keyof GetRoute<K>['schemas']['responses']];

export type RouteResponse<
  K extends RouteKey,
  StatusCode extends keyof GetRoute<K>['schemas']['responses'] & number
> = GetRoute<K>['schemas']['responses'][StatusCode] extends ZodTypeAny
  ? z.infer<GetRoute<K>['schemas']['responses'][StatusCode]>
  : never;

export type RouteStatusCodes<K extends RouteKey> =
  keyof GetRoute<K>['schemas']['responses'];

export type RouteMethod<K extends RouteKey> = GetRoute<K>['method'];
export type RoutePath<K extends RouteKey> = GetRoute<K>['path'];

// --- RUNTIME ACCESS ---
export function getRouteConfig<K extends RouteKey>(key: K) {
  return routes[key];
}

export type RouteConfigWithKey = {
  key: (typeof routes)[keyof typeof routes]['key'];
  path: (typeof routes)[keyof typeof routes]['path'];
  method: (typeof routes)[keyof typeof routes]['method'];
  description?: string;
  public?: boolean;
  auth: UserRole[];
  schemas: {
    params?: ZodTypeAny;
    query?: ZodTypeAny;
    body?: ZodTypeAny;
    responses: Record<number, ZodTypeAny>;
  };
};
export function getRouteConfigFromKey<K extends RouteKey>(
  key: K
): RouteConfigWithKey {
  const cfg = getRouteConfig(key);
  return cfg as unknown as RouteConfigWithKey;
}

// --- GROUPING (if you need modules) ---
export const AppRouter = {
  AUTH_MODULE: {
    CREATE_WITH_OAUTH: routes['auth:create:withOauth2'],
    CREATE_WITH_EMAIL: routes['auth:create:withEmail'],
  },
} as const;

// --- KEY-BASED LOOKUP (use underlying routes to preserve literal keys) ---
type AppRoutes = (typeof routes)[keyof typeof routes];

export type RouteByKey<K extends AppRoutes['key']> = Extract<
  AppRoutes,
  { key: K }
>;

export type RouteRequestBodyByKey<K extends AppRoutes['key']> =
  RouteByKey<K>['schemas'] extends { body?: infer B }
    ? B extends ZodTypeAny
      ? z.infer<B>
      : never
    : never;

export type RouteResponseByStatusByKey<
  K extends AppRoutes['key'],
  StatusCode extends number
> = RouteByKey<K>['schemas'] extends { responses: Record<number, ZodTypeAny> }
  ? RouteByKey<K>['schemas']['responses'][StatusCode] extends ZodTypeAny
    ? z.infer<RouteByKey<K>['schemas']['responses'][StatusCode]>
    : never
  : never;

type SuccessStatusCodesFromRoute<R> = Extract<keyof R, 200 | 201>;

export type RouteSuccessResponseByKey<K extends AppRoutes['key']> =
  RouteByKey<K>['schemas'] extends {
    responses: infer R;
  }
    ? SuccessStatusCodesFromRoute<R> extends infer C
      ? C extends number
        ? R extends Record<number, ZodTypeAny>
          ? R[C] extends ZodTypeAny
            ? z.infer<R[C]>
            : never
          : never
        : never
      : never
    : never;

// --- FRONTEND ROUTER ---
function createFrontendRouter<
  T extends Record<string, ReturnType<typeof defineRoute>>
>(routes: T) {
  const result = {} as {
    [K in keyof T]: Pick<T[K], 'key' | 'path' | 'method'>;
  };

  for (const key in routes) {
    const k = key as keyof T;
    const route = routes[k];
    result[k] = {
      key: route.key,
      path: route.path,
      method: route.method,
    } as Pick<T[typeof k], 'key' | 'path' | 'method'>;
  }

  return result;
}

export const FrontendRoutes = createFrontendRouter(routes);

// --- TYPE TESTS ---
// Uncomment to verify types work correctly:

//type _TestKeys = RouteKey;
// Result: "auth:create:withOauth2" | "auth:create:withEmail"

// type _TestEmailBody = RouteRequestBodyByKey<'auth:create:withEmail'>;
// Result: z.infer<typeof AuthCreateEmailRequestDTO>

//type _TestEmailSuccess = RouteBody<'auth:create:withOauth2'>;
// Result: z.infer<typeof AuthCreateEmailResponseDTO>

// type _TestEmailError = RouteResponse<'auth:create:withEmail', 400>;
// Result: z.infer<typeof ApiErrorSchema>

// type _TestMethod = RouteMethod<'auth:create:withEmail'>;
// Result: "POST"

// type _TestPath = RoutePath<'auth:create:withEmail'>;
// Result: "/auth/email"

// --- USAGE EXAMPLE ---
// Type-safe API client
// async function apiCall<K extends RouteKey>(
//   key: K,
//   body: RouteBody<K>
// ): Promise<RouteSuccessResponse<K>> {
//   const route = getRouteConfig(key);
//
//   const response = await fetch(route.path, {
//     method: route.method,
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(body),
//   });
//
//   return response.json();
// }

// Usage with full type safety:
// const result = await apiCall('auth:create:withEmail', {
//   email: 'test@example.com',
//   password: 'password123'
// });
// result is typed as AuthCreateEmailResponseDTO

// This will error - wrong body type:
// apiCall('auth:create:withEmail', { oauthToken: 'token' });

// This will error - invalid route key:
// apiCall('invalid:key', {});
