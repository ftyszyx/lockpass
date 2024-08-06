import { EntityType, UserSetInfo } from '@common/entitys/app.entity'
import { LangHelper } from '@common/lang'
import { AppEvent, AppEventType } from '@main/entitys/appmain.entity'
import AppModel from '@main/models/app.model'
import { app, Menu, Tray } from 'electron'
import path from 'path'

export class MyTray {
  private tray: Electron.Tray

  constructor() {
    this.tray = new Tray(path.join(__dirname, '../../resources/icon.png'))
    this.tray.setToolTip('passlock')
    this.updateMenu(null)
    this.tray.on('double-click', () => {
      const mainwin = AppModel.getInstance().mainwin
      if (mainwin.isvisible) {
        mainwin.hide()
      } else {
        mainwin.show()
      }
    })
    // AppEvent.on(AppEventType.LoginOk, () => {
    //   this.updateMenu(AppModel.getInstance().curUserInfo().user_set as UserSetInfo)
    // })
    // AppEvent.on(AppEventType.DataChange, (type) => {
    //   if (type == EntityType.user) {
    //     this.updateMenu(AppModel.getInstance().curUserInfo().user_set as UserSetInfo)
    //   }
    // })
  }

  public updateMenu(setinfo: UserSetInfo) {
    const contextmenu = Menu.buildFromTemplate([
      {
        label: LangHelper.getString('tray.menu.openlockpass'),
        click: () => {
          AppModel.getInstance().mainwin.show()
        }
      },
      {
        label: LangHelper.getString('tray.menu.openquick'),
        click: () => {
          AppModel.getInstance().quickwin.show()
        }
      },
      {
        type: 'separator'
      },
      {
        label: LangHelper.getString('tray.menu.lock').padEnd(30),
        click: () => {
          AppModel.getInstance().LockApp()
        }
      },
      {
        label: LangHelper.getString('tray.menu.quit'),
        click: () => {
          app.quit()
        }
      }
    ])
    this.tray.setContextMenu(contextmenu)
  }
}
