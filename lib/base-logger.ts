/* eslint-disable no-console */
import { writeFile, mkdir, readdir, unlink, stat } from "fs/promises";
import { join } from "path";

type LogLevel = "log" | "info" | "warn" | "error" | "debug";

// const cleanLogs = process.env.CLEANUP_OLD_LOGS === "true";
const cleanLogs = false;

export abstract class BaseLogger {
  protected enabled: boolean;
  protected sessionId: string;
  protected logsDir: string;
  protected prefix: string;
  private readonly maxLogAgeDays: number = 7; // Keep logs for 7 days
  private readonly cleanupOldLogs: boolean;

  constructor(prefix: string) {
    // Only enable in development
    this.enabled = process.env.NODE_ENV !== "production";
    this.sessionId = this.generateSessionId();
    this.logsDir = join(process.cwd(), "logs");
    this.prefix = prefix;

    // Check if old logs should be cleaned up (default: false to keep logs)
    this.cleanupOldLogs = cleanLogs;

    // Clean up old log files on initialization if enabled
    if (this.enabled && this.cleanupOldLogs) {
      this.performCleanup();
    }
  }

  private async performCleanup(): Promise<void> {
    try {
      // Create logs directory if it doesn't exist
      await mkdir(this.logsDir, { recursive: true });

      const files = await readdir(this.logsDir);
      const now = Date.now();
      const maxAge = this.maxLogAgeDays * 24 * 60 * 60 * 1000; // Convert days to milliseconds

      for (const file of files) {
        // Only process .log files
        if (!file.endsWith(".log")) continue;

        const filePath = join(this.logsDir, file);

        try {
          const fileStats = await stat(filePath);
          const fileAge = now - fileStats.mtime.getTime();

          // Delete if older than max age
          if (fileAge > maxAge) {
            await unlink(filePath);
          }
        } catch {
          // Ignore errors for individual files
        }
      }
    } catch {
      // Silently fail to avoid breaking logger initialization
    }
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

  protected async writeToFile(level: LogLevel, message: string): Promise<void> {
    if (!this.enabled) return;

    try {
      // Create logs directory if it doesn't exist
      try {
        await mkdir(this.logsDir, { recursive: true });
      } catch {
        // Directory might already exist, ignore error
      }

      const timestamp = this.formatTimestamp();
      const logLine = `[${timestamp}] [${level.toUpperCase()}] ${message}\n`;

      // Write to session-based log file with prefix
      const logFileName = `${this.prefix}_${this.sessionId}.log`;
      const logFilePath = join(this.logsDir, logFileName);

      await writeFile(logFilePath, logLine, { flag: "a" });
    } catch {
      // Silently fail to avoid infinite loops
    }
  }

  protected logToConsole(level: LogLevel, ...args: unknown[]): void {
    if (!this.enabled) return;

    const message = args
      .map(arg =>
        typeof arg === "object"
          ? JSON.stringify(
              arg,
              (_, value) =>
                typeof value === "bigint" ? value.toString() : value,
              2
            )
          : String(arg)
      )
      .join(" ");

    const timestamp = this.formatTimestamp();

    // Console output with timestamp
    const consoleArgs = [`[${timestamp}] [${level.toUpperCase()}]`, ...args];

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

    // Write to file
    this.writeToFile(level, message);
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
