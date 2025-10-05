import { CommandHandler } from '../../../../libs/ddd/command.bus.base';
import { UserEntity } from '../../domain/user.entity';
import { CreateUserCommand } from './create-user.command';

export class CreateUserService
  implements CommandHandler<CreateUserCommand, UserEntity>
{
  async execute(command: CreateUserCommand): Promise<UserEntity> {
    const user = UserEntity.create({ email: command.email });
    console.log('User created with email:');
    return user;
  }
}
