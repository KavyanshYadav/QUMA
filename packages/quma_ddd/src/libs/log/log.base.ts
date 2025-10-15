export type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';
export interface logBase {
  log: (level: LogLevel, message: string, ...args: unknown[]) => void;
  //   info: (level: LogLevel, message: string, ...args: unknown[]) => void;
  //   warn: (level: LogLevel, message: string, ...args: unknown[]) => void;
  //   error: (level: LogLevel, message: string, ...args: unknown[]) => void;
  //   debug: (level: LogLevel, message: string, ...args: unknown[]) => void;
}
