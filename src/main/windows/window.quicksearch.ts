import AppModel from '@main/models/app.model'
import { WindowBase } from './window.base'

export class QuickSearchWindow extends WindowBase {
  constructor() {
    super()
    this.url = 'quick.html'
    this.haveFrame = false
    this.wintype = 'toolbar'
    this.resizeable = false
    this.ontop = true
    this.witdth = 400
    this.height = 50
    this.initWin()
  }

  lockapp(): void {
    this.hide()
  }

  show(): void {
    if (AppModel.getInstance().IsLock()) {
      AppModel.getInstance().mainwin?.show()
      return
    }
    super.show()
  }
}
