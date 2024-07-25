import { Input } from 'antd'
import { FieldInfo } from './form.entity'
import InputArr from '@renderer/components/InputArr'
import { PasswordType } from '@common/gloabl'

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

export const LoginPasswordFieldList: FieldInfo[] = [
  {
    field_name: 'username',
    field_Element: Input,
    edit_props: { placeholder: '请输入用户名' },
    label: '用户名'
  },
  {
    field_name: 'password',
    field_Element: Input.Password,
    label: '密码'
  },
  {
    field_name: 'urls',
    field_Element: InputArr,
    edit_props: { label: '网址', placeholder: '请输入网址' }
  }
]

export const CardPasswordFieldList: FieldInfo[] = [
  {
    field_name: 'card_company',
    field_Element: Input,
    label: '银行'
  },
  {
    field_name: 'card_number',
    field_Element: Input,
    label: '卡号'
  },
  {
    field_name: 'card_password',
    field_Element: Input.Password,
    label: '密码'
  }
]

export const NotePasswordFieldList: FieldInfo[] = [
  {
    field_name: 'note_text',
    field_Element: Input.TextArea,
    label: '笔记'
  }
]

export const PasswordFileListDic: Record<PasswordType, FieldInfo[]> = {
  [PasswordType.Login]: LoginPasswordFieldList,
  [PasswordType.Card]: CardPasswordFieldList,
  [PasswordType.NoteBook]: NotePasswordFieldList
}
