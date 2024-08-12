import { LastUserInfo, LoginInfo, RegisterInfo, User } from '@common/entitys/user.entity'
import { BaseService } from './base.service'
import AppModel from '@main/models/app.model'
import {
  ApiResp,
  ApiRespCode,
  defaultUserSetInfo,
  EntityType,
  UserSetInfo
} from '@common/entitys/app.entity'
import { Log } from '@main/libs/log'
import { AppEvent, AppEventType } from '@main/entitys/appmain.entity'

export class UserService extends BaseService<User> {
  userinfo: User = null
  constructor() {
    super(new User())
    this.userinfo = null
  }

  public async Login(info: LoginInfo): Promise<ApiResp<User>> {
    const res: ApiResp<User> = { code: ApiRespCode.other_err }
    if (!info.username || !info.password) {
      res.code = ApiRespCode.form_err
      return res
    }
    try {
      const users = await super.GetOne('username', info.username)
      if (users.length <= 0) {
        res.code = ApiRespCode.user_notfind
        return res
      }
      const res_code = AppModel.getInstance().myencode.Login(users[0], info.password)
      res.code = res_code
      if (res_code == ApiRespCode.SUCCESS) {
        this.userinfo = users[0]
        AppModel.getInstance().Login(users[0].id)
        res.data = users[0]
      }
    } catch (e: any) {
      Log.Exception(e)
    }
    return res
  }

  public async GetLastUserInfo(): Promise<ApiResp<LastUserInfo>> {
    const ret: ApiResp<LastUserInfo> = {
      code: ApiRespCode.other_err,
      data: { user: null, has_init_key: false }
    }
    const last_userid = AppModel.getInstance().GetLastUserId()
    if (last_userid) {
      const user = await super.GetOne('id', last_userid)
      if (user.length > 0) {
        ret.data.user = user[0]
        this.userinfo = user[0]
        ret.data.has_init_key = AppModel.getInstance().myencode.hasKey(user[0])
        ret.code = ApiRespCode.SUCCESS
      }
    }
    return ret
  }

  public async HasLogin(): Promise<ApiResp<boolean>> {
    const res: ApiResp<boolean> = { code: ApiRespCode.SUCCESS }
    res.data = AppModel.getInstance().myencode.HasLogin()
    return res
  }

  public async Logout(): Promise<ApiResp<void>> {
    const res: ApiResp<void> = { code: ApiRespCode.SUCCESS }
    this.userinfo = null
    AppModel.getInstance().LoginOut()
    return res
  }

  public async Register(info: RegisterInfo): Promise<ApiResp<null>> {
    const res: ApiResp<null> = { code: ApiRespCode.SUCCESS }
    const users = await super.GetOne('username', info.username)
    if (users && users.length > 0) {
      res.code = ApiRespCode.user_exit
    }
    try {
      await AppModel.getInstance().db_helper.beginTransaction()
      await super.AddOne({ username: info.username, user_set: '' } as User)
      const userinfo = await super.GetOne('username', info.username)
      AppModel.getInstance().myencode.Register(userinfo[0], info.password)
      AppModel.getInstance().db_helper.commitTransaction()
      res.code = ApiRespCode.SUCCESS
    } catch (e: any) {
      res.code = ApiRespCode.db_err
      Log.Exception(e)
      await AppModel.getInstance().db_helper.rollbackTransaction()
    }
    return res
  }

  public async GetAll(): Promise<ApiResp<User[]>> {
    return await super.GetAll()
  }

  public async UpdateUser(user: User): Promise<ApiResp<User>> {
    return await super.UpdateOne2(user, true)
  }

  override fixEntityOut(item: User) {
    item.user_set = JSON.parse((item.user_set as string) || '{}') as UserSetInfo
    item.user_set = { ...defaultUserSetInfo, ...item.user_set }
    if (this.userinfo && this.userinfo.id == item.id) {
      this.userinfo = item
    }
  }
  override fiexEntityIn(entity: User): void {
    entity.user_set = JSON.stringify(entity.user_set)
  }

  AfterChange(): void {
    AppEvent.emit(AppEventType.UserChange)
    AppEvent.emit(AppEventType.DataChange, EntityType.user)
  }
}
