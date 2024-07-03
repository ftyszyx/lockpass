import { User } from '@common/entitys/user.entity'
import { BaseService } from './base.service'

export class UserService extends BaseService<User> {
  constructor() {
    super(new User())
  }
}
