import winston from 'winston';
import { logBase, LogLevel } from '../../../log/log.base.js';

export class WinstonAdapter implements logBase {
  private logger: winston.Logger;
  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [new winston.transports.Console()],
    });
  }
  log(level: LogLevel, message: string, ...args: unknown[]) {
    this.logger.log(level, message, ...args);
  }
}
