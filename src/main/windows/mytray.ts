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
    AppEvent.on(AppEventType.LoginOk, () => {
      this.updateMenu(AppModel.getInstance().curUserInfo().user_set as UserSetInfo)
    })
    AppEvent.on(AppEventType.DataChange, (type) => {
      if (type == EntityType.user) {
        this.updateMenu(AppModel.getInstance().curUserInfo().user_set as UserSetInfo)
      }
    })
  }

  getLabelStr(label: string, value: string = ''): string {
    value = (value || '').trim()
    if (value.length <= 0) return label
    const labelWidth = getStrWidth(label)
    const targetwidth = 25
    const padwidth = targetwidth - labelWidth
    if (padwidth <= 0) return label + value
    const res = label + ' '.repeat(padwidth) + value
    console.log('res', res)
    return res
  }

  public updateMenu(setinfo: UserSetInfo) {
    const contextmenu = Menu.buildFromTemplate([
      {
        label: this.getLabelStr(
          LangHelper.getString('tray.menu.openlockpass'),
          setinfo?.shortcut_global_open_main
        ),
        click: () => {
          AppModel.getInstance().mainwin.show()
        }
      },
      {
        label: this.getLabelStr(
          LangHelper.getString('tray.menu.openquick'),
          setinfo?.shortcut_global_quick_find
        ),
        click: () => {
          AppModel.getInstance().quickwin.show()
        }
      },
      {
        type: 'separator'
      },
      {
        label: this.getLabelStr(
          LangHelper.getString('tray.menu.lock'),
          setinfo?.shortcut_global_quick_lock
        ),
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
