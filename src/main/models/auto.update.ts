import { autoUpdater, ProgressInfo, UpdateInfo } from 'electron-updater'
import { Log } from '@main/libs/log'
import { AppEvent, AppEventType } from '@main/entitys/appmain.entity'
import {
  UpdateEventType,
  MyUpdateInfo,
  MyUpdateProgress,
  UpdateStatus
} from '@common/entitys/update.entity'
import { LangHelper } from '@common/lang'

const getUpdateInfo = (info: UpdateInfo): MyUpdateInfo => {
  return {
    version: info.version,
    releaseDate: info.releaseDate,
    releaseName: info.releaseName,
    releaseNotes: info.releaseNotes
  }
}

const getUpdateProgress = (progressObj: ProgressInfo): MyUpdateProgress => {
  return {
    total: progressObj.total,
    delta: progressObj.delta,
    transferred: progressObj.transferred,
    percent: progressObj.percent,
    bytesPerSecond: progressObj.bytesPerSecond
  }
}
export class AutoUpdateHelper {
  status: UpdateStatus = UpdateStatus.idle
  constructor() {
    autoUpdater.logger = Log
    autoUpdater.autoDownload = false
    autoUpdater.on('checking-for-update', () => {
      Log.info('Checking for update...')
      this.status = UpdateStatus.Checking
      AppEvent.emit(AppEventType.UpdateEvent, UpdateEventType.Checking)
    })
    autoUpdater.on('update-available', (info) => {
      this.status = UpdateStatus.idle
      Log.info('Update available.', JSON.stringify(info))
      AppEvent.emit(AppEventType.UpdateEvent, UpdateEventType.updateAvaliable, getUpdateInfo(info))
    })

    autoUpdater.on('update-not-available', (info) => {
      this.status = UpdateStatus.idle
      Log.info('Update not available.', JSON.stringify(info))
      AppEvent.emit(AppEventType.UpdateEvent, UpdateEventType.UpdateEmpty, getUpdateInfo(info))
    })
    autoUpdater.on('error', (err) => {
      this.status = UpdateStatus.idle
      Log.info(`error in update name:${err.name} msg:${err.message} stack: ${err.stack}`)
      AppEvent.emit(AppEventType.UpdateEvent, UpdateEventType.UpdateError, err.message)
    })
    autoUpdater.on('download-progress', (progressObj) => {
      this.status = UpdateStatus.Downloading
      const info = getUpdateProgress(progressObj)
      Log.info(`download progress percent:${JSON.stringify(info)}`)
      AppEvent.emit(AppEventType.UpdateEvent, UpdateEventType.UpdateProgress, info)
    })
    autoUpdater.on('update-downloaded', (info) => {
      this.status = UpdateStatus.DownloadOk
      Log.info(
        `update downloaded file:${info.downloadedFile}  note:${info.releaseNotes} desc:${JSON.stringify(info)} `
      )
      AppEvent.emit(AppEventType.UpdateEvent, UpdateEventType.UpdateDownOk, info.downloadedFile)
    })
  }

  checkUpdateAuto() {
    Log.info('checkUpdateAuto')
    autoUpdater.autoDownload = true
    autoUpdater.checkForUpdatesAndNotify()
  }

  checkForUpdates() {
    Log.info('check for update')
    if (this.status !== UpdateStatus.idle) {
      AppEvent.emit(AppEventType.Message, 'error', LangHelper.getString('update.checking'))
      return
    }
    autoUpdater.autoDownload = false
    autoUpdater.checkForUpdates()
  }

  downloadUpdate() {
    Log.info('download update')
    autoUpdater.downloadUpdate()
  }

  cancelUpdate() {
    this.status = UpdateStatus.idle
  }

  QuitAndInstall() {
    Log.info('install update')
    autoUpdater.quitAndInstall(true, true)
  }
}
