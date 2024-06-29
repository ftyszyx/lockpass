import 'reflect-metadata'
import { Table_Desc, Column_desc, Table_index_desc, Column_Name } from '@common/gloabl'
import { BaseEntity } from '@common/entitys/db.entity'
export type ColumnType =
  | 'BIGINT' //   signed eight-byte integer
  | 'INT' //string of 1s and 0s
  | 'BLOB' //variable-length binary data
  | 'BOOLEAN' //ogical boolean (true/false)
  | 'DATE' //calendar date (year, month day)
  | 'DOUBLE' //double precision floating-point number
  | 'INTEGER' //signed four-byte integer
  | 'HUGEINT' //signed sixteen-byte integer
  | 'REAL' //single precision floating-point number
  | 'SMALLINT' //signed two-byte integer
  | 'TIME' //time of day (no time zone)
  | 'TIMESTAMP WITH TIME ZONE' //
  | 'TIMESTAMP'
  | 'TINYINT'
  | 'UBIGINT'
  | 'UHUGEINT'
  | 'UINTEGER'
  | 'USMALLINT'
  | 'UUID'
  | 'VARCHAR'
  //compose type
  | 'INTEGER[]'
  | 'VARCHAR[]'

export interface ColumnOptions {
  type?: ColumnType
  name?: string
  default?: any
  primary?: boolean
  unique?: boolean
  unique_index?: boolean
  index_name?: string
}

export interface TableOptions {
  name?: string
}

export function Column(options: ColumnOptions): PropertyDecorator {
  return function (object: Object, propertyName: string | symbol) {
    if (!options) options = {} as ColumnOptions
    const col_name = options.name || propertyName.toString()
    const col_type = options.type || 'VARCHAR'
    let col_def = `${col_name} ${col_type}`
    if (options.primary) {
      col_def += ' PRIMARY KEY'
    }
    if (options.default) {
      col_def += ` DEFAULT ${options.default}`
    }
    if (options.unique) {
      col_def += ' UNIQUE'
    }
    Reflect.defineMetadata(Column_desc, col_def, object, propertyName)
    Reflect.defineMetadata(Column_Name, col_name, object, propertyName)
    for (let key in options) {
      Reflect.defineMetadata(key, options[key], object, propertyName)
    }
  }
}

export function Entity(options: TableOptions): ClassDecorator {
  return function (target) {
    if (!options) options = {} as TableOptions
    const table_name = options.name || target.name
    target.prototype.table_name = table_name
  }
}
