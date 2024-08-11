import { BaseDb } from './basedb'
import { Log } from './log'
import { PathHelper } from './path'
import sqlite3 from 'sqlite3'

export class SqliteHelper extends BaseDb {
  private _db: sqlite3.Database | null = null
  constructor() {
    super()
  }
  async OpenDb() {
    const dbPath = this.getDbPath()
    return new Promise((resolve, reject) => {
      if (this._db) {
        resolve(this._db)
      }
      this._db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('open db err', err.message)
          reject(err)
        } else {
          Log.info('open db success')
          resolve(this._db)
        }
      })
    })
  }

  public getDbPath() {
    return `${PathHelper.getHomeDir()}/lockpass.db`
  }

  async CloseDB() {
    return new Promise((resolve, reject) => {
      if (this._db) {
        this._db.close((err) => {
          if (err) {
            console.error('close db err', err.message)
            reject(err)
          } else {
            Log.info('close db success')
            this._db = null
            resolve(true)
          }
        })
      } else {
        resolve(true)
      }
    })
  }

  async run(sql: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._db?.exec(sql, (err) => {
        if (err) {
          Log.Exception(err, `sql:${sql}`)
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  protected async all(sql: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._db?.all(sql, (err, rows) => {
        if (err) {
          Log.Exception(err, `sql:${sql}`)
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }

  protected async each(sql: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this._db?.each(sql, (err, row) => {
        if (err) {
          Log.Exception(err, `sql:${sql}`)
          reject(err)
        } else {
          resolve(row)
        }
      })
    })
  }
}
