import { Strategy as GitHubStrategy } from 'passport-github2';
import { oauthConfig } from '../config/oauth.config.js';
import { container } from 'tsyringe';
import { CreateWithOauthService } from '../commands/create/services/createWithOauthService.js';
import { CreateAuthWithOauthCommand } from '../commands/auth.createWithOauth.js';
import { IdentityEntity } from '../domain/auth.identity.entity.js';

type PassportCallback = (
  error: Error | null,
  user?: IdentityEntity | false
) => void;

export const githubStrategy = new GitHubStrategy(
  {
    clientID: oauthConfig.github.clientID,
    clientSecret: oauthConfig.github.clientSecret,
    callbackURL: oauthConfig.github.callbackURL,
  },
  async (
    accessToken: string,
    refreshToken: string,
    profile: unknown,
    done: PassportCallback
  ) => {
    try {
      const oauthService = container.resolve(CreateWithOauthService);

      const profileData = profile as Record<string, any>;
      const command = new CreateAuthWithOauthCommand({
        provider: 'github',
        providerId: profileData.id,
        email: profileData.emails?.[0]?.value,
        profile: {
          id: profileData.id,
          name: profileData.displayName || profileData.username,
          email: profileData.emails?.[0]?.value,
          picture: profileData.photos?.[0]?.value,
        },
        accessToken,
        refreshToken,
      });

      const identity = await oauthService.execute(command);
      return done(null, identity);
    } catch (error) {
      return done(
        error instanceof Error ? error : new Error('Unknown error'),
        false
      );
    }
  }
);
