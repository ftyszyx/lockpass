import { AppEvent, AppEventType } from '@main/entitys/appmain.entity'
import { WindowBase } from './window.base'
import { MainToWebMsg } from '@common/entitys/ipcmsg.entity'
import { Log } from '@main/libs/log'
import { app } from 'electron'
import { APP_NAME } from '@common/gloabl'
import { is } from '@electron-toolkit/utils'
import { renderViewType } from '@common/entitys/app.entity'
export class MainWindow extends WindowBase {
  constructor() {
    super(renderViewType.Mainview)
    this.url = 'index.html'
    this.title = `${APP_NAME}-${app.getVersion()}-${is.dev ? 'dev' : 'release'}`
    this.initWin()
    AppEvent.on(AppEventType.MainMessage, (msagetype, msg, duration) => {
      this.win.webContents.send(MainToWebMsg.ShowMsgMain, msagetype, msg, duration)
    })

    AppEvent.on(AppEventType.UpdateEvent, (type, data) => {
      Log.info('send UpdateEvent to windows', type)
      this.win.webContents.send(MainToWebMsg.AppUpdateEvent, type, data)
    })

    AppEvent.on(AppEventType.VaultChangeNotBackup, (flag) => {
      this.win.webContents.send(MainToWebMsg.VaultChangeNotBackup, flag)
    })
  }
}
