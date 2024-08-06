import { MyEncode } from '@main/libs/my_encode'
import { Log } from '@main/libs/log'
import DbHlper from '@main/libs/db_help'
import { app, BrowserWindow, crashReporter, globalShortcut } from 'electron'
import { ValutService as VaultService } from '@main/services/vault.service'
import { UserService } from '@main/services/user.service'
import { VaultItemService } from '@main/services/vault_item.service'
import { PathHelper } from '@main/libs/path'
import path from 'path'
import fs from 'fs'
import { LangHelper } from '@common/lang'
import { APP_VER_CODE, Default_Lang, SQL_VER_CODE, VaultItemType } from '@common/gloabl'
import { MainWindow } from '@main/windows/window.main'
import { QuickSearchWindow } from '@main/windows/window.quicksearch'
import { MyTray } from '@main/windows/mytray'
import { initAllApi } from '@main/api/index.api'
import robot from 'robotjs'
import { defaultUserSetInfo, UserSetInfo } from '@common/entitys/app.entity'
import { AppEvent, AppEventType } from '@main/entitys/appmain.entity'
import { LoginPasswordInfo, VaultItem } from '@common/entitys/vault_item.entity'
export interface AppSet {
  lang: string
  sql_ver: number
  app_ver: number
  cur_user_uid?: number
}

class AppModel {
  public mainwin: MainWindow | null = null
  public quickwin: QuickSearchWindow | null = null
  public my_tray: MyTray | null = null
  public myencode: MyEncode | null = null
  public vault: VaultService | null = null
  public vaultItem: VaultItemService | null = null
  private _lock: boolean = false
  private _lock_timeout: number = 0
  private _logined: boolean = false
  public user: UserService | null = null
  private _set_path: string = ''
  private checkInterval: NodeJS.Timeout | null = null

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

  Quit() {
    globalShortcut.unregisterAll()
    if (this.checkInterval) clearInterval(this.checkInterval)
  }

  init() {
    this.initWin()
    initAllApi()
    this.initGlobalShortcut(defaultUserSetInfo)
    app.on('browser-window-blur', () => {
      AppEvent.emit(AppEventType.windowBlur)
      // this.quickwin.CheckBlurClick()
    })
    this.checkInterval = setInterval(() => {
      this.performLockCheck()
    }, 1000)
  }

  initWin() {
    this.mainwin = new MainWindow()
    this.mainwin.win.on('ready-to-show', () => {
      this.mainwin.show()
    })
    this.quickwin = new QuickSearchWindow()
    this.my_tray = new MyTray()
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

  public GetLastUserId() {
    if (this.set.cur_user_uid && this.set.cur_user_uid > 0) return this.set.cur_user_uid
    return null
  }

  public IsSystemInit() {
    const lastuserid = this.GetLastUserId()
    if (lastuserid) return AppModel.getInstance().myencode.hasKey(lastuserid)
    return false
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

  public initLang() {
    LangHelper.setLang(this.set.lang)
  }

  public showMsgErr(msg: string, duration: number = 3000) {
    AppEvent.emit(AppEventType.Message, 'error', msg, duration)
    // this.mainwin?.content.send(MainToWebMsg.ShowErrorMsg, msg, duration)
  }
  public showMsgInfo(msg: string, duration: number = 3000) {
    AppEvent.emit(AppEventType.Message, 'info', msg, duration)
    // this.mainwin?.content.send(MainToWebMsg.ShowInfoMsg, msg, duration)
  }

  private performLockCheck() {
    if (this.IsLock()) return
    const setinfo = this.user.userinfo.user_set as UserSetInfo
    if (setinfo.normal_autolock_time == 0) return
    const cuttime = new Date().getTime() / 1000
    if (this._lock_timeout < cuttime) {
      this.LockApp()
    }
  }

  public LockApp() {
    this._lock = true
    AppEvent.emit(AppEventType.LockApp)
  }

  public IsLock() {
    return this._lock || !this._logined
  }

  public Login(uid: number) {
    this.set.cur_user_uid = uid
    this._logined = true
    this._lock = false
    const setinfo = this.user.userinfo.user_set as UserSetInfo
    this._lock_timeout = new Date().getTime() / 1000 + setinfo.normal_autolock_time * 60
    this.saveSet()
    AppEvent.emit(AppEventType.LoginOk)
  }

  public IsLogin() {
    return this._logined
  }

  public LoginOut() {
    this.myencode?.LoginOut()
    this._logined = false
    this.LockApp()
  }

  public curUserInfo() {
    return this.user.userinfo
  }

  public initGlobalShortcut(setinfo: UserSetInfo) {
    globalShortcut.unregisterAll()
    globalShortcut.register(setinfo.shortcut_global_open_main, () => {
      Log.info('shortcut_global_open_main')
      this.mainwin?.show()
    })
    globalShortcut.register(setinfo.shortcut_global_quick_find, () => {
      Log.info('shortcut_global_quick_find')
      this.quickwin?.show()
    })
    globalShortcut.register(setinfo.shortcut_global_quick_lock, () => {
      Log.info('shortcut_global_quick_lock')
      this.LockApp()
    })
  }

  AutoFill(info: VaultItem) {
    if (info.vault_item_type == VaultItemType.Login) {
      var logininfo = info.info as LoginPasswordInfo
      robot.typeString(logininfo.username)
      robot.keyTap('tab')
      robot.typeString(logininfo.password)
      robot.keyTap('enter')
    }
  }
}

export default AppModel
