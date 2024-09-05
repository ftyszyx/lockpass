import { autoUpdater } from 'electron-updater'
import { Log } from '@main/libs/log'
import { AppEvent, AppEventType } from '@main/entitys/appmain.entity'
import { UpdateEventType } from '@common/entitys/update.entity'
export class AutoUpdateHelper {
  constructor() {
    autoUpdater.logger = Log
    autoUpdater.autoDownload = false
    autoUpdater.on('checking-for-update', () => {
      Log.info('Checking for update...')
    })
    autoUpdater.on('update-available', (info) => {
      Log.info('Update available.', JSON.stringify(info))
      AppEvent.emit(AppEventType.UpdateEvent, UpdateEventType.updateAvaliable, info)
    })

    autoUpdater.on('update-not-available', (info) => {
      Log.info('Update not available.', JSON.stringify(info))
      AppEvent.emit(AppEventType.UpdateEvent, UpdateEventType.UpdateEmpty, info)
    })
    autoUpdater.on('error', (err) => {
      Log.info(`error in update name:${err.name} msg:${err.message} stack: ${err.stack}`)
      AppEvent.emit(AppEventType.UpdateEvent, UpdateEventType.UpdateError, err.message)
    })
    autoUpdater.on('download-progress', (progressObj) => {
      console.log(`download progress percent:${progressObj.percent} total:${progressObj.total}`)
      AppEvent.emit(AppEventType.UpdateEvent, UpdateEventType.UpdateProgress, progressObj)
    })
    autoUpdater.on('update-downloaded', (info) => {
      console.log(
        `update downloaded file:${info.downloadedFile}  note:${info.releaseNotes} desc:${JSON.stringify(info)} `
      )
      AppEvent.emit(AppEventType.UpdateEvent, UpdateEventType.UpdateDownOk, info.downloadedFile)
    })
  }

  // checkForUpdates() {
  //   autoUpdater.autoDownload = true
  //   autoUpdater.checkForUpdatesAndNotify()
  // }
  checkUpdateAuto() {
    Log.info('checkUpdateAuto')
    autoUpdater.autoDownload = true
    autoUpdater.checkForUpdatesAndNotify()
  }

  checkForUpdates() {
    autoUpdater.checkForUpdates()
  }

  downloadUpdate() {
    autoUpdater.downloadUpdate()
  }

  QuitAndInstall() {
    autoUpdater.quitAndInstall(true, true)
  }
}
