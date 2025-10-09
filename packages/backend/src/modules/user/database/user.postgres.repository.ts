import { db } from '../../../db/index';
import { UserRepositoryPort } from './user.repository.port';
import { users } from './schema';

export class UserPostGresRepo extends UserRepositoryPort {
  override async isEmailTaken(email: string): Promise<boolean> {
    return await new Promise(() => {
      return;
    });
  }
  override async createUser(user: {
    email: string;
    country: string;
    postalCode: string;
    street: string;
  }): Promise<void> {
    await db
      .insert(users)
      .values({
        email: user.email,
        display_name: 'Nma',
      })
      .execute();
  }
}
