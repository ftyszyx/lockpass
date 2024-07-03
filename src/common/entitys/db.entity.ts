import { Column } from '@common/decorator/db.decorator'

export class BaseEntity {
  @Column({ type: 'INTEGER', primary: true, unique: true })
  id: number
}

export interface WhereDef {
  [key: string]: any
  andor?: 'AND' | 'OR'
  page?: number
  page_size?: number
}
