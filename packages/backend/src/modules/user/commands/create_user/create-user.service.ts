import { Logger } from '@quma/ddd';
import { CommandHandler } from '@quma/ddd';
import { UserEntity } from '../../domain/user.entity.js';
import { CreateUserCommand } from './create-user.command.js';
import { inject, injectable } from 'tsyringe';
import { UserPostGresRepo } from '../../database/user.postgres.repository.js';

@injectable()
export class CreateUserService
  implements CommandHandler<CreateUserCommand, UserEntity>
{
  constructor(@inject(UserPostGresRepo) private userpgRepo: UserPostGresRepo) {}
  async execute(command: CreateUserCommand): Promise<UserEntity> {
    const user = UserEntity.create({ email: command.email });

    await this.userpgRepo.createUser({
      email: user.getProps().email,
      country: user.id,
      postalCode: user.id,
      street: user.id,
    });

    Logger.info('User created with email:');
    return user;
  }
}
