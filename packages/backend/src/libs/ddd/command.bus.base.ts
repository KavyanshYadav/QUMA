import { Command } from './command.base';

export interface CommandHandler<T extends Command, R> {
  execute(command: T): Promise<R>;
}

export abstract class CommandBusBase {
  abstract registerHandler<T extends Command, R>(
    commandType: new (...args: any[]) => T,
    handler: CommandHandler<T, R>
  ): void;
  abstract  execute(command: any): Promise<any>;
}
