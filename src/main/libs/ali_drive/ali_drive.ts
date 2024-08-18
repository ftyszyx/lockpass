import { shell } from 'electron'
import LoopbackServer from '../LoopbackServer'
import { Log } from '../log'
import { SYS_PROTOL_URL } from '@common/gloabl'
import { AppEvent, AppEventType } from '@main/entitys/appmain.entity'
import { downloadFileFromUrl, SendRequest } from '../net_help'
import AppModel from '@main/models/app.model'
import { AliyunCreateFileResp, AliyunData, AliyunDriveInfo, AliyunFileDownloadInfo } from './def'
import fs from 'fs'
import https from 'https'

export class AliDrive {
  private _host: string = 'https://openapi.alipan.com'
  private _clientid: string = '34cb815617784156a4504565d8c55bd0'
  private _scope: string = 'file:all:read,file:all:write'
  private _callback_path: string = 'auth'
  private _sceret: string = 'b4dda1481a4e45d28a8372df93a5f475'
  private _redirect_url: string = SYS_PROTOL_URL
  protected server: LoopbackServer | null = null
  private _authData: AliyunData | null = null

  constructor() {
    AppEvent.on(AppEventType.DeepLink, async (url: string) => {
      console.log('url', url)
      const start_url = `${this.RedirectUrl}/?`
      if (!url.startsWith(start_url)) return
      const params = new URLSearchParams(url.replace(start_url, ''))
      const code = params.get('code')
      if (!code) return
      console.log('code', code)
      await this.getToken(code)
    })
    this._authData = AppModel.getInstance().aliyunData
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

  async getToken(code: string) {
    const url = new URL(`${this._host}/oauth/access_token`)
    const res = await SendRequest<AliyunData>(
      url.toString(),
      'POST',
      {
        'Content-Type': 'application/json'
      },
      {
        client_id: this._clientid,
        client_secret: this._sceret,
        code: code,
        grant_type: 'authorization_code'
      }
    )
    this._authData = res
    this._authData.expires_in = Math.floor(Date.now() / 1000) + this._authData.expires_in * 1000
    this._authData.drive_info = await this.getDriveInfo()
    AppModel.getInstance().setAliyunData(this._authData)
    Log.info('get authData ok', JSON.stringify(this._authData))
  }

  public needAuth() {
    const timenow = Math.floor(Date.now() / 1000)
    return !this._authData || this._authData.expires_in < timenow
  }

  private getHeaders() {
    return {
      Authorization: `${this._authData.token_type} ${this._authData.access_token}`,
      'Content-Type': 'application/json'
    }
  }

  private async getDriveInfo(): Promise<AliyunDriveInfo> {
    const url = `${this._host}/adrive/v1.0/user/getDriveInfo`
    return await SendRequest<AliyunDriveInfo>(url, 'GET', this.getHeaders(), null)
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

  async uploadFile(parentfile_id: string, file_name: string, local_path: string) {
    const res = await this.createFile(parentfile_id, file_name)
    if (res.exit) {
      throw new Error('file exit')
    }
    const file = fs.readFileSync(local_path)
    res.part_info_list.forEach(async (part) => {
      const number = part.part_number
      const pos = part.part_size * (number - 1)
      const size = Math.min(file.length - pos, part.part_size)
      await SendRequest(
        part.upload_url,
        'PUT',
        {
          'Content-Lenght': size.toString()
        },
        Buffer.from(file, pos, size)
      )
    })
  }

  async downloadFile(parentfile_id: string, file_name: string, local_path: string) {
    const res = await this.createFile(parentfile_id, file_name)
    if (!res.exit) {
      throw new Error('file not exit')
    }
    const url = `${this._host}/adrive/v1.0/openFile/getDownloadUrl`
    const downloadInfo = await SendRequest<AliyunFileDownloadInfo>(url, 'POST', this.getHeaders(), {
      drive_id: this._authData.drive_info.default_drive_id,
      file_id: res.file_id,
      expire_sec: 900
    })
    await downloadFileFromUrl(downloadInfo.url, local_path)
  }
}
