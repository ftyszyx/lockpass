import { AppEvent, AppEventType } from '@main/entitys/appmain.entity'
import { WindowBase } from './window.base'
import { MainToWebMsg } from '@common/entitys/ipcmsg.entity'
import { Log } from '@main/libs/log'

export class MainWindow extends WindowBase {
  constructor() {
    super()
    this.url = 'index.html'
    this.initWin()

    AppEvent.on(AppEventType.MainMessage, (msagetype, msg, duration) => {
      this.win.webContents.send(MainToWebMsg.ShowMsgMain, msagetype, msg, duration)
    })

    AppEvent.on(AppEventType.UpdateEvent, (type, data) => {
      Log.info('send UpdateEvent to windows', type)
      this.win.webContents.send(MainToWebMsg.UpdateEvent, type, data)
    })
  }
}
