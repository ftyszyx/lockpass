export class ConsoleLog {
  static LogInfo(...args: any[]) {
    if (import.meta.env.DEV) console.info('[INFO]', ...args)
  }

  static LogError(...args: any[]) {
    console.trace('[Error]', ...args)
  }

  static LogTrace(...args: any[]) {
    if (import.meta.env.DEV) console.trace('[Trace]', ...args)
  }
}
