import { ipcMain, BrowserWindow, session } from 'electron'
import AppModel from '../models/app.model'
import { webToManMsg } from '../../common/entitys/ipcmsg.entity'
import { InitKeyInfo } from '@common/entitys/app.entity'
export function initAllApi() {
  ipcMain.handle(webToManMsg.needInitKey, (_) => {
    return AppModel.getInstance().myencode?.needInitKey()
  })
  ipcMain.handle(webToManMsg.initKey, (_, info: InitKeyInfo) => {
    return AppModel.getInstance().myencode?.InitKey(info)
  })
}
