import { FrontendRoutes, RouteKey, RouteBody } from '@quma/configShared';

type FetchOptions = RequestInit & { apiKey?: string };

// Utility type to infer request body for a route
type RequestFor<K extends RouteKey> = {
  body: RouteBody<K>;
};

// Example: generic API response type (can extend per route)
type ApiResponse<T = any> = {
  data: T;
  status: number;
};

export class ApiClient {
  constructor(private baseUrl: string, private apiKey?: string) {}

  // Generic request method
  async call<K extends RouteKey>(
    routeKey: K,
    request: RequestFor<K>,
    options?: FetchOptions
  ): Promise<ApiResponse> {
    const route = FrontendRoutes[routeKey];
    if (!route) {
      throw new Error(`Route ${routeKey} not found in FrontendRoutes`);
    }

    const url = `${this.baseUrl}${route.path}`;

    console.log(route);

    const res = await fetch(url, {
      method: route.method,
      headers: {
        'Content-Type': 'application/json',
        ...(this.apiKey ? { 'x-api-key': this.apiKey } : {}),
        ...(options?.headers || {}),
      },
      body: JSON.stringify(request.body),
      ...options,
    });

    const data = await res.json();
    return {
      data,
      status: res.status,
    };
  }
}
