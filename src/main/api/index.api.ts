import { ipcMain } from 'electron'
import AppModel from '../models/app.model'
import { webToManMsg } from '../../common/entitys/ipcmsg.entity'
import { InitKeyInfo } from '@common/entitys/app.entity'
export function initAllApi() {
  ipcMain.handle(webToManMsg.needInitKey, (_) => {
    return AppModel.getInstance().myencode?.needInitKey()
  })
  ipcMain.handle(webToManMsg.initKey, async (_, info: InitKeyInfo) => {
    return await AppModel.getInstance().myencode?.InitSecretkey(info)
  })
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

  ipcMain.handle(webToManMsg.getAllUser, async () => {
    return await AppModel.getInstance().user?.GetAll()
  })

  ipcMain.handle(webToManMsg.SelectAsUser, async (_, username) => {
    return await AppModel.getInstance().user.SelectOne?(username)
  }) 
}
