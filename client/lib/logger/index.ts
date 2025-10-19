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

  private getCallerInfo(): string {
    try {
      const stack = new Error().stack;
      if (!stack) return "unknown";

      const lines = stack.split("\n");
      // Find the first line that's not from this logger file
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        if (
          line &&
          !line.includes("logger") &&
          !line.includes("node_modules")
        ) {
          // Extract filename and line number
          const match =
            line.match(/\(([^)]+):(\d+):\d+\)/) ||
            line.match(/at ([^:]+):(\d+):\d+/);
          if (match) {
            const filePath = match[1];
            const lineNumber = match[2];
            const fileName = filePath.split("/").pop() || filePath;
            return `${fileName}:${lineNumber}`;
          }
        }
      }
      return "unknown";
    } catch {
      return "unknown";
    }
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
        caller: this.getCallerInfo(),
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
      .map(arg =>
        typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)
      )
      .join(" ");

    const caller = this.getCallerInfo();
    const timestamp = this.formatTimestamp();
    const color = this.getColorCode(level);

    // Console output with colors
    const consoleArgs = [
      `%c[${timestamp}] [${level.toUpperCase()}] [${caller}]`,
      `color: ${color}; font-weight: bold;`,
      ...args,
    ];

    switch (level) {
      case "log":
        // eslint-disable-next-line no-console
        console.log(...consoleArgs);
        break;
      case "info":
        // eslint-disable-next-line no-console
        console.info(...consoleArgs);
        break;
      case "warn":
        // eslint-disable-next-line no-console
        console.warn(...consoleArgs);
        break;
      case "error":
        // eslint-disable-next-line no-console
        console.error(...consoleArgs);
        break;
      case "debug":
        // eslint-disable-next-line no-console
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
const logger = new ClientLogger();

export default logger;
