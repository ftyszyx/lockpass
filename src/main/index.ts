import { app, BrowserWindow, ipcMain } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import AppModel from './models/app.model'

app.whenReady().then(async () => {
  electronApp.setAppUserModelId('com.lockpass.app')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })
  ipcMain.on('ping', () => console.log('pong'))

  await AppModel.getInstance().init()

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

app.on('second-instance', (event, commandLine, workingDirectory) => {
  console.log('second-instance', commandLine, workingDirectory, event)
})

app.on('open-url', (event, url) => {
  console.log('open-url', url)
})
