import { logBase, LogLevel } from '../../../log/log.base.js';

export class ConsoleAdapter implements logBase {
  log(level: LogLevel, message: string, ...args: unknown[]) {
    const output = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}`;

    switch (level) {
      case 'error':
        console.error(output, ...args);
        break;
      case 'warn':
        console.warn(output, ...args);
        break;
      case 'debug':
        console.debug(output, ...args);
        break;
      case 'info':
        console.info(output, ...args);
        break;
      default:
        console.log(output, ...args);
    }
  }
}
