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

  public async GetLastUserInfo(): Promise<ApiResp<LastUserInfo>> {
    console.log('get last user info')
    const ret: ApiResp<LastUserInfo> = {
      code: ApiRespCode.other_err,
      data: { user: null, has_init_key: false }
    }
    const last_userid = AppModel.getInstance().set.cur_user_uid
    if (last_userid) {
      const user = await super.GetOne('id', last_userid)
      if (user.length > 0) {
        ret.data.user = user[0]
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
    AppModel.getInstance().myencode.LoginOut()
    return res
  }

  public async Register(info: RegisterInfo): Promise<ApiResp<null>> {
    const res: ApiResp<null> = { code: ApiRespCode.SUCCESS }
    const users = await super.GetOne('username', info.username)
    if (!users || users.length <= 0) {
      res.code = ApiRespCode.user_notfind
    }
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
    }
    return res
  }

  public async GetAll(): Promise<ApiResp<User[]>> {
    return await super.GetAll()
  }
}
