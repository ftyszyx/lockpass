import { Column, Entity } from '@common/decorator/db.decorator'
import { BaseEntity } from './db.entity'
export enum PasswordType {
  Login = 0,
  Card = 1, //银行卡
  NoteBook = 2
}

@Entity({ name: 'valut_item' })
export class VaultItem extends BaseEntity {
  @Column({ type: 'INTEGER' })
  valut_id: number
  @Column({ type: 'VARCHAR', comment: '密码类型' })
  passwordType: string
  @Column({ type: 'VARCHAR' })
  name: string

  @Column({ type: 'VARCHAR' })
  login_name: string
  @Column({ type: 'VARCHAR', hide: true })
  login_password: string
  @Column({ type: 'VARCHAR', hide: true })
  login_phone: string
  @Column({ type: 'VARCHAR' })
  login_email: string
  @Column({ type: 'VARCHAR[]' })
  login_url: string[]

  @Column({ type: 'VARCHAR' })
  card_bank: string
  @Column({ type: 'VARCHAR', hide: true })
  card_number: string
  @Column({ type: 'VARCHAR', hide: true })
  card_phone: string
  @Column({ type: 'VARCHAR', hide: true })
  card_code: string
  @Column({ type: 'VARCHAR' })
  card_date: string

  @Column({ type: 'VARCHAR', hide: true })
  note_txt: string
  @Column({ type: 'VARCHAR' })
  info: string
}
