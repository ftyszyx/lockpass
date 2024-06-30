import { User } from '@common/entitys/user.entity'
import { VaultItem } from '@common/entitys/valut_item.entity'
import { Vault } from '@common/entitys/valuts.entity'
import { Column_Name, Column_Type, Column_desc, Table_Name } from '@common/gloabl'
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
    const table_name = obj[Table_Name]
    let sql_str = 'Insert into ' + table_name + ' Values ('
    const keys = Reflect.ownKeys(obj)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const element = obj[key]
      const col_name = Reflect.getMetadata(Column_Name, obj, key)
      if (col_name) {
        if (element == undefined || element == null) {
          sql_str += 'default'
        } else {
          sql_str += `'${element.toString()}'`
        }
        if (i < keys.length - 1) {
          sql_str += ','
        }
      }
    }
    sql_str += ');'
    Log.info('sql:', sql_str, JSON.stringify(obj))
    let conn = this.getconnection()
    conn.all(sql_str, (err, row) => {
      if (err) {
        Log.error('add one err:', err.message)
      } else {
        Log.info('add one success:', table_name)
      }
    })
  }

  public initTables() {
    let conn = this.getconnection()
    const initFunc = (obj: BaseEntity) => {
      let table_name = obj[Table_Name]
      let table_desc = `CREATE TABLE IF NOT EXISTS ${table_name} (\n`
      let index_desc = ''
      let sequence_desc = ''
      let keys = Reflect.ownKeys(obj)
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        const col_type = Reflect.getMetadata(Column_Type, obj, key)
        const col_name = Reflect.getMetadata(Column_Name, obj, key)
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
      Log.info('sql:\n', sql_str)
      conn.each(sql_str, (err, row) => {
        if (err) {
          Log.error('create table err', obj[Table_Name], err.message)
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
