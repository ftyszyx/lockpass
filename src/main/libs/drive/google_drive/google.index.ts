// https://developers.google.com/drive/api/quickstart/nodejs?hl=zh-cn
import { DriveBase, DriveFileItemBase, DriveUserSetBase } from '../drive.base'
import { DriveType } from '@common/entitys/drive.entity'
// import { google } from 'googleapis'
import { shell } from 'electron'
import { RequestType, SendRequest } from '@main/libs/net_help'
// const OAuth2 = google.auth.OAuth2

export interface GoogleDriveFileItem extends DriveFileItemBase {}

export interface GoogleDriveUserSet extends DriveUserSetBase {}
export class GoogleDrive extends DriveBase<GoogleDriveFileItem, GoogleDriveUserSet> {
  SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly']
  client_id = '122282570207-79ebmbqii93rjkecu3jvfq3e6k108ef0.apps.googleusercontent.com'
  client_secret = import.meta.env.GOOGLE_CLIENT_SECRET
  _host = 'https://accounts.google.com/'
  token_uri = 'https://oauth2.googleapis.com/token'
  auth_provider_x509_cert_url = 'https://www.googleapis.com/oauth2/v1/certs'
  constructor() {
    super(DriveType.google)
  }
  async deeplinkProcess(_params: URLSearchParams) {
    console.log('deeplinkProcess', _params)
    const code = _params.get('code')
    if (!code) return
    console.log('code', code)
    await this._getTokenByCode(code)
  }

  private async _getTokenByCode(code: string) {
    await this._getToken(code, null)
  }

  // private async _getTokenByRefreshToken(refresh_token: string) {
  //   await this._getToken(null, refresh_token)
  // }

  private async _getToken(code: string, refresh_token: string) {
    const url = new URL(`${this._host}//oauth/access_token`)
    console.log('secret', this.client_secret)
    const senddata = {
      client_id: this.client_id,
      client_secret: this.client_secret
    }
    if (code) {
      senddata['code'] = code
      senddata['grant_type'] = 'authorization_code'
    }
    if (refresh_token) {
      senddata['refresh_token'] = refresh_token
      senddata['grant_type'] = 'refresh_token'
    }
    const res = await SendRequest<any>(
      url.toString(),
      RequestType.Post,
      {
        'Content-Type': 'application/json'
      },
      senddata
    )
    console.log('res', res)
  }

  getAuthenticationUrl() {
    console.log('RedirectUrl', this.RedirectUrl)
    /*
    const oauth2Client = new OAuth2(this.client_id, this.client_secret, this.RedirectUrl)
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
      scope: this.SCOPES // If you only need one scope you can pass it as string
    })
    return url
    */
    return ''
  }

  async Login(): Promise<void> {
    const url = this.getAuthenticationUrl()
    console.log('url', url)
    shell.openExternal(url)
  }

  async UploadFile(_file: string, _local_path: string): Promise<string> {
    return ''
  }

  async DownLoadFile(_file: string, _local_path: string): Promise<void> {}

  async GetFileList(): Promise<GoogleDriveFileItem[]> {
    return []
  }

  async DeleteFile(_file_id: string): Promise<void> {}

  async TrashFile(_file_id: string): Promise<void> {}
}
