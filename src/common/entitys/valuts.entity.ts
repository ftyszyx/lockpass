import { Column, Entity } from '@common/decorator/db.decorator'
import { BaseEntity } from './db.entity'

@Entity({ name: 'vault' })
export class Vault extends BaseEntity {
  // @Column({ type: 'INTEGER', primary: true, unique: true })
  // id: number
  @Column({ type: 'VARCHAR', unique: true })
  name: string
  @Column({ type: 'VARCHAR' })
  icon: string
  @Column({ type: 'VARCHAR' })
  desc: string
}
