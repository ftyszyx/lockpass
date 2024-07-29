import { ipcMain } from 'electron'
import AppModel from '../models/app.model'
import { webToManMsg } from '../../common/entitys/ipcmsg.entity'
import { WhereDef } from '@common/entitys/db.entity'
import { Vault } from '@common/entitys/vault.entity'
import { VaultItem } from '@common/entitys/vault_item.entity'

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
  ipcMain.handle(webToManMsg.GetLastUserInfo, async () => {
    return await AppModel.getInstance().user?.GetLastUserInfo()
  })
  //valut
  ipcMain.handle(webToManMsg.GetAllValuts, async (_, cond: WhereDef<Vault>) => {
    return await AppModel.getInstance().vault?.FindAll(cond)
  })
  ipcMain.handle(webToManMsg.GetAllValutItems, async (_, cond: WhereDef<VaultItem>) => {
    return await AppModel.getInstance().vaultItem?.FindAll(cond)
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
  ipcMain.handle(webToManMsg.UpdateValut, async (_, new_valut) => {
    return await AppModel.getInstance().vault?.UpdateOne(new_valut)
  })
  ipcMain.handle(webToManMsg.updateValutItem, async (_, valutItem) => {
    return await AppModel.getInstance().vaultItem?.UpdateOne(valutItem)
  })
}
