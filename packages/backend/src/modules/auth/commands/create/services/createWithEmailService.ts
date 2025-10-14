import { CommandHandler } from '@quma/ddd';
import { CreateAuthWithEmailCommand } from '../../auth.createWithEmail.js';
import { IdentityEntity } from '../../../domain/auth.identity.entity.js';
import { inject, injectable } from 'tsyringe';
import type { AuthRepoBasePort } from '../../../database/auth.repository.port.js';
import { AuthPostGresRepo } from '../../../database/prostgres.auth.repo.js';
import { UserPostGresRepo } from '../../../../user/database/user.postgres.repository.js';

@injectable()
export class CreateWithEmailService
  implements CommandHandler<CreateAuthWithEmailCommand, IdentityEntity>
{
  constructor(
    @inject(AuthPostGresRepo) private identityRepo: AuthRepoBasePort,
    @inject(UserPostGresRepo) private userRepo: UserPostGresRepo
  ) {}

  async execute(command: CreateAuthWithEmailCommand): Promise<IdentityEntity> {
    let checkuser = await this.userRepo.isEmailTaken(
      command.email || 'user@exmaple'
    );

    if (!checkuser) {
      checkuser = await this.userRepo.createUser({
        email: command.email || 'user@exmaple',
        country: 'indai',
        postalCode: '#43',
        street: '3333',
      });
    }
    const identity = IdentityEntity.create({
      provider: 'Email',
      providerId: 's111',
      email: command.email,
      userId: checkuser.getProps().id,
      profile: 'profile',
    });
    await this.identityRepo.create(identity);

    return identity;
  }
}
