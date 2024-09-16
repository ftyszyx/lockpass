import { LogLevel } from '@common/entitys/log.entity'

export class ConsoleLog {
  static log_level: LogLevel = LogLevel.Info
  static info(...args: any[]) {
    if (this.log_level > LogLevel.Info) return
    console.log(`[INFO][${new Date().toLocaleString()}] `, ...args)
  }

  static device(...args: any[]) {
    if (this.log_level > LogLevel.Device) return
    console.log(`[INFO][${new Date().toLocaleString()}] `, ...args)
  }

  static error(...args: any[]) {
    if (this.log_level > LogLevel.Info) return
    console.trace(`[Error][${new Date().toLocaleString()}]`, ...args)
  }

  static trace(...args: any[]) {
    if (this.log_level > LogLevel.Info) return
    console.trace(`[Trace][${new Date().toLocaleString()}]`, ...args)
  }
}
