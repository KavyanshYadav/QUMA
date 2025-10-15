import fs from 'fs';
import path from 'path';
import { logBase, LogLevel } from '../../../log/index.js';

export class FileAdapter implements logBase {
  private logFile: string;

  constructor(filePath = 'app.log') {
    this.logFile = path.resolve(filePath);
  }

  log(level: LogLevel, message: string, ...args: unknown[]) {
    const meta = args.length ? JSON.stringify(args) : '';
    const logLine = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message} ${meta}\n`;

    fs.appendFile(this.logFile, logLine, (err) => {
      if (err) {
        console.error('[FileAdapter] Failed to write log:', err);
      }
    });
  }
}
