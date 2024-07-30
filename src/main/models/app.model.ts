import { MyEncode } from '@main/libs/my_encode'
import { MainViewHelper } from '@main/libs/view_help'
import { Log } from '@main/libs/log'
import DbHlper from '@main/libs/db_help'
import { app, BrowserWindow, crashReporter } from 'electron'
import { ValutService as VaultService } from '@main/services/vault.service'
import { UserService } from '@main/services/user.service'
import { VaultItemService } from '@main/services/vault_item.service'
import { PathHelper } from '@main/libs/path'
import path from 'path'
import fs from 'fs'
import { LangHelper } from '@common/lang'
import { APP_VER_CODE, Default_Lang, SQL_VER_CODE } from '@common/gloabl'
export interface AppSet {
  lang: string
  sql_ver: number
  app_ver: number
  cur_user_uid?: number
}

class AppModel {
  public mainview: MainViewHelper | null = null
  public myencode: MyEncode | null = null
  public vault: VaultService | null = null
  public vaultItem: VaultItemService | null = null
  public user: UserService | null = null
  private _set_path: string = ''
  private set: AppSet = {
    lang: Default_Lang,
    app_ver: APP_VER_CODE,
    sql_ver: SQL_VER_CODE,
    cur_user_uid: 0
  }
  constructor() {
    Log.initialize()
    this.myencode = new MyEncode()
    Log.info('AppModel init')
    DbHlper.instance().InitTables()
    this.vault = new VaultService()
    this.vaultItem = new VaultItemService()
    this.user = new UserService()
    this._initSet()
    this.initLang()
    app.setPath('crashDumps', path.join(PathHelper.getHomeDir(), 'crashs'))
    crashReporter.start({
      productName: 'MyElectron',
      companyName: 'MyCompany',
      uploadToServer: false
    })
  }

  private _initSet() {
    this._set_path = path.join(PathHelper.getHomeDir(), 'set.json')
    if (!fs.existsSync(this._set_path)) {
      fs.writeFileSync(this._set_path, JSON.stringify(this.set))
    } else {
      const saveinfo = JSON.parse(fs.readFileSync(this._set_path).toString())
      Object.keys(saveinfo).forEach((key) => {
        const initvalue = this.set[key]
        if (initvalue != undefined && initvalue != null) {
          this.set[key] = saveinfo[key]
        }
      })
      this.saveSet()
    }
    Log.info('set:', JSON.stringify(this.set))
  }

  public saveSet() {
    fs.writeFileSync(this._set_path, JSON.stringify(this.set))
  }

  public changeLang(lang: string) {
    this.set.lang = lang
    this.initLang()
    this.saveSet()
  }

  public SetLastUser(uid: number) {
    this.set.cur_user_uid = uid
    this.saveSet()
  }

  public GetLastUser() {
    if (this.set.cur_user_uid && this.set.cur_user_uid > 0) return this.set.cur_user_uid
    return null
  }

  public CurLang() {
    return this.set.lang
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

  public initLang() {
    LangHelper.setLang(this.set.lang)
  }
}

export default AppModel
