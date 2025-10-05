import { Command } from '../../ddd/command.base';
import { CommandBusBase, CommandHandler } from '../../ddd/command.bus.base';

export class MemoryBus extends CommandBusBase {
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
    const handler = this.handlers.get(command.constructor);
    console.log('📜executing command', command);
    if (!handler) {
      throw new Error(
        'Handler not found of commandName:' + command.constructor.name
      );
    } else {
      return await handler.execute(command);
    }
  }
}
