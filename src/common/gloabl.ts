export const Table_Desc_KEY = 'table_desc'
export const Table_index_desc_KEY = 'index_desc'
export const Column_desc_KEY = 'col_desc'
export const Column_Name_KEY = 'col_name'
export const Column_Type_KEY = 'col_type'
export const Table_Name_KEY = 'table_name'

export function createInstance<T>(type: new (...args: any[]) => T, ...args: any[]): T {
  return new type(...args)
}

export enum Icon_type {
  icon_money = 'icon-money',
  icon_doc = 'icon-doc',
  icon_money1 = 'icon-money1',
  icon_personal = 'icon-personal',
  icon_lock = 'icon-lock',
  icon_money2 = 'icon-money2',
  icon_lock2 = 'icon-lock2',
  icon_card = 'icon-card',
  icon_chrome = 'icon-chrome',
  icon_eye_fill = 'icon-eye-fill',
  icon_eyeclose_fill = 'icon-eyeclose-fill'
}

export enum ModalType {
  Add = 'add',
  Edit = 'edit'
}
