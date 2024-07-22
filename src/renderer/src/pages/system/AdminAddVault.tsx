import { Vault } from '@common/entitys/vaults.entity'
import { Icon_type, ModalType, PasswordIconType } from '@common/gloabl'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { Button, Form, Input, message, Modal, Select } from 'antd'
import { useForm } from 'antd/es/form/Form'
import TextArea from 'antd/es/input/TextArea'
import Icon from '@renderer/components/icon'
const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 16 } }

interface AmdinAddvalutProps {
  show: boolean
  title: string
  show_type: ModalType
  show_del?: boolean
  edit_info?: Vault
  onAddOk?: () => Promise<void>
  onClose?: () => void
  onDelOk?: () => Promise<void>
}
export default function AdminAddValut(pros: AmdinAddvalutProps): JSX.Element {
  const appstore = use_appstore() as AppStore
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = useForm()
  return (
    <div>
      {contextHolder}
      <Modal
        width={400}
        title={pros.title}
        open={pros.show}
        onOk={() => {
          form.validateFields().then(async (values) => {
            if (pros.show_type === ModalType.Edit) {
              values.id = pros.edit_info.id
              await appstore.UpdateValut(pros.edit_info, values as Vault).catch((err) => {
                messageApi.error(err.message, 5)
              })
            } else if (pros.show_type === ModalType.Add) {
              await appstore.AddValut(values as Vault).catch((err) => {
                messageApi.error(err.message, 5)
              })
            }
            pros.onAddOk?.()
          })
        }}
        onCancel={() => {
          // message.error('exit', 0)
          pros.onClose?.()
        }}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            {pros.show_del && (
              <Button
                onClick={async () => {
                  await appstore.DeleteValut(pros.edit_info.id).catch((err) => {
                    messageApi.error(err.message, 5)
                  })
                  pros.onDelOk?.()
                }}
              >
                删除
              </Button>
            )}
            <CancelBtn />
            <OkBtn />
          </>
        )}
      >
        <Form {...formItemLayout} form={form}>
          <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
            <Input></Input>
          </Form.Item>
          <Form.Item label="图标" name="icon" rules={[{ required: true, message: '请输入图标' }]}>
            <Select>
              {Object.keys(PasswordIconType).map((key) => {
                return (
                  <Select.Option key={key} value={Icon_type[key]}>
                    <Icon type={Icon_type[key]}></Icon>
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>
          <Form.Item label="信息" name="info" rules={[{ required: true, message: '请输入信息' }]}>
            <TextArea showCount style={{ height: 120 }}></TextArea>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
