import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { PagePath } from '@common/entitys/page.entity'
import { LoginInfo, User } from '@common/entitys/user.entity'
import { ConsoleLog } from '@renderer/libs/Console'
import { useHistory } from '@renderer/libs/router'
import { ipc_call } from '@renderer/libs/tools/other'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { Button, Form, Input, message } from 'antd'
import { useForm } from 'antd/es/form/Form'

export default function Login(): JSX.Element {
  const [form] = useForm<LoginInfo>()
  const [messageApi, messageContext] = message.useMessage()
  const history = useHistory()
  const appstore = use_appstore() as AppStore
  ConsoleLog.LogInfo('login render')
  const isLogin = history.PathName == PagePath.Login && !appstore.cur_user
  const lang = (use_appset() as AppsetStore).lang
  async function onFinish() {
    form.validateFields().then(async (values) => {
      if (!isLogin) {
        values.username = appstore.cur_user?.username
      }
      const user = await ipc_call<User>(webToManMsg.Login, values).catch((error) => {
        messageApi.error(lang.getLangText(`err.${error.code}`))
      })
      if (user) {
        message.success(lang.getLangText('auth.login.success'))
        appstore.Login(user)
        history.replace(PagePath.Home)
      }
    })
  }
  return (
    <div className=" bg-slate-100">
      {messageContext}
      <div className=" fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        <Form<LoginInfo>
          form={form}
          initialValues={{ username: appstore.cur_user?.username }}
          layout="vertical"
          onFinish={async () => {
            await onFinish()
          }}
        >
          {isLogin && (
            <Form.Item label="你的账号名" required name="username">
              <Input placeholder="请输入你的名字" />
            </Form.Item>
          )}
          <Form.Item label="初始密码" name="password" required>
            <Input.Password placeholder="请输入初始密码" size="large" />
          </Form.Item>
        </Form>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            onClick={async () => {
              await onFinish()
            }}
          >
            确定
          </Button>
        </Form.Item>
      </div>
    </div>
  )
}
