import {
  Column,
  ColumnTypeCatgory,
  Entity,
  getColumTypeCategory
} from '@common/decorator/db.decorator'
import { BaseEntity } from './db.entity'
import { Column_Type_KEY, VaultItemType } from '@common/gloabl'

@Entity({ name: 'vault_item' })
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

  @Column({ type: 'INTEGER', default: 0 })
  create_time: number
}

export class VaultItemInfoBase {}

export class LoginPasswordInfo extends VaultItemInfoBase {
  @Column({ type: 'VARCHAR' })
  username: string
  @Column({ type: 'VARCHAR' })
  password: string
  @Column({ type: 'VARCHAR[]' })
  urls: string[]
}

export class CardPasswordInfo extends VaultItemInfoBase {
  @Column({ type: 'VARCHAR' })
  card_company: string
  @Column({ type: 'VARCHAR' })
  card_number: string
  @Column({ type: 'VARCHAR' })
  card_password: string
  @Column({ type: 'VARCHAR' })
  card_holder: string
  @Column({ type: 'VARCHAR' })
  card_pub_site: string
  @Column({ type: 'VARCHAR' })
  card_cvc: string
  @Column({ type: 'VARCHAR' })
  card_valid_time: string
  @Column({ type: 'VARCHAR' })
  card_zip_code: string
}

export class NoteTextPasswordInfo extends VaultItemInfoBase {
  @Column({ type: 'VARCHAR' })
  note_text: string
}

export enum VaultImportType {
  chrome = 'chrome',
  edge = 'edge'
}

export type TableImportColType = 'string' | 'number' | 'array'

export interface ImportItemInfo {
  db_key: string
  csv_type: ColumnTypeCatgory
  db_type: ColumnTypeCatgory
}

export function getVaultInfoInstance(type: VaultItemType): VaultItemInfoBase {
  if (type == VaultItemType.Login) return new LoginPasswordInfo()
  if (type == VaultItemType.Card) return new CardPasswordInfo()
  if (type == VaultItemType.NoteBook) return new NoteTextPasswordInfo()
  return new VaultItemInfoBase()
}

export function getVaultImportItems(type: VaultImportType): Record<string, ImportItemInfo> {
  if (type == VaultImportType.edge || type == VaultImportType.chrome) {
    return {
      name: { db_key: 'name', csv_type: 'string', db_type: 'string' },
      url: { db_key: 'info.urls', csv_type: 'string', db_type: 'array' },
      username: { db_key: 'info.username', csv_type: 'string', db_type: 'string' },
      password: { db_key: 'info.password', csv_type: 'string', db_type: 'string' },
      note: { db_key: 'remarks', csv_type: 'string', db_type: 'string' }
    }
  }
  return {}
}

export function Csv2TableCol(table_row: object, typeinfo: ImportItemInfo, csv_value: string) {
  if (csv_value == null) return
  const keys = typeinfo.db_key.split('.')
  let obj = table_row
  for (let i = 0; i < keys.length - 1; i++) {
    if (!obj[keys[i]]) obj[keys[i]] = {}
    obj = obj[keys[i]]
  }
  const key = keys[keys.length - 1]
  if (typeinfo.db_type == 'array') {
    if (typeinfo.csv_type == 'string') {
      if (!obj[key]) obj[key] = []
      obj[key].push(csv_value)
    } else {
      obj[key] = csv_value.split('|')
    }
  } else {
    obj[key] = csv_value
  }
}

export function TableCol2Csv(obj: BaseEntity, fieldinfo: ImportItemInfo): string {
  const keys = fieldinfo.db_key.split('.')
  for (let i = 0; i < keys.length; i++) {
    obj = obj[keys[i]]
    if (obj == null) return null
  }
  if (obj === null || obj === undefined) return ''
  if (fieldinfo.db_type == 'array') return `${(obj as any).join('|')}`
  if (fieldinfo.db_type == 'string') return `${obj}`
  return obj.toString()
}

export function GetExportFieldList() {
  const fieldlist: ImportItemInfo[] = []
  const vault_entity = new VaultItem()
  const vault_login_entity = new LoginPasswordInfo()
  const vault_card_entity = new CardPasswordInfo()
  const vault_note_entity = new NoteTextPasswordInfo()
  const AddFiled = (entity_key: string, obj: object, db_key: string) => {
    const col_type = Reflect.getMetadata(Column_Type_KEY, obj, entity_key)
    const category = getColumTypeCategory(col_type)
    fieldlist.push({ db_key, csv_type: 'string', db_type: category })
  }
  Object.keys(vault_entity).forEach((key) => {
    if (key == 'info') {
      Object.keys(new LoginPasswordInfo()).forEach((subkey) => {
        AddFiled(subkey, vault_login_entity, `info.${subkey}`)
      })
      Object.keys(new NoteTextPasswordInfo()).forEach((subkey) => {
        AddFiled(subkey, vault_note_entity, `info.${subkey}`)
      })
      Object.keys(new CardPasswordInfo()).forEach((subkey) => {
        AddFiled(subkey, vault_card_entity, `info.${subkey}`)
      })
    } else {
      AddFiled(key, vault_entity, key)
    }
  })
  return fieldlist
}
