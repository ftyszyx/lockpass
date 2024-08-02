import { defaultUserSetInfo } from '@common/entitys/app.entity'
import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { User } from '@common/entitys/user.entity'
import { NormalSetFiledList, UserSetInfo } from '@renderer/entitys/set.entity'
import { ConsoleLog } from '@renderer/libs/Console'
import { ipc_call } from '@renderer/libs/tools/other'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { Form, Button, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useState } from 'react'

export default function AdminSet() {
  const [form] = useForm<UserSetInfo>(null)
  const appstore = use_appstore() as AppStore
  const appset = use_appset() as AppsetStore
  const [messageApi, messageContext] = message.useMessage()
  const [select_item, set_select_item] = useState<string>('nomral')
  ConsoleLog.LogInfo('AdminSet render', appstore.cur_user)

  return (
    <div className=" felx flex-row">
      {messageContext}
      {/* left menu */}
      <div className=" w-[100px]">
        {['normal', 'shortcurt'].map((item) => {
          return (
            <div
              key={item}
              onClick={() => {
                set_select_item(item)
              }}
            >
              {appset.lang.getText(`set.menu.${item}`)}
            </div>
          )
        })}
      </div>
      {/* right content */}
      <div className="flex-grow">
        <Form form={form} initialValues={appstore.cur_user.set as UserSetInfo}>
          {select_item == 'normal' &&
            NormalSetFiledList.map((item) => {
              return (
                <Form.Item key={item.field_name} label={item.label} name={item.field_name}>
                  <item.render></item.render>
                </Form.Item>
              )
            })}
          {select_item == 'shortcurt' &&
            Object.keys(defaultUserSetInfo).map((key) => {
              if (key.startsWith('shortcurt')) {
                return (
                  <Form.Item key={key} label={appset.lang.getText(`set.${key}`)} name={key}>
                    <input type="text" />
                  </Form.Item>
                )
              }
              return null
            })}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              onClick={() => {
                form.validateFields().then(async (values) => {
                  appstore.cur_user.set = values
                  await ipc_call<User>(webToManMsg.UpdateUser, appstore.cur_user)
                    .then((res) => {
                      appstore.SetUser(res)
                    })
                    .catch((e) => {
                      messageApi.error(appset.lang.getText(`err.${e.code}`))
                    })
                })
              }}
            >
              {appset.lang.getText('save')}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
