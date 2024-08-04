import { DefaultPasswordTypeConf, GenPasswordType, PasswordTypeInfo } from './password.entity'

export interface ApiResp<T> {
  code: ApiRespCode // 状态，200成功
  data?: T // 返回的数据
  message?: string // 返回的消息
}

export enum ApiRespCode {
  SUCCESS = 200,
  //user
  key_not_found = 1,
  ver_not_match = 2,
  password_err = 3,
  user_notfind = 4,
  user_exit = 5,
  form_err = 6,
  data_not_find = 7,
  update_err = 8,
  //common
  other_err = 205,
  db_err = 206,
  unkonw = 207
}

export interface UserSetInfo {
  normal_autolock_time: number //自动锁定时间,单位分钟
  normal_lock_with_pc: boolean //电脑锁定，软件也锁定
  shortcut_global_quick_find: string //全局快捷键，快速查找
  shortcut_global_quick_lock: string //全局快捷键，快速锁定
  shortcut_local_view_shortcut: string //本地快捷键，查看快捷键
  shortcut_local_find: string //本地快捷键，查找
  password_type: GenPasswordType //密码生成类型
  password_type_conf: PasswordTypeInfo //密码生成配置
}

export const defaultUserSetInfo: UserSetInfo = {
  normal_autolock_time: 5,
  normal_lock_with_pc: true,
  shortcut_global_quick_find: 'ctrl+shift+space',
  shortcut_global_quick_lock: 'ctrl+shift+l',
  shortcut_local_find: 'ctrl+f',
  shortcut_local_view_shortcut: 'ctrl+/',
  password_type: GenPasswordType.random,
  password_type_conf: DefaultPasswordTypeConf
}
