import { Column, Entity } from '@common/decorator/db.decorator'

@Entity({ name: 'user' })
export class User {
  @Column({ type: 'INTEGER', primary: true, unique: true })
  id: number
  @Column({ type: 'VARCHAR', unique: true })
  username: string
  @Column({ type: 'VARCHAR' })
  password: string
  @Column({ type: 'VARCHAR' })
  set: string
}
