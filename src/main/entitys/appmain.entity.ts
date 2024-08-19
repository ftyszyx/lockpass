import { EventEmitter } from 'stream'

export enum AppEventType {
  LockApp = 'LockApp',
  windowBlur = 'windowBlur',
  LoginOk = 'LoginOk',
  Message = 'Message',
  MainMessage = 'MainMessage',
  VaultChange = 'VaultChange',
  UserChange = 'UserChange',
  VaultItemChange = 'VaultItemChange',
  DataChange = 'DataChange',
  DeepLink = 'DeepLink',
  AliyuAuthOk = 'AliyuAuthOk'
}
export const AppEvent = new EventEmitter()
