import { MyEncode } from '../libs/my_encode'
import { MainViewHelper } from '../libs/view_help'
import { Log } from '../libs/log'

class AppModel {
  mainview: MainViewHelper | null = null
  myencode: MyEncode | null = null
  constructor() {
    this.myencode = new MyEncode()
    Log.initialize()
    Log.info('AppModel init')
  }

  private static instance: AppModel
  public static getInstance() {
    if (!AppModel.instance) {
      AppModel.instance = new AppModel()
    }
    return AppModel.instance
  }

  public initMainView(mainview: MainViewHelper) {
    this.mainview = new MainViewHelper(mainview.mainWindow)
  }
}

export default AppModel
