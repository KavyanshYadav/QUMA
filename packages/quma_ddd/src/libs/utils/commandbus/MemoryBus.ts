import { ServiceRegistry } from '../../application/registry.js';
import { Command } from '../../ddd/command.base.js';
import { CommandBusBase, CommandHandler } from '../../ddd/command.bus.base.js';

export class MemoryBus extends CommandBusBase {
  constructor(private registry: ServiceRegistry) {
    super();
  }

  private handlers = new Map<
    new (...args: any[]) => Command,
    CommandHandler<Command, any>
  >();

  registerHandler<T extends Command, R>(
    commandType: new (...args: any[]) => T,
    handler: CommandHandler<T, R>
  ): void {
    this.handlers.set(commandType, handler);
  }

  async execute(command: any): Promise<any> {
    console.log(command);

    const handlerConsul = await this.registry.getHandler(
      command.constructor.name
    );
    if (handlerConsul.length != 0) {
      const instance =
        handlerConsul[Math.floor(Math.random() * handlerConsul.length)];
      const url = `http://${instance.host}:${instance.port}/commands/${command.constructor.name}`;
      console.log(
        `[CommandBus] Sending ${command.constructor.name} → ${instance.instanceId}`
      );
      console.log(url);
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(command),
        headers: { 'Content-Type': 'application/json' },
      });
      return res.json();
    }

    const handler = this.handlers.get(command.constructor);

    if (!handler) {
      throw new Error(
        'Handler not found of commandName:' + command.constructor.name
      );
    } else {
      return await handler.execute(command);
    }
  }
}
