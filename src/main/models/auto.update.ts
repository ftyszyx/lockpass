import { autoUpdater } from 'electron-updater'
import { Log } from '@main/libs/log'
export class AutoUpdateHelper {
  constructor() {
    autoUpdater.logger = Log
    autoUpdater.autoDownload = false
    autoUpdater.on('checking-for-update', () => {
      Log.info('Checking for update...')
    })
    autoUpdater.on('update-available', (info) => {
      Log.info('Update available.', JSON.stringify(info))
    })
    autoUpdater.on('error', (err) => {
      Log.info(`error in update name:${err.name} msg:${err.message} stack: ${err.stack}`)
    })
    autoUpdater.on('download-progress', (progressObj) => {
      console.log(`download progress percent:${progressObj.percent} total:${progressObj.total}`)
    })
    autoUpdater.on('update-downloaded', (info) => {
      console.log(
        `update downloaded file:${info.downloadedFile}  note:${info.releaseNotes} desc:${JSON.stringify(info)} `
      )
    })
  }

  checkForUpdates() {
    autoUpdater.autoDownload = true
    autoUpdater.checkForUpdatesAndNotify()
  }
}
