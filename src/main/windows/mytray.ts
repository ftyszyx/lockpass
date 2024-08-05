import { UserSetInfo } from '@common/entitys/app.entity'
import { LangHelper } from '@common/lang'
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
  }

  public updateMenu(setinfo: UserSetInfo) {
    const contextmenu = Menu.buildFromTemplate([
      {
        label:
          LangHelper.getString('tray.menu.openlockpass') +
          `${setinfo ? setinfo.shortcut_global_open_main : ''}`,
        click: () => {
          AppModel.getInstance().mainwin.show()
        }
      },
      {
        label:
          LangHelper.getString('tray.menu.openquick') +
          `${setinfo ? setinfo.shortcut_global_quick_find : ''}`,
        click: () => {
          AppModel.getInstance().quickwin.show()
        }
      },
      {
        type: 'separator'
      },
      {
        label:
          LangHelper.getString('tray.menu.lock') +
          `${setinfo ? setinfo.shortcut_global_quick_lock : ''}`,
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
