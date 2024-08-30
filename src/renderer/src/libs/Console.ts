import { LogLevel } from '@common/entitys/log.entity'

export class ConsoleLog {
  static log_level: LogLevel = LogLevel.Info
  static LogInfo(...args: any[]) {
    if (this.log_level > LogLevel.Info) return
    console.log(`[INFO][${new Date().toLocaleString()}] `, ...args)
  }

  static LogDevice(...args: any[]) {
    if (this.log_level > LogLevel.Device) return
    console.log(`[INFO][${new Date().toLocaleString()}] `, ...args)
  }

  static LogError(...args: any[]) {
    if (this.log_level > LogLevel.Info) return
    console.trace(`[Error][${new Date().toLocaleString()}]`, ...args)
  }

  static LogTrace(...args: any[]) {
    if (this.log_level > LogLevel.Info) return
    console.trace(`[Trace][${new Date().toLocaleString()}]`, ...args)
  }
}
