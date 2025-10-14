import { UserEntity } from '../domain/user.entity.js';

export abstract class UserRepositoryPort {
  abstract isEmailTaken(email: string): Promise<undefined | UserEntity>;
  abstract createUser(user: {
    email: string;
    country: string;
    postalCode: string;
    street: string;
  }): Promise<UserEntity>;
  abstract findUserByEmail(email: string): Promise<UserEntity | undefined>;
}
