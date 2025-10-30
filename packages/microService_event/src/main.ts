import 'reflect-metadata';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {
  AggregateID,
  AggregateRoot,
  Command,
  CommandHandler,
  MicroService,
  Module,
} from '@quma/ddd';
import { setTimeout } from 'node:timers/promises';
import { container } from 'tsyringe';

class getUserCommand extends Command {
  readonly name: string;
  constructor(name: string, props: any) {
    super(props);
    this.name = name;
  }
}

export class IdentityEntity extends AggregateRoot<{ name: string }> {
  protected override readonly _id!: AggregateID;
  public override validate(): void {
    return;
  }
}

class getUserCommandService
  implements CommandHandler<getUserCommand, IdentityEntity>
{
  async execute(command: getUserCommand): Promise<IdentityEntity> {
    return await setTimeout(
      2000,
      new IdentityEntity({
        id: '1223231',
        props: { name: 'adsa' },
      })
    );
  }
}

class EventModule extends Module {
  constructor() {
    super();
  }

  override init(): void {
    this.registerCommand(getUserCommand, new getUserCommandService());

    this.Router.get('/commands/getUserCommand', async (req, res) => {
      await container.resolve(getUserCommandService).execute(
        new getUserCommand('amed', {
          name: 'ssd',
        })
      );
      res.send('name');
    });
  }
}

const app = new MicroService('event');
app.registerModule(new EventModule());

app.run(7011);
