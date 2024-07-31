import { Input } from 'antd'
import { FieldInfo, FiledProps } from './form.entity'
import InputArr from '@renderer/components/InputArr'
import { ModalType, PasswordType } from '@common/gloabl'
import { LangHelper } from '@common/lang'
import MyInputWrapper from '@renderer/components/MyInputWrapper'

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
    render: (props) => {
      return (
        <MyInputWrapper
          inputProps={{
            placeholder: LangHelper.getString('input.placeholder.username')
          }}
          inputElement={Input}
          show_type={props.show_type}
          {...props}
        />
      )
    },
    edit_rules: [{ required: true, message: LangHelper.getString('input.rule.username') }],
    label: LangHelper.getString('input.label.username')
  },
  {
    field_name: 'password',
    render: (props) => {
      return (
        <MyInputWrapper
          inputProps={{
            placeholder: LangHelper.getString('input.placeholder.password')
          }}
          inputElement={Input.Password}
          show_type={props.show_type}
          is_password
          {...props}
        />
      )
    },
    edit_rules: [{ required: true, message: LangHelper.getString('input.rule.password') }],
    label: LangHelper.getString('input.label.password')
  },
  {
    field_name: 'urls',
    render: (props) => {
      return (
        <InputArr
          readonly={props.show_type == ModalType.View}
          label={LangHelper.getString('input.label.url')}
          placeholder={LangHelper.getString('input.placeholder.url')}
          show_type={props.show_type}
          {...props}
        ></InputArr>
      )
    }
  }
]

export const CardPasswordFieldList: FieldInfo[] = [
  {
    field_name: 'card_company',
    render: (props: FiledProps) => {
      return (
        <MyInputWrapper
          inputProps={{
            placeholder: LangHelper.getString('input.placeholder.bank')
          }}
          inputElement={Input}
          show_type={props.show_type}
          {...props}
        />
      )
    },
    edit_rules: [{ required: true, message: LangHelper.getString('input.rule.bank') }],
    label: LangHelper.getString('input.label.bank')
  },
  {
    field_name: 'card_number',
    render: (props: FiledProps) => {
      return (
        <MyInputWrapper
          inputProps={{ placeholder: LangHelper.getString('input.placeholder.card_number') }}
          inputElement={Input}
          show_type={props.show_type}
          {...props}
        />
      )
    },
    edit_rules: [{ required: true, message: LangHelper.getString('input.rule.card_number') }],
    label: LangHelper.getString('input.label.card_number')
  },
  {
    field_name: 'card_password',
    render: (props: FiledProps) => {
      return (
        <MyInputWrapper
          inputProps={{ placeholder: LangHelper.getString('input.placeholder.password') }}
          inputElement={Input.Password}
          show_type={props.show_type}
          {...props}
        />
      )
    },
    edit_rules: [{ required: true, message: LangHelper.getString('input.rule.password') }],
    label: LangHelper.getString('input.label.password')
  }
]

export const NotePasswordFieldList: FieldInfo[] = [
  {
    field_name: 'note_text',
    render: (props: FiledProps) => {
      return <MyInputWrapper inputElement={Input.TextArea} show_type={props.show_type} {...props} />
    },
    label: LangHelper.getString('input.label.note')
  }
]

export const PasswordFileListDic: Record<PasswordType, FieldInfo[]> = {
  [PasswordType.Login]: LoginPasswordFieldList,
  [PasswordType.Card]: CardPasswordFieldList,
  [PasswordType.NoteBook]: NotePasswordFieldList
}
