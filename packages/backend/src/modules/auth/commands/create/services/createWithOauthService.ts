import { CommandHandler } from '@quma/ddd';
import { CreateAuthWithOauthCommand } from '../../auth.createWithOauth.js';
import { IdentityEntity } from '../../../domain/auth.identity.entity.js';
import { inject, injectable } from 'tsyringe';
import type { AuthRepoBasePort } from '../../../database/auth.repository.port.js';
import { AuthPostGresRepo } from '../../../database/prostgres.auth.repo.js';
import { UserPostGresRepo } from '../../../../user/database/user.postgres.repository.js';

@injectable()
export class CreateWithOauthService
  implements CommandHandler<CreateAuthWithOauthCommand, IdentityEntity>
{
  constructor(
    @inject(AuthPostGresRepo) private identityRepo: AuthRepoBasePort,
    @inject(UserPostGresRepo) private userRepo: UserPostGresRepo
  ) {}

  async execute(command: CreateAuthWithOauthCommand): Promise<IdentityEntity> {
    let user = null;

    // If email is provided, check if user exists with this email
    if (command.email) {
      user = await this.userRepo.findUserByEmail(command.email);
    }

    // If no user exists, create a new one
    if (!user) {
      user = await this.userRepo.createUser({
        email:
          command.email || `${command.providerId}@${command.provider}.oauth`,
        country: 'unknown',
        postalCode: 'unknown',
        street: 'unknown',
      });
    }

    // Create identity entity
    const identity = IdentityEntity.create({
      provider: command.provider,
      providerId: command.providerId,
      email: command.email,
      userId: user.getProps().id,
      profile: command.profile,
    });

    // Save identity to repository
    await this.identityRepo.create(identity);

    return identity;
  }
}
