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
    AppEvent.on(AppEventType.APPQuit, () => {
      this.tray.destroy()
    })
  }

  getLabelStr(key: string, tryinfo: Record<string, string> | null) {
    if (tryinfo == null) return LangHelper.getString(`tray.menu.${key}`)
    return tryinfo[key] || LangHelper.getString(`tray.menu.${key}`)
  }

  public updateMenu(tryinfo: Record<string, string> | null) {
    const contextmenu = Menu.buildFromTemplate([
      {
        label: this.getLabelStr('openlockpass', tryinfo),
        click: () => {
          AppModel.getInstance().mainwin.show()
        }
      },
      {
        label: this.getLabelStr('openquick', tryinfo),
        click: () => {
          AppModel.getInstance().quickwin.show()
        }
      },
      {
        label: this.getLabelStr('closemain', tryinfo),
        click: () => {
          AppModel.getInstance().mainwin.hide()
        }
      },
      {
        type: 'separator'
      },
      {
        label: this.getLabelStr('lock', tryinfo),
        click: () => {
          AppModel.getInstance().LockApp()
        }
      },
      {
        label: this.getLabelStr('quit', null),
        click: () => {
          // AppModel.getInstance().Quit()
          app.quit()
        }
      }
    ])
    this.tray.setContextMenu(contextmenu)
  }
}
