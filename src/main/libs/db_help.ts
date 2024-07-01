import { User } from '@common/entitys/user.entity'
import { VaultItem } from '@common/entitys/valut_item.entity'
import { Vault } from '@common/entitys/valuts.entity'
import { Column_Name_KEY, Column_Type_KEY, Column_desc_KEY, Table_Name_KEY } from '@common/gloabl'
import duckdb from 'duckdb'
import { Log } from './log'
import { BaseEntity } from '@common/entitys/db.entity'
import { Column_type } from '@common/decorator/db.decorator'
class DbHlper {
  private static _instance: DbHlper
  public user: User
  public vault: Vault
  public vaultItem: VaultItem
  constructor() {
    this.user = new User()
    this.vault = new Vault()
    this.vaultItem = new VaultItem()
  }
  public db: duckdb.Database | null = null
  static instance() {
    if (!DbHlper._instance) {
      DbHlper._instance = new DbHlper()
      const dbpath = `${__dirname}/lockpass.db`
      DbHlper._instance.db = new duckdb.Database(dbpath, {
        access_mode: 'READ_WRITE',
        max_memory: '512MB'
      })
    }
    return DbHlper._instance
  }

  public getconnection() {
    return this.db?.connect()
  }

  getColumnValue(obj: BaseEntity, key: string, value: any): string {
    const col_type = Reflect.getMetadata(Column_Type_KEY, obj, key)
    if (col_type) {
      if (value == undefined || value == null) {
        return 'default'
      } else {
        return `${value.toString()}`
      }
    }
    return null
  }

  getAddOneSql(obj: BaseEntity, keys: string[]): string {
    let sql_str = '('
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const element = obj[key]
      const col_value = this.getColumnValue(obj, key, element)
      if (col_value) {
        sql_str += col_value
        if (i < keys.length - 1) {
          sql_str += ','
        }
      }
    }
    sql_str += ')'
    return sql_str
  }

  public DelOne(obj: BaseEntity, key: string, value: string): Promise<void> {
    const table_name = obj[Table_Name_KEY]
    const col_value = this.getColumnValue(obj, key, value)
    let sql_str = `delete from ${table_name} where ${key}=${col_value}`
    return new Promise((resolve, reject) => {
      let conn = this.getconnection()
      conn.exec(sql_str, (err, row) => {
        if (err) {
          Log.error('del one err:', err.message)
          reject(new Error(err.message))
        } else {
          resolve()
        }
      })
    })
  }

  public AddList(objs: BaseEntity[]): Promise<void> {
    const table_name = obj[Table_Name_KEY]
    let sql_str = 'BEGIN TRANSACTION;\n'
    sql_str += 'Insert into ' + table_name + ' Values '
    const keys = Reflect.ownKeys(obj)
    for (let i = 0; i < objs.length; i++) {
      var obj = objs[i]
      sql_str += this.getAddOneSql(obj, keys as string[])
      if (i < objs.length - 1) {
        sql_str += ',\n'
      }
    }
    sql_str += ';\n'
    sql_str += 'COMMIT;'
    // Log.info('sql:', sql_str, JSON.stringify(obj))
    let conn = this.getconnection()
    return new Promise((resolve, reject) => {
      conn.all(sql_str, (err, row) => {
        if (err) {
          Log.error('add list err:', err.message)
          reject(new Error(err.message))
        } else {
          resolve()
        }
      })
    })
  }

  public AddOne(obj: BaseEntity): Promise<void> {
    const table_name = obj[Table_Name_KEY]
    let sql_str = 'Insert into ' + table_name + ' Values '
    const keys = Reflect.ownKeys(obj)
    sql_str += this.getAddOneSql(obj, keys as string[])
    sql_str += ';'
    // Log.info('sql:', sql_str, JSON.stringify(obj))
    let conn = this.getconnection()
    return new Promise((resolve, reject) => {
      conn.all(sql_str, (err, row) => {
        if (err) {
          Log.error('add one err:', err.message)
          reject(new Error(err.message))
        } else {
          if (row.length !== 1) {
            reject(new Error('add one error'))
          } else {
            resolve()
          }
        }
      })
    })
  }

  public initTables() {
    let conn = this.getconnection()
    const initFunc = (obj: BaseEntity) => {
      let table_name = obj[Table_Name_KEY]
      let table_desc = `CREATE TABLE IF NOT EXISTS ${table_name} (\n`
      let index_desc = ''
      let sequence_desc = ''
      let keys = Reflect.ownKeys(obj)
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const col_type = Reflect.getMetadata(Column_Type_KEY, obj, key)
        const col_name = Reflect.getMetadata(Column_Name_KEY, obj, key)
        const isprimary = Reflect.getMetadata('primary', obj, key)
        if (!col_type) continue
        table_desc += `${col_name} ${col_type}`
        if (isprimary) {
          sequence_desc += `CREATE SEQUENCE IF NOT EXISTS ${col_name}_seq start 101;\n`
          table_desc += " PRIMARY KEY default nextval('" + col_name + "_seq')"
        }
        const default_value = Reflect.getMetadata('default', obj, key)
        if (default_value) {
          table_desc += ` DEFAULT ${default_value}`
        }
        if (Reflect.getMetadata('unique', obj, key)) {
          table_desc += ' UNIQUE'
        }
        if (i < keys.length - 1) {
          table_desc += ','
        }
        table_desc += '\n'
        const index_name = Reflect.getMetadata('index_name', obj, key)
        if (index_name) {
          const unique_index = Reflect.getMetadata('unique_index', obj, key)
          index_desc += `CREATE ${unique_index ? 'UNIQUE' : ''} INDEX IF NOT EXISTS ${index_name} ON ${table_name} (${col_name});\n`
        }
      }
      table_desc += ');'
      const sql_str = sequence_desc + '\n' + table_desc + '\n' + index_desc
      // Log.info('sql:\n', sql_str)
      conn.each(sql_str, (err, row) => {
        if (err) {
          Log.error('create table err', obj[Table_Name_KEY], err.message)
        }
      })
    }
    if (conn) {
      initFunc(this.user)
      initFunc(this.vault)
      initFunc(this.vaultItem)
    }
  }
}
export default DbHlper
