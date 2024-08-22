import { shell } from 'electron'
import LoopbackServer from '../LoopbackServer'
import { Log } from '../log'
import { SYS_PROTOL_URL } from '@common/gloabl'
import { AppEvent, AppEventType } from '@main/entitys/appmain.entity'
import { downloadFileFromUrl, SendRequest, uploadFileToUrl } from '../net_help'
import AppModel from '@main/models/app.model'
import {
  AliyunCreateFileResp,
  AliyunData,
  AliyunDriveInfo,
  AliyunFileCateGory,
  AliyunFileDownloadInfo,
  AliyunFileInfo,
  AliyunFileListItem,
  AliyunFilelistResp,
  aliyunFileType
} from './def'
import fs from 'fs'
import { ShowErrToMain, ShowInfoToMain } from '../other.help'
import { LangHelper } from '@common/lang'

export class AliDrive {
  private _host: string = 'https://openapi.alipan.com'
  private _clientid: string = '34cb815617784156a4504565d8c55bd0'
  private _scope: string = 'user:base,file:all:read,file:all:write'
  private _callback_path: string = 'auth'
  private _sceret: string = 'b4dda1481a4e45d28a8372df93a5f475'
  private _redirect_url: string = SYS_PROTOL_URL
  protected server: LoopbackServer | null = null
  private _authData: AliyunData | null = null
  private _parent_dir_name: string = 'lockpass_backup'
  private _partsize: number = 1024 * 1024 * 1024 * 4

  constructor() {
    AppEvent.on(AppEventType.DeepLink, async (url: string) => {
      console.log('url', url)
      const start_url = `${this.RedirectUrl}/?`
      if (!url.startsWith(start_url)) return
      const params = new URLSearchParams(url.replace(start_url, ''))
      const code = params.get('code')
      if (!code) return
      console.log('code', code)
      await this.getTokenByCode(code)
    })
    this._authData = AppModel.getInstance().aliyunData
  }

  get parent_dir_name() {
    return this._parent_dir_name
  }

  get RedirectUrl() {
    return `${this._redirect_url}${this._callback_path}`
  }

  async auth() {
    const redirect_url = encodeURIComponent(this.RedirectUrl)
    const url = `${this._host}/oauth/authorize?client_id=${this._clientid}&scope=${this._scope}&response_type=code&redirect_uri=${redirect_url}`
    console.log('url', url)
    shell.openExternal(url)
  }

  async getTokenByCode(code: string) {
    await this.getToken(code, null)
  }

  async getTokenByRefreshToken(refresh_token: string) {
    await this.getToken(null, refresh_token)
  }

  async getToken(code: string, refresh_token: string) {
    const url = new URL(`${this._host}/oauth/access_token`)
    const senddata = {
      client_id: this._clientid,
      client_secret: this._sceret
    }
    if (code) {
      senddata['code'] = code
      senddata['grant_type'] = 'authorization_code'
    }
    if (refresh_token) {
      senddata['refresh_token'] = refresh_token
      senddata['grant_type'] = 'refresh_token'
    }
    const res = await SendRequest<AliyunData>(
      url.toString(),
      'POST',
      {
        'Content-Type': 'application/json'
      },
      senddata
    )
    this._authData = res
    this._authData.expires_in = Math.floor(Date.now() / 1000) + this._authData.expires_in
    this._authData.refresh_token_expire_time = Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60
    this._authData.drive_info = await this.getDriveInfo()
    AppModel.getInstance().setAliyunData(this._authData)
    Log.Info('get authData ok', JSON.stringify(this._authData))
    if (code) {
      ShowInfoToMain(LangHelper.getString('mydropmenu.aliyunauthok'))
    }
  }

  async needAuth() {
    const timenow = Math.floor(Date.now() / 1000)
    if (!this._authData) return true
    if (this._authData.expires_in > timenow) return false
    if (this._authData.refresh_token_expire_time < timenow) return true
    await this.getTokenByRefreshToken(this._authData.refresh_token)
    return false
  }

  private getHeaders() {
    return {
      Authorization: `${this._authData.token_type} ${this._authData.access_token}`,
      'Content-Type': 'application/json'
    }
  }

  private async getDriveInfo(): Promise<AliyunDriveInfo> {
    const url = `${this._host}/adrive/v1.0/user/getDriveInfo`
    return await SendRequest<AliyunDriveInfo>(url, 'POST', this.getHeaders(), null)
  }

  async createFolderInRoot(folder_name: string): Promise<AliyunCreateFileResp> {
    return await this.createFile2('root', folder_name, 'folder')
  }

  async createFolder(parent_file_id: string, folder_name: string): Promise<AliyunCreateFileResp> {
    return await this.createFile2(parent_file_id, folder_name, 'folder')
  }

  async createFile(parentfile_id: string, file_name: string): Promise<AliyunCreateFileResp> {
    return await this.createFile2(parentfile_id, file_name, 'file')
  }

  private async createFile2(
    parentfile_id: string,
    file_name: string,
    type: string
  ): Promise<AliyunCreateFileResp> {
    const url = `${this._host}/adrive/v1.0/openFile/create`
    const res = await SendRequest<AliyunCreateFileResp>(url, 'POST', this.getHeaders(), {
      drive_id: this._authData.drive_info.default_drive_id,
      parent_file_id: parentfile_id,
      name: file_name,
      type,
      check_name_mode: 'refuse'
    })
    return res
  }

  async UploadFile(file_name: string, local_path: string) {
    let res = await this.createFolderInRoot(this._parent_dir_name)
    res = await this.createFile(res.file_id, file_name)
    if (res.exist) {
      throw new Error('file exit')
    }
    const file = fs.readFileSync(local_path)
    for (let i = 0; i < res.part_info_list.length; i++) {
      const part = res.part_info_list[i]
      const number = part.part_number
      const pos = this._partsize * (number - 1)
      const size = Math.min(file.length - pos, this._partsize)
      Log.Info(`upload part ${number} size ${size} pos ${pos} `)
      const res2 = await uploadFileToUrl(
        part.upload_url,
        {
          method: 'PUT',
          headers: {
            'Content-Length': size,
            Authorization: `${this._authData.token_type} ${this._authData.access_token}`,
            'Transfer-Encoding': 'chunked',
            connection: 'keep-alive'
          }
        },
        file,
        pos,
        size
      )
      Log.Info(`upload part ${number} ok res:${res2}`)
    }
    const fileinfo = await SendRequest<AliyunFileInfo>(
      `${this._host}/adrive/v1.0/openFile/complete`,
      'POST',
      this.getHeaders(),
      {
        drive_id: this._authData.drive_info.default_drive_id,
        file_id: res.file_id,
        upload_id: res.upload_id
      }
    )
    Log.Info('upload file ok', JSON.stringify(fileinfo))
  }

  async downloadFile(file_name: string, local_path: string) {
    const res1 = await this.createFolderInRoot(this._parent_dir_name)
    const res = await this.createFile(res1.file_id, file_name)
    if (!res.exist) {
      ShowErrToMain(LangHelper.getString('alidrive.filenotexit', file_name))
      throw new Error(`file not exit:${file_name}`)
    }
    const url = `${this._host}/adrive/v1.0/openFile/getDownloadUrl`
    const downloadInfo = await SendRequest<AliyunFileDownloadInfo>(url, 'POST', this.getHeaders(), {
      drive_id: this._authData.drive_info.default_drive_id,
      file_id: res.file_id,
      expire_sec: 900
    })
    await downloadFileFromUrl(downloadInfo.url, local_path)
  }

  async getLatestFiliList(
    filetype: AliyunFileCateGory,
    type: aliyunFileType
  ): Promise<AliyunFileListItem[]> {
    const parent_info = await this.createFolderInRoot(this._parent_dir_name)
    const url = `${this._host}/adrive/v1.0/openFile/list`
    const res = await SendRequest<AliyunFilelistResp>(url, 'POST', this.getHeaders(), {
      drive_id: this._authData.drive_info.default_drive_id,
      parent_file_id: parent_info.file_id,
      file_cateGory: filetype,
      order_by: 'created_at',
      limit: 10,
      order_direction: 'DESC',
      type
    })
    return res.items
  }
}
