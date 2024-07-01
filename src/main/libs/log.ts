import os from 'os'
import fs from 'fs'

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
    const file = this
    if (this.hasActiveAsyncWriting || this.asyncWriteQueue.length === 0) {
      return
    }
    const text = this.asyncWriteQueue.join('')
    this.asyncWriteQueue = []
    this.hasActiveAsyncWriting = true

    fs.writeFile(this.path, text, { encoding: 'utf-8' }, (e) => {
      file.hasActiveAsyncWriting = false
      if (e) {
        console.log(`Couldn't write to ${file.path}. ${e.message}`)
      }
      file.writeAyncNext()
    })
  }

  writeLine(text) {
    text += os.EOL
    if (this.writeAync) {
      this.asyncWriteQueue.push(text)
      this.writeAyncNext()
      return
    }
  }
}

export enum LogLevel {
  Debug,
  Info,
  Error
}

export class Log {
  static logWriter: FileLogWriter
  static log_level: LogLevel = 0
  static time_zone: string = 'Asia/Shanghai'
  static locale: string = 'zh-CN'

  constructor() {}

  static initialize() {
    const date = new Date()
    // let log_path = os.homedir() + `/lockpass-${date.getFullYear()}-${date.getMonth()}-${date.getDay()}.log`
    let log_dir = `${__dirname}/log`
    if (!fs.existsSync(log_dir)) {
      fs.mkdirSync(log_dir)
    }
    let log_path = `${log_dir}/lockpass-${date.getFullYear()}-${date.getMonth()}-${date.getDay()}.log`
    Log.logWriter = new FileLogWriter(log_path, true)
  }

  static debug(...args) {
    if (Log.log_level > LogLevel.Debug) {
      return
    }
    const logstr = `[Debug] ${new Date().toLocaleString(this.locale, { timeZone: this.time_zone })} ${args.join(' ')}`
    Log.logWriter.writeLine(logstr)
    console.log(logstr)
  }

  static info(...args) {
    if (Log.log_level > LogLevel.Info) {
      return
    }
    const logstr = `[INFO] ${new Date().toLocaleString(this.locale, { timeZone: this.time_zone })} ${args.join(' ')}`
    Log.logWriter.writeLine(logstr)
    console.log(logstr)
  }

  static error(...args) {
    if (Log.log_level > LogLevel.Error) {
      return
    }
    const obj = Object.create(null)
    Error.captureStackTrace(obj)
    const logstr = `[Error] ${new Date().toLocaleString(this.locale, { timeZone: this.time_zone })} ${args.join(' ')} \n stack:\n ${obj.stack}`
    Log.logWriter.writeLine(logstr)
    console.error(logstr)
  }
}
