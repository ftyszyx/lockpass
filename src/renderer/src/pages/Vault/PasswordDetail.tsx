import { ModalType, VaultItemTypeIcon, VaultItemType } from '@common/gloabl'
import Icon from '@renderer/components/Icon'
import IconSelect from '@renderer/components/IconSelect'
import MyInputWrapper from '@renderer/components/MyInputWrapper'
import MyPicUpload from '@renderer/components/MyPicUpload'
import { FieldInfo } from '@renderer/entitys/form.entity'
import { GetPasswordFilelist } from '@renderer/entitys/Vault_item.entity'
import { ConsoleLog } from '@renderer/libs/Console'
import { use_appstore } from '@renderer/models/app.model'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { Form, Input, Select } from 'antd'
import TextArea, { TextAreaProps } from 'antd/es/input/TextArea'

interface props {
  passwordType: VaultItemType
  modal_type: ModalType
  className?: string
  InputClassName?: string
}

export default function PaswordDetail(props: props) {
  ConsoleLog.info('PaswordDetail render', props)
  const lang = use_appset((state) => state.lang)
  const vaults = use_appstore((state) => state.vaults)
  const getText = use_appset((state) => state.getText) as AppsetStore['getText']
  return (
    <>
      <div className="flex flex-row items-center space-x-2 ">
        <Form.Item name="icon">
          <IconSelect
            show_type={props.modal_type}
            items={Object.keys(VaultItemTypeIcon).map((key) => {
              return {
                value: VaultItemTypeIcon[key],
                label: <Icon type={VaultItemTypeIcon[key]} className=" w-[40px] h-[40px]" svg />
              }
            })}
          ></IconSelect>
        </Form.Item>
        <Form.Item name="name" className="flex-grow">
          <MyInputWrapper
            inputElement={Input}
            inputProps={{ placeholder: getText('name') }}
            show_type={props.modal_type}
          />
        </Form.Item>
      </div>
      <Form.Item name="vault_id" label={getText('vaultitem.label.vault_id')}>
        <Select>
          {vaults.map((item) => {
            return (
              <Select.Option value={item.id} key={item.id}>
                {item.name}
              </Select.Option>
            )
          })}
        </Select>
      </Form.Item>
      <div>
        {GetPasswordFilelist(props.passwordType, lang).map((item: FieldInfo) => {
          return (
            <Form.Item
              className=" mb-2  "
              name={['info', item.field_name]}
              label={item.hide_label ? '' : getText(`vaultitem.label.${item.field_name}`)}
              rules={item.edit_rules}
              key={item.field_name}
            >
              <item.render
                show_type={props.modal_type}
                placeholder={
                  item.hide_placeholder ? '' : getText(`vaultitem.placeholder.${item.field_name}`)
                }
              ></item.render>
            </Form.Item>
          )
        })}
      </div>
      <Form.Item className="mb-0" name="remarks" label={getText('vaultadd.remarks')}>
        <MyInputWrapper<TextAreaProps>
          inputProps={{ autoSize: { minRows: 4 } }}
          inputElement={TextArea}
          show_type={props.modal_type}
        ></MyInputWrapper>
      </Form.Item>
      <Form.Item name="pics" label={getText('vault.item.pics')}>
        <MyPicUpload show_type={props.modal_type}></MyPicUpload>
      </Form.Item>
    </>
  )
}
