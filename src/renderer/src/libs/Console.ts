export class ConsoleLog {
  static LogInfo(...args: any[]) {
    if (import.meta.env.DEV) console.log('[INFO]', ...args)
  }

  static LogError(...args: any[]) {
    console.trace('[Error]', ...args)
  }
}
