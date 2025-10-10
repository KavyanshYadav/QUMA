import { Command, CommandProps } from '@quma/quma_ddd_base';

export class CreateAuthWithEmailCommand extends Command {
  //   readonly provider: ProviderName;
  //   readonly providerId: string;
  readonly email?: string;
  readonly profile?: any;

  constructor(props: CommandProps<CreateAuthWithEmailCommand>) {
    super(props);
    this.email = props.email;
    this.profile = props.profile;
  }
}
