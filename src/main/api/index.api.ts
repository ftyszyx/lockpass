import { ipcMain, BrowserWindow, session } from 'electron'
import AppModel from '../models/app.model'
import { webToManMsg } from '../../common/entitys/ipcmsg.entity'
export function initAllApi() {
  ipcMain.handle(webToManMsg.needInitKey, (_) => {
    return AppModel.getInstance().needInitKey()
  })
}
