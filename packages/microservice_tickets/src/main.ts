/* eslint-disable @nx/enforce-module-boundaries */
import 'reflect-metadata';
import {
  AggregateID,
  AggregateRoot,
  Command,
  CommandHandler,
  MemoryBus,
  MicroService,
  Module,
} from '@quma/ddd';
import { container } from 'tsyringe';

// ===============
// Command
// ===============
class GetUserCommand extends Command {
  readonly name: string;
  constructor(name: string, props: any) {
    super(props);
    this.name = name;
  }
}

// ===============
// Domain Entity
// ===============
class IdentityEntity extends AggregateRoot<{ name: string }> {
  protected override readonly _id!: AggregateID;
  public override validate(): void {
    // No validation for now
  }
}

class getUserCommand extends Command {
  readonly name: string;
  constructor(name: string, props: any) {
    super(props);
    this.name = name;
  }
}

// ===============
// Command Handler
// ===============
class GetUserCommandService
  implements CommandHandler<GetUserCommand, IdentityEntity>
{
  async execute(command: GetUserCommand): Promise<IdentityEntity> {
    console.log(
      `🎟️ [TicketService] Executing GetUserCommand for ${command.name}`
    );

    const bus = container.resolve(MemoryBus);
    await bus.execute(
      new getUserCommand('ad', {
        name: 'dds',
      })
    );
    // Simulate delay
    //await setTimeout(2000);

    return new IdentityEntity({
      id: '1223231',
      props: { name: 'SampleUserFromTicket' },
    });
  }
}

// ===============
// Ticket Module
// ===============
class TicketModule extends Module {
  override init(): void {
    // Register Command + Handler
    this.registerCommand(GetUserCommand, new GetUserCommandService());

    // Example route to test local execution
    this.getRouter().get('/command/getUser', async (req, res) => {
      const result = await container
        .resolve(GetUserCommandService)
        .execute(new GetUserCommand('TestUser', { name: 'SSD' }));
      res.json({ result: result ?? result });
    });
  }
}

// ===============
// Microservice Setup
// ===============
const ticketService = new MicroService('ticket-service-1');
ticketService.registerModule(new TicketModule());
ticketService.run(7012);
