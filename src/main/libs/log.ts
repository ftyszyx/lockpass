import os from 'os'
import fs from 'fs'
import { PathHelper } from './path'
import { ConsoleColor } from '@common/gloabl'
import { LogLevel } from '@common/entitys/log.entity'

export class FileLogWriter {
  asyncWriteQueue = []
  hasActiveAsyncWriting = false
  constructor(
    private path: string,
    private writeAync: boolean = false
  ) {
    console.log(`log path: ${path}`)
  }

  private writeAyncNext() {
    if (this.hasActiveAsyncWriting || this.asyncWriteQueue.length === 0) {
      return
    }
    const text = this.asyncWriteQueue.join('')
    this.asyncWriteQueue = []
    this.hasActiveAsyncWriting = true

    fs.writeFile(this.path, text, { encoding: 'utf-8' }, (e) => {
      this.hasActiveAsyncWriting = false
      if (e) {
        console.log(`Couldn't write to ${this.path}. ${e.message}`)
      }
      this.writeAyncNext()
    })
  }

  writeLine(text) {
    text += os.EOL
    if (this.writeAync) {
      this.asyncWriteQueue.push(text)
      this.writeAyncNext()
      return
    } else {
      fs.appendFileSync(this.path, text, { encoding: 'utf-8' })
    }
  }
}

export class Log {
  static logWriter: FileLogWriter
  static log_level: LogLevel = LogLevel.Info
  static time_zone: string = 'Asia/Shanghai'
  static locale: string = 'zh-CN'

  static initialize() {
    const date = new Date()
    const log_dir = `${PathHelper.getHomeDir()}/log`
    if (!fs.existsSync(log_dir)) {
      fs.mkdirSync(log_dir)
    }
    const log_path = `${log_dir}/lockpass-${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}.log`
    // console.log(`log path: ${log_path}`)
    Log.logWriter = new FileLogWriter(log_path, false)
  }

  static Debug(...args) {
    if (Log.log_level > LogLevel.Debug) {
      return
    }
    const logstr = `[Debug] ${new Date().toLocaleString(this.locale, { timeZone: this.time_zone })} ${args.join(' ')}`
    Log.logWriter.writeLine(logstr)
    console.log(logstr)
  }

  static Info(...args) {
    if (Log.log_level > LogLevel.Info) {
      return
    }
    const logstr = `[INFO] ${new Date().toLocaleString(this.locale, { timeZone: this.time_zone })} ${args.join(' ')}`
    Log.logWriter.writeLine(logstr)
    console.log(logstr)
    // console.log(`${ConsoleColor.FgGreen}${logstr}${ConsoleColor.FgGreen}`)
  }

  static Device(...args) {
    if (Log.log_level > LogLevel.Device) {
      return
    }
    const logstr = `[Device] ${new Date().toLocaleString(this.locale, { timeZone: this.time_zone })} ${args.join(' ')}`
    Log.logWriter.writeLine(logstr)
    console.log(logstr)
  }

  static Error(...args) {
    if (Log.log_level > LogLevel.Error) {
      return
    }
    const obj = Object.create(null)
    Error.captureStackTrace(obj)
    Error.stackTraceLimit = 10
    const logstr = `[Error] ${new Date().toLocaleString(this.locale, { timeZone: this.time_zone })} ${args.join(' ')} 
    \n stack:\n ${obj.stack}`
    Log.logWriter.writeLine(logstr)
    // console.error(logstr)
    console.trace(`${ConsoleColor.FgRed}${logstr}${ConsoleColor.FgRed}`)
    // console.log(logstr)
  }

  static Exception(e: Error, ...args) {
    const logstr = `[Error] ${new Date().toLocaleString(this.locale, { timeZone: this.time_zone })} ${e.message} ${args.join(' ')}
    \n stack:\n ${e.stack}`
    Log.logWriter.writeLine(logstr)
    console.trace(`${ConsoleColor.FgRed}${logstr}${ConsoleColor.FgRed}`)
    // console.trace(logstr)
  }
}
