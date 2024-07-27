import { LastUserInfo, LoginInfo, RegisterInfo, User } from '@common/entitys/user.entity'
import { BaseService } from './base.service'
import AppModel from '@main/models/app.model'
import { ApiResp, ApiRespCode } from '@common/entitys/app.entity'
import { Log } from '@main/libs/log'
import DbHlper from '@main/libs/db_help'

export class UserService extends BaseService<User> {
  constructor() {
    super(new User())
  }

  public async Login(info: LoginInfo): Promise<ApiResp<User>> {
    const users = await super.GetOne('username', info.username)
    if (users.length <= 0) {
      return { code: ApiRespCode.user_notfind }
    }
    const res: ApiResp<User> = { code: ApiRespCode.Other_err }
    try {
      const res_code = AppModel.getInstance().myencode.Login(users[0], info.password)
      res.code = res_code
      if (res_code == ApiRespCode.SUCCESS) {
        AppModel.getInstance().set.cur_user_uid = users[0].id
        AppModel.getInstance().saveSet()
        res.data = users[0]
      }
    } catch (e: any) {
      Log.Exception(e)
    } finally {
      return res
    }
  }

  public async GetLastUserInfo(): Promise<LastUserInfo> {
    const last_userid = AppModel.getInstance().set.cur_user_uid
    let res = { user: null, has_init_key: false }
    if (last_userid) {
      const user = await super.GetOne('id', last_userid)
      if (user.length > 0) {
        res.user = user[0]
        res.has_init_key = AppModel.getInstance().myencode.hasKey(res.user)
      }
    }
    return res
  }

  public async HasLogin(): Promise<boolean> {
    return AppModel.getInstance().myencode.HasLogin()
  }

  public async Logout(): Promise<void> {
    return AppModel.getInstance().myencode.LoginOut()
  }

  public async Register(info: RegisterInfo): Promise<ApiResp<null>> {
    const users = await super.GetOne('username', info.username)
    if (users.length > 0) {
      return { code: ApiRespCode.user_exit }
    }
    let res = { code: ApiRespCode.Other_err }
    try {
      await DbHlper.instance().beginTransaction()
      await super.AddOne({ username: info.username, set: '' } as User)
      const userinfo = await super.GetOne('username', info.username)
      AppModel.getInstance().myencode.Register(userinfo[0], info.password)
      DbHlper.instance().commitTransaction()
      res.code = ApiRespCode.SUCCESS
    } catch (e: any) {
      Log.Exception(e)
      await DbHlper.instance().rollbackTransaction()
    } finally {
      return res
    }
  }

  public async GetAll(): Promise<User[]> {
    const all_users = await super.GetAll()
    return all_users
  }
}
