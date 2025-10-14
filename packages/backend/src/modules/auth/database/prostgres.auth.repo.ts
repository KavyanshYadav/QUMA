import { inject, injectable } from 'tsyringe';
import type { DrizzleDB } from '../../../db/index.js';
import { IdentityEntity } from '../domain/auth.identity.entity.js';
import { AuthRepoBasePort } from './auth.repository.port.js';
import { identityTable } from './schema.js';

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
