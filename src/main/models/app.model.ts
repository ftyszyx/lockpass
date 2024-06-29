import { MyEncode } from '@main/libs/my_encode'
import { MainViewHelper } from '@main/libs/view_help'
import { Log } from '@main/libs/log'
import DbHlper from '@main/libs/db_help'

class AppModel {
  mainview: MainViewHelper | null = null
  myencode: MyEncode | null = null
  constructor() {
    this.myencode = new MyEncode()
    Log.initialize()
    Log.info('AppModel init')
    DbHlper.instance().initTables()
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
