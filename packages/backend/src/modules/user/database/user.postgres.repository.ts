import { db } from '../../../db/index';
import { UserRepositoryPort } from './user.repository.port';
import { users } from './schema';
import { eq } from 'drizzle-orm';
import { UserEntity } from '../domain/user.entity';

export class UserPostGresRepo extends UserRepositoryPort {
  override async isEmailTaken(email: string): Promise<UserEntity | undefined> {
    const user = await db.select().from(users).where(eq(users.email, email));
    if (user.length === 0) return undefined;
    return UserEntity.create({
      email: user[0].email,
      id: user[0].id,
    });
  }

  override async findUserByEmail(
    email: string
  ): Promise<UserEntity | undefined> {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    if (user.length === 0) return;

    return UserEntity.create({
      email: user[0].email,
      id: user[0].id,
    });
  }

  override async createUser(user: {
    email: string;
    country: string;
    postalCode: string;
    street: string;
  }): Promise<UserEntity> {
    await db
      .insert(users)
      .values({
        email: user.email,
        display_name: 'Nma',
      })
      .execute();

    const userd = await this.findUserByEmail(user.email);

    return UserEntity.create({
      email: user.email,
      id: userd?.id,
    });
  }
}
