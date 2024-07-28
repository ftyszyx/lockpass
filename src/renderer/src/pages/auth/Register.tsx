import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { PagePath } from '@common/entitys/page.entity'
import { RegisterInfo } from '@common/entitys/user.entity'
import { ConsoleLog } from '@renderer/libs/Console'
import { useHistory } from '@renderer/libs/router'
import { ipc_call } from '@renderer/libs/tools/other'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { Button, Form, Input, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
interface RegisterInfo2 extends RegisterInfo {
  password_repeat: string
}

export default function Register(): JSX.Element {
  ConsoleLog.LogInfo('register render')
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = useForm<RegisterInfo2>()
  const history = useHistory()
  const lang = (use_appset() as AppsetStore).lang
  async function onFinish() {
    form.validateFields().then(async (values) => {
      console.log(values)
      if (values.password_repeat !== values.password) {
        message.error('两次密码不一致')
        return
      }
      await ipc_call<null>(webToManMsg.Register, values).catch((err) => {
        messageApi.error(lang.getLangText(`err.${err.code}`))
      })
      history.replace(PagePath.Login)
    })
  }
  return (
    <div className=" bg-slate-100">
      {contextHolder}
      <div className=" fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        <div className="flex flex-col items-center">
          <div className=" text-4xl text-black mb-3 font-bold font-sans">
            {lang.getLangText('register.title')}
          </div>
          <Form form={form} layout="vertical" onFinish={() => {}}>
            <Form.Item label="你的账号名" required name="username">
              <Input placeholder="请输入你的名字" />
            </Form.Item>
            <Form.Item label="初始密码" name="password" required>
              <Input.Password placeholder="请输入初始密码" size="large" />
            </Form.Item>
            <Form.Item label="再次输入初始密码" name="password_repeat" required>
              <Input.Password placeholder="请输入初始密码" size="large" />
            </Form.Item>
          </Form>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            onSubmit={async () => {
              await onFinish()
            }}
            onClick={async () => {
              await onFinish()
            }}
          >
            {lang.getLangText('ok')}
          </Button>
          <Button
            className="w-full mt-2"
            onClick={() => {
              history.push(PagePath.Login)
            }}
          >
            {lang.getLangText('register.skiptoLogin')}
          </Button>
        </div>
      </div>
    </div>
  )
}
