import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readdir, unlink } from "fs/promises";
import { join } from "path";

interface LogEntry {
  sessionId: string;
  level: string;
  message: string;
  timestamp: string;
  caller: string;
}

// Track if we've already cleaned up old logs for this session
const cleanedSessions = new Set<string>();

async function cleanupOldClientLogs(
  logsDir: string,
  sessionId: string
): Promise<void> {
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

export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const logEntry: LogEntry = await request.json();

    // Validate required fields
    if (!logEntry.sessionId || !logEntry.level || !logEntry.message) {
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

    // Format log entry for file storage
    const logLine = `[${logEntry.timestamp}] [${logEntry.level.toUpperCase()}] [${logEntry.caller}] ${logEntry.message}\n`;

    // Write to session-based log file with client prefix
    const logFileName = `client_${logEntry.sessionId}.log`;
    const logFilePath = join(logsDir, logFileName);

    await writeFile(logFilePath, logLine, { flag: "a" });

    return NextResponse.json({ success: true });
  } catch {
    // Use a simple error response without console logging to avoid potential issues
    return NextResponse.json({ error: "Failed to write log" }, { status: 500 });
  }
}
