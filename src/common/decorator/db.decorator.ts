import 'reflect-metadata'
import { Table_Desc, Column_desc, Table_index_desc } from '@common/gloabl'
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
  | 'ARRAY'
  | 'LIST'
  | 'MAP'
  | 'STRUCT'
  | 'UNION'

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
    Reflect.defineMetadata('col_name', col_name, object, propertyName)
    for (let key in options) {
      Reflect.defineMetadata(key, options[key], object, propertyName)
    }
  }
}

export function Entity(options: TableOptions): ClassDecorator {
  return function (target: any) {
    if (!options) options = {} as TableOptions
    const table_name = options.name || target.name
    let table_desc = `CREATE TABLE IF NOT EXISTS ${table_name} (`
    let index_desc = ''
    for (let key in target) {
      const col_def = Reflect.getMetadata(Column_desc, target, key)
      if (col_def) {
        table_desc += col_def + ','
      }
      const index_name = Reflect.getMetadata('index_name', target, key)
      const col_name = Reflect.getMetadata('col_name', target, key)
      if (index_name) {
        const unique_index = Reflect.getMetadata('unique_index', target, key)
        index_desc += `CREATE ${unique_index ? 'UNIQUE' : ''} INDEX ${index_name} ON ${table_name} (${col_name});\n`
      }
    }
    table_desc += ');'
    index_desc += ';'
    Reflect.defineMetadata(Table_Desc, table_desc, target)
    Reflect.defineMetadata(Table_index_desc, index_desc, target)
  }
}
