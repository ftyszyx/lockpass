import { WindowBase } from './window.base'

export class QuickSearchWindow extends WindowBase {
  constructor() {
    super()
    this.url = 'quicksearch.html'
    this.initWin()
  }
}
