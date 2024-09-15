import { ControlKey } from '@common/gloabl'
import { DefaultPasswordTypeConf, GenPasswordType, PasswordTypeInfo } from './password.entity'
import { Column, Entity } from '@common/decorator/db.decorator'
import { BaseEntity } from './db.entity'

@Entity({ name: 'app' })
export class AppEntity extends BaseEntity {
  @Column({ type: 'VARCHAR' })
  app_set: string | object
}

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
  //aliyun
  aliyun_err = 100,
  alyun_not_auth = 101,
  aliyun_file_exit = 102,
  aliyun_upload_err = 103,

  //common
  other_err = 205,
  db_err = 206,
  unkonw = 207
}

export interface UserSetInfo {
  normal_autolock_time: number //自动锁定时间,单位分钟
  normal_lock_with_pc: boolean //电脑锁定，软件也锁定
  normal_lang_set: string //语言设置,
  normal_autoupdate: boolean //自动更新
  normal_poweron_open: boolean //开机自启
  shortcut_global_quick_find: string //全局快捷键，快速查找
  shortcut_global_quick_lock: string //全局快捷键，快速锁定
  shortcut_global_open_main: string //全局快捷键，快速锁定
  shortcut_global_hide_main: string //全局快捷键，隐藏主窗口
  shortcut_global_show_password: string //全局快捷键，显示密码窗口
  shortcut_local_find: string //本地快捷键，查找
  password_type: GenPasswordType //密码生成类型
  password_type_conf: PasswordTypeInfo //密码生成配置
}

export const defaultUserSetInfo: UserSetInfo = {
  normal_autolock_time: 5,
  normal_lock_with_pc: true,
  normal_lang_set: 'zh-cn',
  normal_autoupdate: true,
  normal_poweron_open: true,
  shortcut_global_quick_find: `${ControlKey.ctrl}+ ${ControlKey.Shift}+Q`,
  shortcut_global_quick_lock: `${ControlKey.ctrl}+ ${ControlKey.Shift}+L`,
  shortcut_global_open_main: `${ControlKey.ctrl}+ ${ControlKey.Shift}+Up`,
  shortcut_global_hide_main: `${ControlKey.ctrl}+ ${ControlKey.Shift}+Down`,
  shortcut_global_show_password: `${ControlKey.ctrl}+ ${ControlKey.Shift}+P`,
  shortcut_local_find: `${ControlKey.ctrl}+F`,
  password_type: GenPasswordType.random,
  password_type_conf: DefaultPasswordTypeConf
}

export enum renderViewType {
  Mainview = 'mainview',
  Quickview = 'quickview',
  Password = 'password'
}

let gloabl_curViewType: renderViewType = renderViewType.Mainview

export function InitCurViewType(viewtype: renderViewType) {
  gloabl_curViewType = viewtype
}

export function GetCurViewType() {
  return gloabl_curViewType
}

export enum EntityType {
  user = 'user',
  vault = 'vault',
  vault_item = 'vault_item'
}
