import { MyEncode } from '@main/libs/my_encode'
import { MainViewHelper } from '@main/libs/view_help'
import { Log } from '@main/libs/log'
import DbHlper from '@main/libs/db_help'
import { BrowserWindow } from 'electron'
import { ValutService } from '@main/services/vault.service'
import { UserService } from '@main/services/user.service'

class AppModel {
  public mainview: MainViewHelper | null = null
  public myencode: MyEncode | null = null
  public vault: ValutService | null = null
  public vaultItem: ValutService | null = null
  public user: UserService | null = null
  constructor() {
    Log.initialize()
    this.myencode = new MyEncode()
    Log.info('AppModel init')
    DbHlper.instance().InitTables()
    this.vault = new ValutService()
    this.vaultItem = new ValutService()
    this.user = new UserService()
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
