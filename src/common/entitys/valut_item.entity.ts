import { Column, Entity } from '@common/decorator/db.decorator'
export enum PasswordType {
  Login = 0,
  Card = 1, //银行卡
  NoteBook = 2
}

@Entity({ name: 'valut_item' })
export class VaultItem {
  @Column({ type: 'INTEGER', primary: true, unique: true })
  id: number
  @Column({ type: 'INTEGER' })
  valut_id: number
  @Column({ type: 'INTEGER' })
  passwordType: number
  @Column({ type: 'VARCHAR' })
  name: string

  @Column({ type: 'VARCHAR' })
  login_name: string
  @Column({ type: 'VARCHAR' })
  login_password: string
  @Column({ type: 'VARCHAR' })
  login_phone: string
  @Column({ type: 'VARCHAR' })
  login_email: string
  @Column({ type: 'ARRAY' })
  login_url: string[]

  @Column({ type: 'VARCHAR' })
  card_bank: string
  @Column({ type: 'VARCHAR' })
  card_number: string
  @Column({ type: 'VARCHAR' })
  card_phone: string
  @Column({ type: 'VARCHAR' })
  card_code: string
  @Column({ type: 'VARCHAR' })
  card_date: string

  @Column({ type: 'VARCHAR' })
  note_txt: string
}
