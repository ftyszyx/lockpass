export const Table_Desc_KEY = 'table_desc'
export const Table_index_desc_KEY = 'index_desc'
export const Column_desc_KEY = 'col_desc'
export const Column_Name_KEY = 'col_name'
export const Column_Type_KEY = 'col_type'
export const Table_Name_KEY = 'table_name'

export function createInstance<T>(type: new (...args: any[]) => T, ...args: any[]): T {
  return new type(...args)
}
