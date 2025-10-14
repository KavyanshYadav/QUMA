import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { JWTService } from '../services/jwt.service';
import { IdentityEntity } from '../domain/auth.identity.entity';

export class OAuthController {
  private jwtService: JWTService;

  constructor() {
    this.jwtService = container.resolve(JWTService);
  }

  // Handle successful OAuth authentication
  handleOAuthCallback(req: Request, res: Response) {
    const identity = req.user as IdentityEntity;

    if (!identity) {
      return res.status(401).json({
        success: false,
        error: 'Authentication failed',
      });
    }

    const identityProps = identity.getProps();

    // Generate JWT tokens
    const accessToken = this.jwtService.generateToken({
      userId: identityProps.userId!,
      email: identityProps.email,
      provider: identityProps.provider,
      providerId: identityProps.providerId,
    });

    const refreshToken = this.jwtService.generateRefreshToken({
      userId: identityProps.userId!,
      email: identityProps.email,
      provider: identityProps.provider,
      providerId: identityProps.providerId,
    });

    // Redirect to frontend with tokens
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    // const redirectUrl = `${frontendUrl}/auth/callback?access_token=${accessToken}&refresh_token=${refreshToken}`;
    const redirectUrl = `${frontendUrl}`;
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    });

    res.redirect(redirectUrl);
    return;
  }

  // Handle OAuth authentication failure
  handleOAuthFailure(req: Request, res: Response) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:4200';
    const redirectUrl = `${frontendUrl}/auth/error?error=authentication_failed`;

    res.redirect(redirectUrl);
  }

  // Get user profile from JWT token
  getProfile(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: 'No token provided',
        });
      }

      const token = authHeader.substring(7);
      const payload = this.jwtService.verifyToken(token);

      res.json({
        success: true,
        data: {
          userId: payload.userId,
          email: payload.email,
          provider: payload.provider,
          providerId: payload.providerId,
        },
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }
    return;
  }

  // Refresh access token
  refreshToken(req: Request, res: Response) {
    try {
      const { refresh_token } = req.body;

      if (!refresh_token) {
        return res.status(400).json({
          success: false,
          error: 'Refresh token required',
        });
      }

      const payload = this.jwtService.verifyToken(refresh_token);
      const newAccessToken = this.jwtService.generateToken(payload);

      res.json({
        success: true,
        data: {
          access_token: newAccessToken,
        },
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Invalid refresh token',
      });
    }
    return;
  }
}
