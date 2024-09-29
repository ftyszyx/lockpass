/*
 * @Author: zhangyuxin
 * @Date: 2024-09-15 15:46:26
 * @Description: aliyun drive
 */
import { shell } from 'electron'
import { Log } from '../../log'
import { downloadFileFromUrl, RequestType, SendRequest, uploadFileToUrl } from '../../net_help'
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
import { ShowErrToMain, ShowInfoToMain } from '../../other.help'
import { LangHelper } from '@common/lang'
import { DriveBase } from '../drive.base'
import { DriveType } from '@common/entitys/drive.entity'

export class AliDrive extends DriveBase<AliyunFileListItem, AliyunData> {
  private _host: string = 'https://openapi.alipan.com'
  private _clientid: string = '34cb815617784156a4504565d8c55bd0'
  private _scope: string = 'user:base,file:all:read,file:all:write'
  private _sceret: string = import.meta.env.ALIYUN_CLIENT_SECRET
  private _partsize: number = 1024 * 1024 * 1024 * 4

  constructor() {
    super(DriveType.aliyun)
  }

  async deeplinkProcess(params: URLSearchParams) {
    const code = params.get('code')
    if (!code) return
    console.log('code', code)
    await this._getTokenByCode(code)
  }

  private async _getTokenByCode(code: string) {
    await this._getToken(code, null)
  }

  private async _getTokenByRefreshToken(refresh_token: string) {
    await this._getToken(null, refresh_token)
  }

  private async _getToken(code: string, refresh_token: string) {
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
      RequestType.Post,
      {
        'Content-Type': 'application/json'
      },
      senddata
    )
    let user_set: AliyunData = {
      token_type: res.token_type,
      access_token: res.access_token,
      refresh_token: res.refresh_token,
      expires_in: Math.floor(Date.now() / 1000) + res.expires_in,
      refresh_token_expire_time: Math.floor(Date.now() / 1000) + 90 * 24 * 60 * 60
    }
    this.SetUerData(user_set, false)
    user_set.drive_info = await this.getDriveInfo()
    this.SetUerData(user_set, true)
    Log.info('get authData ok', JSON.stringify(this.userData))
    if (code) {
      ShowInfoToMain(LangHelper.getString('mydropmenu.aliyunauthok'))
    }
  }

  private getHeaders() {
    return {
      Authorization: `${this.userData.token_type} ${this.userData.access_token}`,
      'Content-Type': 'application/json'
    }
  }

  private async getDriveInfo(): Promise<AliyunDriveInfo> {
    const url = `${this._host}/adrive/v1.0/user/getDriveInfo`
    return await SendRequest<AliyunDriveInfo>(url, RequestType.Post, this.getHeaders(), null)
  }

  private async createFolderInRoot(folder_name: string): Promise<AliyunCreateFileResp> {
    return await this._createFile2('root', folder_name, 'folder')
  }

  private async _createFile(
    parentfile_id: string,
    file_name: string
  ): Promise<AliyunCreateFileResp> {
    return await this._createFile2(parentfile_id, file_name, 'file')
  }

  private async _createFile2(
    parentfile_id: string,
    file_name: string,
    type: string
  ): Promise<AliyunCreateFileResp> {
    const url = `${this._host}/adrive/v1.0/openFile/create`
    const res = await SendRequest<AliyunCreateFileResp>(url, RequestType.Post, this.getHeaders(), {
      drive_id: this.userData.drive_info.default_drive_id,
      parent_file_id: parentfile_id,
      name: file_name,
      type,
      check_name_mode: 'refuse'
    })
    return res
  }

  async TrashFile(file_id: string) {
    const url = `${this._host}/adrive/v1.0/openFile/recyclebin/trash`
    await SendRequest<any>(url, RequestType.Post, this.getHeaders(), {
      drive_id: this.userData.drive_info.default_drive_id,
      file_id: file_id
    })
  }

  async DeleteFile(file_id: string) {
    const url = `${this._host}/adrive/v1.0/openFile/delete`
    await SendRequest<any>(url, RequestType.Post, this.getHeaders(), {
      drive_id: this.userData.drive_info.default_drive_id,
      file_id: file_id
    })
  }

  async UploadFile(file_name: string, local_path: string) {
    let res = await this.createFolderInRoot(this.parent_dir_name)
    res = await this._createFile(res.file_id, file_name)
    if (res.exist) {
      throw new Error('file exit')
    }
    const file = fs.readFileSync(local_path)
    for (let i = 0; i < res.part_info_list.length; i++) {
      const part = res.part_info_list[i]
      const number = part.part_number
      const pos = this._partsize * (number - 1)
      const size = Math.min(file.length - pos, this._partsize)
      Log.info(`upload part ${number} size ${size} pos ${pos} `)
      const res2 = await uploadFileToUrl(
        part.upload_url,
        {
          method: 'PUT',
          headers: {
            'Content-Length': size,
            Authorization: `${this.userData.token_type} ${this.userData.access_token}`,
            'Transfer-Encoding': 'chunked',
            connection: 'keep-alive'
          }
        },
        file,
        pos,
        size
      )
      Log.info(`upload part ${number} ok res:${res2}`)
    }
    const fileinfo = await SendRequest<AliyunFileInfo>(
      `${this._host}/adrive/v1.0/openFile/complete`,
      RequestType.Post,
      this.getHeaders(),
      {
        drive_id: this.userData.drive_info.default_drive_id,
        file_id: res.file_id,
        upload_id: res.upload_id
      }
    )
    Log.info('upload file ok', JSON.stringify(fileinfo))
    return `${this.parent_dir_name}/${file_name}`
  }

  async DownLoadFile(file_name: string, local_path: string) {
    const res1 = await this.createFolderInRoot(this.parent_dir_name)
    const res = await this._createFile(res1.file_id, file_name)
    if (!res.exist) {
      ShowErrToMain(LangHelper.getString('alidrive.filenotexit', file_name))
      throw new Error(`file not exit:${file_name}`)
    }
    const url = `${this._host}/adrive/v1.0/openFile/getDownloadUrl`
    const downloadInfo = await SendRequest<AliyunFileDownloadInfo>(
      url,
      RequestType.Post,
      this.getHeaders(),
      {
        drive_id: this.userData.drive_info.default_drive_id,
        file_id: res.file_id,
        expire_sec: 900
      }
    )
    await downloadFileFromUrl(downloadInfo.url, local_path)
  }

  private async _getLatestFiliList(
    filetype: AliyunFileCateGory,
    type: aliyunFileType
  ): Promise<AliyunFileListItem[]> {
    const parent_info = await this.createFolderInRoot(this.parent_dir_name)
    const url = `${this._host}/adrive/v1.0/openFile/list`
    const res = await SendRequest<AliyunFilelistResp>(url, RequestType.Post, this.getHeaders(), {
      drive_id: this.userData.drive_info.default_drive_id,
      parent_file_id: parent_info.file_id,
      file_cateGory: filetype,
      order_by: 'created_at',
      limit: 10,
      order_direction: 'DESC',
      type
    })
    return res.items
  }

  async GetFileList() {
    console.log('getFileList aliyun')
    return await this._getLatestFiliList('zip', 'file')
  }

  async NeedLogin() {
    const timenow = Math.floor(Date.now() / 1000)
    if (!this.userData) return true
    if (this.userData.expires_in > timenow) return false
    if (this.userData.refresh_token_expire_time < timenow) return true
    await this._getTokenByRefreshToken(this.userData.refresh_token)
    return false
  }

  async Login() {
    const redirect_url = encodeURIComponent(this.RedirectUrl)
    const url = `${this._host}/oauth/authorize?client_id=${this._clientid}&scope=${this._scope}&response_type=code&redirect_uri=${redirect_url}`
    console.log('url', url)
    shell.openExternal(url)
  }
}
