import { shell } from 'electron'
import LoopbackServer from './LoopbackServer'
import { Log } from './log'

export class AliDrive {
  private _clientid: string = '34cb815617784156a4504565d8c55bd0'
  private _scope: string = 'file:all:read,file:all:write'
  private _callback_path: string = '/callback'
  private _sceret: string = 'b4dda1481a4e45d28a8372df93a5f475'
  private _redirect_url: string = 'http://127.0.0.1'
  private _port: number = 42125
  protected server: LoopbackServer | null = null

  private access_token: string = ''
  private refresh_token: string = ''
  private expires_in: number = 0
  private token_type: string = ''

  async auth() {
    const redirect_url = encodeURIComponent(
      `${this._redirect_url}:${this._port}${this._callback_path}`
    )
    const url = `https://openapi.alipan.com/oauth/authorize?client_id=${this._clientid}&scope=${this._scope}&response_type=code&redirect_uri=${redirect_url}`
    console.log('url', url)
    if (this.server) {
      await this.server.close()
      this.server = null
    }
    this.server = new LoopbackServer({
      port: this._port,
      successRedirectURL: this._redirect_url,
      callbackPath: this._callback_path
    })
    shell.openExternal(url)
    try {
      const callbackurl = await this.server.waitForRedirection()
      this.server = null
      console.log('callbackurl', callbackurl)
    } catch (e: any) {
      Log.Exception(e, 'auth err')
    }
  }
}
