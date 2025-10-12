import { Command, CommandProps } from '@quma/quma_ddd_base';
import { ProviderName } from '../domain/auth.value.objects';

export interface OAuthProfile {
  id?: string;
  name?: string;
  email?: string;
  picture?: string;
  [key: string]: unknown;
}

export class CreateAuthWithOauthCommand extends Command {
  readonly provider: ProviderName;
  readonly providerId: string;
  readonly email?: string;
  readonly profile?: OAuthProfile;
  readonly accessToken?: string;
  readonly refreshToken?: string;
  readonly expiresAt?: Date;

  constructor(props: CommandProps<CreateAuthWithOauthCommand>) {
    super(props);
    this.provider = props.provider;
    this.providerId = props.providerId;
    this.email = props.email;
    this.profile = props.profile;
    this.accessToken = props.accessToken;
    this.refreshToken = props.refreshToken;
    this.expiresAt = props.expiresAt;
  }
}
