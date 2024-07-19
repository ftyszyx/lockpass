import { Icon_type } from '@common/gloabl'
import Icon from '@renderer/components/icon'
import { Form, Input } from 'antd'
import { useForm } from 'antd/es/form/Form'

export default function Lock() {
  const [form] = useForm()
  return (
    <div>
      <div className="flex flex-row ">
        {/* left */}
        <div className="w-[1/4] relative">
          <Icon type={Icon_type.icon_1password} className="" />
        </div>
        {/* right */}
        <div className=" flex-grow">
          <Form form={form}>
            <Form.Item name="password">
              <Input.Password placeholder="password" />
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}
