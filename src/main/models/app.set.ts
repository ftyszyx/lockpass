import { APP_VER_CODE, SQL_VER_CODE } from '@common/gloabl'
import { AliyunData } from '@main/libs/ali_drive/def'
import fs from 'fs'
import path from 'path'
import { PathHelper } from '@main/libs/path'
import { LogLevel } from '@common/entitys/log.entity'
import { LangHelper } from '@common/lang'
import { Log } from '@main/libs/log'
import { AppEvent, AppEventType } from '@main/entitys/appmain.entity'
import { app } from 'electron'

export interface AppSetInfo {
  lang?: string
  sql_ver: number
  app_ver: number
  cur_user_uid?: number
  log_level?: LogLevel
  open_dev?: boolean
  aliyun_data?: AliyunData
}

export interface TempSetInfo {
  vault_change_not_backup?: boolean
}

export class AppSetModel {
  private _set: AppSetInfo = {
    app_ver: APP_VER_CODE,
    sql_ver: SQL_VER_CODE,
    cur_user_uid: 0
  }
  private _temp_set: TempSetInfo = {
    vault_change_not_backup: false
  }
  private _set_path: string
  private _temp_set_path: string

  constructor() {
    this._set_path = path.join(PathHelper.getHomeDir(), 'set.json')
    this._temp_set_path = path.join(PathHelper.getHomeDir(), 'temp_set.json')
    let { info, change } = this.initSet(this._set_path, this.set)
    this._set = info
    if (this._set.lang === undefined) {
      const systemlan = app.getSystemLocale().toLowerCase()
      console.log('systemlan', systemlan)
      if (systemlan.indexOf('zh') >= 0) {
        this._set.lang = 'zh-cn'
      } else {
        this._set.lang = 'en-us'
      }
      change = true
    }
    if (change) {
      this.saveSet()
    }
    const { info: temp_info, change: temp_change } = this.initSet(
      this._temp_set_path,
      this._temp_set
    )
    this._temp_set = temp_info
    if (temp_change) {
      this.saveTempSet()
    }
    this.initLang()
    Log.log_level = this.set.log_level || LogLevel.Error
    this.set.log_level = Log.log_level
    Log.info('log level:', Log.log_level)
    // Log.Info('set:', JSON.stringify(this.set))
  }

  initSet(setpath: string, info: any): { info: any; change: boolean } {
    if (!fs.existsSync(setpath)) {
      fs.writeFileSync(setpath, JSON.stringify(info))
      return { info, change: false }
    } else {
      const saveinfo = JSON.parse(fs.readFileSync(setpath).toString())
      let have_new_property = false
      Object.keys(info).forEach((key) => {
        const initvalue = saveinfo[key]
        if (initvalue === undefined || initvalue === null) {
          saveinfo[key] = info[key]
          have_new_property = true
        }
      })
      return { info: saveinfo, change: have_new_property }
    }
  }

  get set() {
    return this._set
  }

  public saveSet() {
    fs.writeFileSync(this._set_path, JSON.stringify(this.set))
  }

  public saveTempSet() {
    fs.writeFileSync(this._temp_set_path, JSON.stringify(this._temp_set))
  }

  public set_vault_change_not_backup(flag: boolean) {
    this._temp_set.vault_change_not_backup = flag
    AppEvent.emit(AppEventType.VaultChangeNotBackup, flag)
    this.saveTempSet()
  }

  public get vault_change_not_backup() {
    return this._temp_set.vault_change_not_backup
  }

  public changeSqlVer(ver: number) {
    this.set.sql_ver = ver
    this.saveSet()
  }

  get log_level() {
    return this.set.log_level || LogLevel.Info
  }

  get sql_ver() {
    return this.set.sql_ver
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

  public SetLastUserId(uid: number) {
    this.set.cur_user_uid = uid
    this.saveSet()
  }

  public changeLang(lang: string) {
    this.set.lang = lang
    this.initLang()
    this.saveSet()
  }

  public CurLang() {
    return this.set.lang
  }

  public initLang() {
    LangHelper.setLang(this.set.lang)
  }

  get set_path() {
    return this._set_path
  }
}
