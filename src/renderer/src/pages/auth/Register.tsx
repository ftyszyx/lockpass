import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { PagePath } from '@common/entitys/page.entity'
import { RegisterInfo } from '@common/entitys/user.entity'
import { useLang } from '@renderer/libs/AppContext'
import { Button, Form, Input, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
interface RegisterInfo2 extends RegisterInfo {
  password_repeat: string
}

export default function Register(): JSX.Element {
  console.log('init system')
  const [form] = useForm<RegisterInfo2>()
  const lang = useLang()
  return (
    <div className=" bg-slate-100">
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
            onClick={() => {
              form.validateFields().then((values) => {
                console.log(values)
                if (values.password_repeat !== values.password) {
                  message.error('两次密码不一致')
                  return
                }
                window.electron.ipcRenderer.invoke(webToManMsg.Register, values).then((res) => {
                  if (res) {
                    message.success('初始化成功')
                    window.location.href = PagePath.Login
                  }
                })
              })
            }}
          >
            确定
          </Button>
        </div>
      </div>
    </div>
  )
}
