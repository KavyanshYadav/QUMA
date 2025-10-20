export type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

export interface OpenTelemetryLogRecord {
  timestamp: string;
  severity_text: string;
  body: string | Record<string, unknown>;
  attributes: Record<string, unknown>;
  trace_id?: string;
  span_id?: string;
  resource?: Record<string, unknown>;
}

export interface logBase {
  log(
    level: LogLevel,
    message: string | Record<string, unknown>,
    meta?: Record<string, unknown>
  ): void;
}
