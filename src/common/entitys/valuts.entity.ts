import { Column, Entity } from '@common/decorator/db.decorator'

@Entity({ name: 'vault' })
export class Vault {
  @Column({ type: 'INTEGER', primary: true, unique: true })
  id: number
  @Column({ type: 'VARCHAR', unique: true })
  name: string
}
