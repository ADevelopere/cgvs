/* eslint-disable no-console */
import { LogEntry, LogLevel, LoggerConfig } from "./types";

class ClientLogger {
  private config: LoggerConfig;
  private sessionId: string;

  constructor() {
    // Only enable in development
    const enabled = process.env.NODE_ENV === "development";

    this.sessionId = this.generateSessionId();
    this.config = {
      enabled,
      apiEndpoint: "/api/logs",
      sessionId: this.sessionId,
    };
  }

  private generateSessionId(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
  }

  private getColorCode(level: LogLevel): string {
    const colors = {
      log: "#888",
      info: "#2196F3",
      warn: "#FF9800",
      error: "#F44336",
      debug: "#9C27B0",
    };
    return colors[level] || "#888";
  }

  private formatTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  private async sendToAPI(level: LogLevel, message: string): Promise<void> {
    if (!this.config.enabled) return;

    try {
      const logEntry: LogEntry = {
        sessionId: this.sessionId,
        level,
        message,
        timestamp: this.formatTimestamp(),
      };

      await fetch(this.config.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logEntry),
      });
    } catch {
      // Silently fail - don't log errors to avoid infinite loops
    }
  }

  private logToConsole(level: LogLevel, ...args: unknown[]): void {
    if (!this.config.enabled) return;

    const message = args
      .map(arg => {
        if (arg === null) return "null";
        if (arg === undefined) return "undefined";
        if (typeof arg === "object") {
          // Handle Error objects specially
          if (arg instanceof Error) {
            return `${arg.name}: ${arg.message} || ""}`;
          }
          // Try to stringify with error handling for circular references
          try {
            return JSON.stringify(arg, null, 2);
          } catch {
            // Fallback for circular references or other issues
            return String(arg);
          }
        }
        return String(arg);
      })
      .join(" ");

    const timestamp = this.formatTimestamp();
    const color = this.getColorCode(level);

    // Console output with colors
    const consoleArgs = [
      `%c[${timestamp}] [${level.toUpperCase()}]`,
      `color: ${color}; font-weight: bold;`,
      ...args,
    ];

    switch (level) {
      case "log":
        console.log(...consoleArgs);
        break;
      case "info":
        console.info(...consoleArgs);
        break;
      case "warn":
        console.warn(...consoleArgs);
        break;
      case "error":
        console.error(...consoleArgs);
        break;
      case "debug":
        console.debug(...consoleArgs);
        break;
    }

    // Send to API
    this.sendToAPI(level, message);
  }

  public log(...args: unknown[]): void {
    this.logToConsole("log", ...args);
  }

  public info(...args: unknown[]): void {
    this.logToConsole("info", ...args);
  }

  public warn(...args: unknown[]): void {
    this.logToConsole("warn", ...args);
  }

  public error(...args: unknown[]): void {
    this.logToConsole("error", ...args);
  }

  public debug(...args: unknown[]): void {
    this.logToConsole("debug", ...args);
  }
}

// Create singleton instance
export const logger = new ClientLogger();

export default logger;
