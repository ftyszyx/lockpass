import { SYS_PROTOL_URL } from '@common/gloabl'
import { AppEvent, AppEventType } from '@main/entitys/appmain.entity'
import { AliyunData } from './ali_drive/def'
import AppModel from '@main/models/app.model'
import { AliDrive } from './ali_drive/aliyun.index'
import { BaiduDrive } from './baidu_drive/baidu.index'
import { GoogleDrive } from './google_drive/google.index'
export interface DriveBaseI {}
export interface DriveUserSetBase {
  access_token: string
  refresh_token: string
  refresh_token_expire_time: number
  expires_in: number
}

export interface DriveFileItemBase {}

export interface DriveUserSet {
  aliyun?: AliyunData
}

export enum DriveType {
  aliyun = 'aliyun',
  baidu = 'baidu',
  google = 'google'
}

export class DriveBase<FileT extends DriveFileItemBase, UserT extends DriveUserSetBase>
  implements DriveBaseI
{
  private _parent_dir_name: string = 'lockpass_backup'
  private _redirect_url: string = SYS_PROTOL_URL
  private _callback_path: string = 'auth'
  private _user_set: UserT
  constructor(public name: DriveType) {
    AppEvent.on(AppEventType.DeepLink, async (url: string) => {
      console.log('url', url)
      const start_url = `${this.RedirectUrl}/?`
      if (!url.startsWith(start_url)) return
      const params = new URLSearchParams(url.replace(start_url, ''))
      await this.deeplinkProcess(params)
    })
    this.initSet()
  }

  async deeplinkProcess(_params: URLSearchParams) {
    return
  }

  public initSet(): void {
    this._user_set = AppModel.getInstance().set.drive_user_set[this.name]
  }

  get userData(): UserT {
    return this._user_set
  }

  public SaveUserData() {
    const olddata = AppModel.getInstance().set.drive_user_set
    AppModel.getInstance().set.setDriveUserSet({ ...olddata, [this.name]: this.userData })
  }

  get parent_dir_name() {
    return this._parent_dir_name
  }

  get RedirectUrl() {
    return `${this._redirect_url}${this._callback_path}`
  }

  async needLogin(): Promise<boolean> {
    return false
  }

  async Login() {}

  async upLoadFile(_file: string, _local_path: string) {}

  async downLoadFile(_file: string, _local_path: string) {}
  async GetFileList(): Promise<FileT[]> {
    return []
  }

  async DeleteFile(_file_id: string) {}
  async TrashFile(_file_id: string) {}
}

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
DriveMangerInstance.AddDrive(new AliDrive())
DriveMangerInstance.AddDrive(new BaiduDrive())
DriveMangerInstance.AddDrive(new GoogleDrive())
