import { Column, Entity } from '@common/decorator/db.decorator'
import { BaseEntity } from './db.entity'

@Entity({ name: 'valut_item' })
export class VaultItem extends BaseEntity {
  @Column({ type: 'INTEGER', notNull: true })
  user_id: number

  @Column({ type: 'INTEGER', notNull: true })
  valut_id: number

  @Column({ type: 'VARCHAR', comment: '密码类型' })
  passwordType: string

  @Column({ type: 'VARCHAR' })
  icon: string

  @Column({ type: 'VARCHAR' })
  name: string

  @Column({ type: 'VARCHAR', encode: true })
  remarks: string

  @Column({ type: 'VARCHAR', encode: true })
  info: string
}
