import { VaultItem } from '@common/entitys/vault_item.entity'
import { PasswordIconType, PasswordType } from '@common/gloabl'
import Icon from '@renderer/components/icon'
import { PasswordFileListDic } from '@renderer/entitys/password.entity'
import { Form, Input, message, Modal, Select } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useState } from 'react'
import SelectPasswordTypeComp from './SelectPasswordTypeComp'
import TextArea from 'antd/es/input/TextArea'
import { FieldInfo } from '@renderer/entitys/form.entity'
import { LeftOutlined } from '@ant-design/icons'
import { useLang } from '@renderer/libs/AppContext'

interface AdminAddPasswordProps {
  show: boolean
  title: string
  init_info?: VaultItem
  onOk?: () => Promise<void>
  onClose?: () => void
}
export default function AdminAddPassword(props: AdminAddPasswordProps): JSX.Element {
  const lang = useLang()
  console.log('lang', lang)
  const [form] = useForm<VaultItem>()
  const [messageApi, contextHolder] = message.useMessage()
  const [show_password_type, set_show_password_type] = useState(true)
  const [select_type, set_select_type] = useState(PasswordType.Login)
  const [show_info, set_show_info] = useState(false)
  return (
    <div className=" relative">
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
          title={
            <div className="flex flex-row">
              <LeftOutlined />
              <div className=" m-auto">{props.title}</div>
            </div>
          }
          open={props.show}
          okText="确定"
          onCancel={() => {
            set_show_info(false)
            props.onClose?.()
          }}
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
          <Form form={form} className="" initialValues={props.init_info || {}}>
            <div className="flex flex-row items-center">
              <Form.Item name="icon">
                <Select className=" w-[90px] h-[90px] ">
                  {Object.keys(PasswordIconType).map((key) => {
                    return (
                      <Select.Option value={key} key={key}>
                        <Icon type={PasswordIconType[key]} className=" w-[60px] h-[60px]" svg />
                      </Select.Option>
                    )
                  })}
                </Select>
              </Form.Item>

              <Form.Item name="name">
                <Input placeholder="名称" />
              </Form.Item>
            </div>
            {PasswordFileListDic[select_type].map((item: FieldInfo) => {
              return (
                <Form.Item
                  name={item.field_name}
                  label={item.label}
                  rules={item.edit_rules}
                  key={item.field_name}
                >
                  <item.field_Element {...item.edit_props}></item.field_Element>
                </Form.Item>
              )
            })}
            <Form.Item name="remarks" label={lang.getLangText('vaultadd.remarks')}>
              <TextArea autoSize={{ minRows: 3 }}></TextArea>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  )
}
