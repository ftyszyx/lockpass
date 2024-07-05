import { ipcMain } from 'electron'
import AppModel from '../models/app.model'
import { webToManMsg } from '../../common/entitys/ipcmsg.entity'
import { InitKeyInfo } from '@common/entitys/app.entity'
export function initAllApi() {
  ipcMain.handle(webToManMsg.needInitKey, (_) => {
    return AppModel.getInstance().myencode?.needInitKey()
  })
  ipcMain.handle(webToManMsg.initKey, async (_, info: InitKeyInfo) => {
    return await AppModel.getInstance().myencode?.InitSystem(info)
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
  ipcMain.handle(webToManMsg.DeleteValut, async (_, valut) => {
    return await AppModel.getInstance().vault?.DeleteOne(valut.id)
  })
  ipcMain.handle(webToManMsg.DeleteValutItem, async (_, valutItem) => {
    return await AppModel.getInstance().vaultItem?.DeleteOne(valutItem.id)
  })
  ipcMain.handle(webToManMsg.UpdateValut, async (_, valut) => {
    return await AppModel.getInstance().vault?.UpdateOne(valut)
  })
  ipcMain.handle(webToManMsg.updateValutItem, async (_, valutItem) => {
    return await AppModel.getInstance().vaultItem?.UpdateOne(valutItem)
  })
}
