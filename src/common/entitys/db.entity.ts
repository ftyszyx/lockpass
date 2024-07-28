import { Column } from '@common/decorator/db.decorator'

export class BaseEntity {
  @Column({ type: 'INTEGER', primary: true, unique: true })
  id: number
}

export type SearchField<T> = {
  [P in keyof T]?: any
}
export interface WhereDef<T> {
  cond: SearchField<T>
  // [key: string]: any
  andor?: 'AND' | 'OR'
  page?: number
  page_size?: number
}
