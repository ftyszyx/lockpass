import { AppEvent, AppEventType } from '@main/entitys/appmain.entity'
import { WindowBase } from './window.base'
import { MainToWebMsg } from '@common/entitys/ipcmsg.entity'
import { Log } from '@main/libs/log'
import { app } from 'electron'
import { APP_NAME } from '@common/gloabl'
import { is } from '@electron-toolkit/utils'
import { renderViewType } from '@common/entitys/app.entity'
import AppModel from '@main/models/app.model'
export class MainWindow extends WindowBase {
  constructor() {
    super(renderViewType.Mainview)
    this.url = 'index.html'
    this.title = `${APP_NAME}-${app.getVersion()}-${is.dev ? 'dev' : 'release'}`
    this.witdth = AppModel.getInstance().set.set.window_width
    this.height = AppModel.getInstance().set.set.window_height
    console.log('MainWindow', this.title)
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

  winResize(width: number, height: number) {
    Log.info('resize', width, height)
    if (this.win.isFocused()) {
      AppModel.getInstance().set.setWindowSize(width, height)
    }
  }
}
