import { VaultItem } from '@common/entitys/vault_item.entity'
import { PasswordIconType, PasswordType } from '@common/gloabl'
import Icon from '@renderer/components/icon'
import { FieldInfo } from '@renderer/entitys/form.entity'
import { PasswordFileListDic } from '@renderer/entitys/password.entity'
import { Form, Input, message, Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useState } from 'react'
import SelectPasswordTypeComp from './SelectPasswordTypeComp'
import TextArea from 'antd/es/input/TextArea'
import { useLang } from '@renderer/libs/lan/index.render'

interface AdminAddPasswordProps {
  show: boolean
  title: string
  init_info?: VaultItem
  onOk?: () => Promise<void>
  onClose?: () => void
}
export default function AdminAddPassword(props: AdminAddPasswordProps): JSX.Element {
  const getLang = useLang()
  const [form] = useForm<VaultItem>()
  const [messageApi, contextHolder] = message.useMessage()
  const [show_password_type, set_show_password_type] = useState(true)
  const [select_type, set_select_type] = useState(PasswordType.Login)
  const fieldlist = PasswordFileListDic[select_type]
  const [show_info, set_show_info] = useState(false)
  return (
    <div>
      {show_password_type && (
        <SelectPasswordTypeComp
          onClose={() => {
            set_show_password_type(false)
            props.onClose?.()
          }}
          show={show_password_type}
          onOk={async (slecttype) => {
            set_show_password_type(false)
            set_select_type(slecttype)
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
                    <option value={key} key={key}>
                      <Icon type={PasswordIconType[key]} />
                    </option>
                  )
                })}
              </select>
            </Form.Item>

            <Form.Item name="name">
              <Input placeholder="名称" />
            </Form.Item>

            {/* {PasswordFileListDic[select_type].map((item: FieldInfo) => {
              return (
                <Form.Item
                  name={item.field_name}
                  label={item.label}
                  rules={item.edit_rules}}
                  key={item.field_name}
                >
                  <item.field_Element {...item.edit_props}></item.field_Element>
                </Form.Item>
              )
            })}
              */}
            <Form.Item name="remarks" label={getLang('vaultadd.remarks')}>
              <TextArea autoSize={{ minRows: 3 }}></TextArea>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  )
}
