import winston from 'winston';
import { logBase, LogLevel } from '../../../log/log.base.js';
import { RequestContext } from '../../../application/index.js';

function getCallerInfo(): { file?: string; line?: string; func?: string } {
  const err = new Error();
  const stack = err.stack?.split('\n')[3];
  const match = stack?.match(/\s*at\s+(?:(.*?)\s+\()?(.+?):(\d+):\d+\)?/);
  if (!match) return {};
  const [, func, file, line] = match;
  return { file: file?.split('/').pop(), line, func };
}

export class WinstonAdapter implements logBase {
  private logger: winston.Logger;

  constructor() {
    const isDev = process.env.NODE_ENV !== 'production';

    const devFormat = winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: 'HH:mm:ss' }),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        const { file, line, func }: any = meta.__caller || {};
        const ctxPart = meta.requestId ? `[${meta.requestId}] ` : '';
        const callerPart = file ? `[${file}:${line} ${func ?? ''}] ` : '';
        const metaStr = JSON.stringify({ ...meta }, null, 2);
        return `[${timestamp}] ${level}: ${ctxPart}${callerPart}${message} ${metaStr}`;
      })
    );

    const prodFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    );

    this.logger = winston.createLogger({
      level: isDev ? 'debug' : 'info',
      format: isDev ? devFormat : prodFormat,
      transports: [new winston.transports.Console()],
    });
  }

  log(
    level: LogLevel,
    message: string | Record<string, unknown>,
    meta: Record<string, unknown> = {}
  ) {
    const ctx = RequestContext.getContext();
    const caller = getCallerInfo();

    const contextMeta = {
      requestId: ctx?.requestId,
      userId: ctx?.userId,
      // correlationId: ctx?.correlationId,
      __caller: caller,
      ...meta,
    };

    if (typeof message === 'string') {
      this.logger.log(level, message, contextMeta);
    } else {
      this.logger.log(level, { ...contextMeta, ...message });
    }
  }
}
