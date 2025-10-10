import { inject, injectable } from 'tsyringe';
import type { DrizzleDB } from '../../../db/index';
import { IdentityEntity } from '../domain/auth.identity.entity';
import { AuthRepoBasePort } from './auth.repository.port';
import { identityTable } from './schema';

@injectable()
export class AuthPostGresRepo implements AuthRepoBasePort {
  private db: DrizzleDB;

  constructor(@inject('DrizzleDBinstance') db: DrizzleDB) {
    this.db = db;
  }

  async create(account: IdentityEntity): Promise<IdentityEntity> {
    const props = account.getProps();
    await this.db.insert(identityTable).values({
      provider: props.provider,
      providerId: props.providerId,
      profile: props.profile,
      email: props.email,
      userId: props.userId,
    });
    return account;
  }
}
