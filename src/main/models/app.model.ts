import { MyEncode } from '@main/libs/my_encode'
import { Log } from '@main/libs/log'
import { app, dialog, crashReporter, globalShortcut, screen, BrowserWindow } from 'electron'
import { ValutService as VaultService } from '@main/services/vault.service'
import { UserService } from '@main/services/user.service'
import { VaultItemService } from '@main/services/vault_item.service'
import { PathHelper } from '@main/libs/path'
import path from 'path'
import fs from 'fs'
import { LangHelper } from '@common/lang'
import {
  APP_VER_CODE,
  Default_Lang,
  DRIVE_BACK_UP_PATH,
  SQL_VER_CODE,
  VaultItemType
} from '@common/gloabl'
import { MainWindow } from '@main/windows/window.main'
import { QuickSearchWindow } from '@main/windows/window.quicksearch'
import { MyTray } from '@main/windows/mytray'
import { initAllApi } from '@main/api/index.api'
import robot from 'robotjs'
import { defaultUserSetInfo, UserSetInfo } from '@common/entitys/app.entity'
import { AppEvent, AppEventType } from '@main/entitys/appmain.entity'
import { LoginPasswordInfo, VaultItem } from '@common/entitys/vault_item.entity'
import zl from 'zip-lib'
import { SqliteHelper } from '@main/libs/sqlite_help'
import { AppService } from '@main/services/app.service'
import { AliDrive } from '@main/libs/ali_drive'
import { AliyunData } from '@main/libs/ali_drive/def'
export interface AppSet {
  lang: string
  sql_ver: number
  app_ver: number
  cur_user_uid?: number
  aliyun_data?: AliyunData
}

class AppModel {
  public mainwin: MainWindow | null = null
  public quickwin: QuickSearchWindow | null = null
  public my_tray: MyTray | null = null
  public myencode: MyEncode | null = null
  public vault: VaultService | null = null
  public vaultItem: VaultItemService | null = null
  public appInfo: AppService | null = null
  private _lock: boolean = false
  public ali_drive: AliDrive | null = null
  private _lock_timeout: number = 0
  private _logined: boolean = false
  public user: UserService | null = null
  public db_helper: SqliteHelper = new SqliteHelper()
  private _set_path: string = ''
  private checkInterval: NodeJS.Timeout | null = null

  private set: AppSet = {
    lang: Default_Lang,
    app_ver: APP_VER_CODE,
    sql_ver: SQL_VER_CODE,
    cur_user_uid: 0
  }

  private static instance: AppModel
  public static getInstance() {
    if (!AppModel.instance) {
      AppModel.instance = new AppModel()
    }
    return AppModel.instance
  }

  constructor() {
    //empty
  }

  Quit() {
    globalShortcut.unregisterAll()
    if (this.checkInterval) clearInterval(this.checkInterval)
  }

  async init() {
    Log.initialize()
    Log.info('init myencode')
    this.myencode = new MyEncode()
    Log.info('init entity')
    this.vault = new VaultService()
    this.vaultItem = new VaultItemService()
    this.user = new UserService()
    this.appInfo = new AppService()
    Log.info('begin open db')
    await this.db_helper.OpenDb()
    Log.info('init tables')
    await this.db_helper.initOneTable(this.user.entity)
    await this.db_helper.initOneTable(this.vault.entity)
    await this.db_helper.initOneTable(this.vaultItem.entity)
    await this.db_helper.initOneTable(this.appInfo.entity)
    this._initSet()
    this.ali_drive = new AliDrive()
    this.initLang()
    app.setPath('crashDumps', path.join(PathHelper.getHomeDir(), 'crashs'))
    crashReporter.start({
      productName: 'MyElectron',
      companyName: 'MyCompany',
      uploadToServer: false
    })
    this.initWin()
    initAllApi()
    this.initGlobalShortcut()
    app.on('browser-window-blur', (_, windows: BrowserWindow) => {
      AppEvent.emit(AppEventType.windowBlur, windows)
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

  public get aliyunData() {
    return this.set.aliyun_data
  }

  public setAliyunData(data: AliyunData) {
    this.set.aliyun_data = data
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
    this.initGlobalShortcut()
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

  public initGlobalShortcut() {
    let setinfo = defaultUserSetInfo
    const curuserinfo = this.curUserInfo()
    if (curuserinfo) {
      setinfo = curuserinfo.user_set as UserSetInfo
    }
    globalShortcut.unregisterAll()
    Object.keys(setinfo).forEach((key) => {
      if (key.startsWith('shortcut_global')) {
        const value = setinfo[key]
        if (value && value.length > 0) {
          const res = globalShortcut.register(value, () => {
            if (key == 'shortcut_global_open_main') this.mainwin?.show()
            if (key == 'shortcut_global_quick_find') this.quickwin?.show()
            if (key == 'shortcut_global_quick_lock') this.LockApp()
          })
          Log.info('register global key:', value, res)
        }
      }
    })
  }

  public IsKeyRegisted(key: string) {
    return globalShortcut.isRegistered(key)
  }

  private last_point = { x: 0, y: 0 }

  setLastPoint(point: { x: number; y: number }) {
    this.last_point = point
  }

  async AutoFill(info: VaultItem) {
    this.quickwin.hide()
    if (info.vault_item_type == VaultItemType.Login) {
      const logininfo = info.info as LoginPasswordInfo
      robot.moveMouse(this.last_point.x, this.last_point.y)
      robot.mouseClick()
      robot.typeString(logininfo.username)
      robot.keyTap('tab')
      robot.typeString(logininfo.password)
      robot.keyTap('enter')
    }
  }

  getScreenPoint() {
    return screen.getCursorScreenPoint()
  }

  private async BackupFile(srcpath: string, backup_path: string) {
    Log.info(`backup file begin:${srcpath}`)
    const filename = path.basename(srcpath)
    const dest = path.join(backup_path, filename)
    return new Promise((resolve, reject) => {
      fs.copyFile(srcpath, dest, (err) => {
        if (err) {
          Log.error(`backup file error:${srcpath}->${dest}`, err)
          reject(false)
        } else {
          Log.info(`backup file ok:${srcpath}->${dest}`)
          resolve(true)
        }
      })
    })
  }
  //生成备份
  async BackupSystem(): Promise<string> {
    let res: string | null = null
    try {
      const back_dir_name = `backup_${Math.ceil(new Date().getTime() / 1000)}`
      const backup_path_dir = path.join(PathHelper.getHomeDir(), 'backup')
      if (!fs.existsSync(backup_path_dir)) {
        fs.mkdirSync(backup_path_dir)
      }
      const backup_path = path.join(backup_path_dir, back_dir_name)
      if (!fs.existsSync(backup_path)) {
        fs.mkdirSync(backup_path)
      }
      await this.db_helper.CloseDB()
      // await this.sleep(2000)
      const dbpath = this.db_helper.getDbPath()
      await this.BackupFile(dbpath, backup_path)
      await this.BackupFile(this._set_path, backup_path)
      await this.BackupFile(this.myencode.getKeyPath(), backup_path)
      const zip_file = path.join(backup_path_dir, `${back_dir_name}.zip`)
      await zl.archiveFolder(backup_path, zip_file)
      res = zip_file
    } catch (e) {
      Log.error('gen backup error:', e)
      AppEvent.emit(AppEventType.Message, 'error', LangHelper.getString('main.backup.error'))
    }
    await this.db_helper.OpenDb()
    return res
  }

  async RecoverSystemFromBackup() {
    let res = true
    try {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'zip', extensions: ['zip'] }]
      })

      if (canceled || !filePaths || filePaths.length == 0) {
        AppEvent.emit(
          AppEventType.Message,
          'error',
          LangHelper.getString('main.backup.filenotselect')
        )
        return false
      }
      res = await this.RecoverSystemFromBackupFile(filePaths[0])
    } catch (e) {
      Log.error('restore backup error:', e)
      res = false
      AppEvent.emit(AppEventType.Message, 'error', LangHelper.getString('main.backup.error'))
    }
    return res
  }

  //还原备份
  async RecoverSystemFromBackupFile(zipfile_path: string) {
    let res = true
    try {
      if (fs.existsSync(zipfile_path) == false) {
        Log.error('zip file not exists:', zipfile_path)
        AppEvent.emit(
          AppEventType.Message,
          'error',
          LangHelper.getString('main.backup.zipfilenotfound', zipfile_path)
        )
        return false
      }
      await this.db_helper.CloseDB()
      const fiename = path.basename(zipfile_path.replace('.zip', ''))
      const backup_path = path.join(PathHelper.getHomeDir(), fiename)
      Log.info(`extract backup file:${zipfile_path}->${backup_path}`)
      await zl.extract(zipfile_path, backup_path)

      const restoreFile = (dest: string) => {
        const destfile = path.basename(dest)
        const srcpath = path.join(backup_path, destfile)
        if (fs.existsSync(srcpath) == false) {
          Log.error('restore file not exists:', srcpath)
          AppEvent.emit(
            AppEventType.Message,
            'error',
            LangHelper.getString('main.backup.zipfilenotfound', srcpath)
          )
          return false
        }
        fs.copyFileSync(srcpath, dest)
        Log.info(`restore file ok:${srcpath}->${dest}`)
        return true
      }

      const restoreAll = () => {
        const dbpath = this.db_helper.getDbPath()
        if (restoreFile(dbpath) == false) return false
        if (restoreFile(this._set_path) == false) return false
        if (restoreFile(this.myencode.getKeyPath()) == false) return false
        return true
      }
      if (restoreAll() === true) this.myencode.LoadSet()
      else res = false
    } catch (e) {
      Log.error('restore backup error:', e)
      res = false
      AppEvent.emit(AppEventType.Message, 'error', LangHelper.getString('main.backup.error'))
    }
    Log.info('recover system from backup:', res)
    await this.db_helper.OpenDb()
    return res
  }

  async BackupByAliyun() {
    if (this.ali_drive.needAuth()) {
      this.ali_drive.auth()
      return null
    }
    const zip_file = await this.BackupSystem()
    if (zip_file == null) return null
    const filename = path.basename(zip_file)
    await this.ali_drive.uploadFile(filename, zip_file)
    return `${this.ali_drive.parent_dir_name}/${filename}`
  }

  async RecoverByAliyun(backup_file_name: string) {
    if (this.ali_drive.needAuth()) {
      this.ali_drive.auth()
      return
    }
    const backup_path_dir = path.join(PathHelper.getHomeDir(), 'backup_aliyun')
    if (fs.existsSync(backup_path_dir) == false) {
      fs.mkdirSync(backup_path_dir)
    }
    const backup_file_path = path.join(backup_path_dir, backup_file_name)
    await this.ali_drive.downloadFile(backup_file_name, backup_file_path)
    await this.RecoverSystemFromBackupFile(backup_file_path)
  }

  async GetAliyunBackupList() {
    if (this.ali_drive.needAuth()) {
      this.ali_drive.auth()
      return []
    }
    return await this.ali_drive.getLatestFiliList('zip', 'file')
  }

  //导入
  async ImportCsvFile() {}

  //导出
  async ExportCsvFile() {
    return
  }
}

export default AppModel
