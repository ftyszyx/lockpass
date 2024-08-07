import { WindowBase } from './window.base'

export class MainWindow extends WindowBase {
  constructor() {
    super()
    this.url = 'index.html'
    this.initWin()
  }
}
