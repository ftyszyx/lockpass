/*
desc: 密码生成器
© 2024 zyx
date:2024/08/02 16:14:17
*/
import { Form, Input, message, Select } from 'antd'
import { forwardRef, Ref, useEffect, useImperativeHandle, useState } from 'react'
import { useForm } from 'antd/es/form/Form'
import { PasswordTypeFileList } from '@renderer/entitys/password.entity'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { GenPasswordType, PasswordTypeInfo } from '@common/entitys/password.entity'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import word_dic from '@common/words_password.json'
import { ConsoleLog } from '@renderer/libs/Console'
import { ChangeAppset } from '@renderer/libs/tools/other'
interface PasswordGenContentProps {
  onChange: (value: string) => void
}

export interface PasswordGenContentRef {
  ReFresh: () => void
  UpdateSet: () => Promise<void>
}

export const PasswordGenContent = forwardRef(function PasswordGenContent(
  props: PasswordGenContentProps,
  ref: Ref<PasswordGenContentRef>
): JSX.Element {
  const RAND_NUMBERS = '0123456789'
  const RAND_LETTERS = 'abcdefghijklmnopqrstuvwxyz'
  const RAND_SYMBOLS = '!@#$%^&*()_+'
  const RAND_CAP_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const [value, setValue] = useState<string>('')
  const appset = use_appset() as AppsetStore
  const appstore = use_appstore() as AppStore
  const [messageApi, contextHolder] = message.useMessage()
  useImperativeHandle(ref, () => {
    return {
      ReFresh: () => {
        genPassword()
      },
      UpdateSet
    }
  })

  const [form] = useForm()
  const [password_type, set_password_type] = useState<string>(appstore.GetUserSet().password_type)
  ConsoleLog.LogInfo('PasswordGenPanel render', appstore.GetUserSet().password_type_conf)
  useEffect(() => {
    genPassword()
  }, [password_type])

  async function UpdateSet() {
    const setinfo = (await form.validateFields()) as PasswordTypeInfo
    let appsetinfo = appstore.GetUserSet()
    appsetinfo.password_type_conf = { ...appsetinfo.password_type_conf, ...setinfo }
    appsetinfo.password_type = password_type as GenPasswordType
    await ChangeAppset(appstore, appset, appsetinfo, messageApi)
  }

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
  useEffect(() => {
    props.onChange(value)
  }, [value])

  function genRandomPassword(setinfo: PasswordTypeInfo) {
    let randomchars = RAND_LETTERS
    if (setinfo.random_number) randomchars += RAND_NUMBERS
    let password_arr = []
    if (setinfo.random_capitalize) {
      password_arr.push(RAND_CAP_LETTERS[Math.floor(Math.random() * RAND_CAP_LETTERS.length)])
    }
    if (setinfo.random_number) {
      password_arr.push(RAND_NUMBERS[Math.floor(Math.random() * RAND_NUMBERS.length)])
    }
    if (setinfo.random_symbol) {
      password_arr.push(RAND_SYMBOLS[Math.floor(Math.random() * RAND_SYMBOLS.length)])
    }
    const used_len = password_arr.length
    for (let i = 0; i < setinfo.random_characters_len - used_len; i++) {
      password_arr.push(randomchars[Math.floor(Math.random() * randomchars.length)])
    }
    // console.log('passwordarr', password_arr, setinfo.random_characters_len, password_arr.length)
    password_arr.sort(() => Math.random() - 0.5)
    return password_arr.join('')
  }

  function genRandomPin(setinfo: PasswordTypeInfo) {
    let password = ''
    for (let i = 0; i < setinfo.pin_code_num; i++) {
      password += Math.floor(Math.random() * RAND_NUMBERS.length)
    }
    return password
  }

  function genMemoryPassword(setinfo: PasswordTypeInfo) {
    let password = ''
    const words = word_dic['items'] as string[]
    const cap_index = Math.floor(Math.random() * setinfo.memory_words_num)
    for (let i = 0; i < setinfo.memory_words_num; i++) {
      let use_word = words[Math.floor(Math.random() * words.length)]
      if (cap_index == i && setinfo.memory_capitalize) {
        use_word = use_word.toUpperCase()
      }
      if (setinfo.memory_word_full == false) use_word = use_word.slice(0, 4)
      password += use_word
      if (i < setinfo.memory_words_num - 1) password += setinfo.memory_separator
    }
    return password
  }
  return (
    <>
      {contextHolder}
      <div className="flex flex-col space-y-1">
        <div>
          <Input value={value}></Input>
        </div>
        <div className=" flex flex-row justify-between">
          <div> {appset.lang.getText('passwordGenPanel.password_type')}</div>
          <div className="">
            <Select
              className="w-[100px]"
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
            layout="horizontal"
            initialValues={appstore.GetUserSet().password_type_conf}
            onFieldsChange={() => {
              genPassword()
            }}
          >
            {PasswordTypeFileList.map((item) => {
              if (item.field_name.startsWith(password_type))
                return (
                  <Form.Item
                    layout="horizontal"
                    name={item.field_name}
                    className="mb-1"
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
    </>
  )
})
