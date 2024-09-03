import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { Form, Input, message, Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { GetStrComp } from './OtherHelp'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { ipc_call_normal } from '@renderer/libs/tools/other'
import { webToManMsg } from '@common/entitys/ipcmsg.entity'

interface ChangeMainPasswordProps {
  show: boolean
  onClose: () => void
  className?: string
  onOk: () => void
}

interface ChangePassInfo {
  oldpass: string
  newpass: string
  newpass_repeat: string
}

export default function ChangeMainPassword(props: ChangeMainPasswordProps): JSX.Element {
  const appset = use_appset() as AppsetStore
  const [form] = useForm()
  const [messageApi, contextHolder] = message.useMessage()

  return (
    <>
      {contextHolder}
      <Modal
        className={props.className ? props.className : ''}
        open={props.show}
        title={appset.getText('changemainpass.title')}
        okText={appset.getText('ok')}
        cancelText={appset.getText('cancel')}
        onCancel={() => {
          props.onClose()
        }}
        onOk={async () => {
          const values = (await form.validateFields()) as ChangePassInfo
          console.log('get values', values)
          if (values.newpass.trim() !== values.newpass_repeat.trim()) {
            messageApi.error(appset.getText('changemainpass.passnotmatch'), 5)
            return
          }
          if (values.oldpass.trim() === values.newpass.trim()) {
            messageApi.error(appset.getText('changemainpass.pss_issame'), 5)
            return
          }
          Modal.confirm({
            title: appset.getText('changemainpass.title'),
            icon: <ExclamationCircleOutlined />,
            content: GetStrComp(appset.getText('changemainpass.content')),
            okText: appset.getText('ok'),
            cancelText: appset.getText('cancel'),
            onOk: async () => {
              await ipc_call_normal<boolean>(
                webToManMsg.ChangeMainPassword,
                values.oldpass.trim(),
                values.newpass.trim()
              ).then((res) => {
                if (res) {
                  Modal.confirm({
                    title: appset.getText('changemainpass.ok.title'),
                    icon: <ExclamationCircleOutlined />,
                    content: appset.getText('changemainpass.ok.content'),
                    okText: appset.getText('ok'),
                    cancelText: appset.getText('cancel')
                  })
                  props.onOk()
                }
              })
            }
          })
        }}
      >
        <div>
          <Form form={form}>
            <Form.Item
              label={appset.getText('changemainpass.label.oldpass')}
              name="oldpass"
              rules={[
                { required: true, message: appset.getText('changemainpass.placeholder.oldpass') }
              ]}
            >
              <Input.Password
                size="large"
                placeholder={appset.getText('changemainpass.placeholder.oldpass')}
              />
            </Form.Item>
            <Form.Item
              label={appset.getText('changemainpass.label.newpass')}
              name="newpass"
              rules={[
                { required: true, message: appset.getText('changemainpass.placeholder.newpass') }
              ]}
            >
              <Input.Password
                size="large"
                placeholder={appset.getText('changemainpass.placeholder.newpass')}
              />
            </Form.Item>
            <Form.Item
              label={appset.getText('changemainpass.label.newpass_repeat')}
              name="newpass_repeat"
              rules={[
                {
                  required: true,
                  message: appset.getText('changemainpass.placeholder.newpass_repeat')
                }
              ]}
            >
              <Input.Password
                size="large"
                placeholder={appset.getText('changemainpass.placeholder.newpass_repeat')}
              />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  )
}
