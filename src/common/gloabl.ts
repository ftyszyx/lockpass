//duckdb key
export const Table_Desc_KEY = 'table_desc'
export const Table_index_desc_KEY = 'index_desc'
export const Column_desc_KEY = 'col_desc'
export const Column_Name_KEY = 'col_name'
export const Column_Type_KEY = 'col_type'
export const Table_Name_KEY = 'table_name'
export const COlumn_Encode_key = 'encode'

//global string
export const SYS_TEM_NAME = 'passlock'

export const Default_Lang = 'zh-cn'

export function createInstance<T>(type: new (...args: any[]) => T, ...args: any[]): T {
  return new type(...args)
}

export enum PasswordIconType {
  icon_money = 'icon-money',
  icon_document = 'icon-document',
  icon_note = 'icon-note',
  icon_password = 'icon-password',
  icon_id = 'icon-identity',
  icon_1password = 'icon-1password',
  icon_login = 'icon-login',
  icon_api = 'icon-api_key',
  icon_api2 = 'icon-api_key2',
  icon_money1 = 'icon-money1',
  icon_personal = 'icon-personal',
  icon_lock = 'icon-lock',
  icon_money2 = 'icon-money2',
  icon_lock2 = 'icon-lock2',
  icon_card = 'icon-card',
  icon_chrome = 'icon-chrome'
}

export enum Icon_type {
  icon_money = 'icon-money',
  icon_document = 'icon-document',
  icon_note = 'icon-note',
  icon_password = 'icon-password',
  icon_id = 'icon-identity',
  icon_1password = 'icon-1password',
  icon_login = 'icon-login',
  icon_api = 'icon-api_key',
  icon_api2 = 'icon-api_key2',
  icon_money1 = 'icon-money1',
  icon_personal = 'icon-personal',
  icon_lock = 'icon-lock',
  icon_money2 = 'icon-money2',
  icon_lock2 = 'icon-lock2',
  icon_card = 'icon-card',
  icon_chrome = 'icon-chrome',
  icon_eye_fill = 'icon-eye-fill',
  icon_eyeclose_fill = 'icon-eyeclose-fill',
  icon_set = 'icon-set',
  icon_add = 'icon-add',
  icon_log = 'icon-log',
  icon_help = 'icon-help',
  icon_user = 'icon-user',
  icon_man = 'icon-man',
  icon_type = 'icon-type',
  icon_type2 = 'icon-type2',
  icon_rank = 'icon-rank',
  icon_del = 'icon-delete'
}

export enum PasswordType {
  Login = 'login',
  Card = 'card',
  NoteBook = 'note'
}

export enum ModalType {
  Add = 'add',
  Edit = 'edit',
  View = 'view'
}
