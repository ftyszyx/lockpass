import { VaultItem } from '@common/entitys/vault_item.entity'

import { ModalType, PasswordIconType, PasswordType } from '@common/gloabl'
import Icon from '@renderer/components/icon'
import { FieldInfo } from '@renderer/entitys/form.entity'
import { PasswordFileListDic } from '@renderer/entitys/password.entity'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { Form, Input, message, Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useState } from 'react'

interface AdminAddPasswordProps {
  show: boolean
  title: string
  show_type: ModalType
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
      {contextHolder}
      <Modal
        width={400}
        title={props.title}
        open={props.show}
        okText="确定"
        onOk={async () => {
          const values = await form.validateFields()
          console.log('values', values)
        }}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <OkBtn />
          </>
        )}
      >
        <Form form={form}>
          <Form.Item name="icon">
            <select>
              {Object.keys(PasswordIconType).map((key) => {
                return (
                  <option value={key}>
                    <Icon type={PasswordIconType[key]} />
                  </option>
                )
              })}
            </select>
          </Form.Item>

          <Form.Item name="name">
            <Input placeholder="名称" value={props.edit_info.name} />
          </Form.Item>

          <Form.List name="info">
            {PasswordFileListDic[props.edit_info.passwordType].map((item: FieldInfo) => {
              return (
                <Form.Item name={item.field_name} label={item.label} rules={item.edit_rules}>
                  <item.field_Element
                    {...item.edit_props}
                    disabled={props.show_type == ModalType.View}
                  ></item.field_Element>
                </Form.Item>
              )
            })}
          </Form.List>
        </Form>
      </Modal>
    </div>
  )
}
