import { SYS_PROTOL_URL } from '@common/gloabl'
import { AppEvent, AppEventType } from '@main/entitys/appmain.entity'
import AppModel from '@main/models/app.model'
import { DriveType } from '@common/entitys/drive.entity'

export interface DriveFileItemBase {}

export class DriveBase<FileT extends DriveFileItemBase, UserT extends DriveUserSetBase> {
  private _parent_dir_name: string = 'lockpass_backup'
  private _redirect_url: string = SYS_PROTOL_URL
  private _callback_path: string = 'auth'
  private _user_set: UserT
  constructor(public name: DriveType) {
    AppEvent.on(AppEventType.DeepLink, async (url: string) => {
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
    this._user_set = AppModel.getInstance().set.drive_user_set?.[this.name]
  }

  get userData(): UserT {
    return this._user_set
  }

  public SetUerData(user_set: UserT, save: boolean) {
    this._user_set = user_set
    if (save) {
      const olddata = AppModel.getInstance().set.drive_user_set
      AppModel.getInstance().set.setDriveUserSet({ ...olddata, [this.name]: user_set })
    }
  }

  get parent_dir_name() {
    return this._parent_dir_name
  }

  get RedirectUrl() {
    return `${this._redirect_url}${this._callback_path}`
  }

  async NeedLogin(): Promise<boolean> {
    throw new Error('not implement needlogin')
  }

  async Login() {
    throw new Error('not implement login')
  }

  async UploadFile(_file: string, _local_path: string): Promise<string> {
    throw new Error('not implement upload')
  }

  async DownLoadFile(_file: string, _local_path: string) {
    throw new Error('not implement download')
  }
  async GetFileList(): Promise<FileT[]> {
    throw new Error('not implement getfilelist')
  }

  async DeleteFile(_file_id: string) {
    throw new Error('not implement deletefile')
  }
  async TrashFile(_file_id: string) {
    throw new Error('not implement trashfile')
  }
}
