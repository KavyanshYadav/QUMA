import { Router } from 'express';
import { Command } from '../ddd/command.base.js';
import { CommandHandler } from '../ddd/command.bus.base.js';

export abstract class Module {
  protected Router: Router;

  protected readonly commands = new Map<
    new (...args: any[]) => Command,
    CommandHandler<any, any>
  >();

  constructor() {
    this.Router = Router();
  }

  abstract init(): void;

  getCommands() {
    return this.commands;
  }

  /** Helper for child modules to register commands */
  protected registerCommand<T extends Command>(
    commandClass: new (...args: any[]) => T,
    handler: CommandHandler<T, any>
  ) {
    this.commands.set(commandClass, handler);
  }

  getRouter() {
    return this.Router;
  }
}
