import { ModalType, VaultItemTypeIcon, VaultItemType } from '@common/gloabl'
import Icon from '@renderer/components/Icon'
import IconSelect from '@renderer/components/IconSelect'
import MyInputWrapper from '@renderer/components/MyInputWrapper'
import { FieldInfo } from '@renderer/entitys/form.entity'
import { GetPasswordFilelist, PasswordFileListDic } from '@renderer/entitys/VaultItem.entity'
import { ConsoleLog } from '@renderer/libs/Console'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { Form, Input } from 'antd'
import TextArea, { TextAreaProps } from 'antd/es/input/TextArea'

interface props {
  passwordType: VaultItemType
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
          <IconSelect
            show_type={props.modal_type}
            items={Object.keys(VaultItemTypeIcon).map((key) => {
              return {
                value: VaultItemTypeIcon[key],
                label: <Icon type={VaultItemTypeIcon[key]} className=" w-[50px] h-[50px]" svg />
              }
            })}
          ></IconSelect>
        </Form.Item>
        <Form.Item name="name" className="flex-grow">
          <MyInputWrapper
            inputElement={Input}
            inputProps={{ placeholder: appset.lang.getText('name') }}
            show_type={props.modal_type}
          />
        </Form.Item>
      </div>
      <div>
        {GetPasswordFilelist(props.passwordType, appset.lang).map((item: FieldInfo) => {
          console.log('item', item)
          return (
            <Form.Item
              className=" mb-2  "
              name={['info', item.field_name]}
              label={
                item.hide_label ? '' : appset.lang.getText(`vaultitem.label.${item.field_name}`)
              }
              rules={item.edit_rules}
              key={item.field_name}
            >
              <item.render
                show_type={props.modal_type}
                placeholder={appset.lang.getText(`vaultitem.placeholder.${item.field_name}`)}
              ></item.render>
            </Form.Item>
          )
        })}
      </div>
      <Form.Item className="mb-0" name="remarks" label={appset.lang.getText('vaultadd.remarks')}>
        <MyInputWrapper<TextAreaProps>
          inputProps={{ autoSize: { minRows: 4 } }}
          inputElement={TextArea}
          show_type={props.modal_type}
        ></MyInputWrapper>
      </Form.Item>
    </>
  )
}
