import AppModel from '@main/models/app.model'
import { app, Menu, Tray } from 'electron'
import path from 'path'

export class MyTray {
  private tray: Electron.Tray

  constructor() {
    this.tray = new Tray(path.join(__dirname, '../../resources/icon.png'))
    this.tray.setToolTip('passlock')
    const contextmenu = Menu.buildFromTemplate([
      {
        label: '显示',
        click: () => {
          AppModel.getInstance().mainwin.show()
        }
      },
      {
        label: '退出',
        click: () => {
          app.quit()
        }
      }
    ])
    this.tray.setContextMenu(contextmenu)
    this.tray.on('double-click', () => {
      const mainwin = AppModel.getInstance().mainwin
      if (mainwin.isvisible) {
        mainwin.hide()
      } else {
        mainwin.show()
      }
    })
  }
}
