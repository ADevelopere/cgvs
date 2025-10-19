import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

interface LogEntry {
  sessionId: string;
  level: string;
  message: string;
  timestamp: string;
  caller: string;
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
