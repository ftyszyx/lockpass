import { BrowserWindow, session } from 'electron'
import path from 'path'
import fs from 'fs'

class AppModel {
  mainWindow: BrowserWindow | null = null
  secret_key: string | null = null
  constructor() {
    let key_path = path.join(__dirname, 'secret.key')
    if (fs.existsSync(key_path)) {
      this.secret_key = fs.readFileSync(key_path).toString()
    }
  }
  private static instance: AppModel
  public static getInstance() {
    if (!AppModel.instance) {
      AppModel.instance = new AppModel()
    }
    return AppModel.instance
  }

  public needInitKey() {
    return this.secret_key === null
  }

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

export default AppModel
