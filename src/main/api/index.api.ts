import { ipcMain, BrowserWindow, session } from 'electron'
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
}
