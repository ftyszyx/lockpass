import { VaultItem } from '@common/entitys/vault_item.entity'
import { ModalType, VaultItemTypeIcon, VaultItemType } from '@common/gloabl'
import { Form, message, Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useState } from 'react'
import SelectPasswordTypePanel from './SelectPasswordTypePanel'
import { LeftOutlined } from '@ant-design/icons'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { ipc_call } from '@renderer/libs/tools/other'
import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { useRouterStore } from '@renderer/libs/router'
import PaswordDetail from './PasswordDetail'

interface AdminAddPasswordProps {
  show: boolean
  title: string
  init_info?: VaultItem
  onOk?: () => Promise<void>
  onClose?: () => void
}
export default function AddPasswordPanel(props: AdminAddPasswordProps): JSX.Element {
  const [form] = useForm<VaultItem>()
  const [messageApi, contextHolder] = message.useMessage()
  const [show_password_type, set_show_password_type] = useState(true)
  const [select_type, set_select_type] = useState(VaultItemType.Login)
  const [show_info, set_show_info] = useState(false)
  const appset = use_appset() as AppsetStore
  const appstore = use_appstore() as AppStore
  const route_data = useRouterStore()
  const cur_vault_id = parseInt(route_data.match?.params['id'])
  return (
    <div className=" relative">
      {show_password_type && (
        <SelectPasswordTypePanel
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
        ></SelectPasswordTypePanel>
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
            values.info = JSON.stringify(values.info)
            values.user_id = appstore.cur_user?.id
            values.valut_id = cur_vault_id
            values.vault_item_type = select_type
            await ipc_call(webToManMsg.AddValutItem, values)
              .then(() => {
                set_show_info(false)
                props.onOk?.()
              })
              .catch((err) => {
                messageApi.error(appset.lang.getText(`err.${err.code}`), 5)
              })
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
            wrapperCol={{}}
            initialValues={
              props.init_info ||
              ({
                icon: VaultItemTypeIcon[`icon_${select_type}`],
                name: appset.lang.getText(`password_name_${select_type}`)
              } as VaultItem)
            }
          >
            <PaswordDetail passwordType={select_type} modal_type={ModalType.Add}></PaswordDetail>
          </Form>
        </Modal>
      )}
    </div>
  )
}
