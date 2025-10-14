import { Router } from 'express';
import { MemoryBus } from '@quma/quma_ddd_base';
import { container } from 'tsyringe';
import passport from 'passport';
import { AuthPostGresRepo } from './database/prostgres.auth.repo';
import { CreateAuthWithEmailCommand } from './commands/auth.createWithEmail';
import { CreateAuthWithOauthCommand } from './commands/auth.createWithOauth';
import { CreateAuthHttpController } from './commands/create/auth.create.http.controller';
import { CreateWithEmailService } from './commands/create/services/createWithEmailService';
import { CreateWithOauthService } from './commands/create/services/createWithOauthService';
import { JWTService } from './services/jwt.service';
import { OAuthController } from './controllers/oauth.controller';
import { googleStrategy } from './strategies/google.strategy';
import { githubStrategy } from './strategies/github.strategy';
export class AuthMoudle {
  public router: Router;
  private oauthController: OAuthController;

  constructor() {
    this.router = Router();
    this.oauthController = new OAuthController();

    // Register services
    container.register(AuthPostGresRepo, { useClass: AuthPostGresRepo });
    container.register(CreateWithEmailService, {
      useClass: CreateWithEmailService,
    });
    container.register(CreateWithOauthService, {
      useClass: CreateWithOauthService,
    });
    container.register(JWTService, {
      useClass: JWTService,
    });
    container.register(CreateAuthHttpController, {
      useClass: CreateAuthHttpController,
    });

    // Configure Passport strategies
    this.configurePassport();

    const memoryBus = container.resolve(MemoryBus);
    memoryBus.registerHandler(
      CreateAuthWithEmailCommand,
      container.resolve(CreateWithEmailService)
    );
    memoryBus.registerHandler(
      CreateAuthWithOauthCommand,
      container.resolve(CreateWithOauthService)
    );

    this.router.post('/auth/email', async (req, res) => {
      const controller = container.resolve(CreateAuthHttpController);
      controller.handle(req, res);
    });

    this.router.post('/auth/oauth', async (req, res) => {
      try {
        const memoryBus = container.resolve(MemoryBus);
        const command = new CreateAuthWithOauthCommand({
          provider: req.body.provider,
          providerId: req.body.providerId,
          email: req.body.email,
          profile: req.body.profile,
          accessToken: req.body.accessToken,
          refreshToken: req.body.refreshToken,
          expiresAt: req.body.expiresAt
            ? new Date(req.body.expiresAt)
            : undefined,
        });

        const result = await memoryBus.execute(command);
        res.status(201).json({
          success: true,
          data: result.getProps(),
        });
      } catch (error) {
        res.status(400).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });

    // OAuth2 Routes
    this.setupOAuthRoutes();
  }

  private configurePassport() {
    // Configure Passport strategies
    passport.use('google', googleStrategy);
    passport.use('github', githubStrategy);

    // Serialize user for session
    passport.serializeUser((user: unknown, done) => {
      done(null, user);
    });

    // Deserialize user from session
    passport.deserializeUser((user: unknown, done) => {
      done(null, user as Record<string, any>);
    });
  }

  private setupOAuthRoutes() {
    // Google OAuth routes
    this.router.get(
      '/auth/google',
      passport.authenticate('google', {
        scope: ['profile', 'email'],
      })
    );

    this.router.get(
      '/auth/google/callback',
      passport.authenticate('google', { failureRedirect: '/auth/failure' }),
      (req, res) => this.oauthController.handleOAuthCallback(req, res)
    );

    // GitHub OAuth routes
    this.router.get(
      '/auth/github',
      passport.authenticate('github', {
        scope: ['user:email'],
      })
    );

    this.router.get(
      '/auth/github/callback',
      passport.authenticate('github', { failureRedirect: '/auth/failure' }),
      (req, res) => this.oauthController.handleOAuthCallback(req, res)
    );

    // OAuth failure route
    this.router.get('/auth/failure', (req, res) =>
      this.oauthController.handleOAuthFailure(req, res)
    );

    // Profile and token management routes
    this.router.get('/auth/profile', (req, res) =>
      this.oauthController.getProfile(req, res)
    );

    this.router.post('/auth/refresh', (req, res) =>
      this.oauthController.refreshToken(req, res)
    );
  }
}
