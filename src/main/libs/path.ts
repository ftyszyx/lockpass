import { is } from '@electron-toolkit/utils'
import { app } from 'electron'
export class PathHelper {
  static initPath() {
    return
  }

  static getHomeDir() {
    if (is.dev) return process.cwd()
    else return app.getPath('userData')
  }
}
