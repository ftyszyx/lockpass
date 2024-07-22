import { VaultItem } from '@common/entitys/vault_item.entity'

import { PasswordIconType } from '@common/gloabl'
import Icon from '@renderer/components/icon'
import { FieldInfo } from '@renderer/entitys/form.entity'
import { PasswordFileListDic } from '@renderer/entitys/password.entity'
import { Form, Input, message, Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useState } from 'react'
import SelectPasswordTypeComp from './SelectPasswordTypeComp'

interface AdminAddPasswordProps {
  show: boolean
  title: string
  init_info?: VaultItem
  onOk?: () => Promise<void>
  onClose?: () => void
}
export default function AdminAddPassword(props: AdminAddPasswordProps): JSX.Element {
  const [form] = useForm<VaultItem>()
  const [messageApi, contextHolder] = message.useMessage()
  const [show_password_type, set_show_password_type] = useState(false)
  const [show_info, set_show_info] = useState(false)
  return (
    <div>
      {show_password_type && (
        <SelectPasswordTypeComp
          show={show_password_type}
          onOk={async (slecttype) => {
            form.setFieldsValue({ passwordType: slecttype })
            set_show_password_type(false)
            set_show_info(true)
          }}
        ></SelectPasswordTypeComp>
      )}
      {contextHolder}
      {show_info && (
        <Modal
          width={400}
          title={props.title}
          open={props.show}
          okText="确定"
          onOk={async () => {
            const values = await form.validateFields()
            console.log('values', values)
          }}
          footer={(_, { OkBtn }) => (
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
              <Input placeholder="名称" value={props.init_info.name} />
            </Form.Item>

            <Form.List name="info">
              {PasswordFileListDic[props.init_info.passwordType].map((item: FieldInfo) => {
                return (
                  <Form.Item name={item.field_name} label={item.label} rules={item.edit_rules}>
                    <item.field_Element {...item.edit_props}></item.field_Element>
                  </Form.Item>
                )
              })}
            </Form.List>
          </Form>
        </Modal>
      )}
    </div>
  )
}
