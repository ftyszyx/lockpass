import { Checkbox, Input } from 'antd'
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
import { KEY_MAP } from '@common/keycode'

//get string for show
export function GetPasswordInfoString(item: VaultItem): string {
  if (item.vault_item_type == VaultItemType.Login) {
    const info = item.info as LoginPasswordInfo
    const res = `${info.username} ${info.urls ? '-' + info.urls.join('-') : ''}`
    return res
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
  if (item.remarks.includes(search_word)) return true
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
      edit_rules: [{ required: true, message: lang?.getText('vaultitem.rule.username') }]
    },
    {
      field_name: 'username_auto_fill',
      hide_placeholder: true,
      hide_label: true,
      render: (props) => {
        return (
          <Checkbox {...props} defaultChecked>
            {lang?.getText('vaultitem.label.username_auto_fill')}
          </Checkbox>
        )
      }
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
      edit_rules: [{ required: true, message: lang?.getText('vaultitem.rule.password') }]
    },
    {
      field_name: 'password_auto_fill',
      hide_placeholder: true,
      hide_label: true,
      render: (props) => {
        return (
          <Checkbox {...props} defaultChecked>
            {lang?.getText('vaultitem.label.password_auto_fill')}
          </Checkbox>
        )
      }
    },
    {
      field_name: 'urls',
      hide_label: true,
      render: (props) => {
        return (
          <InputArr
            readonly={props.show_type == ModalType.View}
            label={lang?.getText('vaultitem.label.url')}
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
      edit_rules: [{ required: true, message: lang?.getText('vaultitem.rule.card_company') }]
    },
    {
      field_name: 'card_number',
      render: (props: FiledProps) => {
        return <MyInputWrapper inputElement={Input} show_type={props.show_type} {...props} />
      },
      edit_rules: [{ required: true, message: lang?.getText('vaultitem.rule.card_number') }]
    },
    {
      field_name: 'card_password',
      render: (props: FiledProps) => {
        return (
          <MyInputWrapper inputElement={Input.Password} show_type={props.show_type} {...props} />
        )
      },
      edit_rules: [{ required: true, message: lang?.getText('vaultitem.rule.card_password') }]
    },
    {
      field_name: 'card_cvc',
      render: (props: FiledProps) => {
        return <MyInputWrapper inputElement={Input} show_type={props.show_type} {...props} />
      }
    },
    {
      field_name: 'card_holder',
      render: (props: FiledProps) => {
        return <MyInputWrapper inputElement={Input} show_type={props.show_type} {...props} />
      }
    },
    {
      field_name: 'card_pub_site',
      render: (props: FiledProps) => {
        return <MyInputWrapper inputElement={Input} show_type={props.show_type} {...props} />
      }
    },
    {
      field_name: 'card_valid_time',
      render: (props: FiledProps) => {
        return (
          <MyInputWrapper is_date inputElement={Input} show_type={props.show_type} {...props} />
        )
      }
    },
    {
      field_name: 'card_zip_code',
      render: (props: FiledProps) => {
        return <MyInputWrapper inputElement={Input} show_type={props.show_type} {...props} />
      }
    }
  ]
}

export function NotePasswordFieldList(): FieldInfo[] {
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
      return NotePasswordFieldList()
    default:
      return []
  }
}

export interface PasswordRenderDetail {
  key: string
  shortCut: string
}

export enum PasswordRenderDetailKey {
  ctrl_C = `${KEY_MAP.ctrl}+c`,
  ctrl_shift_C = `${KEY_MAP.ctrl}+${KEY_MAP.shift}+c`,
  ctrl_alt_c = `${KEY_MAP.ctrl}+${KEY_MAP.alt}+c`
}

export const GetPasswordRenderDetailList = (vaule: VaultItem): PasswordRenderDetail[] => {
  switch (vaule.vault_item_type) {
    case VaultItemType.Login:
      return [
        { key: 'username', shortCut: PasswordRenderDetailKey.ctrl_C },
        { key: 'password', shortCut: PasswordRenderDetailKey.ctrl_alt_c }
      ]
    case VaultItemType.Card:
      return [
        { key: 'card_number', shortCut: PasswordRenderDetailKey.ctrl_C },
        { key: 'card_password', shortCut: PasswordRenderDetailKey.ctrl_alt_c }
      ]
    case VaultItemType.NoteBook:
      return [{ key: 'note_text', shortCut: PasswordRenderDetailKey.ctrl_C }]
  }
  return []
}
