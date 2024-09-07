import { VaultItem } from '@common/entitys/vault_item.entity'
import { ModalType, VaultItemTypeIcon, VaultItemType } from '@common/gloabl'
import { Form, message, Modal } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useState } from 'react'
import SelectPasswordTypePanel from './SelectPasswordTypePanel'
import { LeftOutlined } from '@ant-design/icons'
import { AppStore, use_appstore } from '@renderer/models/app.model'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { getAllVaultItem, ipc_call } from '@renderer/libs/tools/other'
import { webToManMsg } from '@common/entitys/ipcmsg.entity'
import { useRouterStore } from '@renderer/libs/router'
import PaswordDetail from './PasswordDetail'
import { ConsoleLog } from '@renderer/libs/Console'

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
  const getText = use_appset((state) => state.getText) as AppsetStore['getText']
  const appstore = use_appstore() as AppStore
  const route_data = useRouterStore()
  const cur_vault_id = parseInt(route_data.match?.params['vault_id'])
  ConsoleLog.LogInfo(`AddPasswordPanel render`)
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
            values.user_id = appstore.GetCurUser().id
            values.vault_id = cur_vault_id
            values.vault_item_type = select_type
            await ipc_call(webToManMsg.AddValutItem, values)
              .then(async () => {
                set_show_info(false)
                await getAllVaultItem(appstore, getText, messageApi)
                props.onOk?.()
              })
              .catch((err) => {
                messageApi.error(getText(`err.${err.code}`), 5)
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
                name: getText(`vaultitem.title`)
              } as VaultItem)
            }
          >
            <div className=" overflow-auto " style={{ height: 'calc(60vh)' }}>
              <PaswordDetail passwordType={select_type} modal_type={ModalType.Add}></PaswordDetail>
            </div>
          </Form>
        </Modal>
      )}
    </div>
  )
}
