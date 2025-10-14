import { db } from '../../../db/index.js';
import { UserRepositoryPort } from './user.repository.port.js';
import { users } from './schema.js';
import { eq } from 'drizzle-orm';
import { UserEntity } from '../domain/user.entity.js';

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
    const [usr] = await db
      .insert(users)
      .values({
        email: user.email,
        display_name: 'Nma',
      })
      .returning({ id: users.id })
      .execute();

    return UserEntity.create({
      email: user.email,
      id: usr.id,
    });
  }
}
