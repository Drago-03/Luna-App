export class Logger {
  private static instance: Logger;
  private logFile: string[] = [];

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  log(message: string, type: 'info' | 'error' | 'warning' = 'info'): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
    
    // Add to memory log
    this.logFile.push(logEntry);
    
    // Log to console
    console.log(logEntry);
    
    // In a real implementation, you'd want to periodically save this to a file
    // or send it to a logging service
  }

  getLogs(): string[] {
    return [...this.logFile];
  }
}