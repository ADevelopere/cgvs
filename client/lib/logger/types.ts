export interface LogEntry {
  sessionId: string;
  level: string;
  message: string;
  timestamp: string;
  caller: string;
}

export type LogLevel = "log" | "info" | "warn" | "error" | "debug";

export interface LoggerConfig {
  enabled: boolean;
  apiEndpoint: string;
  sessionId: string;
}
