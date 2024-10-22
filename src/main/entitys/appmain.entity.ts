import { EventEmitter } from 'stream'

export enum AppEventType {
  ResizeWindow = 'ResizeWindow',
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
  UpdateEvent = 'UpdateEvent',
  SystemLock = 'SystemLock',
  VaultChangeNotBackup = 'VaultChangeNotBackup',
  DriveLoginOk = 'DriveLoginOk',
  DriveLoginErr = 'DriveLoginErr',
  AppSetChange = 'AppSetChange',
  OpenDev = 'OpenDev',
  OpenLog = 'OpenLog'
}
export const AppEvent = new EventEmitter()
