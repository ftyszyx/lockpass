import { InitKeyInfo } from '@common/entitys/app.entity'
import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { Button, Form, Input, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
interface InitFormInfo extends InitKeyInfo {
  password_repeat: string
}

export default function InitSystem() {
  const [form] = useForm<InitFormInfo>()
  return (
    <div className=" bg-slate-100">
      <div className=" fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        <Form form={form} layout="vertical" onFinish={() => {}}>
          <Form.Item label="你的账号名" required name="username" rules={[{ min: 6 }]}>
            <Input placeholder="请输入你的名字" />
          </Form.Item>
          <Form.Item label="初始密码" name="password" rules={[{ required: true }, { min: 6 }]}>
            <Input.Password placeholder="请输入初始密码" size="large" />
          </Form.Item>
          <Form.Item
            label="再次输入初始密码"
            name="password_repeat"
            rules={[{ required: true }, { min: 6 }]}
          >
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
              window.electron.ipcRenderer.invoke(webToManMsg.initKey, values).then((res) => {
                if (res) {
                  message.success('初始化成功')
                  window.location.href = '/'
                }
              })
            })
          }}
        >
          确定
        </Button>
      </div>
    </div>
  )
}
