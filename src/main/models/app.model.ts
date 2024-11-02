/*
app main model
*/
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
import { Icon_type, SQL_VER_CODE, VaultItemType } from '@common/gloabl'
import { MainWindow } from '@main/windows/window.main'
import { QuickSearchWindow } from '@main/windows/window.quicksearch'
import { MyTray } from '@main/windows/mytray'
import { initAllApi } from '@main/api/index.api'
import robot from 'robotjs_addon'
import { ApiRespCode, defaultUserSetInfo, UserSetInfo } from '@common/entitys/app.entity'
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
import { ShowErrToMain } from '@main/libs/other.help'
import { GetImportVaultName, str2csv } from '@common/help'
import { ParseCsvFile } from '@main/libs/csv_parser'
import { AppSetModel } from './app.set'
import { BaseEntity, SearchField } from '@common/entitys/db.entity'
import { AutoUpdateHelper } from './auto.update'
import {
  checkAlidriveAuth,
  DownloadFileByDrive,
  updateFileByDrive
} from '@main/libs/drive/drive.manger'
import { BackupFileItem, DriveType } from '@common/entitys/drive.entity'
import { initDrive } from '@main/libs/drive/drive.manger'
class AppModel {
  public mainwin: MainWindow | null = null
  public quickwin: QuickSearchWindow | null = null
  public my_tray: MyTray | null = null
  public myencode: MyEncode | null = null
  public vault: VaultService | null = null
  public vaultItem: VaultItemService | null = null
  public appInfo: AppService | null = null
  private _lock: boolean = false
  private _lock_timeout: number = 0
  private _logined: boolean = false
  public user: UserService | null = null
  public db_helper: SqliteHelper = new SqliteHelper()
  private checkInterval: NodeJS.Timeout | null = null
  auto_update: AutoUpdateHelper = new AutoUpdateHelper()
  set: AppSetModel | null = null
  static App_quit = false

  private static instance: AppModel
  public static getInstance() {
    if (!AppModel.instance) {
      AppModel.instance = new AppModel()
    }
    return AppModel.instance
  }

  get isWin() {
    return process.platform === 'win32'
  }

  get isMac() {
    return process.platform === 'darwin'
  }

  get isLinux() {
    return process.platform === 'linux'
  }

  constructor() {
    AppEvent.on(AppEventType.SystemLock, () => {
      if (this.user.userinfo == null) return
      const userset = this.user.userinfo.user_set as UserSetInfo
      if (userset.normal_lock_with_pc) {
        Log.info('lock with pc')
        this.LockApp()
      }
    })
    //empty
    return
  }

  Quit() {
    AppModel.App_quit = true
    Log.info('app quit begin')
    AppEvent.emit(AppEventType.APPQuit)
    this.db_helper.CloseDB()
    globalShortcut.unregisterAll()
    if (this.checkInterval) clearInterval(this.checkInterval)
    Log.info('app quit')
    // app.quit()
  }

  async init() {
    Log.initialize()
    process.on('uncaughtException', (err) => {
      Log.Exception(err, 'uncaughtException')
      console.log(err.stack)
    })
    this.set = new AppSetModel()
    Log.info('init win')
    this.initWin()
    initAllApi()
    Log.info('init myencode')
    this.myencode = new MyEncode()
    Log.info('init entity')
    this.vault = new VaultService()
    this.vaultItem = new VaultItemService()
    this.user = new UserService()
    this.appInfo = new AppService()
    initDrive()
    Log.info('begin open db')
    await this.db_helper.OpenDb()
    Log.info('init tables')
    try {
      await this.db_helper.checkUpdate(this.set.sql_ver)
      await this.db_helper.initOneTable(this.user.entity)
      await this.db_helper.initOneTable(this.vault.entity)
      await this.db_helper.initOneTable(this.vaultItem.entity)
      await this.db_helper.initOneTable(this.appInfo.entity)
    } catch (e: any) {
      Log.error('init tables error:', e)
      app.quit()
      return
    }
    if (this.set.sql_ver != SQL_VER_CODE) {
      this.set.changeSqlVer(SQL_VER_CODE)
    }
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

    Log.info('check update')
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
    if (this.mainwin?.isFocused() || this.quickwin?.isFocused()) {
      this.extendLockTime()
      return
    }
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

  extendLockTime() {
    const setinfo = this.user.userinfo.user_set as UserSetInfo
    this._lock_timeout = new Date().getTime() / 1000 + setinfo.normal_autolock_time * 60
  }

  public Login(uid: number) {
    this._logined = true
    this._lock = false
    this.set.SetLastUserId(uid)
    this.extendLockTime()
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

  public hideAllWindow() {
    this.mainwin?.hide()
    this.quickwin?.hide()
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
            if (key == 'shortcut_global_hide_main') this.hideAllWindow()
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
      // console.log('move to ', this.last_point.x, this.last_point.y)
      robot.moveMouse(this.last_point.x, this.last_point.y)
      robot.keyTap('space', 'control') //切换成英文
      robot.mouseClick()
      robot.typeString(logininfo.username)
      robot.keyTap('tab')
      if (this.isWin) robot.typeKeyCodeStringInWin(logininfo.password)
      else robot.typeString(logininfo.password)
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
      const dbpath = this.db_helper.getDbPath()
      await this.BackupFile(dbpath, backup_path)
      await this.BackupFile(this.set.set_path, backup_path)
      await this.BackupFile(this.myencode.getKeyPath(), backup_path)
      const zip_file = path.join(backup_path_dir, `${back_dir_name}.zip`)
      await zl.archiveFolder(backup_path, zip_file)
      res = zip_file
    } catch (e) {
      Log.error('gen backup error:', e)
      AppEvent.emit(AppEventType.Message, 'error', LangHelper.getString('main.backup.error'))
    }
    await this.db_helper.OpenDb()
    this.set.set_vault_change_not_backup(false)
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
    const fiename = path.basename(zipfile_path.replace('.zip', ''))
    const backup_path = path.join(PathHelper.getHomeDir(), fiename)
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
        if (restoreFile(this.set.set_path) == false) return false
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
    fs.rmSync(backup_path, { recursive: true, force: true })
    await this.db_helper.OpenDb()
    return res
  }
  //aliyun drive

  async BackupByDrive(drive_type: DriveType, custom_name: string): Promise<string | null> {
    await checkAlidriveAuth(drive_type)
    const zip_file = await this.BackupSystem()
    if (zip_file == null) return null
    const filename = custom_name || path.basename(zip_file)
    Log.info(`begin upload file ${zip_file} to aliyun:${filename}`)
    let res: BackupFileItem | null = null
    try {
      res = await updateFileByDrive(drive_type, filename, zip_file)
    } catch (e: any) {
      Log.Exception(e, 'upload file error:', e.message)
      fs.unlinkSync(zip_file)
      ShowErrToMain(LangHelper.getString('alidrive.uploaderror'))
      return null
    }
    fs.unlinkSync(zip_file)
    Log.info('upload file ok')
    this.set.set_vault_change_not_backup(false)
    this.set.setCurUseBackupInfo({
      drive_type,
      file_name: filename,
      time: res.updated_at
    })
    return res.full_path
  }

  async RecoverByDrive(drive_type: DriveType, fileinfo: BackupFileItem) {
    Log.info(`begin download file ${fileinfo.name} from aliyun:`)
    await checkAlidriveAuth(drive_type)
    const backup_path_dir = path.join(PathHelper.getHomeDir(), 'backup_aliyun')
    if (fs.existsSync(backup_path_dir) == false) {
      fs.mkdirSync(backup_path_dir)
    }
    const backup_file_path = path.join(backup_path_dir, fileinfo.name)
    await DownloadFileByDrive(drive_type, fileinfo.name, backup_file_path)
    const res = await this.RecoverSystemFromBackupFile(backup_file_path)
    fs.unlinkSync(backup_file_path)
    if (res) Log.info('recover system from aliyun ok')
    this.set.setCurUseBackupInfo({
      drive_type,
      file_name: fileinfo.name,
      time: fileinfo.updated_at
    })
    return res
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
      Log.info('import csv file:', filePaths[0])
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
      Log.info(`get vault ok:${add_vault_name}`)
      const filepath = filePaths[0]
      const results = await ParseCsvFile(filepath)
      // console.log('get results:', results)
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
      Log.info('export csv file:', csv_path)
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
      Log.error('export csv file error:', e)
      AppEvent.emit(AppEventType.Message, 'error', LangHelper.getString('main.export.error'))
      return null
    }
  }

  async updteTable<T extends BaseEntity>(
    entity: T,
    cond: SearchField<T>,
    oldhash: Buffer,
    newhash: Buffer
  ) {
    this.myencode.setCurPassHashStr(oldhash)
    const total = await this.db_helper.GetTotalCount(entity, { cond })
    const pagesize = 100
    let page = Math.ceil(total / pagesize)
    for (let i = 0; i < page; i++) {
      this.myencode.setCurPassHashStr(oldhash)
      const items = await this.db_helper.GetMany(entity, {
        cond,
        page_size: pagesize,
        page: i
      })
      this.myencode.setCurPassHashStr(newhash)
      await this.db_helper.UpdateManyById(entity, items)
    }
  }

  async ChangeMainPassword(old_password: string, new_password: string) {
    const userinfo = this.user.userinfo
    if (userinfo == null) {
      AppEvent.emit(
        AppEventType.Message,
        'error',
        LangHelper.getString('main.change_pass.notlogin')
      )
      return false
    }
    const check_res = this.myencode?.CheckMainPass(userinfo, old_password)
    if (check_res.code != ApiRespCode.SUCCESS) {
      AppEvent.emit(AppEventType.Message, 'error', LangHelper.getString(`err.${check_res.code}`))
      return false
    }
    await this.db_helper.beginTransaction()
    const old_hash = this.myencode.getCurPassHashStr()
    try {
      const new_hash = this.myencode.GetNewHashbyNewPass(userinfo, new_password)
      Log.info('change main pass begin')
      await this.updteTable(this.vaultItem.entity, { user_id: userinfo.id }, old_hash, new_hash)
      Log.info('update vault item ok')
      await this.updteTable(this.vault.entity, { user_id: userinfo.id }, old_hash, new_hash)
      Log.info('update vault ok')
      await this.db_helper.commitTransaction()
      Log.info('table update')
      this.myencode.ChangeMainPass(userinfo, new_password)
      Log.info('update password ok')
      this.LoginOut()
    } catch (e: any) {
      Log.Exception(e, 'change main pass error:')
      await this.db_helper.rollbackTransaction()
      this.myencode.setCurPassHashStr(old_hash)
      return false
    } finally {
    }
    return true
  }

  powerOnOpen(open: boolean) {
    Log.info('poweronopen', open)
    if (app.isPackaged) {
      const ex = process.execPath
      Log.info('poweronopen1', open)
      app.setLoginItemSettings({
        openAtLogin: open,
        path: ex,
        args: []
      })
    }
  }
}

export default AppModel
