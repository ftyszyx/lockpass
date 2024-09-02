import { APP_VER_CODE, Default_Lang, SQL_VER_CODE } from '@common/gloabl'
import { AliyunData } from '@main/libs/ali_drive/def'
import fs from 'fs'
import path from 'path'
import { PathHelper } from '@main/libs/path'
import { LogLevel } from '@common/entitys/log.entity'
import { LangHelper } from '@common/lang'
import { Log } from '@main/libs/log'
import { AppEvent, AppEventType } from '@main/entitys/appmain.entity'
import AppModel from './app.model'

export interface AppSetInfo {
  lang: string
  sql_ver: number
  app_ver: number
  cur_user_uid?: number
  log_level?: LogLevel
  open_dev?: boolean
  aliyun_data?: AliyunData
}

export class AppSetModel {
  private _set: AppSetInfo = {
    lang: Default_Lang,
    app_ver: APP_VER_CODE,
    sql_ver: SQL_VER_CODE,
    cur_user_uid: 0
  }
  private _set_path: string

  constructor() {
    this._set_path = path.join(PathHelper.getHomeDir(), 'set.json')
    if (!fs.existsSync(this._set_path)) {
      fs.writeFileSync(this._set_path, JSON.stringify(this.set))
    } else {
      const saveinfo = JSON.parse(fs.readFileSync(this._set_path).toString())
      let have_new_property = false
      Object.keys(this.set).forEach((key) => {
        const initvalue = saveinfo[key]
        if (initvalue === undefined || initvalue === null) {
          saveinfo[key] = this.set[key]
          have_new_property = true
        }
      })
      this._set = saveinfo
      if (have_new_property) {
        this.saveSet()
      }
    }
    this.initLang()
    Log.log_level = this.set.log_level || LogLevel.Error
    this.set.log_level = Log.log_level
    Log.Info('log level:', Log.log_level)
    // Log.Info('set:', JSON.stringify(this.set))
  }

  get set() {
    return this._set
  }

  public saveSet() {
    fs.writeFileSync(this._set_path, JSON.stringify(this.set))
  }

  get log_level() {
    return this.set.log_level || LogLevel.Info
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
