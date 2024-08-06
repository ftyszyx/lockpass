import { Column, Entity } from '@common/decorator/db.decorator'
import { BaseEntity } from './db.entity'

@Entity({ name: 'valut_item' })
export class VaultItem extends BaseEntity {
  @Column({ type: 'INTEGER', notNull: true })
  user_id: number

  @Column({ type: 'INTEGER', notNull: true })
  valut_id: number

  @Column({ type: 'VARCHAR', notNull: true, comment: '密码类型' })
  vault_item_type: string

  @Column({ type: 'VARCHAR', notNull: true })
  icon: string

  @Column({ type: 'VARCHAR', encode: true, notNull: true })
  name: string

  @Column({ type: 'VARCHAR', encode: true, default: '' })
  info: string | object

  @Column({ type: 'VARCHAR', encode: true, default: '' })
  remarks: string

  @Column({ type: 'INTEGER', default: 0 })
  last_use_time: number
}

export interface LoginPasswordInfo {
  username: string
  password: string
  urls: string[]
}

export interface CardPasswordInfo {
  card_company: string
  card_number: string
  card_password: string
}

export interface NoteTextPasswordInfo {
  note_text: string
}
