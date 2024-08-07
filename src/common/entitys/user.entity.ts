import { Column, Entity } from '@common/decorator/db.decorator'
import { BaseEntity } from './db.entity'
import { UserSetInfo } from './app.entity'

export interface RegisterInfo {
  username: string
  password: string
  password_repeat: string
}

export interface LoginInfo {
  username: string
  password: string
}

export interface LastUserInfo {
  user: User
  has_init_key: boolean
}

export interface CurUserInfo {
  user: User
  has_init_key: boolean
}

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Column({ type: 'VARCHAR', unique_index: true, index_name: 'username_index' })
  username: string
  @Column({ type: 'VARCHAR', unique_index: false, index_name: 'nickname_index' })
  nickname: string
  @Column({ type: 'VARCHAR' })
  user_set: string | UserSetInfo
}
