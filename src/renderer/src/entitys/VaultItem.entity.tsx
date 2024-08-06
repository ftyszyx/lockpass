import { Input } from 'antd'
import { FieldInfo, FiledProps } from './form.entity'
import InputArr from '@renderer/components/InputArr'
import { ModalType, VaultItemType } from '@common/gloabl'
import { LangItem } from '@common/lang'
import MyInputWrapper from '@renderer/components/MyInputWrapper'
import { TextAreaProps } from 'antd/es/input'
import {
  CardPasswordInfo,
  LoginPasswordInfo,
  NoteTextPasswordInfo,
  VaultItem
} from '@common/entitys/vault_item.entity'

//get string for show
export function GetPasswordInfoString(item: VaultItem): string {
  if (item.vault_item_type == VaultItemType.Login) {
    const info = item.info as LoginPasswordInfo
    return `${info.username}-${info.urls.join('-')}`
  } else if (item.vault_item_type == VaultItemType.Card) {
    const info = item.info as CardPasswordInfo
    return `${info.card_company}:${info.card_number}`
  } else if (item.vault_item_type == VaultItemType.NoteBook) {
    const info = item.info as NoteTextPasswordInfo
    return info.note_text
  }
  return ''
}

//which key should be used for search
export function IsKeyForSearch(key: string): boolean {
  if (key.indexOf('password') > -1) return false
  return true
}

//search fun
export function IsVaultItemMatchSearch(item: VaultItem, search_word: string): boolean {
  if (item.name.includes(search_word)) return true
  if (item.info) {
    const keys = Object.keys(item.info)
    const ok = keys.some((key) => {
      if (!IsKeyForSearch(key)) return false
      const value = item.info[key]
      if (value == null) return false
      if (value.toString().includes(search_word)) return true
      return false
    })
    if (ok) return true
  }
  return false
}

export function LoginPasswordFieldList(lang: LangItem): FieldInfo[] {
  return [
    {
      field_name: 'username',
      render: (props) => {
        return <MyInputWrapper inputElement={Input} show_type={props.show_type} {...props} />
      },
      edit_rules: [{ required: true, message: lang.getText('input.rule.username') }]
    },
    {
      field_name: 'password',
      render: (props) => {
        return (
          <MyInputWrapper
            inputElement={Input.Password}
            show_type={props.show_type}
            is_password
            {...props}
          />
        )
      },
      edit_rules: [{ required: true, message: lang.getText('input.rule.password') }]
    },
    {
      field_name: 'urls',
      hide_label: true,
      render: (props) => {
        return (
          <InputArr
            readonly={props.show_type == ModalType.View}
            label={lang.getText('vaultitem.label.url')}
            show_type={props.show_type}
            {...props}
          ></InputArr>
        )
      }
    }
  ]
}

export function CardPasswordFieldList(lang: LangItem): FieldInfo[] {
  return [
    {
      field_name: 'card_company',
      render: (props: FiledProps) => {
        return <MyInputWrapper inputElement={Input} show_type={props.show_type} {...props} />
      },
      edit_rules: [{ required: true, message: lang.getText('input.rule.bank') }]
    },
    {
      field_name: 'card_number',
      render: (props: FiledProps) => {
        return <MyInputWrapper inputElement={Input} show_type={props.show_type} {...props} />
      },
      edit_rules: [{ required: true, message: lang.getText('input.rule.card_number') }]
    },
    {
      field_name: 'card_password',
      render: (props: FiledProps) => {
        return (
          <MyInputWrapper inputElement={Input.Password} show_type={props.show_type} {...props} />
        )
      },
      edit_rules: [{ required: true, message: lang.getText('input.rule.password') }]
    }
  ]
}

export function NotePasswordFieldList(lang: LangItem): FieldInfo[] {
  return [
    {
      field_name: 'note_text',
      render: (props: FiledProps) => {
        return (
          <MyInputWrapper<TextAreaProps>
            inputProps={{ autoSize: { minRows: 9 } }}
            inputElement={Input.TextArea}
            show_type={props.show_type}
            {...props}
          />
        )
      }
    }
  ]
}

export const GetPasswordFilelist = (type: VaultItemType, lang: LangItem): FieldInfo[] => {
  switch (type) {
    case VaultItemType.Login:
      return LoginPasswordFieldList(lang)
    case VaultItemType.Card:
      return CardPasswordFieldList(lang)
    case VaultItemType.NoteBook:
      return NotePasswordFieldList(lang)
    default:
      return []
  }
}
