import { Column, Entity } from '@common/decorator/db.decorator'
import { BaseEntity } from './db.entity'

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Column({ type: 'VARCHAR', unique_index: true, index_name: 'username_index' })
  username: string
  @Column({ type: 'VARCHAR', select_hide: true })
  password: string
  @Column({ type: 'VARCHAR' })
  set: string
}
