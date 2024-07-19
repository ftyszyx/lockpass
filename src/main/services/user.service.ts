import { User } from '@common/entitys/user.entity'
import { BaseService } from './base.service'
import AppModel from '@main/models/app.model'

export class UserService extends BaseService<User> {
  constructor() {
    super(new User())
  }

  public async GetAll(): Promise<User[]> {
    const all_users = await super.GetAll()
    all_users.forEach((user) => {
      user.password = ''
    })
    console.log('get all users', all_users)
    return all_users
  }

  public async SelectOne(username: string): Promise<void> {
    console.log('select one', username)
    const users = await super.GetOne('username', username)
    if (users.length <= 0) {
      return Promise.reject(new Error('User not found'))
    }
    AppModel.getInstance().myencode.PassHash = users[0].password
  }
}
