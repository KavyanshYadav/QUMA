import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { oauthConfig } from '../config/oauth.config.js';
import { injectable } from 'tsyringe';

export interface JWTPayload {
  userId: string;
  email?: string;
  provider: string;
  providerId: string;
}

@injectable()
export class JWTService {
  private readonly secret: Secret;
  private readonly accessOptions: SignOptions;
  private readonly refreshOptions: SignOptions;
  private readonly devToken: SignOptions;

  constructor() {
    this.secret = oauthConfig.jwt.secret as Secret;

    this.accessOptions = {
      expiresIn: '15m' as SignOptions['expiresIn'],
    };

    this.refreshOptions = {
      expiresIn: '30d' as SignOptions['expiresIn'],
    };
    this.devToken = {
      expiresIn: '100d' as SignOptions['expiresIn'],
    };
  }

  generateDevToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.secret, this.devToken);
  }

  generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.secret, this.accessOptions);
  }

  verifyToken(token: string): JWTPayload {
    return jwt.verify(token, this.secret) as JWTPayload;
  }

  generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.secret, this.refreshOptions);
  }
}
