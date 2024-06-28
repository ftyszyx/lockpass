import { BrowserWindow } from 'electron'

export class MainViewHelper {
  constructor(public mainWindow: BrowserWindow) {}
  public showMsgErr(msg: string, duration: number = 3000) {
    this.mainWindow?.webContents.send('ShowMsgErr', msg, duration)
  }
  public showMsgInfo(msg: string, duration: number = 3000) {
    this.mainWindow?.webContents.send('ShowMsgInfo', msg, duration)
  }
  public sendmsg(event: string, ...args: any[]) {
    this.mainWindow?.webContents.send(event, ...args)
  }
}
