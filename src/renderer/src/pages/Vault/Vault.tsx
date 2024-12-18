/*
desc: 密码管理页面
© 2024 zyx
date:2024/07/23 11:45:04
*/
import { use_appstore } from '@renderer/models/app.model'
import { Button, Form, Input, InputRef, message, Popconfirm, Popover } from 'antd'
import { useEffect, useRef, useState } from 'react'
import Icon from '@renderer/components/Icon'
import { Icon_type, ModalType, VaultItemType } from '@common/gloabl'
import AddPasswordPanel from './AddPasswordPanel'
import { VaultItem } from '@common/entitys/vault_item.entity'
import { AppsetStore, use_appset } from '@renderer/models/appset.model'
import { getAllVaultItem, ipc_call } from '@renderer/libs/tools/other'
import PaswordDetail from './PasswordDetail'
import { ConsoleLog } from '@renderer/libs/Console'
import { useForm } from 'antd/es/form/Form'
import VaultSide from './VaultSide'
import { webToManMsg } from '@common/entitys/ipcmsg.entity'

export default function Vault() {
  ConsoleLog.info('Vault render')
  const appstore = use_appstore()
  const getText = use_appset((state) => state.getText)
  const fold_menu = use_appset((state) => state.fold_menu)
  const [defulat_select_item, set_defulat_select_item] = useState<VaultItem>(null)
  const appsetinfo = appstore.GetUserSet()
  const ToggleFoldMenu = use_appset(
    (state) => state.ToggleFoldMenu
  ) as AppsetStore['ToggleFoldMenu']
  const [form] = useForm<VaultItem>()
  const [messageApi, contextHolder] = message.useMessage()
  const [global_search_keyword, set_gloal_search_keyword] = useState('')
  const [select_vault_item, set_select_vault_item] = useState<VaultItem>(null)
  const [show_add_vault, set_show_add_vault] = useState(false)
  const [show_edit, set_show_edit] = useState(false)
  const quickFindRef = useRef<InputRef>(null)
  useEffect(() => {
    if (select_vault_item) {
      form.resetFields()
    }
  }, [select_vault_item])

  useEffect(() => {
    if (appstore.quick_input.quick_search) {
      quickFindRef.current.focus()
      appstore.setQuickInput({ quick_search: false })
    }
    if (appstore.quick_input.quick_add) {
      set_show_add_vault(true)
      appstore.setQuickInput({ quick_add: false })
    }
  }, [appstore.quick_input])

  return (
    <>
      <div className="flex flex-col bg-gray-100">
        {contextHolder}
        {/* header */}
        <div className=" flex flex-row h-[var(--search-height)] items-center px-4 space-x-2 border-gray-300 border-b-[1px] border-solid">
          <Icon
            type={Icon_type.icon_fold}
            className={`cursor-pointer ${fold_menu ? ' rotate-180' : 'rotate-0'} font-[40px]`}
            onClick={() => {
              ToggleFoldMenu()
            }}
          ></Icon>
          <Input
            ref={quickFindRef}
            placeholder={getText(
              'vault.global_search',
              appstore.GetCurUser()?.username,
              appsetinfo?.shortcut_local_find
            )}
            className="flex-grow"
            onChange={(newvalue) => {
              const value = newvalue.target.value
              if (value !== null && value !== undefined) {
                set_gloal_search_keyword(value.trim())
              }
            }}
          />
          <Button
            type="primary"
            onClick={() => {
              set_show_add_vault(true)
            }}
          >
            <Popover content={getText('shortcut.title', appsetinfo?.shortcut_local_add)} title="">
              {getText('vault.sider.add')}
            </Popover>
          </Button>
        </div>

        {/* content */}
        <div className=" flex flex-row flex-grow">
          <VaultSide
            default_select_item={defulat_select_item}
            global_search_keyword={global_search_keyword}
            onSelect={(item) => {
              set_select_vault_item(item)
            }}
          ></VaultSide>
          {/*  right side content*/}
          <div className="flex flex-grow  overflow-y-auto scroll_enabled h-[var(--content-height)] ">
            {select_vault_item && (
              <div className=" flex flex-col w-full">
                <div className="flex flex-row-reverse   p-4 border-b-2 border-solid border-gray-200">
                  <Button
                    type="primary"
                    onClick={() => {
                      set_show_edit(!show_edit)
                    }}
                  >
                    {show_edit ? getText('cancel') : getText('edit')}
                  </Button>
                </div>
                <div className="p-2">
                  <Form
                    form={form}
                    className="flex-grow"
                    initialValues={select_vault_item}
                    layout="vertical"
                  >
                    <PaswordDetail
                      passwordType={select_vault_item.vault_item_type as VaultItemType}
                      modal_type={show_edit ? ModalType.Edit : ModalType.View}
                    ></PaswordDetail>
                    <div className=" flex flex-row-reverse mt-2">
                      {show_edit && (
                        <Form.Item>
                          <Popconfirm
                            title={getText('vault.edit_title')}
                            description={getText('vault.sure_edit', select_vault_item.name)}
                            okText={getText('ok')}
                            cancelText={getText('cancel')}
                            onConfirm={async () => {
                              const values = await form.validateFields()
                              console.log('values', values)
                              values.id = select_vault_item.id
                              await ipc_call(webToManMsg.updateValutItem, values)
                                .then(async () => {
                                  set_show_edit(false)
                                  await getAllVaultItem(appstore, getText, messageApi)
                                  messageApi.success(getText('success'))
                                })
                                .catch((err) => {
                                  messageApi.error(getText(`err.${err.code}`), 5)
                                })
                            }}
                          >
                            <Button type="primary" htmlType="submit">
                              {getText('save')}
                            </Button>
                          </Popconfirm>
                        </Form.Item>
                      )}
                      {show_edit && (
                        <Form.Item className=" mr-3">
                          <Popconfirm
                            title={getText('vault.delete_title')}
                            description={getText('vault.sure_delete', select_vault_item.name)}
                            onConfirm={async () => {
                              await ipc_call(webToManMsg.DeleteValutItem, select_vault_item.id)
                                .then(async () => {
                                  set_show_edit(false)
                                  messageApi.success(getText('success'))
                                  await getAllVaultItem(appstore, getText, messageApi)
                                })
                                .catch((err) => {
                                  messageApi.error(getText(`err.${err.code}`), 5)
                                })
                            }}
                            okText={getText('ok')}
                            cancelText={getText('cancel')}
                          >
                            <Button type="dashed">{getText('delete')}</Button>
                          </Popconfirm>
                        </Form.Item>
                      )}
                    </div>
                  </Form>
                </div>
              </div>
            )}
            {!select_vault_item && (
              <div className="flex flex-col items-center justify-center flex-grow">
                {/* <Icon type={Icon_type.icon_no_data} svg className=" w-[100px] h-[100px]" /> */}
                <Button
                  type="primary"
                  onClick={() => {
                    set_show_add_vault(true)
                  }}
                >
                  {getText('vault.empty_add')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {show_add_vault && (
        <AddPasswordPanel
          show={show_add_vault}
          title={getText('vaultitem.label.add_vault_item')}
          onOk={async (res) => {
            set_show_add_vault(false)
            set_defulat_select_item(res)
          }}
          onClose={() => {
            set_show_add_vault(false)
            set_defulat_select_item(null)
          }}
        ></AddPasswordPanel>
      )}
    </>
  )
}
