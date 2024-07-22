export enum webToManMsg {
  SetLang = 'setLang',
  GetLang = 'getLang',
  needInitKey = 'needInitKey',
  initKey = 'initKey',

  getAllUser = 'getAllUser',
  SelectAsUser = 'Login',

  GetAllValuts = 'GetAllValuts',
  UpdateValut = 'UpdateValut',
  DeleteValut = 'DeleteValut',
  AddValut = 'AddValut',

  GetAllValutItems = 'GetAllValutItems',
  updateValutItem = 'updateValutItem',
  DeleteValutItem = 'DeleteValutItem',
  AddValutItem = 'AddValutItem'
}

export enum MainToWebMsg {
  ShowErrorMsg = 'ShowError',
  ShowInfoMsg = 'ShowInfoMsg'
}
