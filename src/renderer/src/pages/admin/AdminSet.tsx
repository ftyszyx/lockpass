import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { User } from '@common/entitys/user.entity'
import { UserSetFieldList, UserSetInfo } from '@renderer/entitys/set.entity'
import { ConsoleLog } from '@renderer/libs/Console'
import { ipc_call } from '@renderer/libs/tools/other'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { Form, Button, message } from 'antd'
import { useForm } from 'antd/es/form/Form'

export default function AdminSet() {
  const [form] = useForm<UserSetInfo>(null)
  const appstore = use_appstore() as AppStore
  const appset = use_appset() as AppsetStore
  const [messageApi, messageContext] = message.useMessage()
  ConsoleLog.LogInfo('AdminSet render', appstore.cur_user)

  return (
    <div>
      {messageContext}
      <Form form={form} initialValues={appstore.cur_user.set as UserSetInfo}>
        {UserSetFieldList.map((item) => {
          return (
            <Form.Item key={item.field_name} label={item.label} name={item.field_name}>
              <item.field_Element></item.field_Element>
            </Form.Item>
          )
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
  )
}
