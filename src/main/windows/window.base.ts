import { BrowserWindow, screen } from 'electron'
import icon from '../../../resources/icon.png?asset'
import path from 'path'
import { is } from '@electron-toolkit/utils'
import { AppEvent, AppEventType } from '@main/entitys/appmain.entity'
import { MainToWebMsg } from '@common/entitys/ipcmsg.entity'
import { EntityType, renderViewType } from '@common/entitys/app.entity'
import { Log } from '@main/libs/log'
import AppModel from '@main/models/app.model'
import { APP_NAME } from '@common/gloabl'
import { AppSetInfo } from '@common/entitys/set.entity'
export class WindowBase {
  protected witdth: number = 900
  protected height: number = 670
  protected click_outsize_close = false
  protected url: string = 'index.html'
  protected resizeable: boolean = true
  protected closeable: boolean = true
  protected haveFrame: boolean = true //是否无边框
  protected ontop: boolean = false
  protected wintype: string = 'normal'
  base_path: string = ''
  protected title: string = APP_NAME.toUpperCase()

  private window: BrowserWindow | null = null

  get content() {
    return this.window.webContents
  }

  get win() {
    return this.window
  }

  get isvisible() {
    return this.window.isVisible()
  }

  constructor(public windowType: renderViewType) {
    AppEvent.on(AppEventType.windowBlur, (windows: BrowserWindow) => {
      this.CheckBlurClick(windows)
    })
    AppEvent.on(AppEventType.LockApp, () => {
      this.lockapp()
      this.win.webContents.send(MainToWebMsg.LockApp)
    })
    AppEvent.on(AppEventType.LoginOk, () => {
      this.win.webContents.send(MainToWebMsg.LoginOK)
    })
    AppEvent.on(AppEventType.Message, (msagetype, msg, duration) => {
      this.win.webContents.send(MainToWebMsg.ShowMsg, msagetype, msg, duration)
    })
    AppEvent.on(AppEventType.VaultChange, () => {
      this.win.webContents.send(MainToWebMsg.VaultChange)
    })
    AppEvent.on(AppEventType.UserChange, () => {
      this.win.webContents.send(MainToWebMsg.UserChange)
    })
    AppEvent.on(AppEventType.VaultItemChange, () => {
      this.win.webContents.send(MainToWebMsg.vaultItemChange)
    })
    AppEvent.on(AppEventType.DataChange, (type: EntityType) => {
      this.win.webContents.send(MainToWebMsg.DataChange, type)
    })
    AppEvent.on(AppEventType.APPQuit, () => {
      if (is.dev) this.win.webContents.closeDevTools()
      this.close()
    })
    AppEvent.on(AppEventType.LangChange, (lang: string) => {
      this.win.webContents.send(MainToWebMsg.LangChange, lang)
    })
    AppEvent.on(AppEventType.LoginOut, () => {
      this.lockapp()
      this.win.webContents.send(MainToWebMsg.LoginOut)
    })
    AppEvent.on(
      AppEventType.ResizeWindow,
      (viewtype: renderViewType, width: number, height: number) => {
        if (viewtype == this.windowType) this.setSize(width, height)
      }
    )
    AppEvent.on(AppEventType.AppSetChange, (set: AppSetInfo) => {
      this.win.webContents.send(MainToWebMsg.AppSetChange, set)
    })
    AppEvent.on(AppEventType.OpenDev, (value: boolean) => {
      if (value) this.window.webContents.openDevTools({ mode: 'detach' })
      else this.window.webContents.closeDevTools()
    })
  }

  lockapp() {
    return
  }
  initWin() {
    this.window = new BrowserWindow({
      width: this.witdth,
      height: this.height,
      alwaysOnTop: this.ontop,
      type: this.wintype,
      show: false,
      title: this.title,
      icon,
      resizable: this.resizeable,
      closable: this.closeable,
      frame: this.haveFrame,
      autoHideMenuBar: true,
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: path.join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    })
    if (is.dev || AppModel.getInstance().set.set.open_dev)
      this.window.webContents.openDevTools({ mode: 'detach' })
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      this.base_path = `${process.env['ELECTRON_RENDERER_URL']}/${this.url}`
      this.win.loadURL(this.base_path)
    } else {
      const urlpath = path.join(__dirname, `../renderer/${this.url}`)
      this.base_path = path.resolve(urlpath)
      this.win.loadFile(this.base_path)
    }
    this.window.on('close', (event) => {
      if (AppModel.App_quit) return
      event.preventDefault()
      this.hide()
    })
    this.window.on('page-title-updated', (event) => {
      event.preventDefault()
    })
    this.window.on('resize', () => {
      const oldsize = this.win.getSize()
      this.winResize(oldsize[0], oldsize[1])
    })
  }

  winResize(_width: number, _height: number): void {}

  show() {
    Log.info('show window', this.url)
    AppModel.getInstance().setLastPoint(screen.getCursorScreenPoint())
    this.win.show()
    this.win.webContents.send(MainToWebMsg.WindowsShow)
  }

  hide() {
    Log.info('hide window', this.url)
    this.window.hide()
    this.window.setSkipTaskbar(true)
    this.win.webContents.send(MainToWebMsg.WindowsHide)
  }

  close() {
    Log.info('close window', this.url)
    this.window.close()
  }

  showOrHide(show: boolean) {
    if (show) this.show()
    else this.hide()
  }

  isFocused() {
    return this.window.isFocused()
  }

  setSize(width: number, height: number) {
    const oldsize = this.win.getSize()
    if (width <= 0) width = oldsize[0]
    if (height <= 0) height = oldsize[1]
    width = Math.floor(width)
    height = Math.floor(height)
    this.win.setMinimumSize(width, height)
    // const [minWidth, minHeight] = this.win.getMinimumSize()
    // console.log('change size', width, height, this.url, oldsize)
    this.window.setSize(width, height, true)
  }

  CheckBlurClick(windows: BrowserWindow) {
    // console.log('winblur', this.url)
    if (!this.click_outsize_close || this.window.isVisible() == false) return
    if (this.window != windows) return
    // console.log('checkblurclick', windows, this.window == windows, this.window.isVisible())
    const { x, y } = screen.getCursorScreenPoint()
    const rect = this.win.getBounds()
    if (x < rect.x || x > rect.x + rect.width || y < rect.y || y > rect.y + rect.height) {
      this.hide()
    }
  }
}
