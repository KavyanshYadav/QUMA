import { IdentityEntity } from '../domain/auth.identity.entity.js';

export interface AuthRepoBasePort {
  //   findByProviderId(
  //     provider: ProviderName,
  //     providerId: string
  //   ): Promise<IdentityEntity | null>;
  //   findByEmail(email: string): Promise<IdentityEntity[]>;
  //   findByUserId(userId: string): Promise<IdentityEntity[]>;
  create(account: Partial<IdentityEntity>): Promise<IdentityEntity>;
  //   update(account: IdentityEntity): Promise<IdentityEntity>;
  //   linkToUser(accountId: string, userId: string): Promise<void>;
  //   delete(accountId: string): Promise<void>;
}
