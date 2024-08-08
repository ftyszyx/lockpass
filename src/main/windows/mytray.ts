import { EntityType, UserSetInfo } from '@common/entitys/app.entity'
import { LangHelper } from '@common/lang'
import { AppEvent, AppEventType } from '@main/entitys/appmain.entity'
import { getStrWidth } from '@main/libs/str'
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

  getLabelStr(label: string, value: string = ''): string {
    value = (value || '').trim()
    if (value.length <= 0) return label
    const labelWidth = getStrWidth(label)
    const targetwidth = 15
    const padwidth = targetwidth - labelWidth
    if (padwidth <= 0) return label + value
    const res = label + 'A'.repeat(padwidth) + value
    console.log('res', res)
    return res
  }

  getLabelStr2(key: string, tryinfo: Record<string, string> | null) {
    if (tryinfo == null) return LangHelper.getString(`tray.menu.${key}`)
    return tryinfo[key] || LangHelper.getString(`tray.menu.${key}`)
  }

  public updateMenu(tryinfo: Record<string, string> | null) {
    const contextmenu = Menu.buildFromTemplate([
      {
        label: this.getLabelStr2('openlockpass', tryinfo),
        click: () => {
          AppModel.getInstance().mainwin.show()
        }
      },
      {
        label: this.getLabelStr2('openquick', tryinfo),
        click: () => {
          AppModel.getInstance().quickwin.show()
        }
      },
      {
        type: 'separator'
      },
      {
        label: this.getLabelStr2('lock', tryinfo),
        click: () => {
          AppModel.getInstance().LockApp()
        }
      },
      {
        label: this.getLabelStr(LangHelper.getString('tray.menu.quit')),
        click: () => {
          app.quit()
        }
      }
    ])
    this.tray.setContextMenu(contextmenu)
  }
}
