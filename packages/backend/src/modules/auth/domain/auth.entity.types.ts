import { ProviderName } from './auth.value.objects.js';

export interface IdentityProps {
  id: string;
  provider: ProviderName;
  providerId: string;
  userId: string | null;
  email?: string;
  profile?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateIdentityProp {
  provider: ProviderName;
  providerId: string;
  userId: string | null;
  email?: string;
  profile?: any;
}
