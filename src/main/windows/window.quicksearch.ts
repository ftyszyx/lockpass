import { WindowBase } from './window.base'

export class QuickSearchWindow extends WindowBase {
  constructor() {
    super()
    this.url = 'quick.html'
    this.haveFrame = false
    this.wintype = 'toolbar'
    this.resizeable = false
    this.closeable = false
    this.ontop = true
    this.witdth = 400
    this.height = 50
    this.initWin()
  }
}
