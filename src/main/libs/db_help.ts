import { User } from '@common/entitys/user.entity'
import { VaultItem } from '@common/entitys/valut_item.entity'
import { Vault } from '@common/entitys/valuts.entity'
import { Column_Name, Column_desc } from '@common/gloabl'
import duckdb from 'duckdb'
import { Log } from './log'
import { BaseEntity } from '@common/entitys/db.entity'
class DbHlper {
  private static _instance: DbHlper
  user: User
  vault: Vault
  vaultItem: VaultItem
  constructor() {
    this.user = new User()
    this.vault = new Vault()
    this.vaultItem = new VaultItem()
  }
  public db: duckdb.Database | null = null
  static instance() {
    if (!DbHlper._instance) {
      DbHlper._instance = new DbHlper()
      DbHlper._instance.db = new duckdb.Database('lockpass.db', {
        access_mode: 'READ_WRITE',
        max_memory: '512MB'
      })
    }
    return DbHlper._instance
  }

  public getconnection() {
    return this.db?.connect()
  }

  public AddOne(obj: BaseEntity) {
    const table_name = obj.table_name
    let sql_str = 'Insert into ' + table_name + 'Values ('
    const keys = Reflect.ownKeys(obj)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const element = obj[key]
      if (element) {
        const col_name = Reflect.getMetadata(Column_Name, obj, key)
        if (col_name) {
          sql_str += element.toString()
          if (i < keys.length - 1) {
            sql_str += ','
          }
        }
      }
    }
    sql_str += ')'
    Log.info('sql:', sql_str, JSON.stringify(obj))
    let conn = this.getconnection()
    conn.all(sql_str, (err, row) => {
      if (err) {
        Log.error('add one err:', err.message)
      } else {
        Log.info('add one success:', obj.table_name)
      }
    })
  }

  public initTables() {
    let conn = this.getconnection()
    const initFunc = (obj: BaseEntity) => {
      let table_name = obj.table_name
      let table_desc = `CREATE TABLE IF NOT EXISTS ${table_name} (\n`
      let index_desc = ''
      let keys = Reflect.ownKeys(obj)
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const col_def = Reflect.getMetadata(Column_desc, obj, key)
        if (col_def) {
          table_desc += col_def
          if (i < keys.length - 1) {
            table_desc += ','
          }
          table_desc += '\n'
        }
        const index_name = Reflect.getMetadata('index_name', obj, key)
        const col_name = Reflect.getMetadata(Column_Name, obj, key)
        if (index_name) {
          const unique_index = Reflect.getMetadata('unique_index', obj, key)
          index_desc += `CREATE ${unique_index ? 'UNIQUE' : ''} INDEX IF NOT EXISTS ${index_name} ON ${table_name} (${col_name});\n`
        }
      }
      table_desc += ');'
      const sql_str = table_desc + '\n' + index_desc
      Log.info('sql:\n', sql_str)
      conn.each(sql_str, (err, row) => {
        if (err) {
          Log.error('create table err', obj.table_name, err.message)
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
