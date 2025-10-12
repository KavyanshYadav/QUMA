import { Logger } from '@quma/quma_ddd_base';
import { CommandHandler } from '@quma/quma_ddd_base';
import { UserEntity } from '../../domain/user.entity';
import { CreateUserCommand } from './create-user.command';
import { inject, injectable } from 'tsyringe';
import { UserPostGresRepo } from '../../database/user.postgres.repository';

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
