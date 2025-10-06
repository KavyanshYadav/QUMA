import { Logger } from '@quma/quma_ddd_base';
import { CommandHandler } from '@quma/quma_ddd_base';
import { UserEntity } from '../../domain/user.entity';
import { CreateUserCommand } from './create-user.command';

export class CreateUserService
  implements CommandHandler<CreateUserCommand, UserEntity>
{
  async execute(command: CreateUserCommand): Promise<UserEntity> {
    const user = UserEntity.create({ email: command.email });
    Logger.info('User created with email:');
    return user;
  }
}
