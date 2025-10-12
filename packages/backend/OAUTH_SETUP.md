# OAuth2 Setup Guide

This guide will help you set up OAuth2 authentication with Google and GitHub providers.

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# OAuth2 Configuration
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Session Configuration
SESSION_SECRET=your_session_secret_here

# Frontend URL
FRONTEND_URL=http://localhost:4200

# Server Configuration
HOST=localhost
PORT=3000
NODE_ENV=development
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create OAuth 2.0 Client IDs
5. Set authorized redirect URIs to: `http://localhost:3000/auth/google/callback`
6. Copy the Client ID and Client Secret to your `.env` file

## GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - Application name: Your app name
   - Homepage URL: `http://localhost:4200`
   - Authorization callback URL: `http://localhost:3000/auth/github/callback`
4. Copy the Client ID and Client Secret to your `.env` file

## API Endpoints

### OAuth Login

- `GET /auth/google` - Initiate Google OAuth login
- `GET /auth/github` - Initiate GitHub OAuth login

### OAuth Callbacks

- `GET /auth/google/callback` - Google OAuth callback
- `GET /auth/github/callback` - GitHub OAuth callback
- `GET /auth/failure` - OAuth failure redirect

### Token Management

- `GET /auth/profile` - Get user profile (requires Bearer token)
- `POST /auth/refresh` - Refresh access token

## Frontend Integration

The frontend includes OAuth buttons that redirect users to the OAuth providers. After successful authentication, users are redirected back to the frontend with access and refresh tokens.

### Usage Example

```typescript
// Redirect to OAuth provider
window.location.href = '/auth/google';

// Handle callback (automatic redirect after OAuth)
// Tokens are stored in localStorage and user is redirected to dashboard
```

## Security Notes

1. Keep your OAuth client secrets secure
2. Use HTTPS in production
3. Set secure session cookies in production
4. Use strong JWT secrets
5. Implement proper token refresh logic

## Testing

1. Start the backend server: `pnpm run serve`
2. Start the frontend: `pnpm run serve` (in frontend package)
3. Navigate to the login page
4. Click on "Continue with Google" or "Continue with GitHub"
5. Complete the OAuth flow
6. You should be redirected back with authentication tokens
