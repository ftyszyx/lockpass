import { PasswordType, VaultItem } from '@common/entitys/vault_item.entity'
import { ModalType } from '@common/gloabl'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { Form, message, Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useState } from 'react'

interface AdminAddPasswordProps {
  show: boolean
  title: string
  show_type: ModalType
  password_type: PasswordType
  edit_info?: VaultItem
  onOk?: () => Promise<void>
  onClose?: () => void
  onDelOk?: () => Promise<void>
}
export default function AdminAddPassword(props: AdminAddPasswordProps): JSX.Element {
  const appstore = use_appstore() as AppStore
  const [form] = useForm()
  const [messageApi, contextHolder] = message.useMessage()

  return (
    <div>
      <Modal
        width={400}
        title={props.title}
        open={props.show}
        okText="确定"
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <OkBtn />
          </>
        )}
      >
        <Form form={form}></Form>
      </Modal>
    </div>
  )
}
