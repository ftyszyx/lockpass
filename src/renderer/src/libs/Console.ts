export class ConsoleLog {
  static LogInfo(...args: any[]) {
    if (import.meta.env.DEV) console.info(`[INFO][${new Date().toLocaleString()}]`, ...args)
  }

  static LogError(...args: any[]) {
    console.trace(`[Error][${new Date().toLocaleString()}]`, ...args)
  }

  static LogTrace(...args: any[]) {
    if (import.meta.env.DEV) console.trace(`[Trace][${new Date().toLocaleString()}]`, ...args)
  }
}
