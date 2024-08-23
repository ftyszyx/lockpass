import { Column, Entity } from '@common/decorator/db.decorator'
import { BaseEntity } from './db.entity'
import { ColumnType } from '@common/decorator/db.decorator'

@Entity({ name: 'valut_item' })
export class VaultItem extends BaseEntity {
  @Column({ type: 'INTEGER', notNull: true })
  user_id: number

  @Column({ type: 'INTEGER', notNull: true })
  vault_id: number

  @Column({ type: 'VARCHAR', notNull: true, comment: '密码类型' })
  vault_item_type: string

  @Column({ type: 'VARCHAR', notNull: true })
  icon: string

  @Column({ type: 'VARCHAR', notNull: true })
  name: string

  @Column({ type: 'VARCHAR', encode: true, default: '' })
  info: string | object

  @Column({ type: 'VARCHAR', encode: true, default: '' })
  remarks: string

  @Column({ type: 'INTEGER', default: 0 })
  last_use_time: number
}

export class LoginPasswordInfo {
  @Column({ type: 'VARCHAR' })
  username: string
  @Column({ type: 'VARCHAR' })
  password: string
  @Column({ type: 'VARCHAR[]' })
  urls: string[]
}

export class CardPasswordInfo {
  @Column({ type: 'VARCHAR' })
  card_company: string
  @Column({ type: 'VARCHAR' })
  card_number: string
  @Column({ type: 'VARCHAR' })
  card_password: string
}

export class NoteTextPasswordInfo {
  @Column({ type: 'VARCHAR' })
  note_text: string
}

export enum VaultImportType {
  chrome = 'chrome',
  edge = 'edge'
}

export type TableImportColType = 'string' | 'number' | 'array'

export interface ImportItemInfo {
  key: string
  type: ColumnType
}

export function getVaultImportItems(type: VaultImportType): Record<string, ImportItemInfo> {
  if (type == VaultImportType.edge || type == VaultImportType.chrome) {
    return {
      name: { key: 'name', type: 'VARCHAR' },
      url: { key: 'info.urls', type: 'VARCHAR[]' },
      username: { key: 'info.username', type: 'VARCHAR' },
      password: { key: 'info.password', type: 'VARCHAR' },
      note: { key: 'remarks', type: 'VARCHAR' }
    }
  }
  return {}
}

export function Csv2TableCol(table_row: object, typeinfo: ImportItemInfo, csv_value: string) {
  if (csv_value == null) return
  const keys = typeinfo.key.split('.')
  let obj = table_row
  for (let i = 0; i < keys.length - 1; i++) {
    if (!obj[keys[i]]) obj[keys[i]] = {}
    obj = obj[keys[i]]
  }
  if (typeinfo.type == 'VARCHAR[]') {
    if (csv_value.startsWith('[') && csv_value.endsWith(']')) {
      obj[keys[keys.length - 1]] = JSON.parse(csv_value)
    } else {
      if (!obj[keys[keys.length - 1]]) obj[keys[keys.length - 1]] = []
      obj[keys[keys.length - 1]].push(csv_value)
    }
  } else {
    obj[keys[keys.length - 1]] = csv_value
  }
}

export function TableCol2Csv(table_row: object, key: string): string {
  const keys = key.split('.')
  let obj = table_row
  for (let i = 0; i < keys.length; i++) {
    obj = obj[keys[i]]
    if (obj == null) return null
  }
  if (obj == null) return ''
  if (obj instanceof Array) return JSON.stringify(obj)
  // if (obj instanceof Object) return JSON.stringify(obj)
  return obj.toString()
}

export function GetExportFieldList() {
  const fieldlist = []
  Object.keys(new VaultItem()).forEach((key) => {
    if (key == 'info') {
      Object.keys(new LoginPasswordInfo()).forEach((subkey) => {
        fieldlist.push(`info.${subkey}`)
      })
      Object.keys(new NoteTextPasswordInfo()).forEach((subkey) => {
        fieldlist.push(`info.${subkey}`)
      })
      Object.keys(new CardPasswordInfo()).forEach((subkey) => {
        fieldlist.push(`info.${subkey}`)
      })
    } else fieldlist.push(key)
  })
  return fieldlist
}
