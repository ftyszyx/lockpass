import AppModel from '@main/models/app.model'
import { WindowBase } from './window.base'
import { renderViewType } from '@common/entitys/app.entity'

export class QuickSearchWindow extends WindowBase {
  constructor() {
    super(renderViewType.Quickview)
    this.url = 'quick.html'
    this.haveFrame = false
    this.wintype = 'toolbar'
    this.resizeable = false
    // this.ontop = true
    this.click_outsize_close = true
    this.witdth = 600
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
