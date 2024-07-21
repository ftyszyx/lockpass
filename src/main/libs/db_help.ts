import { User } from '@common/entitys/user.entity'
import { VaultItem } from '@common/entitys/vault_item.entity'
import { Vault } from '@common/entitys/vaults.entity'
import { Column_Name_KEY, Column_Type_KEY, Table_Name_KEY } from '@common/gloabl'
import duckdb from 'duckdb'
import { Log } from './log'
import { BaseEntity, WhereDef } from '@common/entitys/db.entity'
import { ColumnType } from '@common/decorator/db.decorator'
import { PathHelper } from './path'
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
      const dbpath = `${PathHelper.getHomeDir()}/lockpass.db`
      DbHlper._instance.db = new duckdb.Database(dbpath, {
        access_mode: 'READ_WRITE',
        max_memory: '512MB'
      })
    }
    return DbHlper._instance
  }

  private getconnection() {
    return this.db?.connect()
  }

  private getColumnValue(obj: BaseEntity, key: string, value: any): string {
    const col_type: ColumnType = Reflect.getMetadata(Column_Type_KEY, obj, key)
    if (col_type) {
      if (value == undefined || value == null) {
        return 'default'
      } else if (col_type == 'VARCHAR' || col_type == 'VARCHAR[]') {
        return `'${value.toString()}'`
      } else {
        return `${value.toString()}`
      }
    }
    return null
  }

  private getAddOneSql(obj: BaseEntity, keys: string[]): string {
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

  private getupdateOneSql(entity: BaseEntity, obj_old: any, obj: any, keys: string[]): string {
    let sql_str = ''
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const element = obj[key]
      const old_value = obj_old[key]
      if (element == undefined || element == null) continue
      if (old_value == element) continue
      const col_value = this.getColumnValue(entity, key, element)
      if (col_value) {
        sql_str += `${key}=${col_value}`
        if (i < keys.length - 1) {
          sql_str += ','
        }
      }
    }
    return sql_str
  }

  private _exesql(sql_str: string, ext_msg: string = ''): Promise<void> {
    let conn = this.getconnection()
    return new Promise((resolve, reject) => {
      conn.exec(sql_str, (err, row) => {
        if (err) {
          Log.error(`run sql:${sql_str} ext:${ext_msg}  err: ${err.message}`)
          reject(new Error(err.message))
        } else {
          resolve()
        }
      })
    })
  }

  private _runSql(sql_str: string, ext_msg: string = ''): Promise<void> {
    let conn = this.getconnection()
    return new Promise((resolve, reject) => {
      conn.all(sql_str, (err, row) => {
        if (err) {
          Log.error(`run sql:${sql_str} ext:${ext_msg}  err: ${err.message}`)
          reject(new Error(err.message))
        } else {
          resolve()
        }
      })
    })
  }

  private _runSqlWithResult<T>(
    obj: BaseEntity,
    sql_str: string,
    ext_msg: string = ''
  ): Promise<T[]> {
    return this._runSqlWithResult2(
      obj.constructor as new (...args: any[]) => T,
      obj,
      sql_str,
      ext_msg
    )
  }

  private _runSqlWithResult2<T>(
    obj_type: new (...args: any[]) => T,
    obj: BaseEntity,
    sql_str: string,
    ext_msg: string = ''
  ): Promise<T[]> {
    let conn = this.getconnection()
    const keys = Reflect.ownKeys(obj) as string[]
    return new Promise((resolve, reject) => {
      conn.all(sql_str, (err, rows) => {
        if (err) {
          Log.error(`run sql:${sql_str} ext:${ext_msg} err: ${err.message}`)
          reject(new Error(err.message))
        } else {
          let res: T[] = []
          for (let i = 0; i < rows.length; i++) {
            const item = new obj_type()
            for (let j = 0; j < keys.length; j++) {
              const key = keys[j]
              const col_name = Reflect.getMetadata(Column_Name_KEY, obj, key)
              if (col_name) {
                item[key] = rows[i][col_name]
              }
            }
            res.push(item)
          }
          resolve(res)
        }
      })
    })
  }

  public DelOne(obj: BaseEntity, key: string, value: string | number): Promise<void> {
    const table_name = obj[Table_Name_KEY]
    const col_value = this.getColumnValue(obj, key, value)
    let sql_str = `delete from ${table_name} where ${key}=${col_value}`
    return this._runSql(sql_str, `del:${table_name}`)
  }

  public UpdateOne(entity: BaseEntity, obj_old: any, obj: any): Promise<void> {
    const table_name = entity[Table_Name_KEY]
    if (!obj.id) {
      Log.error('update entity id is null')
      return Promise.reject(new Error('update entity id is null'))
    }
    let sql_str = 'update ' + table_name + ' set '
    const keys = Reflect.ownKeys(entity)
    keys.splice(keys.indexOf('id'), 1)
    sql_str += this.getupdateOneSql(entity, obj_old, obj, keys as string[])
    sql_str += ` where id=${obj.id}`
    return this._exesql(sql_str, `update:${table_name}`)
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
    return this._runSql(sql_str)
  }

  public AddOne(obj: BaseEntity): Promise<void> {
    const table_name = obj[Table_Name_KEY]
    let sql_str = 'Insert into ' + table_name + ' Values '
    const keys = Reflect.ownKeys(obj)
    sql_str += this.getAddOneSql(obj, keys as string[])
    sql_str += ';'
    return this._runSql(sql_str)
  }

  private getWhreSql(obj: BaseEntity, where: WhereDef): string {
    let sql_str = ''
    Object.keys(where).every((val, indx, _) => {
      const col_value = this.getColumnValue(obj, val, where[val])
      if (col_value) {
        sql_str += ` ${val}=${col_value}`
        if (indx < Object.keys(where).length - 1) {
          sql_str += where.andor
        }
      }
      return true
    })
    return sql_str
  }

  public GetOne<T extends BaseEntity>(obj: T, where: WhereDef): Promise<T[]> {
    const table_name = obj[Table_Name_KEY]
    let sql_str = `select * from ${table_name} where `
    sql_str += this.getWhreSql(obj, where)
    sql_str += ' limit 1'
    return this._runSqlWithResult(obj, sql_str, `get:${table_name}`)
  }

  public GetAll<T extends BaseEntity>(obj: T, where: WhereDef): Promise<T[]> {
    const table_name = obj[Table_Name_KEY]
    let sql_str = `select * from ${table_name} `
    if (where) sql_str += this.getWhreSql(obj, where)
    return this._runSqlWithResult(obj, sql_str, `get:${table_name}`)
  }

  public GetTotalCount(obj: BaseEntity, where: WhereDef): Promise<number> {
    const table_name = obj[Table_Name_KEY]
    let keystr = 'count(*)'
    let sql_str = `select ${keystr} from ${table_name} where `
    sql_str += this.getWhreSql(obj, where)
    return new Promise((resolve, reject) => {
      let conn = this.getconnection()
      conn.all(sql_str, (err, rows) => {
        if (err) {
          reject(new Error(err.message))
        } else {
          resolve(rows[0][keystr])
        }
      })
    })
  }

  public async SearchAll<T extends BaseEntity>(obj: T, where: WhereDef): Promise<T[]> {
    const total_num = await this.GetTotalCount(obj, where)
    if (total_num == 0) return []
    const table_name = obj[Table_Name_KEY]
    let sql_str = `select count(*) from ${table_name} where `
    sql_str += this.getWhreSql(obj, where)
    if (where.page_size && where.page) {
      const offset = where.page_size * (where.page - 1)
      sql_str += ` limit ${where.page_size} offset ${offset}`
    }
    return this._runSqlWithResult(obj, sql_str, `search:${table_name}`)
  }

  public InitTables() {
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
