import http from 'http'
import net from 'net'
import { Log } from './log'

export type LoopbackServerOptions = {
  /**
   * The port the loopback will be listening on.
   */
  port: number
  /**
   * The `path` on which we expect the code to be present
   * as query string.
   */
  callbackPath: string
  /**
   * The URL to which the `callbackPath` will be redirecting to in case of sucess.
   */
  successRedirectURL: string
}

export default class LoopbackServer {
  private _server: http.Server
  private _maybeRedirection: Promise<URL>

  constructor({ port, successRedirectURL, callbackPath }: LoopbackServerOptions) {
    this._maybeRedirection = new Promise((resolve, reject) => {
      this._server = http.createServer((req, res) => {
        if (req.url) {
          Log.Info('url', req.url, req.headers.host)

          const url = new URL(req.url)
          Log.Info('req.url', req, url.pathname)
          if (url.pathname === callbackPath) {
            res.writeHead(302, {
              Location: successRedirectURL
            })
            res.end()
            resolve(url)
            Log.Info('resolve', url)
            this._server.close()
            return
          }
        }
        res.writeHead(404)
        res.end()
      })
      this._server.on('error', (e) => {
        Log.Error('server error', e.message)
        reject(e)
      })
      console.log('listen', port)
      this._server.listen(port)
      this._server.on('close', () => {
        Log.Info('server close')
      })
      this._server.on('listening', () => {
        const address = this._server.address() as net.AddressInfo
        Log.Info(`listen:${address.address}:${address.port}`)
      })
    })
  }

  waitForRedirection() {
    return this._maybeRedirection
  }

  close() {
    return new Promise((resolve) => this._server.close(resolve))
  }
}
