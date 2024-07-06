import { MyEncode } from '@main/libs/my_encode'
import { MainViewHelper } from '@main/libs/view_help'
import { Log } from '@main/libs/log'
import DbHlper from '@main/libs/db_help'
import { BrowserWindow } from 'electron'
import { ValutService } from '@main/services/vault.service'

class AppModel {
  mainview: MainViewHelper | null = null
  myencode: MyEncode | null = null
  vault: ValutService | null = null
  vaultItem: ValutService | null = null
  constructor() {
    Log.initialize()
    this.myencode = new MyEncode()
    Log.info('AppModel init')
    DbHlper.instance().InitTables()
    this.vault = new ValutService()
    this.vaultItem = new ValutService()
  }

  private static instance: AppModel
  public static getInstance() {
    if (!AppModel.instance) {
      AppModel.instance = new AppModel()
    }
    return AppModel.instance
  }

  public initMainView(mainview: BrowserWindow) {
    this.mainview = new MainViewHelper(mainview)
  }
}

export default AppModel
