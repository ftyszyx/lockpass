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
import { Icon_type, VaultItemType } from '@common/gloabl'
import { MainWindow } from '@main/windows/window.main'
import { QuickSearchWindow } from '@main/windows/window.quicksearch'
import { MyTray } from '@main/windows/mytray'
import { initAllApi } from '@main/api/index.api'
import robot from 'robotjs_addon'
import { defaultUserSetInfo, UserSetInfo } from '@common/entitys/app.entity'
import { AppEvent, AppEventType } from '@main/entitys/appmain.entity'
import {
  Csv2TableCol,
  GetExportFieldList,
  getVaultImportItems,
  LoginPasswordInfo,
  TableCol2Csv,
  VaultImportType,
  VaultItem
} from '@common/entitys/vault_item.entity'
import zl from 'zip-lib'
import { SqliteHelper } from '@main/libs/sqlite_help'
import { AppService } from '@main/services/app.service'
import { AliDrive } from '@main/libs/ali_drive'
import { ShowErrToMain } from '@main/libs/other.help'
import { GetImportVaultName, str2csv } from '@common/help'
import { ParseCsvFile } from '@main/libs/csv_parser'
import { AppSetModel } from './app.set'

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
  private checkInterval: NodeJS.Timeout | null = null
  set: AppSetModel | null = null
  static App_quit = false

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
    AppModel.App_quit = true
    Log.Info('app quit begin')
    AppEvent.emit(AppEventType.APPQuit)
    this.db_helper.CloseDB()
    globalShortcut.unregisterAll()
    if (this.checkInterval) clearInterval(this.checkInterval)
    Log.Info('app quit')
    app.quit()
  }

  async init() {
    Log.initialize()
    process.on('uncaughtException', (err) => {
      Log.Exception(err, 'uncaughtException')
      console.log(err.stack)
    })
    this.set = new AppSetModel()
    Log.Info('init win')
    this.initWin()
    initAllApi()
    Log.Info('init myencode')
    this.myencode = new MyEncode()
    Log.Info('init entity')
    this.vault = new VaultService()
    this.vaultItem = new VaultItemService()
    this.user = new UserService()
    this.appInfo = new AppService()
    Log.Info('begin open db')
    await this.db_helper.OpenDb()
    Log.Info('init tables')
    await this.db_helper.initOneTable(this.user.entity)
    await this.db_helper.initOneTable(this.vault.entity)
    await this.db_helper.initOneTable(this.vaultItem.entity)
    await this.db_helper.initOneTable(this.appInfo.entity)
    this.ali_drive = new AliDrive()
    app.setPath('crashDumps', path.join(PathHelper.getHomeDir(), 'crashs'))
    crashReporter.start({
      productName: 'MyElectron',
      companyName: 'MyCompany',
      uploadToServer: false
    })
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

  public IsSystemInit() {
    const lastuserid = this.set.GetLastUserId()
    if (lastuserid) return AppModel.getInstance().myencode.hasKey(lastuserid)
    return false
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
    this._logined = true
    this._lock = false
    const setinfo = this.user.userinfo.user_set as UserSetInfo
    this._lock_timeout = new Date().getTime() / 1000 + setinfo.normal_autolock_time * 60
    this.set.SetLastUserId(uid)
    this.initGlobalShortcut()
    AppEvent.emit(AppEventType.LoginOk)
  }

  public IsLogin() {
    return this._logined
  }

  public LoginOut() {
    this.myencode?.LoginOut()
    this._logined = false
    this._lock = true
    AppEvent.emit(AppEventType.LoginOut)
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
          Log.Info('register global key:', value, res)
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
    Log.Info(`backup file begin:${srcpath}`)
    const filename = path.basename(srcpath)
    const dest = path.join(backup_path, filename)
    return new Promise((resolve, reject) => {
      fs.copyFile(srcpath, dest, (err) => {
        if (err) {
          Log.Error(`backup file error:${srcpath}->${dest}`, err)
          reject(false)
        } else {
          Log.Info(`backup file ok:${srcpath}->${dest}`)
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
      const dbpath = this.db_helper.getDbPath()
      await this.BackupFile(dbpath, backup_path)
      await this.BackupFile(this.set.set_path, backup_path)
      await this.BackupFile(this.myencode.getKeyPath(), backup_path)
      const zip_file = path.join(backup_path_dir, `${back_dir_name}.zip`)
      await zl.archiveFolder(backup_path, zip_file)
      res = zip_file
    } catch (e) {
      Log.Error('gen backup error:', e)
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
      Log.Error('restore backup error:', e)
      res = false
      AppEvent.emit(AppEventType.Message, 'error', LangHelper.getString('main.backup.error'))
    }
    return res
  }

  //还原备份
  async RecoverSystemFromBackupFile(zipfile_path: string) {
    let res = true
    const fiename = path.basename(zipfile_path.replace('.zip', ''))
    const backup_path = path.join(PathHelper.getHomeDir(), fiename)
    try {
      if (fs.existsSync(zipfile_path) == false) {
        Log.Error('zip file not exists:', zipfile_path)
        AppEvent.emit(
          AppEventType.Message,
          'error',
          LangHelper.getString('main.backup.zipfilenotfound', zipfile_path)
        )
        return false
      }
      await this.db_helper.CloseDB()
      Log.Info(`extract backup file:${zipfile_path}->${backup_path}`)
      await zl.extract(zipfile_path, backup_path)

      const restoreFile = (dest: string) => {
        const destfile = path.basename(dest)
        const srcpath = path.join(backup_path, destfile)
        if (fs.existsSync(srcpath) == false) {
          Log.Error('restore file not exists:', srcpath)
          AppEvent.emit(
            AppEventType.Message,
            'error',
            LangHelper.getString('main.backup.zipfilenotfound', srcpath)
          )
          return false
        }
        fs.copyFileSync(srcpath, dest)
        Log.Info(`restore file ok:${srcpath}->${dest}`)
        return true
      }

      const restoreAll = () => {
        const dbpath = this.db_helper.getDbPath()
        if (restoreFile(dbpath) == false) return false
        if (restoreFile(this.set.set_path) == false) return false
        if (restoreFile(this.myencode.getKeyPath()) == false) return false
        return true
      }
      if (restoreAll() === true) this.myencode.LoadSet()
      else res = false
    } catch (e) {
      Log.Error('restore backup error:', e)
      res = false
      AppEvent.emit(AppEventType.Message, 'error', LangHelper.getString('main.backup.error'))
    }
    Log.Info('recover system from backup:', res)
    fs.rmSync(backup_path, { recursive: true, force: true })
    await this.db_helper.OpenDb()
    return res
  }
  //aliyun drive
  private async checkAlidriveAuth(): Promise<boolean> {
    const needauth = await this.ali_drive?.needAuth()
    if (needauth) {
      this.ali_drive.auth()
      AppEvent.emit(
        AppEventType.Message,
        'error',
        LangHelper.getString('mydropmenu.aliyunneedauth')
      )
      return false
    }
    return true
  }

  async BackupByAliyun(): Promise<string | null> {
    if ((await this.checkAlidriveAuth()) == false) return null
    const zip_file = await this.BackupSystem()
    if (zip_file == null) return null
    const filename = path.basename(zip_file)
    Log.Info(`begin upload file ${zip_file} to aliyun:`)
    try {
      await this.ali_drive.UploadFile(filename, zip_file)
    } catch (e: any) {
      Log.Exception(e, 'upload file error:', e.message)
      ShowErrToMain(LangHelper.getString('alidrive.uploaderror'))
      return null
    }
    Log.Info('upload file ok')
    return `${this.ali_drive.parent_dir_name}/${filename}`
  }

  async RecoverByAliyun(backup_file_name: string) {
    Log.Info(`begin download file ${backup_file_name} from aliyun:`)
    if ((await this.checkAlidriveAuth()) == false) return null
    const backup_path_dir = path.join(PathHelper.getHomeDir(), 'backup_aliyun')
    if (fs.existsSync(backup_path_dir) == false) {
      fs.mkdirSync(backup_path_dir)
    }
    const backup_file_path = path.join(backup_path_dir, backup_file_name)
    await this.ali_drive.downloadFile(backup_file_name, backup_file_path)
    const res = await this.RecoverSystemFromBackupFile(backup_file_path)
    if (res) Log.Info('recover system from aliyun ok')
    return res
  }

  async GetAliyunBackupList() {
    if ((await this.checkAlidriveAuth()) == false) return []
    return await this.ali_drive.getLatestFiliList('zip', 'file')
  }

  //导入
  async ImportCsv(import_type: VaultImportType): Promise<boolean> {
    const cur_user = this.curUserInfo()
    let res = true
    try {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        title: LangHelper.getString(
          'importcsvtype.opencsvtitle',
          LangHelper.getString(`importcsvtype.${import_type}`)
        ),
        properties: ['openFile'],
        filters: [{ name: 'csv', extensions: ['csv'] }]
      })
      if (canceled || !filePaths || filePaths.length == 0) {
        AppEvent.emit(
          AppEventType.Message,
          'error',
          LangHelper.getString('main.import.filenotselect')
        )
        return false
      }
      Log.Info('import csv file:', filePaths[0])
      const add_vault_name = GetImportVaultName(import_type)
      let vault_old = await this.vault.GetOne({ user_id: cur_user.id, name: add_vault_name })
      if (!vault_old) {
        await this.vault.AddOne({
          user_id: cur_user.id,
          name: add_vault_name,
          icon: `icon-${import_type.toString()}`
        })
        vault_old = await this.vault.GetOne({ user_id: cur_user.id, name: add_vault_name })
        if (vault_old == null) {
          throw new Error('add vault error')
        }
      }
      Log.Info(`get vault ok:${add_vault_name}`)
      const filepath = filePaths[0]
      const results = await ParseCsvFile(filepath)
      const importitems = getVaultImportItems(import_type)
      const vaultitems = []
      for (let i = 0; i < results.rows.length; i++) {
        const info = {
          user_id: cur_user.id,
          vault_id: vault_old.id,
          vault_item_type: VaultItemType.Login,
          icon: Icon_type.icon_login
        }
        for (let j = 0; j < results.headers.length; j++) {
          const filed_name = results.headers[j].trim()
          const value = results.rows[i][filed_name].trim()
          const importinfo = importitems[filed_name]
          if (importinfo == null) continue
          Csv2TableCol(info, importinfo, value)
        }
        vaultitems.push(info)
      }
      await this.vaultItem.AddMany(vaultitems)
    } catch (e: any) {
      Log.Exception(e, 'import csv file error:')
      AppEvent.emit(AppEventType.Message, 'error', LangHelper.getString('importcsvtype.error'))
      res = false
    }
    return res
  }

  //导出
  async ExportCsv() {
    try {
      const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openDirectory']
      })
      if (canceled || !filePaths || filePaths.length == 0) {
        AppEvent.emit(
          AppEventType.Message,
          'error',
          LangHelper.getString('main.import.filenotselect')
        )
        return null
      }
      const csv_path = path.join(filePaths[0], 'export_lockpass.csv')
      Log.Info('export csv file:', csv_path)
      const userinfo = this.curUserInfo()
      const items = await this.vaultItem.GetMany({ cond: { user_id: userinfo.id } })
      const writestream = fs.createWriteStream(csv_path)
      const fieldlist = GetExportFieldList()
      const keylist = fieldlist.reduce((pre: string[], cur) => {
        pre.push(cur.db_key)
        return pre
      }, [])
      writestream.write(keylist.join(',') + '\n')
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        fieldlist.forEach((fieldinfo) => {
          const value = TableCol2Csv(item, fieldinfo)
          if (value == null || value == undefined) {
            writestream.write(',')
            return
          }
          writestream.write(`${str2csv(value)}`)
          writestream.write(',')
        })
        writestream.write('\n')
      }
      writestream.close()
      return csv_path
    } catch (e) {
      Log.Error('export csv file error:', e)
      AppEvent.emit(AppEventType.Message, 'error', LangHelper.getString('main.export.error'))
      return null
    }
  }
}

export default AppModel
