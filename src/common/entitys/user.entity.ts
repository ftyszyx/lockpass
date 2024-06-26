import { Column, Entity } from '@common/decorator/db.decorator'
import { BaseEntity } from './db.entity'

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Column({ type: 'INTEGER', primary: true, unique: true })
  id: number
  @Column({ type: 'VARCHAR', unique: true, index_name: 'username_index' })
  username: string
  @Column({ type: 'VARCHAR' })
  password: string
  @Column({ type: 'VARCHAR' })
  set: string
}
