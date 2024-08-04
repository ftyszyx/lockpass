/*
desc: 密码生成器
© 2024 zyx
date:2024/08/02 16:14:17
*/
import { Button, Form, Input, Modal, Select } from 'antd'
import { useState } from 'react'
import { useForm } from 'antd/es/form/Form'
import { PasswordTypeFileList } from '@renderer/entitys/Password.entity'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import Icon from '@renderer/components/Icon'
import { Icon_type } from '@common/gloabl'
import { GenPasswordType, PasswordTypeInfo } from '@common/entitys/password.entity'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import word_dic from '@common/words_password.json'
interface PasswordGenPanelProps {
  show: boolean
  calssName?: string
  onOk: (value: string) => void
  onClose: () => void
}
export default function PasswordGenPanel(props: PasswordGenPanelProps): JSX.Element {
  console.log('PasswordGenPanel render')
  const RAND_NUMBERS = '0123456789'
  const RAND_LETTERS = 'abcdefghijklmnopqrstuvwxyz'
  const RAND_SYMBOLS = '!@#$%^&*()_+'
  const RAND_CAP_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const [value, setValue] = useState<string>('')
  const appset = use_appset() as AppsetStore
  const appstore = use_appstore() as AppStore
  const [form] = useForm()
  const [password_type, set_password_type] = useState<string>(appstore.GetUserSet().password_type)

  async function genPassword() {
    let password = ''
    const setinfo = (await form.getFieldsValue()) as PasswordTypeInfo
    if (password_type == GenPasswordType.random) {
      password = genRandomPassword(setinfo)
    } else if (password_type == GenPasswordType.Memory) {
      password = genMemoryPassword(setinfo)
    } else if (password_type == GenPasswordType.Pin) {
      password = genRandomPin(setinfo)
    }
    setValue(password)
  }

  function genRandomPassword(setinfo: PasswordTypeInfo) {
    let password = ''
    let randomchars = RAND_LETTERS
    if (setinfo.random_number) randomchars += RAND_NUMBERS
    if (setinfo.random_capitalize) randomchars += RAND_CAP_LETTERS
    if (setinfo.random_symbol) randomchars += RAND_SYMBOLS
    for (let i = 0; i < setinfo.random_characters_len; i++) {
      password += randomchars[Math.floor(Math.random() * randomchars.length)]
    }
    return password
  }

  function genRandomPin(setinfo: PasswordTypeInfo) {
    let password = ''
    for (let i = 0; i < setinfo.pin_code_num; i++) {
      password += Math.floor(Math.random() * RAND_LETTERS.length)
    }
    return password
  }

  function genMemoryPassword(setinfo: PasswordTypeInfo) {
    let password = ''
    const words = word_dic['items'] as string[]
    const cap_index = Math.floor(Math.random() * words.length)
    for (let i = 0; i < setinfo.memory_words_num; i++) {
      let use_word = words[Math.floor(Math.random() * words.length)]
      if (cap_index == i && setinfo.memory_capitalize) {
        use_word = use_word.toUpperCase()
      }
      if (setinfo.memory_word_full == false) use_word = use_word.slice(4)
      password += use_word
      password += setinfo.memory_separator
    }
    return password
  }
  return (
    <Modal
      className={props.calssName ? props.calssName : ''}
      open={props.show}
      closable={false}
      footer={null}
      title={
        <div className="flex flex-row justify-between">
          <Button
            onClick={() => {
              props.onClose()
            }}
          >
            {appset.lang.getText('cancel')}
          </Button>
          <Icon
            onClick={() => {
              genPassword()
            }}
            type={Icon_type.icon_refresh}
            className="text-[20px]"
            svg
          ></Icon>
          <Button
            type="primary"
            onClick={() => {
              props.onOk(value)
            }}
          >
            {appset.lang.getText('use')}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col space-y-2">
        <div>
          <Input value={value}></Input>
        </div>
        <div className=" flex flex-row justify-between">
          <div> {appset.lang.getText('passwordGenPanel.password_type')}</div>
          <div className="">
            <Select
              className="w-[200px]"
              value={password_type}
              onChange={(value) => set_password_type(value)}
            >
              {Object.keys(GenPasswordType).map((key) => {
                return (
                  <Select.Option value={GenPasswordType[key]} key={key}>
                    {appset.lang.getText(`passwordType.${GenPasswordType[key]}`)}
                  </Select.Option>
                )
              })}
            </Select>
          </div>
        </div>
        <div>
          <Form
            form={form}
            initialValues={appstore.GetUserSet().password_type_conf}
            onFieldsChange={() => {
              genPassword()
            }}
          >
            {PasswordTypeFileList.map((item) => {
              if (item.field_name.startsWith(password_type))
                return (
                  <Form.Item
                    name={item.field_name}
                    key={item.field_name}
                    label={appset.lang.getText(`passwordGenPanel.${item.field_name}`)}
                  >
                    <item.render></item.render>
                  </Form.Item>
                )
              else return null
            })}
          </Form>
        </div>
      </div>
    </Modal>
  )
}
