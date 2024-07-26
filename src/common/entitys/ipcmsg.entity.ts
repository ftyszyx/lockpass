export enum webToManMsg {
  SetLang = 'setLang',
  GetLang = 'getLang',
  //user
  Login = 'Login',
  Register = 'Register',
  HasLogin = 'HasLogin',
  Logout = 'Logout',
  getAllUser = 'getAllUser',
  GetLastUserInfo = 'getLastUser',

  //valut
  GetAllValuts = 'GetAllValuts',
  UpdateValut = 'UpdateValut',
  DeleteValut = 'DeleteValut',
  AddValut = 'AddValut',

  //vaultItem
  GetAllValutItems = 'GetAllValutItems',
  updateValutItem = 'updateValutItem',
  DeleteValutItem = 'DeleteValutItem',
  AddValutItem = 'AddValutItem'
}

export enum MainToWebMsg {
  ShowErrorMsg = 'ShowError',
  ShowInfoMsg = 'ShowInfoMsg'
}
