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
  icon_del = 'icon-delete',
  icon_fold = 'icon-fold'
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

export enum ConsoleColor {
  Reset = '\x1b[0m',
  Bright = '\x1b[1m',
  Dim = '\x1b[2m',
  Underscore = '\x1b[4m',
  Blink = '\x1b[5m',
  Reverse = '\x1b[7m',
  Hidden = '\x1b[8m',

  FgBlack = '\x1b[30m',
  FgRed = '\x1b[31m',
  FgGreen = '\x1b[32m',
  FgYellow = '\x1b[33m',
  FgBlue = '\x1b[34m',
  FgMagenta = '\x1b[35m',
  FgCyan = '\x1b[36m',
  FgWhite = '\x1b[37m',
  FgGray = '\x1b[90m',

  BgBlack = '\x1b[40m',
  BgRed = '\x1b[41m',
  BgGreen = '\x1b[42m',
  BgYellow = '\x1b[43m',
  BgBlue = '\x1b[44m',
  BgMagenta = '\x1b[45m',
  BgCyan = '\x1b[46m',
  BgWhite = '\x1b[47m',
  BgGray = '\x1b[100m'
}
