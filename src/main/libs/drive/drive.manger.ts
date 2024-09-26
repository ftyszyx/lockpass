import { AliDrive } from './ali_drive/aliyun.index'
import { BaiduDrive } from './baidu_drive/baidu.index'
import { GoogleDrive } from './google_drive/google.index'
import { LangHelper } from '@common/lang'
import { DriveBase, DriveFileItemBase, DriveUserSetBase } from './drive.base'
import { AppEvent, AppEventType } from '@main/entitys/appmain.entity'
import { DriveType } from '@common/entitys/drive.entity'
import { AliyunData } from './ali_drive/def'
export class DriveManger {
  drives: { [key: string]: DriveBase<DriveFileItemBase, DriveUserSetBase> } = {}
  AddDrive(drive: DriveBase<DriveFileItemBase, DriveUserSetBase>) {
    this.drives[drive.name] = drive
  }

  GetDrive(name: DriveType) {
    return this.drives[name]
  }
}

export interface DriveUserSet {
  aliyun?: AliyunData
}

export const DriveMangerInstance = new DriveManger()

export function initDrive() {
  DriveMangerInstance.AddDrive(new AliDrive())
  DriveMangerInstance.AddDrive(new BaiduDrive())
  DriveMangerInstance.AddDrive(new GoogleDrive())
}

export async function checkAlidriveAuth(drivetyp: DriveType): Promise<boolean> {
  const drive = DriveMangerInstance.GetDrive(drivetyp)
  const needauth = await drive.NeedLogin()
  if (needauth) {
    drive.Login()
    AppEvent.emit(AppEventType.Message, 'error', LangHelper.getString('mydropmenu.aliyunneedauth'))
    return false
  }
  return true
}

export async function updateFileByDrive(
  drivetyp: DriveType,
  file: string,
  local_path: string
): Promise<string> {
  return await DriveMangerInstance.GetDrive(drivetyp).UploadFile(file, local_path)
}

export async function deleteFileByDrive(drive_type: DriveType, file_id: string) {
  if ((await checkAlidriveAuth(drive_type)) == false) return
  await DriveMangerInstance.GetDrive(drive_type).DeleteFile(file_id)
}

export async function DownloadFileByDrive(drivetype: DriveType, file: string, local_path: string) {
  if ((await checkAlidriveAuth(drivetype)) == false) return
  await DriveMangerInstance.GetDrive(drivetype).DownLoadFile(file, local_path)
}

export async function GetFileListByDrive(drive_type: DriveType) {
  if ((await checkAlidriveAuth(drive_type)) == false) return []
  return await DriveMangerInstance.GetDrive(drive_type).GetFileList()
}

export async function TrashFileByDrive(drive_type: DriveType, file_id: string) {
  if ((await checkAlidriveAuth(drive_type)) == false) return
  await DriveMangerInstance.GetDrive(drive_type).TrashFile(file_id)
}
