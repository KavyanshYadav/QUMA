export interface OAuthConfig {
  google: {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
  };
  github: {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

export const oauthConfig: OAuthConfig = {
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL:
      process.env.GOOGLE_CALLBACK_URL ||
      'http://localhost:3000/auth/google/callback',
  },
  github: {
    clientID: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    callbackURL:
      process.env.GITHUB_CALLBACK_URL ||
      'http://localhost:3000/auth/github/callback',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
};
