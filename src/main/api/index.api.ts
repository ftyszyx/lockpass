import { ipcMain } from 'electron'
import AppModel from '../models/app.model'
import { webToManMsg } from '../../common/entitys/ipcmsg.entity'
export function initAllApi() {
  //system
  ipcMain.handle(webToManMsg.SetLang, (_, lang) => {
    AppModel.getInstance().changeLang(lang)
  })
  ipcMain.handle(webToManMsg.GetLang, () => {
    return AppModel.getInstance().set.lang
  })
  //user
  ipcMain.handle(webToManMsg.Login, async (_, info) => {
    return await AppModel.getInstance().user?.Login(info)
  })
  ipcMain.handle(webToManMsg.Register, async (_, info) => {
    return await AppModel.getInstance().user?.Register(info)
  })
  ipcMain.handle(webToManMsg.HasLogin, async (_) => {
    return await AppModel.getInstance().user?.HasLogin()
  })
  ipcMain.handle(webToManMsg.Logout, async (_) => {
    return await AppModel.getInstance().user?.Logout()
  })
  ipcMain.handle(webToManMsg.getAllUser, async () => {
    return await AppModel.getInstance().user?.GetAll()
  })
  ipcMain.handle(webToManMsg.getLastUser, async () => {
    return await AppModel.getInstance().user?.GetLastUser()
  })
  //valut
  ipcMain.handle(webToManMsg.GetAllValuts, async () => {
    return await AppModel.getInstance().vault?.GetAll()
  })
  ipcMain.handle(webToManMsg.GetAllValutItems, async () => {
    return await AppModel.getInstance().vaultItem?.GetAll()
  })
  ipcMain.handle(webToManMsg.AddValut, async (_, valut) => {
    return await AppModel.getInstance().vault?.AddOne(valut)
  })
  ipcMain.handle(webToManMsg.AddValutItem, async (_, valutItem) => {
    return await AppModel.getInstance().vaultItem?.AddOne(valutItem)
  })
  ipcMain.handle(webToManMsg.DeleteValut, async (_, vault_id) => {
    return await AppModel.getInstance().vault?.DeleteOne(vault_id)
  })
  ipcMain.handle(webToManMsg.DeleteValutItem, async (_, vault_item_id) => {
    return await AppModel.getInstance().vaultItem?.DeleteOne(vault_item_id)
  })
  ipcMain.handle(webToManMsg.UpdateValut, async (_, old_valut, new_valut) => {
    return await AppModel.getInstance().vault?.UpdateOne(old_valut, new_valut)
  })
  ipcMain.handle(webToManMsg.updateValutItem, async (_, old_item, valutItem) => {
    return await AppModel.getInstance().vaultItem?.UpdateOne(old_item, valutItem)
  })
}
