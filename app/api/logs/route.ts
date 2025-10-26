import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readdir, unlink } from "fs/promises";
import { join } from "path";

interface LogEntry {
  sessionId: string;
  level: string;
  message: string;
  timestamp: string;
  caller?: string;
  sequence: number;
}

// const cleanupEnabled = process.env.CLEANUP_OLD_LOGS === "true";
const cleanupEnabled = false;

// Track if we've already cleaned up old logs for this session
const cleanedSessions = new Set<string>();

// Buffer to store out-of-order log entries per session
const logBuffers = new Map<
  string,
  { entries: LogEntry[]; nextSequence: number; writeLock: Promise<void> }
>();

async function cleanupOldClientLogs(
  logsDir: string,
  sessionId: string
): Promise<void> {
  // Check if cleanup is enabled (default: false to keep logs)
  if (!cleanupEnabled) return;

  // Only cleanup once per session
  if (cleanedSessions.has(sessionId)) return;

  try {
    // Ensure logs directory exists
    await mkdir(logsDir, { recursive: true });

    // Read all files in the logs directory
    const files = await readdir(logsDir);

    // Find all client log files (files starting with 'client_')
    const clientLogFiles = files.filter(file => file.startsWith("client_"));

    // Delete all previous client log files
    const deletePromises = clientLogFiles.map(file =>
      unlink(join(logsDir, file)).catch(() => {
        // Silently ignore deletion errors
      })
    );

    await Promise.all(deletePromises);

    // Mark this session as cleaned up
    cleanedSessions.add(sessionId);
  } catch {
    // Silently fail to avoid infinite loops
  }
}

async function writeLogEntry(
  logEntry: LogEntry,
  logsDir: string
): Promise<void> {
  const { sessionId } = logEntry;

  // Get or create buffer for this session
  if (!logBuffers.has(sessionId)) {
    logBuffers.set(sessionId, {
      entries: [],
      nextSequence: 1,
      writeLock: Promise.resolve(),
    });
  }

  const buffer = logBuffers.get(sessionId)!;

  // Add entry to buffer
  buffer.entries.push(logEntry);

  // Sort buffer by sequence number
  buffer.entries.sort((a, b) => a.sequence - b.sequence);

  // Wait for any pending writes to complete
  await buffer.writeLock;

  // Create a new write lock promise
  let resolveWriteLock: () => void;
  buffer.writeLock = new Promise(resolve => {
    resolveWriteLock = resolve;
  });

  try {
    // Write all consecutive entries starting from nextSequence
    const logFileName = `client_${sessionId}.log`;
    const logFilePath = join(logsDir, logFileName);

    while (
      buffer.entries.length > 0 &&
      buffer.entries[0].sequence === buffer.nextSequence
    ) {
      const entry = buffer.entries.shift()!;
      const logLine = `[${entry.timestamp}] [${entry.level.toUpperCase()}] [${entry.caller || "undefined"}] ${entry.message}\n`;

      await writeFile(logFilePath, logLine, { flag: "a" });
      buffer.nextSequence++;
    }
  } finally {
    resolveWriteLock!();
  }
}

export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const logEntry: LogEntry = await request.json();

    // Validate required fields
    if (
      !logEntry.sessionId ||
      !logEntry.level ||
      !logEntry.message ||
      typeof logEntry.sequence !== "number"
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create logs directory if it doesn't exist
    const logsDir = join(process.cwd(), "logs");
    try {
      await mkdir(logsDir, { recursive: true });
    } catch {
      // Directory might already exist, ignore error
    }

    // Clean up old client log files for this session
    await cleanupOldClientLogs(logsDir, logEntry.sessionId);

    // Write log entry using buffered writer
    await writeLogEntry(logEntry, logsDir);

    return NextResponse.json({ success: true });
  } catch {
    // Use a simple error response without logging to avoid potential issues
    return NextResponse.json({ error: "Failed to write log" }, { status: 500 });
  }
}
