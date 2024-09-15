import { renderViewType } from '@common/entitys/app.entity'
import { WindowBase } from './window.base'

export class PasswordWindow extends WindowBase {
  constructor() {
    super(renderViewType.Password)
    this.url = 'password.html'
    this.haveFrame = false
    this.wintype = 'toolbar'
    this.resizeable = false
    this.click_outsize_close = true
    this.witdth = 600
    this.height = 500
    this.initWin()
  }
}
