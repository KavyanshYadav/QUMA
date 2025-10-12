# OAuth2 Authentication API Documentation

This collection contains all the OAuth2 authentication endpoints for the QUMA application.

## 🚀 Quick Start

1. **Set up environment variables** (see `OAUTH_SETUP.md` in backend)
2. **Start the backend server**: `pnpm nx serve @quma/backend`
3. **Test OAuth flow**: Use the Bruno endpoints below

## 📋 Available Endpoints

### OAuth2 Flow Endpoints

| Endpoint                | Method | Description                         |
| ----------------------- | ------ | ----------------------------------- |
| `/auth/google`          | GET    | Initiate Google OAuth login         |
| `/auth/github`          | GET    | Initiate GitHub OAuth login         |
| `/auth/google/callback` | GET    | Google OAuth callback (auto-called) |
| `/auth/github/callback` | GET    | GitHub OAuth callback (auto-called) |
| `/auth/failure`         | GET    | OAuth failure handler               |

### Token Management

| Endpoint        | Method | Description                              |
| --------------- | ------ | ---------------------------------------- |
| `/auth/profile` | GET    | Get user profile (requires Bearer token) |
| `/auth/refresh` | POST   | Refresh access token                     |

### User Creation (Testing)

| Endpoint      | Method | Description                |
| ------------- | ------ | -------------------------- |
| `/auth/oauth` | POST   | Manually create OAuth user |
| `/auth/email` | POST   | Create email-based user    |

## 🔄 OAuth2 Flow

### 1. User Login Flow

```
User clicks "Login with Google"
    ↓
GET /auth/google
    ↓
Redirect to Google OAuth
    ↓
User grants permission
    ↓
GET /auth/google/callback?code=...
    ↓
Backend processes & creates user
    ↓
Redirect to frontend with tokens
```

### 2. Token Usage

```
Frontend receives tokens
    ↓
Store in localStorage
    ↓
Use access_token for API calls
    ↓
When expired, use refresh_token
    ↓
POST /auth/refresh
    ↓
Get new access_token
```

## 🧪 Testing with Bruno

### Environment Variables

Set these in Bruno's environment:

```json
{
  "baseUrl": "http://localhost:3000",
  "accessToken": "your_jwt_token_here",
  "refreshToken": "your_refresh_token_here"
}
```

### Test Scenarios

#### 1. Test OAuth Login

1. Open `OAuth Google Login` or `OAuth GitHub Login`
2. Click "Send" - you should get a 302 redirect
3. Follow the redirect URL to test the OAuth flow

#### 2. Test Token Refresh

1. Use a valid refresh token in `Refresh Access Token`
2. Should return a new access token

#### 3. Test Profile Access

1. Get a valid access token from OAuth flow
2. Use it in `Get User Profile`
3. Should return user information

#### 4. Test Manual User Creation

1. Use `Create OAuth User (Manual)` to test user creation
2. Use `Create Email User` to test email-based registration

## 🔐 Security Notes

- **Never expose** OAuth client secrets in frontend code
- **Always use HTTPS** in production
- **Validate tokens** on every API call
- **Implement proper CORS** for your frontend domain
- **Use secure session cookies** in production

## 🐛 Troubleshooting

### Common Issues

1. **"Invalid OAuth configuration"**

   - Check environment variables are set correctly
   - Verify OAuth app settings in Google/GitHub

2. **"Authentication failed"**

   - Check callback URLs match exactly
   - Verify client ID and secret

3. **"Token expired"**

   - Use refresh token to get new access token
   - Check JWT secret configuration

4. **"CORS errors"**
   - Add your frontend domain to CORS settings
   - Check if backend is running on correct port

### Debug Mode

Enable debug logging by setting:

```env
NODE_ENV=development
```

## 📚 Additional Resources

- [OAuth2 Setup Guide](../backend/OAUTH_SETUP.md)
- [Google OAuth2 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth2 Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [JWT.io](https://jwt.io/) - For debugging JWT tokens
