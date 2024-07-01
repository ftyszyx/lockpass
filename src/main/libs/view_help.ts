import { MainToWebMsg } from '@common/entitys/ipcmsg.entity'
import { BrowserWindow } from 'electron'

export class MainViewHelper {
  constructor(public mainWindow: BrowserWindow) {}
  public showMsgErr(msg: string, duration: number = 3000) {
    console.log('show err')
    this.mainWindow?.webContents.send(MainToWebMsg.ShowErrorMsg, msg, duration)
  }
  public showMsgInfo(msg: string, duration: number = 3000) {
    this.mainWindow?.webContents.send(MainToWebMsg.ShowInfoMsg, msg, duration)
  }
  public sendmsg(event: string, ...args: any[]) {
    this.mainWindow?.webContents.send(event, ...args)
  }
}
