import { app, BrowserWindow, ipcMain, protocol } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import AppModel from './models/app.model'
import { SYS_TEM_NAME } from '@common/gloabl'
import path from 'path'
import { AppEvent, AppEventType } from './entitys/appmain.entity'

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.lockpass.app')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  ipcMain.on('ping', () => console.log('pong'))

  await AppModel.getInstance().init()

  // protocol.handle('lockpass', (request) => {})

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      AppModel.getInstance().initWin()
    }
  })
})

app.on('window-all-closed', () => {
  AppModel.getInstance().Quit()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

function setDefaultProtocol(scheme) {
  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient(scheme, process.execPath, [path.resolve(process.argv[1])])
    }
  } else {
    app.setAsDefaultProtocolClient(scheme)
  }
}
setDefaultProtocol(SYS_TEM_NAME)

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (_, commandLine) => {
    const mainwin = AppModel.getInstance().mainwin
    if (mainwin) {
      if (mainwin.win.isMinimized()) mainwin.win.restore()
      mainwin.win.focus()
    }
    const url = commandLine.at(-1)
    console.log('second-instance', url)
    AppEvent.emit(AppEventType.DeepLink, url)
  })

  app.on('open-url', (event, url) => {
    console.log('open-url', url)
    if (BrowserWindow.getAllWindows().length === 0) {
      AppModel.getInstance().initWin()
    }
    AppEvent.emit(AppEventType.DeepLink, url)
  })
}
