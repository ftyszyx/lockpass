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
          className="w-[500px] bg-gray-400"
          title={
            <div className="flex flex-row">
              <LeftOutlined
                onClick={() => {
                  set_show_info(false)
                  set_show_password_type(true)
                }}
              />
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
          <Form<VaultItem>
            form={form}
            layout="vertical"
            wrapperCol={{ span: 24 }}
            className=" flex flex-col items-center "
            initialValues={
              props.init_info ||
              ({
                icon: PasswordIconType.[`icon_${select_type}`],
                name: lang.getLangText(`password_name_${select_type}`),
              } as VaultItem)
            }
          >
            <div className="flex flex-row items-center space-x-2">
              <Form.Item name="icon">
                <Select className=" w-[70px] h-[40px]">
                  {Object.keys(PasswordIconType).map((key) => {
                    return (
                      <Select.Option value={PasswordIconType[key]} key={key}>
                        <Icon type={PasswordIconType[key]} className=" w-[30px] h-[30px]" svg />
                      </Select.Option>
                    )
                  })}
                </Select>
              </Form.Item>

              <Form.Item name="name">
                <Input placeholder="名称" className="w-[300px] h-[40px]" />
              </Form.Item>
            </div>
            {PasswordFileListDic[select_type].map((item: FieldInfo) => {
              return (
                <Form.Item
                  className=" mb-0 w-[400px] "
                  name={item.field_name}
                  label={item.label}
                  rules={item.edit_rules}
                  key={item.field_name}
                >
                  <item.field_Element {...item.edit_props}></item.field_Element>
                </Form.Item>
              )
            })}
            <Form.Item
              className="mb-0 w-[400px]"
              name="remarks"
              label={lang.getLangText('vaultadd.remarks')}
            >
              <TextArea autoSize={{ minRows: 3 }}></TextArea>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  )
}
