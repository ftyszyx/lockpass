import { EventEmitter } from 'stream'

export enum AppEventType {
  LockApp = 'LockApp',
  windowBlur = 'windowBlur',
  LoginOk = 'LoginOk',
  LoginOut = 'LoginOut',
  Message = 'Message',
  MainMessage = 'MainMessage',
  VaultChange = 'VaultChange',
  UserChange = 'UserChange',
  VaultItemChange = 'VaultItemChange',
  DataChange = 'DataChange',
  DeepLink = 'DeepLink',
  AliyuAuthOk = 'AliyuAuthOk',
  APPQuit = 'APPQuit',
  LangChange = 'LangChange',
  SystemLock = 'SystemLock'
}
export const AppEvent = new EventEmitter()
