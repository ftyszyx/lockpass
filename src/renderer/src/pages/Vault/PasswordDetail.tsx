import { ModalType, PasswordIconType, PasswordType } from '@common/gloabl'
import Icon from '@renderer/components/icon'
import { FieldInfo } from '@renderer/entitys/form.entity'
import { PasswordFileListDic } from '@renderer/entitys/password.entity'
import { ConsoleLog } from '@renderer/libs/Console'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { Form, Input, Select } from 'antd'
import TextArea from 'antd/es/input/TextArea'

interface props {
  passwordType: PasswordType
  modal_type: ModalType
  className?: string
  InputClassName?: string
}

export default function PaswordDetail(props: props) {
  ConsoleLog.LogInfo('PaswordDetail render', props)
  const appset = use_appset() as AppsetStore
  return (
    <>
      <div className="flex flex-row items-center space-x-2 ">
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
          <Input placeholder="名称" />
        </Form.Item>
      </div>
      <div>
        {PasswordFileListDic[props.passwordType].map((item: FieldInfo) => {
          return (
            <Form.Item
              labelCol={{
                style: { marginBottom: '0px', marginTop: '0px', padding: '0px' }
              }}
              wrapperCol={{ style: { marginTop: '0px' } }}
              className=" mb-2 "
              name={['info', item.field_name]}
              label={item.label}
              rules={item.edit_rules}
              key={item.field_name}
            >
              <item.field_Element {...item.edit_props}></item.field_Element>
            </Form.Item>
          )
        })}
      </div>
      <Form.Item className="mb-0" name="remarks" label={appset.lang.getText('vaultadd.remarks')}>
        <TextArea autoSize={{ minRows: 4 }}></TextArea>
      </Form.Item>
    </>
  )
}
