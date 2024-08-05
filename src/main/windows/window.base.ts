import { BrowserWindow } from 'electron'
import icon from '../../../resources/icon.png?asset'
import path, { join } from 'path'
import { is } from '@electron-toolkit/utils'
export class WindowBase {
  protected witdth: number = 900
  protected height: number = 670
  protected url: string = 'index.html'
  protected resizeable: boolean = true
  protected closeable: boolean = true
  protected haveFrame: boolean = true //是否无边框
  protected ontop: boolean = false
  protected wintype: string = 'normal'
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

  constructor() {}

  initWin() {
    this.window = new BrowserWindow({
      width: this.witdth,
      height: this.height,
      alwaysOnTop: this.ontop,
      type: this.wintype,
      show: false,
      resizable: this.resizeable,
      closable: this.closeable,
      frame: this.haveFrame,
      autoHideMenuBar: true,
      ...(process.platform === 'linux' ? { icon } : {}),
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false
      }
    })
    if (is.dev) this.window.webContents.openDevTools({ mode: 'detach' })
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      this.window.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/${this.url}`)
    } else {
      this.window.loadFile(join(__dirname, `../renderer/${this.url}`))
    }
    this.window.on('close', (event) => {
      event.preventDefault()
      this.hide()
    })
  }

  show() {
    this.win.show()
  }

  hide() {
    this.window.hide()
    this.window.setSkipTaskbar(true)
  }
}
