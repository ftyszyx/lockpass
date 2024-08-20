export enum webToManMsg {
  SetLang = 'setLang',
  GetLang = 'getLang',
  //user
  Login = 'Login',
  getCurUserInfo = 'getCurUserInfo',
  isLogin = 'isLogin',
  Register = 'Register',
  Logout = 'Logout',
  getAllUser = 'getAllUser',
  GetLastUserInfo = 'getLastUser',
  UpdateUser = 'UpdateUser',

  //valut
  GetAllValuts = 'GetAllValuts',
  UpdateValut = 'UpdateValut',
  DeleteValut = 'DeleteValut',
  AddValut = 'AddValut',

  //vaultItem
  GetAllValutItems = 'GetAllValutItems',
  updateValutItem = 'updateValutItem',
  DeleteValutItem = 'DeleteValutItem',
  AddValutItem = 'AddValutItem',

  //other
  ResizeWindow = 'ResizeWindow',
  isLock = 'isLock',
  LockApp = 'LockApp',
  UnLockApp = 'UnLockApp',
  IsSystemInit = 'IsSystemInit',
  AutoFill = 'AutoFill',
  ShortCutKeyChange = 'ShortCutKeyChange',
  CheckShortKey = 'CheckShortKey',
  getMousePos = 'getMousePos',
  showWindows = 'showWindows',
  ShowVaultItem = 'ShowItem',
  UpdateTrayMenu = 'UpdateTrayMenu',
  Backup_local = 'BackupFromLocal',
  Recover_local = 'RestoreFromLocal',
  Backup_alidrive = 'BackupFromAliDrive',
  Recover_alidrive = 'RestoreFromAliDrive',
  GetAllBackups_alidrive = 'GetAllBackupsFromAliDrive',
  QuitAPP = 'QuitAPP',
  RestartApp = 'RestartApp',
  CloseDb = 'CloseDb',
  OpenDb = 'OpenDb'
}

export enum MainToWebMsg {
  ShowMsg = 'ShowMsg',
  ShowMsgMain = 'ShowMsgMain',
  LockApp = 'lockApp',
  LoginOK = 'LoginOk',
  LoginOut = 'LoginOut',
  UserChange = 'userchange',
  VaultChange = 'vaultchange',
  vaultItemChange = 'vaultItemChange',
  DataChange = 'DataChange',
  ShowVaulteItem = 'ShowVaulteItem',
  AliyunAuthOk = 'AliyunAuthOk'
}
