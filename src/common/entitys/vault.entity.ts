import { Column, Entity } from '@common/decorator/db.decorator'
import { BaseEntity } from './db.entity'

@Entity({ name: 'vault' })
export class Vault extends BaseEntity {
  @Column({
    type: 'VARCHAR',
    encode: true,
    unique_index: true,
    index_name: 'name_index',
    notNull: true
  })
  name: string
  @Column({ type: 'INTEGER', notNull: true })
  user_id: number
  @Column({ type: 'VARCHAR' })
  icon: string
  @Column({ type: 'VARCHAR', encode: true })
  info: string
}
