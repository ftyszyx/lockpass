import { AliDrive } from './ali_drive/aliyun.index'
import { BaiduDrive } from './baidu_drive/baidu.index'
import { GoogleDrive } from './google_drive/google.index'
import { DriveBase, DriveFileItemBase } from './drive.base'
import { AppEvent, AppEventType } from '@main/entitys/appmain.entity'
import { DriveType, DriveUserSetBase } from '@common/entitys/drive.entity'
import { Log } from '../log'
export class DriveManger {
  drives: { [key: string]: DriveBase<DriveFileItemBase, DriveUserSetBase> } = {}
  AddDrive(drive: DriveBase<DriveFileItemBase, DriveUserSetBase>) {
    this.drives[drive.name] = drive
  }

  GetDrive(name: DriveType) {
    return this.drives[name]
  }
}

export const DriveMangerInstance = new DriveManger()

export function initDrive() {
  DriveMangerInstance.AddDrive(new AliDrive())
  DriveMangerInstance.AddDrive(new BaiduDrive())
  DriveMangerInstance.AddDrive(new GoogleDrive())
}

export async function checkAlidriveAuth(drivetyp: DriveType): Promise<void> {
  const drive = DriveMangerInstance.GetDrive(drivetyp)
  const needauth = await drive.NeedLogin()
  if (needauth) {
    await drive.Login()
    return new Promise((resolve, reject) => {
      AppEvent.once(AppEventType.DriveLoginOk, () => {
        Log.info(`${drivetyp} login ok,start callback`)
        resolve()
      })
      AppEvent.once(AppEventType.DriveLoginErr, (err: string) => {
        Log.info(`${drivetyp} login err`)
        AppEvent.emit(AppEventType.Message, 'error', err)
        reject(err)
      })
    })
  }
  Log.info(`${drivetyp} no need login,start callback`)
  return Promise.resolve()
}

export async function updateFileByDrive(
  drivetyp: DriveType,
  file: string,
  local_path: string
): Promise<string> {
  return await DriveMangerInstance.GetDrive(drivetyp).UploadFile(file, local_path)
}

export async function deleteFileByDrive(drive_type: DriveType, file_id: string) {
  await checkAlidriveAuth(drive_type)
  return await DriveMangerInstance.GetDrive(drive_type).DeleteFile(file_id)
}

export async function DownloadFileByDrive(drivetype: DriveType, file: string, local_path: string) {
  await checkAlidriveAuth(drivetype)
  return await DriveMangerInstance.GetDrive(drivetype).DownLoadFile(file, local_path)
}

export async function GetFileListByDrive(drive_type: DriveType) {
  await checkAlidriveAuth(drive_type)
  return await DriveMangerInstance.GetDrive(drive_type).GetFileList()
}

export async function TrashFileByDrive(drive_type: DriveType, file_id: string) {
  await checkAlidriveAuth(drive_type)
  await DriveMangerInstance.GetDrive(drive_type).TrashFile(file_id)
}
