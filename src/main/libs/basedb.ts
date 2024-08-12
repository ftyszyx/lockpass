import { Log } from './log'
import { COlumn_Encode_key, Column_Name_KEY, Column_Type_KEY, Table_Name_KEY } from '@common/gloabl'
import { BaseEntity, WhereDef } from '@common/entitys/db.entity'
import { ColumnType } from '@common/decorator/db.decorator'
import AppModel from '@main/models/app.model'

export class BaseDb {
  public show_log: boolean = false
  // Add a comment to explain the purpose of the empty constructor
  constructor() {
    // Empty constructor
  }

  protected async run(_: string): Promise<void> {
    return Promise.resolve()
  }
  protected async all(_: string): Promise<any[]> {
    return Promise.resolve([])
  }
  protected each(_: string): Promise<any> {
    return Promise.resolve()
  }

  protected encode_table_str(obj: BaseEntity, key: string, value: any): string {
    if (value == undefined || value == null || value == '') return value
    const col_type: ColumnType = Reflect.getMetadata(Column_Type_KEY, obj, key)
    const encode_type = Reflect.getMetadata(COlumn_Encode_key, obj, key)
    if (encode_type) {
      if (col_type == 'VARCHAR' || col_type == 'VARCHAR[]') {
        return AppModel.getInstance().myencode.Encode(value.toString())
      }
    }
    return value
  }

  protected decode_table_str(obj: BaseEntity, key: string, value: any): string {
    if (value == undefined || value == null || value == '') return value
    const col_type: ColumnType = Reflect.getMetadata(Column_Type_KEY, obj, key)
    const encode_type = Reflect.getMetadata(COlumn_Encode_key, obj, key)
    if (encode_type) {
      if (col_type == 'VARCHAR' || col_type == 'VARCHAR[]') {
        return AppModel.getInstance().myencode.Decode(value.toString())
      }
    }
    return value
  }

  protected getColumnValue(obj: BaseEntity, key: string, value: any): string {
    const col_type: ColumnType = Reflect.getMetadata(Column_Type_KEY, obj, key)
    const isprimary = Reflect.getMetadata('primary', obj, key)
    const default_value = Reflect.getMetadata('default', obj, key)
    if (col_type) {
      if (value === undefined || value === null) {
        if (default_value != undefined || default_value != null || isprimary) return undefined
        else return `''`
      } else if (col_type == 'VARCHAR' || col_type == 'VARCHAR[]') {
        const res = value.toString()
        return `'${res}'`
      } else {
        return `${value.toString()}`
      }
    }
    return null
  }

  protected getAddOneSql(obj: BaseEntity, keys: string[]): string {
    let sql_str = ''
    const key_arr = []
    const value_arr = []
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      let element = obj[key]
      element = this.encode_table_str(obj, key, element)
      const col_value = this.getColumnValue(obj, key, element)
      if (col_value !== null && col_value !== undefined) {
        key_arr.push(key)
        value_arr.push(col_value)
      }
    }
    sql_str += ` (${key_arr.join(',')}) values (${value_arr.join(',')}) `
    return sql_str
  }

  protected getupdateOneSql(entity: BaseEntity, obj_old: any, obj: any, keys: string[]): string {
    let sql_str = ''
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      let element = obj[key]
      const old_value = obj_old[key]
      if (element == undefined || element == null) continue
      element = this.encode_table_str(entity, key, element)
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

  protected async _exesql(sql_str: string): Promise<void> {
    if (this.show_log) Log.info('exesql:', sql_str)
    await this.run(sql_str)
  }

  private async _runSql(sql_str: string): Promise<void> {
    if (this.show_log) Log.info('runsql:', sql_str)
    await this.run(sql_str)
  }

  private _runSqlWithResult<T>(obj: BaseEntity, sql_str: string): Promise<T[]> {
    return this._runSqlWithResult2(obj.constructor as new (...args: any[]) => T, obj, sql_str)
  }

  private async _runSqlWithResult2<T>(
    obj_type: new (...args: any[]) => T,
    obj: BaseEntity,
    sql_str: string
  ): Promise<T[]> {
    const keys = Reflect.ownKeys(obj) as string[]
    if (this.show_log) Log.info('runsql:', sql_str)
    const rows = await this.all(sql_str)
    const res: T[] = []
    for (let i = 0; i < rows.length; i++) {
      const item = new obj_type()
      for (let j = 0; j < keys.length; j++) {
        const key = keys[j]
        const col_name = Reflect.getMetadata(Column_Name_KEY, obj, key)
        if (col_name) {
          const col_value = rows[i][col_name]
          if (col_value == undefined || col_value == null) continue
          item[key] = this.decode_table_str(obj, key, col_value)
        }
      }
      res.push(item)
    }
    return res
  }

  public async DelOne(obj: BaseEntity, key: string, value: string | number): Promise<void> {
    const table_name = obj[Table_Name_KEY]
    const encode_value = this.encode_table_str(obj, key, value)
    const col_value = this.getColumnValue(obj, key, encode_value)
    const sql_str = `delete from ${table_name} where ${key}=${col_value}`
    return await this._runSql(sql_str)
  }

  public async UpdateOne(entity: BaseEntity, obj_old: any, obj: any): Promise<void> {
    const table_name = entity[Table_Name_KEY]
    if (!obj.id) {
      Log.error('update entity id is null')
      return Promise.reject(new Error('update entity id is null'))
    }
    let sql_str = 'update ' + table_name + ' set '
    const keys = Reflect.ownKeys(entity)
    keys.splice(keys.indexOf('id'), 1)
    const update_sql = this.getupdateOneSql(entity, obj_old, obj, keys as string[])
    if (update_sql.trim().length == 0) {
      Log.info('no update value')
      return
    }
    sql_str += update_sql
    sql_str += ` where id=${obj.id}`
    return await this._exesql(sql_str)
  }

  public async AddList(objs: BaseEntity[]): Promise<void> {
    if (objs.length == 0) return
    const obj = objs[0]
    const table_name = obj[Table_Name_KEY]
    let sql_str = 'BEGIN TRANSACTION;\n'
    sql_str += 'Insert into ' + table_name
    const keys = Reflect.ownKeys(obj)
    for (let i = 0; i < objs.length; i++) {
      const obj = objs[i]
      sql_str += this.getAddOneSql(obj, keys as string[])
      if (i < objs.length - 1) {
        sql_str += ',\n'
      }
    }
    sql_str += ';\n'
    sql_str += 'COMMIT;'
    return await this._runSql(sql_str)
  }

  public async beginTransaction() {
    await this._runSql('BEGIN TRANSACTION;')
  }

  public async commitTransaction() {
    await this._runSql('COMMIT;')
  }

  public async rollbackTransaction() {
    await this._runSql('ROLLBACK;')
  }

  public async abortTransaction() {
    await this._runSql('ABORT;')
  }

  public AddOne(obj: BaseEntity): Promise<void> {
    const table_name = obj[Table_Name_KEY]
    let sql_str = ''
    sql_str += 'Insert into ' + table_name
    const keys = Reflect.ownKeys(obj)
    sql_str += this.getAddOneSql(obj, keys as string[])
    sql_str += ';'
    return this._runSql(sql_str)
  }

  private getWhreSql(obj: BaseEntity, where: WhereDef<BaseEntity>): string {
    let sql_str = ''
    Object.keys(where.cond).every((key, indx, _) => {
      let search_val = where.cond[key]
      if (search_val == undefined || search_val == null)
        throw new Error(`search value is null key:${key}`)
      search_val = this.encode_table_str(obj, key, search_val)
      const col_value = this.getColumnValue(obj, key, search_val)
      if (col_value) {
        sql_str += ` ${key}=${col_value}`
        if (indx < Object.keys(where).length - 1) {
          sql_str += where.andor
        }
      }
      return true
    })
    return sql_str
  }

  public GetOne<T extends BaseEntity>(obj: T, where: WhereDef<T>): Promise<T[]> {
    const table_name = obj[Table_Name_KEY]
    let sql_str = `select * from ${table_name} where `
    sql_str += this.getWhreSql(obj, where)
    sql_str += ' limit 1'
    return this._runSqlWithResult(obj, sql_str)
  }

  public GetAll<T extends BaseEntity>(obj: T, where: WhereDef<T>): Promise<T[]> {
    const table_name = obj[Table_Name_KEY]
    let sql_str = `select * from ${table_name}  `
    if (where) {
      sql_str = `${sql_str} where ${this.getWhreSql(obj, where)}`
    }
    return this._runSqlWithResult(obj, sql_str)
  }

  public async GetTotalCount(obj: BaseEntity, where: WhereDef<BaseEntity>): Promise<number> {
    const table_name = obj[Table_Name_KEY]
    const keystr = 'count(*)'
    let sql_str = `select ${keystr} from ${table_name} where `
    sql_str += this.getWhreSql(obj, where)
    if (this.show_log) Log.info('runsql:', sql_str)
    const res = await this.all(sql_str)
    return res[0][keystr]
  }

  public async SearchAll<T extends BaseEntity>(obj: T, where: WhereDef<T>): Promise<T[]> {
    const total_num = await this.GetTotalCount(obj, where)
    if (total_num == 0) return []
    const table_name = obj[Table_Name_KEY]
    let sql_str = `select count(*) from ${table_name} where `
    sql_str += this.getWhreSql(obj, where)
    if (where.page_size && where.page) {
      const offset = where.page_size * (where.page - 1)
      sql_str += ` limit ${where.page_size} offset ${offset}`
    }
    return this._runSqlWithResult(obj, sql_str)
  }

  public async initOneTable(obj: BaseEntity) {
    const table_name = obj[Table_Name_KEY]
    Log.info('init table:', table_name)
    let table_desc = `CREATE TABLE IF NOT EXISTS ${table_name} (\n`
    let index_desc = ''
    const keys = Reflect.ownKeys(obj)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const col_type = Reflect.getMetadata(Column_Type_KEY, obj, key)
      const col_name = Reflect.getMetadata(Column_Name_KEY, obj, key)
      const isprimary = Reflect.getMetadata('primary', obj, key)
      if (!col_type) continue
      table_desc += `${col_name} ${col_type}`
      if (isprimary) {
        table_desc += ' PRIMARY KEY autoincrement'
      }
      const default_value = Reflect.getMetadata('default', obj, key)
      if (default_value != undefined || default_value != null) {
        table_desc += ` DEFAULT '${default_value}' `
      }
      if (Reflect.getMetadata('unique', obj, key)) {
        table_desc += ' UNIQUE'
      }
      if (Reflect.getMetadata('notNull', obj, key)) {
        table_desc += ' NOT NULL'
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
    const sql_str = table_desc + '\n' + index_desc
    if (this.show_log) Log.info('runsql:', sql_str)
    await this.run(sql_str)
  }
}
