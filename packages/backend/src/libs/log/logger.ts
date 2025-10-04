import { RequestContext } from '../application/context/AppRequestContex';
import {
  REQUEST_CONTEXT_NOT_INITIALIZED,
  RequestContextErrorException,
} from '../exceptions';
import { logBase, LogLevel } from './log.base';

export class Logger {
  private static adapters: logBase[];
  private static enabled = true;
  static registerAdapter(adapter: logBase) {
    if (!Logger.adapters) Logger.adapters = [];
    Logger.adapters.push(adapter);
  }
  static log(level: LogLevel, message: string, meta: Record<string, any> = {}) {
    try {
      const ctx = RequestContext.getContext();
    } catch {
      throw new RequestContextErrorException(
        'RequestContext Not Initialized',
        REQUEST_CONTEXT_NOT_INITIALIZED
      );
    }
    if (this.enabled) {
      this.adapters.forEach((adapter) => {
        adapter.log(level, message, meta);
      });
    }
  }

  static enable() {
    this.enabled = true;
  }

  static disable() {
    this.enabled = false;
  }

  static getAdapters(): logBase[] {
    return this.adapters;
  }

  static info(message: string, meta?: Record<string, any>) {
    this.log('info', message, meta);
  }

  static error(message: string, meta?: Record<string, any>) {
    this.log('error', message, meta);
  }

  static warn(message: string, meta?: Record<string, any>) {
    this.log('warn', message, meta);
  }

  static debug(message: string, meta?: Record<string, any>) {
    this.log('debug', message, meta);
  }
}
