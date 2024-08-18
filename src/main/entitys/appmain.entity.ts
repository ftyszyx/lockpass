import { EventEmitter } from 'stream'

export enum AppEventType {
  LockApp = 'LockApp',
  windowBlur = 'windowBlur',
  LoginOk = 'LoginOk',
  Message = 'Message',
  VaultChange = 'VaultChange',
  UserChange = 'UserChange',
  VaultItemChange = 'VaultItemChange',
  DataChange = 'DataChange',
  DeepLink = 'DeepLink'
}
export const AppEvent = new EventEmitter()
