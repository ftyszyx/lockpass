import { LastUserInfo, LoginInfo, RegisterInfo, User } from '@common/entitys/user.entity'
import { BaseService } from './base.service'
import AppModel from '@main/models/app.model'
import { LangHelper } from '@common/lang'
import { ApiResp, ApiRespCode } from '@common/entitys/app.entity'

export class UserService extends BaseService<User> {
  constructor() {
    super(new User())
  }

  public async Login(info: LoginInfo): Promise<ApiResp<User>> {
    const users = await super.GetOne('username', info.username)
    if (users.length <= 0) {
      return { code: ApiRespCode.user_notfind }
    }
    const res = AppModel.getInstance().myencode.Login(users[0], info.password)
    if (res == ApiRespCode.SUCCESS) {
      AppModel.getInstance().set.cur_user_uid = users[0].id
      AppModel.getInstance().saveSet()
      return {
        code: ApiRespCode.SUCCESS,
        data: users[0]
      }
    }
    return { code: res }
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

  public async Register(info: RegisterInfo): Promise<void> {
    const users = await super.GetOne('username', info.username)
    if (users.length > 0) {
      return Promise.reject(new Error(LangHelper.getString('userservice.register.userexist')))
    }
    await super.AddOne({ username: info.username, set: '' } as User)
    const userinfo = await super.GetOne('username', info.username)
    AppModel.getInstance().myencode.Register(userinfo[0], info.password)
  }

  public async GetAll(): Promise<User[]> {
    const all_users = await super.GetAll()
    return all_users
  }
}
