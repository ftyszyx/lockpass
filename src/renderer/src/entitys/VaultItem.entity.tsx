import { Input } from 'antd'
import { FieldInfo, FiledProps } from './form.entity'
import InputArr from '@renderer/components/InputArr'
import { ModalType, VaultItemType } from '@common/gloabl'
import { LangHelper, LangItem } from '@common/lang'
import MyInputWrapper from '@renderer/components/MyInputWrapper'
import { TextAreaProps } from 'antd/es/input'

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
