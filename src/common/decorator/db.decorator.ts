import 'reflect-metadata'
import { Column_Name_KEY, Column_Type_KEY } from '@common/gloabl'
export type ColumnType =
  | 'BIGINT' //   signed eight-byte integer
  | 'INT' //string of 1s and 0s
  | 'BLOB' //variable-length binary data
  | 'BOOLEAN' //ogical boolean (true/false)
  | 'DATE' //calendar date (year, month day)
  | 'DOUBLE' //double precision floating-point number
  | 'TIMESTAMP'
  | 'TINYINT'
  | 'INTEGER'
  | 'VARCHAR'
  | 'VARCHAR[]'

//compose type

export type ColumnTypeCatgory = 'number' | 'string' | 'boolean' | 'object' | 'array'

export function getColumTypeCategory(type: ColumnType): ColumnTypeCatgory {
  if (
    type == 'BIGINT' ||
    type == 'INT' ||
    type == 'DOUBLE' ||
    type == 'TINYINT' ||
    type == 'INTEGER'
  ) {
    return 'number'
  }
  if (type == 'VARCHAR') {
    return 'string'
  }
  if (type == 'VARCHAR[]') {
    return 'array'
  }
  if (type == 'BOOLEAN') {
    return 'boolean'
  }
  if (type == 'BLOB') {
    return 'object'
  }
  if (type == 'DATE' || type == 'TIMESTAMP') {
    return 'string'
  }
  return 'object'
}

export interface ColumnOptions {
  comment?: string
  type?: ColumnType
  name?: string
  default?: any
  primary?: boolean
  unique?: boolean
  unique_index?: boolean
  index_name?: string
  hide?: boolean
  encode?: boolean
  notNull?: boolean
}

export interface TableOptions {
  name?: string
}

export function Column(options: ColumnOptions): PropertyDecorator {
  return function (instance: object, propertyName: string | symbol) {
    if (!options) options = {} as ColumnOptions
    const col_name = options.name || propertyName.toString()
    const col_type = options.type || 'VARCHAR'
    Reflect.defineMetadata(Column_Name_KEY, col_name, instance, propertyName)
    Reflect.defineMetadata(Column_Type_KEY, col_type, instance, propertyName)
    for (const key in options) {
      Reflect.defineMetadata(key, options[key], instance, propertyName)
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
