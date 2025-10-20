
export const FrontendRoutes = {
  "auth:create:withOauth2": {
    "path": "/auth/google",
    "method": "POST"
  },
  "auth:create:withEmail": {
    "path": "/auth/email",
    "method": "POST"
  },
  "auth:create:withPOP": {
    "path": "/auth/name",
    "method": "POST"
  }
} as const;

export type FrontendRouteKey = keyof typeof FrontendRoutes;
