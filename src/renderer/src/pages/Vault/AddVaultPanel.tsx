import { Vault } from '@common/entitys/vault.entity'
import { Icon_type, ModalType, VaultItemTypeIcon } from '@common/gloabl'
import { Button, Form, Input, message, Modal, Popconfirm, Select } from 'antd'
import { useForm } from 'antd/es/form/Form'
import TextArea from 'antd/es/input/TextArea'
import Icon from '@renderer/components/Icon'
import { ipc_call } from '@renderer/libs/tools/other'
import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { GetStrComp } from '@renderer/components/OtherHelp'
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
export default function AddValutPanel(pros: AmdinAddvalutProps): JSX.Element {
  const [messageApi, contextHolder] = message.useMessage()
  const [form] = useForm()
  const appstore = use_appstore() as AppStore
  const appset = use_appset() as AppsetStore
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
              await ipc_call(webToManMsg.UpdateValut, values)
                .then(() => {
                  pros.onAddOk?.()
                })
                .catch((err) => {
                  messageApi.error(appset.lang.getText(`err.${err.code}`), 5)
                })
            } else if (pros.show_type === ModalType.Add) {
              values.user_id = appstore.cur_user?.id
              await ipc_call(webToManMsg.AddValut, values)
                .then(async () => {
                  pros.onAddOk?.()
                })
                .catch((err) => {
                  messageApi.error(appset.lang.getText(`err.${err.code}`), 5)
                })
            }
          })
        }}
        onCancel={() => {
          // message.error('exit', 0)
          pros.onClose?.()
        }}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            {pros.show_del && (
              <Popconfirm
                title={appset.getText('addvaultpanel.del.title')}
                description={GetStrComp(
                  appset.getText('addvaultpanel.del.content', pros.edit_info?.name)
                )}
                onConfirm={async () => {
                  await ipc_call(webToManMsg.DeleteValut, pros.edit_info.id)
                    .then(() => {
                      pros.onDelOk?.()
                    })
                    .catch((err) => {
                      messageApi.error(appset.lang.getText(`err.${err.code}`), 5)
                    })
                }}
              >
                <Button>删除</Button>
              </Popconfirm>
            )}
            <CancelBtn />
            <OkBtn />
          </>
        )}
      >
        <Form {...formItemLayout} form={form} initialValues={pros.edit_info}>
          <Form.Item
            label={appset.lang.getText('name')}
            name="name"
            rules={[{ required: true, message: appset.lang.getText('addvault.input.name') }]}
          >
            <Input></Input>
          </Form.Item>
          <Form.Item
            label={appset.lang.getText('icon')}
            name="icon"
            rules={[{ required: true, message: appset.lang.getText('addvault.input.icon') }]}
          >
            <Select>
              {Object.keys(VaultItemTypeIcon).map((key) => {
                return (
                  <Select.Option key={key} value={Icon_type[key]}>
                    <Icon type={Icon_type[key]} svg></Icon>
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
