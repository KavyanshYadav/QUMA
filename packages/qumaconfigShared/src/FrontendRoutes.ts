
export const FrontendRoutes = {
  "auth:create:withOauth2": {
    "path": "/auth/google",
    "method": "POST"
  },
  "auth:create:withGithubOauth2": {
    "path": "/auth/github",
    "method": "POST"
  },
  "auth:create:withEmail": {
    "path": "/auth/email",
    "method": "POST"
  }
} as const;

export type FrontendRouteKey = keyof typeof FrontendRoutes;
