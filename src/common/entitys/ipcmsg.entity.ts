export enum webToManMsg {
  SetLang = 'setLang',
  GetLang = 'getLang',
  //user
  Login = 'Login',
  isLogin = 'isLogin',
  Register = 'Register',
  HasLogin = 'HasLogin',
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
  UnLockApp = 'UnLockApp'
}

export enum MainToWebMsg {
  ShowErrorMsg = 'ShowError',
  ShowInfoMsg = 'ShowInfoMsg',
  LockApp = 'lockApp',
  UnlockApp = 'UnLockApp'
}
